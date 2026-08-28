import { DIR_MAP } from '../ramps';
import type { Params, PointCloud } from '../types';

/** Anything below this alpha is treated as absent and produces no point. */
const ALPHA_FLOOR = 0.35;

/** World-space span, matching every other source. */
const WORLD_SPAN = 6;

export type DecodedImage = HTMLImageElement | ImageBitmap;

function dimensions(img: DecodedImage): { w: number; h: number } {
  const w = (img as HTMLImageElement).naturalWidth || img.width;
  const h = (img as HTMLImageElement).naturalHeight || img.height;
  return { w, h };
}

/**
 * Raster source: brightness becomes relief.
 *
 * Bright pixels sit nearer the camera, and the normal comes from the local
 * brightness gradient, so the image lights like a carving rather than a
 * flat card. `albedoMix` blends between that sculpt lighting and the image's
 * own brightness.
 */
export function cloudFromImage(img: DecodedImage, p: Params): PointCloud {
  let width = Math.max(24, Math.round(210 * p.density));
  const source = dimensions(img);
  let height = Math.max(24, Math.round(width * (source.h / source.w)));
  if (height > 420) {
    height = 420;
    width = Math.round(height * (source.w / source.h));
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { pos: new Float32Array(0), nrm: new Float32Array(0), alb: new Float32Array(0), arc: null, edge: null, edgeDir: null, count: 0 };

  ctx.drawImage(img as CanvasImageSource, 0, 0, width, height);
  const pixels = ctx.getImageData(0, 0, width, height).data;

  const cells = width * height;
  const lum = new Float32Array(cells);
  const alpha = new Float32Array(cells);
  let lo = 1;
  let hi = 0;

  for (let i = 0; i < cells; i++) {
    const p4 = i * 4;
    const l = (0.2126 * pixels[p4] + 0.7152 * pixels[p4 + 1] + 0.0722 * pixels[p4 + 2]) / 255;
    lum[i] = l;
    alpha[i] = pixels[p4 + 3] / 255;
    if (alpha[i] > 0.5) {
      if (l < lo) lo = l;
      if (l > hi) hi = l;
    }
  }

  // Percentile rather than min/max: one specular highlight or one crushed
  // shadow would otherwise squash the range everything else has to share.
  const sorted = Float32Array.from(lum).sort();
  lo = sorted[Math.floor(cells * 0.05)];
  hi = sorted[Math.floor(cells * 0.95)];
  const invRange = 1 / Math.max(0.001, hi - lo);

  // Then an S-curve, which pushes midtones apart. A short character ramp has
  // very few steps to spend, so linear brightness wastes most of them.
  const k = p.contrast;
  for (let i = 0; i < cells; i++) {
    let v = (lum[i] - lo) * invRange;
    v = v < 0 ? 0 : v > 1 ? 1 : v;
    lum[i] = k > 0 ? 1 / (1 + Math.exp(-k * (v - 0.5))) : v;
  }

  // ── Sobel: magnitude and quantized direction, per cell ──────────────────
  // An edge cell gets a line character oriented along the edge instead of a
  // brightness character, which is what makes lettering and hard contours read.
  const edgeMag = new Float32Array(cells);
  const edgeDirGrid = new Uint8Array(cells);
  let maxEdge = 0;
  for (let y = 1; y < height - 1; y++) {
    const row = y * width;
    const up = (y - 1) * width;
    const down = (y + 1) * width;
    for (let x = 1; x < width - 1; x++) {
      const tl = lum[up + x - 1];
      const tt = lum[up + x];
      const tr = lum[up + x + 1];
      const ml = lum[row + x - 1];
      const mr = lum[row + x + 1];
      const bl = lum[down + x - 1];
      const bb = lum[down + x];
      const br = lum[down + x + 1];
      const sx = -tl - 2 * ml - bl + tr + 2 * mr + br;
      const sy = -tl - 2 * tt - tr + bl + 2 * bb + br;
      const mag = Math.sqrt(sx * sx + sy * sy);
      const at = row + x;
      edgeMag[at] = mag;
      if (mag > maxEdge) maxEdge = mag;
      if (mag > 0) {
        const sector = Math.round(((Math.atan2(sy, sx) + Math.PI) / Math.PI) * 4) % 8;
        edgeDirGrid[at] = DIR_MAP[sector];
      }
    }
  }
  if (maxEdge > 0) {
    const invMax = 1 / maxEdge;
    for (let i = 0; i < cells; i++) edgeMag[i] *= invMax;
  }

  let kept = 0;
  for (let i = 0; i < cells; i++) if (alpha[i] > ALPHA_FLOOR) kept++;

  const pos = new Float32Array(kept * 3);
  const nrm = new Float32Array(kept * 3);
  const alb = new Float32Array(kept);
  const edge = new Float32Array(kept);
  const edgeDir = new Uint8Array(kept);

  const flat = p.imageMode === 'flat';
  const spanX = WORLD_SPAN / width;
  const spanY = (WORLD_SPAN * (height / width)) / height;
  let w = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (alpha[idx] <= ALPHA_FLOOR) continue;

      const i3 = w * 3;
      pos[i3] = (x / width - 0.5) * WORLD_SPAN;
      pos[i3 + 1] = (y / height - 0.5) * WORLD_SPAN * (height / width);
      alb[w] = lum[idx];
      edge[w] = edgeMag[idx];
      edgeDir[w] = edgeDirGrid[idx];

      if (flat) {
        // A billboard: no displacement, every normal faces the camera. The
        // image supplies the tone, which is what makes a photo still look
        // like the photo.
        pos[i3 + 2] = 0;
        nrm[i3] = 0;
        nrm[i3 + 1] = 0;
        nrm[i3 + 2] = -1;
        w++;
        continue;
      }

      const xm = x > 0 ? idx - 1 : idx;
      const xp = x < width - 1 ? idx + 1 : idx;
      const ym = y > 0 ? idx - width : idx;
      const yp = y < height - 1 ? idx + width : idx;

      // Surface height is -(lum * depth), so the gradient is negated here.
      const gx = (-(lum[xp] - lum[xm]) * p.reliefDepth * 0.5) / spanX;
      const gy = (-(lum[yp] - lum[ym]) * p.reliefDepth * 0.5) / spanY;
      // Outward normal faces the viewer, i.e. toward -z.
      const nz = -1;
      const len = Math.sqrt(gx * gx + gy * gy + 1) || 1;

      pos[i3 + 2] = -(lum[idx] - 0.5) * p.reliefDepth;
      nrm[i3] = gx / len;
      nrm[i3 + 1] = gy / len;
      nrm[i3 + 2] = nz / len;
      w++;
    }
  }

  return { pos, nrm, alb, arc: null, edge, edgeDir, count: w };
}

