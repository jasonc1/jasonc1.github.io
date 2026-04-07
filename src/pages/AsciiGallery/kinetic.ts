/**
 * Kinetic typography engine — per-photo, element-aware animation.
 *
 * Two animation modes, chosen to eliminate the "2D noise orb" artifact:
 *
 *   'wave'    — 1D row-based noise: each row samples an independent noise value,
 *               creating horizontal ripple bands. A small per-cell component breaks
 *               up perfectly uniform rows. No 2D spatial field → no blob structures.
 *               Use for ocean, coastal water.
 *
 *   'foliage' — per-cell sinusoidal oscillation with a position-seeded phase offset.
 *               Every qualifying cell trembles at its own rate, like individual leaves.
 *               No shared spatial structure → no orbs, no shimmer.
 *               Use for forest canopy, flowers, shrubs, wires, and sky chars.
 *
 * Pittsburgh additionally runs a procedural bird flock overlay.
 */

import { AsciiGrid, RAMP } from './useAsciiConverter';
import { KineticDir } from './photos';

const RAMP_LEN = RAMP.length;

// ── 2D Perlin noise (used as 1D sampler for 'wave' mode) ─────────────────────

const PERM = (() => {
  const p = Array.from({ length: 256 }, (_, i) => i);
  let s = 0xdeadbeef >>> 0;
  for (let i = 255; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  const t = new Uint8Array(512);
  for (let i = 0; i < 512; i++) t[i] = p[i & 255];
  return t;
})();

function _fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function _lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function _grad(h: number, x: number, y: number) {
  switch (h & 3) {
    case 0: return  x + y;
    case 1: return -x + y;
    case 2: return  x - y;
    default: return -x - y;
  }
}

function noise2(x: number, y: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  x -= Math.floor(x); y -= Math.floor(y);
  const u = _fade(x), v = _fade(y);
  const a = PERM[X] + Y, b = PERM[X + 1] + Y;
  return _lerp(
    _lerp(_grad(PERM[a],     x,     y  ), _grad(PERM[b],     x - 1,     y  ), u),
    _lerp(_grad(PERM[a + 1], x, y - 1  ), _grad(PERM[b + 1], x - 1, y - 1  ), u),
    v,
  );
}

// Per-cell integer hash → phase offset in [0, 2π)
// Gives each foliage cell an independent oscillation phase.
function cellPhase(x: number, y: number): number {
  const h = ((Math.imul(x, 2654435761) ^ Math.imul(y, 2246822519)) >>> 0);
  return (h & 0xFFFF) / 0xFFFF * Math.PI * 2;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type LayerMode = 'wave' | 'foliage';

/**
 * One animation zone.
 *
 * mode: 'wave'
 *   spatialScale = row noise frequency (rows per noise period)
 *   colScale     = per-cell horizontal noise frequency (breaks up uniform rows)
 *   flowX        = horizontal drift speed (units/sec)
 *   flowY        = row phase drift speed — wave travel speed (units/sec)
 *
 * mode: 'foliage'
 *   oscSpeed     = angular velocity (rad/sec) — controls trembling cadence
 *   (spatialScale, colScale, flowX, flowY ignored)
 *
 * mode: 'sky'
 *   spatialScale = 2D noise frequency (very small → very large features)
 *   flowX, flowY = slow drift direction
 *   (colScale, oscSpeed ignored)
 */
interface AnimLayer {
  mode:         LayerMode;
  zoneRowStart: number;
  zoneRowEnd:   number;
  densityMin:   number;
  densityMax:   number;
  spatialScale: number;
  colScale:     number;
  flowX:        number;
  flowY:        number;
  maxShift:     number;
  oscSpeed:     number;
}

interface BirdState {
  x:     number;
  y:     number;
  speed: number;
}

export interface KineticState {
  dir:         KineticDir;
  rows:        string[];
  cols:        number;
  numRows:     number;
  rampIndices: Uint8Array;
  layers:      AnimLayer[];
  birds:       BirdState[] | null;
  prevElapsed: number;
}

// ── Build per-photo state ─────────────────────────────────────────────────────

export function buildKineticState(grid: AsciiGrid, dir: KineticDir): KineticState {
  const { rows, cols, rampIndices } = grid;
  const numRows = rows.length;
  let layers: AnimLayer[] = [];
  let birds: BirdState[] | null = null;

  switch (dir) {

    // ── Bodega Bay — rolling ocean surface ────────────────────────────────
    // 1D row noise: each row has an independent wave height.
    // densityMin/Max spans the full range of typical water chars — from
    // medium-density foam (~43) through bright glare/reflection (~62).
    // Space chars (63-64) excluded to avoid dot-pop artifacts.
    // flowY < 0 → rows drift upward = waves rolling toward viewer.
    case 'ocean_waves':
      layers = [{
        mode: 'wave',
        zoneRowStart: 0.52, zoneRowEnd: 1.0,
        densityMin: 43, densityMax: 62,
        spatialScale: 0.08,  // ~12 rows/period → ~4 ripple bands in zone
        colScale: 0.022,     // subtle horizontal variation within rows
        flowX: 0.05,
        flowY: -0.60,        // ~6s per wave band crossing the zone — feels like tide
        maxShift: 3,         // crest/trough readable as brightness change
        oscSpeed: 0,
      }];
      break;

    // ── Flora — magenta bush in a steady breeze ───────────────────────────
    // Each cell trembles at its own phase → feels like many flowers moving
    // independently, not a shared wave sweeping through.
    case 'flower_wind':
      layers = [{
        mode: 'foliage',
        zoneRowStart: 0.05, zoneRowEnd: 0.95,
        densityMin: 10, densityMax: 32,
        spatialScale: 0, colScale: 0, flowX: 0, flowY: 0,
        maxShift: 1,
        oscSpeed: 1.8,  // gentle breeze
      }];
      break;

    // ── Forest — canopy wind ──────────────────────────────────────────────
    case 'forest_wind':
      layers = [{
        mode: 'foliage',
        zoneRowStart: 0.04, zoneRowEnd: 0.92,
        densityMin: 7, densityMax: 18,
        spatialScale: 0, colScale: 0, flowX: 0, flowY: 0,
        maxShift: 1,
        oscSpeed: 1.4,  // heavier canopy — slightly slower
      }];
      break;

    // ── Half Moon Bay — shrub row at cliff top ────────────────────────────
    case 'coastal_shrubs':
      layers = [{
        mode: 'foliage',
        zoneRowStart: 0.02, zoneRowEnd: 0.20,
        densityMin: 5, densityMax: 20,
        spatialScale: 0, colScale: 0, flowX: 0, flowY: 0,
        maxShift: 1,
        oscSpeed: 2.2,  // exposed coastal wind — faster
      }];
      break;

    // ── Honolulu — sky breathing + ocean waves ────────────────────────────
    // Sky: single-octave 2D noise at ~250-char scale — pure atmosphere, no blobs.
    // Water: 1D row wave, same as Bodega Bay.
    case 'dual_horizon':
      layers = [
        {
          // Sky: per-cell oscillation — no spatial structure, no orbs
          mode: 'foliage',
          zoneRowStart: 0.04, zoneRowEnd: 0.46,
          densityMin: 50, densityMax: 62,   // exclude index 63 (space) — avoids dot-pop artifacts
          spatialScale: 0, colScale: 0, flowX: 0, flowY: 0,
          maxShift: 1,
          oscSpeed: 0.4,  // very slow — atmospheric breathing
        },
        {
          mode: 'wave',
          zoneRowStart: 0.52, zoneRowEnd: 1.0,
          densityMin: 43, densityMax: 62,
          spatialScale: 0.08,
          colScale: 0.022,
          flowX: 0.05,
          flowY: -0.60,
          maxShift: 3,
          oscSpeed: 0,
        },
      ];
      break;

    // ── Montana d'Oro — diagonal coastal swells ───────────────────────────
    // Stronger horizontal flow component creates diagonal wave direction.
    case 'coastal_waves':
      layers = [{
        mode: 'wave',
        zoneRowStart: 0.32, zoneRowEnd: 0.90,
        densityMin: 43, densityMax: 62,
        spatialScale: 0.08,
        colScale: 0.022,
        flowX: 0.40,   // diagonal swells — strong X component
        flowY: -0.50,
        maxShift: 3,
        oscSpeed: 0,
      }];
      break;

    // ── Pittsburgh — wire sway + bird flock ──────────────────────────────
    // Wire layer uses foliage mode: each structural character trembles at its
    // own independent phase. No shared spatial field → no orbs whatsoever.
    // Sky is left unanimated — the photo reads fine without it.
    case 'city_birds': {
      layers = [
        {
          mode: 'foliage',
          zoneRowStart: 0.08, zoneRowEnd: 0.58,
          densityMin: 38, densityMax: 47,   // t / | ( ) 1 ? - _ +
          spatialScale: 0, colScale: 0, flowX: 0, flowY: 0,
          maxShift: 1,
          oscSpeed: 0.8,  // slow, subtle wire tremor
        },
      ];

      const skyTop = Math.floor(0.08 * numRows);
      const skyBot = Math.floor(0.55 * numRows);
      const skyH   = Math.max(1, skyBot - skyTop);

      birds = Array.from({ length: 5 }, (_, i) => ({
        x:     (cols / 5) * i + Math.random() * (cols / 5),
        y:     skyTop + Math.floor((i / 5 + Math.random() * 0.18) * skyH),
        speed: -(22 + Math.random() * 14),
      }));
      break;
    }
  }

  return { dir, rows, cols, numRows, rampIndices, layers, birds, prevElapsed: 0 };
}

// ── Per-frame update ──────────────────────────────────────────────────────────

export function applyKineticFrame(
  state:   KineticState,
  elapsed: number,
  output:  string[],
): void {
  const { rows, numRows } = state;
  const tSec  = elapsed / 1000;
  const dtSec = Math.min((elapsed - state.prevElapsed) / 1000, 0.1);
  state.prevElapsed = elapsed;

  for (let y = 0; y < numRows; y++) output[y] = rows[y];
  for (const layer of state.layers) applyLayer(state, layer, tSec, output);
  if (state.birds) applyBirds(state, dtSec, output);
}

// ── Layer dispatch ────────────────────────────────────────────────────────────

function applyLayer(
  state:  KineticState,
  layer:  AnimLayer,
  tSec:   number,
  output: string[],
): void {
  switch (layer.mode) {
    case 'wave':    return applyWaveLayer(state, layer, tSec, output);
    case 'foliage': return applyFoliageLayer(state, layer, tSec, output);
  }
}

// ── Wave layer — 1D row noise ─────────────────────────────────────────────────
// Each row gets one noise value (its "wave height"). A small per-cell
// horizontal component breaks up perfectly uniform rows without creating blobs.

function applyWaveLayer(
  state:  KineticState,
  layer:  AnimLayer,
  tSec:   number,
  output: string[],
): void {
  const { rows, cols, numRows, rampIndices } = state;
  const zoneTop = Math.floor(layer.zoneRowStart * numRows);
  const zoneBot = Math.ceil(layer.zoneRowEnd   * numRows);
  const zoneH   = Math.max(1, zoneBot - zoneTop - 1);

  for (let y = zoneTop; y < zoneBot; y++) {
    const rowFrac    = (y - zoneTop) / zoneH;
    const zoneWeight = Math.sin(rowFrac * Math.PI);

    // Row noise: sample at (rowPhase, fixed Y) → pure 1D variation across rows
    const rowPhase  = y * layer.spatialScale + layer.flowY * tSec;
    const rowNoise  = noise2(rowPhase, 2.71);

    let chars: string[] | null = null;

    for (let x = 0; x < cols; x++) {
      const i   = y * cols + x;
      const idx = rampIndices[i];
      if (idx < layer.densityMin || idx > layer.densityMax) continue;

      // Per-cell horizontal variation — subtle, keeps rows from being identical
      const colPhase  = x * layer.colScale + layer.flowX * tSec;
      const cellNoise = noise2(colPhase, 1.41);

      const n     = rowNoise * 0.72 + cellNoise * 0.28;
      const shift = Math.round(n * layer.maxShift * zoneWeight);
      if (shift === 0) continue;

      const newIdx = Math.max(0, Math.min(RAMP_LEN - 1, idx + shift));
      if (newIdx === idx) continue;

      if (!chars) chars = rows[y].split('');
      chars[x] = RAMP[newIdx];
    }

    if (chars) output[y] = chars.join('');
  }
}

// ── Foliage layer — per-cell sinusoidal oscillation ──────────────────────────
// Each qualifying cell oscillates independently, seeded by its grid position.
// No shared spatial pattern → no orbs, no shimmer, just individual trembling.

function applyFoliageLayer(
  state:  KineticState,
  layer:  AnimLayer,
  tSec:   number,
  output: string[],
): void {
  const { rows, cols, numRows, rampIndices } = state;
  const zoneTop = Math.floor(layer.zoneRowStart * numRows);
  const zoneBot = Math.ceil(layer.zoneRowEnd   * numRows);

  for (let y = zoneTop; y < zoneBot; y++) {
    let chars: string[] | null = null;

    for (let x = 0; x < cols; x++) {
      const i   = y * cols + x;
      const idx = rampIndices[i];
      if (idx < layer.densityMin || idx > layer.densityMax) continue;

      // Each cell has its own phase offset → trembles out of sync with neighbors
      const phase = cellPhase(x, y) + tSec * layer.oscSpeed;
      const shift = Math.round(Math.sin(phase) * layer.maxShift);
      if (shift === 0) continue;

      const newIdx = Math.max(0, Math.min(RAMP_LEN - 1, idx + shift));
      if (newIdx === idx) continue;

      if (!chars) chars = rows[y].split('');
      chars[x] = RAMP[newIdx];
    }

    if (chars) output[y] = chars.join('');
  }
}

// ── Bird flock (Pittsburgh) ───────────────────────────────────────────────────

const BIRD_CHAR = 'v';

function applyBirds(state: KineticState, dtSec: number, output: string[]): void {
  const { birds, cols, numRows, rampIndices } = state;
  if (!birds) return;

  const skyTop = Math.floor(0.08 * numRows);
  const skyBot = Math.floor(0.50 * numRows);
  const skyH   = Math.max(1, skyBot - skyTop);

  for (const bird of birds) {
    bird.x += bird.speed * dtSec;
    if (bird.x < -1) {
      bird.x = cols;
      bird.y = skyTop + Math.floor(Math.random() * skyH);
    }
    const xi = Math.round(bird.x);
    const yi = bird.y;
    if (xi < 0 || xi >= cols || yi < 0 || yi >= numRows) continue;
    if (rampIndices[yi * cols + xi] < 48) continue;
    output[yi] = output[yi].substring(0, xi) + BIRD_CHAR + output[yi].substring(xi + 1);
  }
}
