import { useEffect, useState } from 'react';

// Extended ramp — more steps in the light half where sky/cloud gradients live.
// Dark → mid covers subjects; mid → light covers sky layers, clouds, gradients.
export const RAMP = '@#%S&8WM$*oahkbdpqwZO0QLCJUYXzcvunxrjft/|()1?-_+~<>ilI;:\'\"^`,.·  ';

// How many sub-pixels to average per character cell (each axis)
const SUPERSAMPLE = 6; // 6×6 = 36 samples per cell at high col counts

// Measured at runtime — avoids distortion from hardcoded assumption
let CHAR_ASPECT = 0.55; // fallback; overwritten on first call to measureCharAspect()
const LINE_HEIGHT = 1.0;

export const N_COLORS = 3;

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

export function computeGrid(): { cols: number; rows: number; fontSize: number } {
  measureCharAspect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cols = vw < 770 ? 150 : 600;
  const charWidth  = vw / cols;
  const fontSize   = charWidth / CHAR_ASPECT;
  const charHeight = fontSize * LINE_HEIGHT;
  const rows = Math.ceil(vh / charHeight) + 1;
  return { cols, rows, fontSize };
}

function sigmoid(x: number, steepness = 7): number {
  return 1 / (1 + Math.exp(-steepness * (x - 0.5)));
}

function imageToGrid(img: HTMLImageElement, cols: number, rows: number, fontSize: number, accents: string[]): AsciiGrid {
  const W = cols * SUPERSAMPLE;
  const H = rows * SUPERSAMPLE;
  const total = cols * rows;
  const ss2 = SUPERSAMPLE * SUPERSAMPLE;

  // ── Pass 1: grayscale for brightness / character selection ──────────
  const grayCanvas = document.createElement('canvas');
  grayCanvas.width = W; grayCanvas.height = H;
  const ctx = grayCanvas.getContext('2d')!;
  ctx.filter = 'grayscale(1) contrast(120%)';
  ctx.drawImage(img, 0, 0, W, H);
  const { data } = ctx.getImageData(0, 0, W, H);

  const bright = new Float32Array(total);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let sum = 0;
      for (let sy = 0; sy < SUPERSAMPLE; sy++) {
        for (let sx = 0; sx < SUPERSAMPLE; sx++) {
          const p = ((row * SUPERSAMPLE + sy) * W + (col * SUPERSAMPLE + sx)) * 4;
          sum += data[p];
        }
      }
      bright[row * cols + col] = sum / ss2;
    }
  }

  // Percentile normalization (5th–95th)
  const sorted = Float32Array.from(bright).sort();
  const lo    = sorted[Math.floor(total * 0.05)];
  const hi    = sorted[Math.floor(total * 0.95)];
  const range = hi - lo || 1;

  const norm = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    norm[i] = Math.max(0, Math.min(1, (bright[i] - lo) / range));
  }

  // Sobel edge detection
  const edges = new Float32Array(total);
  let maxEdge = 0;
  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      const tl = norm[(y-1)*cols+(x-1)], t  = norm[(y-1)*cols+x], tr = norm[(y-1)*cols+(x+1)];
      const ml = norm[ y   *cols+(x-1)],                           mr = norm[ y   *cols+(x+1)];
      const bl = norm[(y+1)*cols+(x-1)], b  = norm[(y+1)*cols+x], br = norm[(y+1)*cols+(x+1)];
      const gx = -tl - 2*ml - bl + tr + 2*mr + br;
      const gy = -tl - 2*t  - tr + bl + 2*b  + br;
      const mag = Math.sqrt(gx * gx + gy * gy);
      edges[y * cols + x] = mag;
      if (mag > maxEdge) maxEdge = mag;
    }
  }
  if (maxEdge > 0) {
    for (let i = 0; i < total; i++) edges[i] /= maxEdge;
  }

  // Build character rows + rampIndices
  const RAMP_MAX = RAMP.length - 1;
  const rampIndices = new Uint8Array(total);
  const lines: string[] = [];
  for (let y = 0; y < rows; y++) {
    let line = '';
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      const boosted  = sigmoid(norm[i], 5);
      const edgePush = edges[i] * 0.08;
      const charIdx  = Math.max(0, Math.min(RAMP_MAX,
        Math.floor((boosted - edgePush) * RAMP_MAX),
      ));
      rampIndices[i] = charIdx;
      line += RAMP[charIdx];
    }
    lines.push(line);
  }

  // Build outlineRows: only characters where Sobel edge > threshold
  const EDGE_THRESH = 0.22;
  const outlineRows: string[] = [];
  for (let y = 0; y < rows; y++) {
    let line = '';
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      line += edges[i] > EDGE_THRESH ? lines[y][x] : ' ';
    }
    outlineRows.push(line);
  }

  // ── Pass 2: full color for palette extraction ───────────────────────
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = W; colorCanvas.height = H;
  const cctx = colorCanvas.getContext('2d')!;
  cctx.drawImage(img, 0, 0, W, H);
  const cdata = cctx.getImageData(0, 0, W, H).data;

  const cellR = new Uint8Array(total);
  const cellG = new Uint8Array(total);
  const cellB = new Uint8Array(total);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let r = 0, g = 0, b = 0;
      for (let sy = 0; sy < SUPERSAMPLE; sy++) {
        for (let sx = 0; sx < SUPERSAMPLE; sx++) {
          const p = ((row * SUPERSAMPLE + sy) * W + (col * SUPERSAMPLE + sx)) * 4;
          r += cdata[p]; g += cdata[p + 1]; b += cdata[p + 2];
        }
      }
      const idx = row * cols + col;
      cellR[idx] = r / ss2; cellG[idx] = g / ss2; cellB[idx] = b / ss2;
    }
  }

  const accentRgb = accents.map(hexToRgb);
  const assign = assignToAccents(cellR, cellG, cellB, total, accentRgb);
  const palette = accents;

  // Build colorMaps: N_COLORS row arrays, each showing cells of that palette color
  const colorMaps: string[][] = Array.from({ length: N_COLORS }, () => []);
  for (let y = 0; y < rows; y++) {
    const rowBufs: string[][] = Array.from({ length: N_COLORS }, () => []);
    for (let x = 0; x < cols; x++) {
      const c = assign[y * cols + x];
      for (let ci = 0; ci < N_COLORS; ci++) {
        rowBufs[ci].push(ci === c ? lines[y][x] : ' ');
      }
    }
    for (let ci = 0; ci < N_COLORS; ci++) {
      colorMaps[ci].push(rowBufs[ci].join(''));
    }
  }

  return { rows: lines, outlineRows, rampIndices, palette, colorMaps, cols, fontSize };
}

