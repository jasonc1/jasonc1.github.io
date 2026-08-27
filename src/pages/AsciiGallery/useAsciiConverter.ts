import { useEffect, useRef, useState } from 'react';
import { asciiConfig } from './asciiConfig';

// Extended ramp — more steps in the light half where sky/cloud gradients live.
// Dark → mid covers subjects; mid → light covers sky layers, clouds, gradients.
export const RAMP = '@#%S&8WM$*oahkbdpqwZO0QLCJUYXzcvunxrjft/|()1?-_+~<>ilI;:\'\"^`,.·  ';

// How many sub-pixels to average per character cell (each axis)
const SUPERSAMPLE = 6; // 6×6 = 36 samples per cell at high col counts

// Measured at runtime — avoids distortion from hardcoded assumption
let CHAR_ASPECT = 0.55; // fallback; overwritten on first call to measureCharAspect()
const LINE_HEIGHT = 1.0;

export const N_COLORS = 3;

// ── Structural edge direction ─────────────────────────────────────────────────
// Direction buckets stored in edgeDirs: 0=none, 1=vertical, 2=horizontal, 3=diag-/, 4=diag-\
// Angle from atan2 is quantized into 8 sectors, then mapped to 4 directions.
const DIR_MAP: readonly number[] = [2, 2, 4, 1, 1, 1, 3, 2]; // bucket 0-7 → direction

// 2D table: EDGE_CHARS[direction][brightnessBand] — 4 directions × 5 brightness levels
// At light values all directions collapse — not enough ink to convey structure.
const EDGE_CHARS: readonly (readonly string[])[] = [
  [],                             // 0 = no edge (unused)
  ['|', '|', 'l', 'i', '.'],     // 1 = vertical
  ['=', '=', '-', '~', '.'],     // 2 = horizontal
  ['/', '/', 'r', '\'', '.'],    // 3 = diagonal /
  ['\\', '%', 'k', '`', '.'],    // 4 = diagonal \
];

// Pre-compute char codes for kinetic use
export const EDGE_CHAR_CODES: readonly (readonly number[])[] =
  EDGE_CHARS.map(row => row.map(ch => ch.charCodeAt(0)));

// Only strong, confident edges get structural treatment
export const STRUCTURAL_EDGE_THRESH = 0.40;

// Export cache clearing for the tweak panel's "Reconvert" button
export function clearCache(): void { cache.clear(); }

function measureCharAspect(): number {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const size = 40;
  ctx.font = `${size}px GeistMono, monospace`;
  const w = ctx.measureText('M').width;
  CHAR_ASPECT = w / size;
  return CHAR_ASPECT;
}

export interface AsciiGrid {
  rows: string[];
  outlineRows: string[];    // edge-only characters (Sobel > threshold)
  rampIndices: Uint8Array;  // per-cell index into RAMP — needed for kinetic animation
  edgeDirs: Uint8Array;     // per-cell edge direction (0=none, 1=vert, 2=horiz, 3=diag-/, 4=diag-\)
  edges: Float32Array;      // per-cell normalized edge magnitude (0-1)
  colorAssign: Uint8Array;  // per-cell accent color index (0,1,2) — for color-masked animation
  palette: string[];        // N_COLORS dominant CSS color strings
  colorMaps: string[][];    // colorMaps[i] = rows where palette[i] dominates
  cols: number;
  fontSize: number;
}

const cache = new Map<string, AsciiGrid>();

function cacheKey(src: string, cols: number, rows: number, accents: string[]) {
  return `${src}__${cols}x${rows}__${accents.join(',')}`;
}

// Parse a CSS hex color into [r, g, b]
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Assign each cell to the nearest accent color (squared Euclidean distance)
function assignToAccents(
  cellR: Uint8Array, cellG: Uint8Array, cellB: Uint8Array,
  total: number, accentRgb: [number, number, number][],
): Uint8Array {
  const assign = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    let best = 0, bestD = Infinity;
    for (let c = 0; c < accentRgb.length; c++) {
      const dr = cellR[i] - accentRgb[c][0];
      const dg = cellG[i] - accentRgb[c][1];
      const db = cellB[i] - accentRgb[c][2];
      const d = dr * dr + dg * dg + db * db;
      if (d < bestD) { bestD = d; best = c; }
    }
    assign[i] = best;
  }
  return assign;
}

