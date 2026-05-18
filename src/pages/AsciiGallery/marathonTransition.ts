/**
 * Marathon-style transition: geometric shape families + directional dissolve.
 *
 * Three phases:
 *   1. Entry sweep — shapes appear directionally (leading edge first)
 *   2. Shape cycling — full screen of cycling geometric characters
 *   3. Exit dissolve — shapes disappear directionally with soft trailing edge
 *
 * Light/empty areas use subtle characters instead of blank space,
 * keeping the screen dense and kinetic throughout.
 */

// ── Shape family ramps ──────────────────────────────────────────────────────
// 8 chars each. No spaces — even the lightest index uses a visible character.
// Index 0 = lightest (subtle dot), index 7 = heaviest.
const FAMILIES = [
  '··..+x#@',   // Dots → crosses → dense
  '··.oOO0@',   // Dots → circles → dense
  '··.:=+#@',   // Dots → structure → dense
  '··./|/x#',   // Dots → lines → dense
  '·· · ·· ',   // Sparse tail (only this one has spaces)
];

export const FAMILY_COUNT = FAMILIES.length;
export const SHAPE_Q = 8;

export const FAMILY_CODES: Uint16Array[] = FAMILIES.map(f => {
  const codes = new Uint16Array(SHAPE_Q);
  for (let i = 0; i < SHAPE_Q; i++) codes[i] = f.charCodeAt(i);
  return codes;
});

// ── Dissolve edge character — shown at the trailing edge of the dissolve front
const EDGE_CHAR = 0xB7; // · (middle dot)

// ── 8 directional wipe vectors ──────────────────────────────────────────────
const DIRECTIONS: [number, number][] = [
  [ 1,  0],   // → right
  [-1, -1],   // ↖ up-left
  [ 0,  1],   // ↓ down
  [ 1, -1],   // ↗ up-right
  [-1,  0],   // ← left
  [ 1,  1],   // ↘ down-right
  [ 0, -1],   // ↑ up
  [-1,  1],   // ↙ down-left
];

let _dirIndex = Math.floor(Math.random() * 8);

// ── Public interface ────────────────────────────────────────────────────────

export interface MarathonState {
  cols: number;
  numRows: number;
  startMs: number;
  durationMs: number;
  weight: Float32Array;
  rand: Float32Array;
  dirPos: Float32Array;
  buf: Uint16Array;
  lines: string[];
}

export function initMarathon(
  rampIndices: Uint8Array,
  cols: number,
  numRows: number,
  durationMs: number,
): MarathonState {
  let rampMax = 0;
  for (let i = 0; i < rampIndices.length; i++) {
    if (rampIndices[i] > rampMax) rampMax = rampIndices[i];
  }
  if (rampMax < 1) rampMax = 1;
  const total = cols * numRows;

  const weight = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    weight[i] = 1 - rampIndices[i] / rampMax;
  }

  const rand = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    rand[i] = Math.random();
  }

  const [dx, dy] = DIRECTIONS[_dirIndex % 8];
  _dirIndex++;

  const dirPos = new Float32Array(total);
  const invCols = cols > 1 ? 1 / (cols - 1) : 0;
  const invRows = numRows > 1 ? 1 / (numRows - 1) : 0;
  let minDot = Infinity, maxDot = -Infinity;

  for (let y = 0; y < numRows; y++) {
    const ny = y * invRows;
    const off = y * cols;
    for (let x = 0; x < cols; x++) {
      const dot = x * invCols * dx + ny * dy;
      dirPos[off + x] = dot;
      if (dot < minDot) minDot = dot;
      if (dot > maxDot) maxDot = dot;
    }
  }
  const range = maxDot - minDot || 1;
  for (let i = 0; i < total; i++) {
    dirPos[i] = (dirPos[i] - minDot) / range;
  }

  return { cols, numRows, startMs: performance.now(), durationMs, weight, rand, dirPos, buf: new Uint16Array(cols), lines: new Array(numRows) };
}

export function tickMarathon(state: MarathonState): {
  text: string;
  done: boolean;
} {
  const t = Math.min(1, (performance.now() - state.startMs) / state.durationMs);
  const { weight, rand, dirPos, cols, numRows, buf, lines } = state;

  // ── Phase blending ──
  const rawPhase = Math.min(FAMILY_COUNT - 0.001, t * FAMILY_COUNT * 1.1);
  const phaseIdx = Math.floor(rawPhase);
  const blend = rawPhase - phaseIdx;
  const curCodes = FAMILY_CODES[Math.min(phaseIdx, FAMILY_COUNT - 1)];
  const nxtCodes = FAMILY_CODES[Math.min(phaseIdx + 1, FAMILY_COUNT - 1)];

  // ── Entry sweep (0% – 20%) ──
  let entryFront = 1;
  if (t < 0.2) {
    entryFront = t / 0.2;
  }

  // ── Exit dissolve (40% – 100%) ──
  let exitThreshold = 0;
  if (t > 0.4) {
    const d = (t - 0.4) / 0.55;
    exitThreshold = d < 1 ? d * d : 1;
  }

  // Soft edge width — cells within this margin of the dissolve front
  // show a trailing dot instead of hard-cutting to space
  const EDGE_WIDTH = 0.08;

  // ── Build text (reuses pre-allocated lines array) ──
  for (let y = 0; y < numRows; y++) {
    const off = y * cols;

    for (let x = 0; x < cols; x++) {
      const idx = off + x;
      const w = weight[idx];
      const r = rand[idx];
      const dp = dirPos[idx];

      // Entry: not yet reached — show trailing dot near the front
      const entryVal = dp + (r - 0.5) * 0.1;
      if (entryVal > entryFront) {
        // Soft entry edge: cells just ahead of the front get a dot
        if (entryVal < entryFront + EDGE_WIDTH) {
          buf[x] = EDGE_CHAR;
        } else {
          buf[x] = 32;
        }
        continue;
      }

      // Exit dissolve
      const life = w * 0.25 + dp * 0.75 + (r - 0.5) * 0.06;
      if (life < exitThreshold) {
        // Soft dissolve edge: cells just past the threshold get a trailing dot
        if (life > exitThreshold - EDGE_WIDTH) {
          buf[x] = EDGE_CHAR;
        } else {
          buf[x] = 32;
        }
        continue;
      }

      // Pick family with per-cell staggered blending
      const codes = r < blend ? nxtCodes : curCodes;
      // Boost low weights so light areas still show visible chars (not just index 0)
      const boosted = w * 0.75 + 0.25; // range shifts from [0,1] to [0.25,1]
      const qi = Math.min(SHAPE_Q - 1, (boosted * SHAPE_Q) | 0);
      buf[x] = codes[qi];
    }
    lines[y] = String.fromCharCode.apply(null, buf as unknown as number[]);
  }

  return { text: lines.join('\n'), done: t >= 1 };
}