export function useAsciiConverter(src: string, cols: number, rows: number, fontSize: number, accents: string[]): AsciiGrid | null {
  // Always read directly from the shared cache — avoids the one-render stale-state
  // window that causes a flash when `src` changes (useState doesn't reinitialize
  // on prop changes, so a state-based approach lags by one render cycle).
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const k = cacheKey(src, cols, rows, accents);
    if (cache.has(k)) return; // already cached — synchronous read below will find it
    const img = new Image();
    img.crossOrigin = 'anonymous';
    let cancelled = false;
    img.onload = () => {
      if (cancelled) return;
      const result = imageToGrid(img, cols, rows, fontSize, accents);
      cache.set(k, result);
      forceUpdate(n => n + 1); // trigger re-render so cache read below picks it up
    };
    img.src = src;
    return () => { cancelled = true; };
  // accents is a stable array reference per photo — including it directly would cause re-runs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, cols, rows, fontSize]);

  // Synchronous cache read — always fresh, no stale-state lag
  return cache.get(cacheKey(src, cols, rows, accents)) ?? null;
}

export function preloadAll(photos: Array<{ src: string; accents: string[] }>, cols: number, rows: number, fontSize: number): void {
  photos.forEach(({ src, accents }) => {
    const k = cacheKey(src, cols, rows, accents);
    if (cache.has(k)) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => cache.set(k, imageToGrid(img, cols, rows, fontSize, accents));
    img.src = src;
  });
}