export function computeGrid(): { cols: number; rows: number; fontSize: number; gridAR: number } {
  measureCharAspect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Mobile: more cols than before (was ~84), better horizontal fidelity
  const cols = vw < 480 ? asciiConfig.colsMobile : vw < 770 ? asciiConfig.colsTablet : asciiConfig.colsDesktop;
  const charWidth  = vw / cols;
  const fontSize   = charWidth / CHAR_ASPECT;
  const charHeight = fontSize * LINE_HEIGHT;
  const rows = Math.ceil(vh / charHeight) + 1;
  const gridAR = (cols * CHAR_ASPECT) / rows;
  return { cols, rows, fontSize, gridAR };
}

function sigmoid(x: number, steepness = 7): number {
  return 1 / (1 + Math.exp(-steepness * (x - 0.5)));
}

function imageToGrid(img: HTMLImageElement, cols: number, rows: number, fontSize: number, accents: string[]): AsciiGrid {
  const W = cols * SUPERSAMPLE;
  const H = rows * SUPERSAMPLE;
  const total = cols * rows;
  const ss2 = SUPERSAMPLE * SUPERSAMPLE;
  const invSs2 = 1 / ss2;

  // ── Single canvas draw — extract both color and grayscale from one pass ──
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  // Cover-fit: correct for non-square character cells (each cell is ~0.55:1 w:h).
  // Characters are narrower than tall, so the visual width of the grid is W * CHAR_ASPECT.
  // We compute cover-crop in source-image space so the photo isn't distorted.
  const visualW = W * CHAR_ASPECT;          // chars are narrower than canvas pixels
  const visualH = H;                        // row height maps 1:1 to canvas vertical pixels
  const imgAR = img.naturalWidth / img.naturalHeight;
  const gridAR = visualW / visualH;

  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
  if (imgAR > gridAR) {
    // Image is wider — crop sides
    sw = img.naturalHeight * gridAR;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    // Image is taller — crop top/bottom
    sh = img.naturalWidth / gridAR;
    sy = (img.naturalHeight - sh) / 2;
  }

  // Draw color version first (used for palette extraction)
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
  const cdata = ctx.getImageData(0, 0, W, H).data;

  // Draw grayscale version (reuse same canvas, same cover-fit crop)
  ctx.filter = `grayscale(1) contrast(${asciiConfig.canvasContrast}%)`;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
  const { data } = ctx.getImageData(0, 0, W, H);

  // ── Supersample brightness + color in a single cell loop ──────────
  const bright = new Float32Array(total);
  const cellR = new Uint8Array(total);
  const cellG = new Uint8Array(total);
  const cellB = new Uint8Array(total);

  for (let row = 0; row < rows; row++) {
    const rowBase = row * SUPERSAMPLE * W;
    const cellRowBase = row * cols;
    for (let col = 0; col < cols; col++) {
      const colBase = col * SUPERSAMPLE;
      let sum = 0, r = 0, g = 0, b = 0;
      for (let sy = 0; sy < SUPERSAMPLE; sy++) {
        const pixelRowOff = (rowBase + sy * W + colBase) * 4;
        for (let sx = 0; sx < SUPERSAMPLE; sx++) {
          const p = pixelRowOff + sx * 4;
          sum += data[p];
          r += cdata[p]; g += cdata[p + 1]; b += cdata[p + 2];
        }
      }
      const idx = cellRowBase + col;
      bright[idx] = sum * invSs2;
      cellR[idx] = r * invSs2; cellG[idx] = g * invSs2; cellB[idx] = b * invSs2;
    }
  }

  // Percentile normalization (5th–95th) — sort a copy, not a new allocation via .from()
  const sorted = new Float32Array(bright);
  sorted.sort();
  const lo    = sorted[Math.floor(total * asciiConfig.percentileLo)];
  const hi    = sorted[Math.floor(total * asciiConfig.percentileHi)];
  const invRange = 1 / (hi - lo || 1);

  const norm = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const v = (bright[i] - lo) * invRange;
    norm[i] = v < 0 ? 0 : v > 1 ? 1 : v;
  }

  // Sobel edge detection + direction quantization
  const edges = new Float32Array(total);
  const edgeDirs = new Uint8Array(total);
  let maxEdge = 0;
  for (let y = 1; y < rows - 1; y++) {
    const yOff = y * cols;
    const yOffM1 = (y - 1) * cols;
    const yOffP1 = (y + 1) * cols;
    for (let x = 1; x < cols - 1; x++) {
      const tl = norm[yOffM1 + x - 1], t  = norm[yOffM1 + x], tr = norm[yOffM1 + x + 1];
      const ml = norm[yOff   + x - 1],                          mr = norm[yOff   + x + 1];
      const bl = norm[yOffP1 + x - 1], b  = norm[yOffP1 + x], br = norm[yOffP1 + x + 1];
      const gx = -tl - 2*ml - bl + tr + 2*mr + br;
      const gy = -tl - 2*t  - tr + bl + 2*b  + br;
      const mag = Math.sqrt(gx * gx + gy * gy);
      edges[yOff + x] = mag;
      if (mag > maxEdge) maxEdge = mag;

      // Quantize gradient direction into 4 structural directions
      if (mag > 0) {
        const angle = Math.atan2(gy, gx);
        const bucket = Math.round(((angle + Math.PI) / Math.PI) * 4) % 8;
        edgeDirs[yOff + x] = DIR_MAP[bucket];
      }
    }
  }
  if (maxEdge > 0) {
    const invMaxEdge = 1 / maxEdge;
    for (let i = 0; i < total; i++) edges[i] *= invMaxEdge;
  }

  // Build character rows + rampIndices using pre-allocated buffer
  // Cells with strong edges get structural directional characters; all others use brightness ramp.
  const RAMP_MAX = RAMP.length - 1;
  const rampIndices = new Uint8Array(total);
  const charCodeBuf = new Uint16Array(cols); // char codes for building row strings
  const lines: string[] = new Array(rows);
  for (let y = 0; y < rows; y++) {
    const yOff = y * cols;
    for (let x = 0; x < cols; x++) {
      const i = yOff + x;
      const boosted  = sigmoid(norm[i], asciiConfig.sigmoidSteepness);
      const edgePush = edges[i] * 0.08;
      let charIdx = (boosted - edgePush) * RAMP_MAX | 0;
      if (charIdx < 0) charIdx = 0;
      else if (charIdx > RAMP_MAX) charIdx = RAMP_MAX;
      rampIndices[i] = charIdx;

      const dir = edgeDirs[i];
      if (dir > 0 && edges[i] > asciiConfig.edgeThreshold) {
        const band = Math.min((boosted * 4) | 0, 4);
        charCodeBuf[x] = EDGE_CHAR_CODES[dir][band];
      } else {
        charCodeBuf[x] = RAMP.charCodeAt(charIdx);
      }
    }
    lines[y] = String.fromCharCode.apply(null, charCodeBuf as unknown as number[]);
  }

  // Build outlineRows: only characters where Sobel edge > threshold
  const EDGE_THRESH = 0.22;
  const outlineRows: string[] = new Array(rows);
  for (let y = 0; y < rows; y++) {
    const yOff = y * cols;
    const row = lines[y];
    const outBuf = new Uint16Array(cols);
    for (let x = 0; x < cols; x++) {
      if (edges[yOff + x] > EDGE_THRESH) {
        outBuf[x] = row.charCodeAt(x);
      } else {
        outBuf[x] = 32; // space
      }
    }
    outlineRows[y] = String.fromCharCode.apply(null, outBuf as unknown as number[]);
  }

  const accentRgb = accents.map(hexToRgb);
  const assign = assignToAccents(cellR, cellG, cellB, total, accentRgb);
  const palette = accents;

  // Build colorMaps: N_COLORS row arrays using pre-allocated char arrays
  const colorMaps: string[][] = Array.from({ length: N_COLORS }, () => new Array(rows));
  for (let y = 0; y < rows; y++) {
    const yOff = y * cols;
    const row = lines[y];
    // Build all N_COLORS rows simultaneously using char code buffers
    const bufs: Uint8Array[] = Array.from({ length: N_COLORS }, () => {
      const b = new Uint8Array(cols);
      b.fill(32); // space = 32
      return b;
    });
    for (let x = 0; x < cols; x++) {
      const c = assign[yOff + x];
      bufs[c][x] = row.charCodeAt(x);
    }
    for (let ci = 0; ci < N_COLORS; ci++) {
      colorMaps[ci][y] = String.fromCharCode.apply(null, bufs[ci] as unknown as number[]);
    }
  }

  return { rows: lines, outlineRows, rampIndices, edgeDirs, edges, colorAssign: assign, palette, colorMaps, cols, fontSize };
}