/**
 * Decode a picked file without depending on blob: URLs where possible.
 * createImageBitmap takes the Blob directly; the URL route is the fallback.
 */
export function decodeImage(file: Blob): Promise<DecodedImage | null> {
  const viaUrl = () =>
    new Promise<DecodedImage | null>((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        resolve(img);
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });

  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(file).catch(viaUrl);
  }
  return viaUrl();
}

/**
 * Load an image by URL.
 *
 * crossOrigin is required because the pixels get read back off a canvas, and a
 * host that does not send Access-Control-Allow-Origin will taint it. There is no
 * workaround from the page side — a retry without crossOrigin would load the
 * image but throw on getImageData — so the failure is reported plainly instead.
 */
export function loadImageFromUrl(url: string): Promise<DecodedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(
        new Error(
          'Could not load that URL. It must point straight at an image file, and the host must allow cross-origin reads.',
        ),
      );
    img.src = url;
  });
}

/**
 * Reading a picked file fails in more environments than you would think —
 * NotReadableError, sandboxed frames, cloud-backed files. Try every distinct
 * plumbing path and report which one worked.
 */
export async function readFileText(file: Blob): Promise<string> {
  const strategies: Array<[string, () => Promise<string>]> = [];

  if (typeof file.text === 'function') {
    strategies.push(['Blob.text', () => file.text()]);
  }
  strategies.push(['Response.text', () => new Response(file).text()]);
  strategies.push([
    'FileReader.readAsText',
    () =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'));
        reader.readAsText(file);
      }),
  ]);
  strategies.push([
    'ArrayBuffer + TextDecoder',
    () =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve(new TextDecoder('utf-8').decode(new Uint8Array(reader.result as ArrayBuffer)));
        reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'));
        reader.readAsArrayBuffer(file);
      }),
  ]);

  const failures: string[] = [];
  for (const [name, run] of strategies) {
    try {
      const text = await run();
      if (text) return text;
      failures.push(`${name}: empty result`);
    } catch (err) {
      const e = err as Error;
      failures.push(`${name}: ${e?.name || e?.message || 'error'}`);
    }
  }
  throw new Error(`every read strategy failed — ${failures.join('; ')}`);
}