export function useAsciiConverter(src: string, cols: number, rows: number, fontSize: number, accents: string[]): AsciiGrid | null {
  // Always read directly from the shared cache — avoids the one-render stale-state
  // window that causes a flash when `src` changes (useState doesn't reinitialize
  // on prop changes, so a state-based approach lags by one render cycle).
  const [, forceUpdate] = useState(0);
  // Keep a ref to the last successfully produced grid so we never return null
  // during resize reconversion — the caller always has a frame to display.
  const lastGoodRef = useRef<AsciiGrid | null>(null);

  useEffect(() => {
    const k = cacheKey(src, cols, rows, accents);
    if (cache.has(k)) return; // already cached — synchronous read below will find it
    const img = new Image();
    img.crossOrigin = 'anonymous';
    let cancelled = false;
    img.onload = () => {
      if (cancelled) return;
      // Yield to the browser before doing heavy canvas work — avoids blocking
      // the main thread during resize when the image is already browser-cached
      // and onload fires synchronously.
      const run = () => {
        if (cancelled) return;
        const result = imageToGrid(img, cols, rows, fontSize, accents);
        cache.set(k, result);
        forceUpdate(n => n + 1); // trigger re-render so cache read below picks it up
      };
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(run, { timeout: 120 });
      } else {
        setTimeout(run, 0);
      }
    };
    img.src = src;
    return () => { cancelled = true; };
  }, [src, cols, rows, fontSize, accents]);

  // Synchronous cache read — always fresh, no stale-state lag.
  // Fall back to the last good grid so we never return null mid-resize.
  const current = cache.get(cacheKey(src, cols, rows, accents)) ?? null;
  if (current) lastGoodRef.current = current;
  return current ?? lastGoodRef.current;
}

// Prefetch the ASCII grids for the given photos, fetching one image at a time.
//
// Callers pass only the photos they actually need soon (see AsciiGallery), because
// the full set is several megabytes and only one photo is ever on screen. Fetching
// serially rather than firing every request at once also keeps a cold load from
// splitting the connection N ways.
//
// Prefetching is best-effort: useAsciiConverter loads on demand and falls back to
// the last good grid, so a photo that hasn't been prefetched costs a repeated frame
// while it loads, never a blank one.
export function preloadAll(
  photos: Array<{ src: string; accents: string[] }>,
  cols: number,
  rows: number,
  fontSize: number,
): void {
  const queue = photos.filter(
    ({ src, accents }) => !cache.has(cacheKey(src, cols, rows, accents)),
  );

  let step = 0;
  const loadNext = () => {
    const entry = queue.shift();
    if (!entry) return;
    const { src, accents } = entry;
    const k = cacheKey(src, cols, rows, accents);
    if (cache.has(k)) return loadNext();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Stagger heavy canvas work across idle frames so we don't block the
      // main thread with N simultaneous conversions (especially on resize).
      const run = () => cache.set(k, imageToGrid(img, cols, rows, fontSize, accents));
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(run, { timeout: 200 + step * 80 });
      } else {
        setTimeout(run, step * 50);
      }
      step += 1;
      loadNext();
    };
    img.onerror = () => loadNext(); // one bad asset must not stall the chain
    img.src = src;
  };

  loadNext();
}

