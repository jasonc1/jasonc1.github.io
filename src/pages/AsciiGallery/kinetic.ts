/**
 * Kinetic typography engine — per-photo, element-aware animation.
 *
 * Two animation modes:
 *
 *   'wave'    — Multi-frequency noise superposition with physical dispersion.
 *               Three wave components at different scales/speeds (ratio ~1 : 1.3 : 1.68)
 *               based on the dispersion relation ω ∝ √k. Direction is automatic:
 *               flowX/flowY weights determine whether the wave structure is primarily
 *               horizontal (col-dominant) or rolling toward the viewer (row-dominant).
 *               A slow set-envelope modulates overall amplitude (~90s period).
 *               Use for ocean, coastal water, atmospheric cloud drift.
 *
 *   'foliage' — Travelling wind-front phase, not per-cell trembling.
 *               Main: sin(x * flowX + t * oscSpeed + seed * 0.25) — a phase wave
 *               that sweeps left-to-right across the plant mass at oscSpeed rad/sec.
 *               Flutter: fast per-cell detail at 2.8× the main speed.
 *               Height factor: top of zone moves more than base (treetop physics).
 *               Use for flowers, forest canopy, shrubs, wire sway.
 *
 * Pittsburgh additionally runs a procedural bird flock overlay.
 */

import { AsciiGrid, RAMP } from './useAsciiConverter';
import { KineticDir } from './photos';

const RAMP_LEN = RAMP.length;

// ── 2D Perlin noise ───────────────────────────────────────────────────────────

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

// Per-cell hash → phase seed in [0, 2π) — used by foliage flutter
function cellPhase(x: number, y: number): number {
  const h = ((Math.imul(x, 2654435761) ^ Math.imul(y, 2246822519)) >>> 0);
  return (h & 0xFFFF) / 0xFFFF * Math.PI * 2;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type LayerMode = 'wave' | 'foliage' | 'cloud';

/**
 * mode: 'wave'
 *   spatialScale = row noise base frequency (harmonic ratios derived automatically)
 *   colScale     = column noise base frequency
 *   flowX        = horizontal drift speed — higher value = wave moves right faster
 *   flowY        = vertical drift speed — negative = rolls toward viewer (upward)
 *   Direction weighting: |flowX| / (|flowX|+|flowY|) blends col vs row dominance.
 *
 * mode: 'foliage'
 *   flowX        = wind spatial frequency (phase advance per column)
 *   oscSpeed     = wind travel speed (phase advance per second at fixed x)
 *   heightPow    = bend exponent — 1.5 tree-like, 0.4 flower-like (default 1.5)
 *   Flutter runs at oscSpeed * 2.8 — no extra field needed.
 *   spatialScale, colScale, flowY are unused.
 *
 * mode: 'cloud'
 *   flowX        = angular frequency (rad/sec). Period = 2π/flowX seconds.
 *                  0.05 ≈ 125s period (slow screensaver drift).
 *   maxShift     = breathing noise amplitude in chars (subtle variation on top of sine).
 *   Oscillation amplitude = min(cols * 0.25, 60) chars — caps on wide grids.
 *   No linear wrap → no seam artifact. Drift reverses naturally like clouds in wind.
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
  heightPow?:   number;
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

    // ── Bodega Bay — coastal mist drifting sideways ───────────────────────
    // Notes: mist in mid-frame (~0.25–0.70), horizontal drift dominant.
    // 2× speed: flowX doubled (0.36), flowY doubled (–0.60).
    case 'ocean_waves':
      layers = [{
        mode: 'wave',
        zoneRowStart: 0.25, zoneRowEnd: 0.70,
        densityMin: 43, densityMax: 62,
        spatialScale: 0.06,
        colScale: 0.06,
        flowX: 0.36,
        flowY: -0.60,
        maxShift: 2,
        oscSpeed: 0,
      }];
      break;

    // ── Flora — bougainvillea in a Ghibli-style breeze ───────────────────
    // Two layers: slow mass sway (whole bush tilts) + faster per-flower flutter.
    // heightPow 0.4 = much more uniform than trees — flowers animate throughout,
    // not just at the top. Wide density range catches both petals and stems.
    case 'flower_wind':
      layers = [
        {
          // Mass sway — the whole bush tilts left-to-right as one body
          mode: 'foliage',
          zoneRowStart: 0.05, zoneRowEnd: 0.92,
          densityMin: 5, densityMax: 45,
          spatialScale: 0, colScale: 0, flowY: 0,
          flowX: 0.002,     // very long spatial period → entire mass sways together
          oscSpeed: 0.65,   // ~10s sway cycle — languid, not frantic
          maxShift: 1,
          heightPow: 0.4,
        },
        {
          // Individual flower flutter — faster detail on top of mass motion
          mode: 'foliage',
          zoneRowStart: 0.05, zoneRowEnd: 0.92,
          densityMin: 12, densityMax: 35,
          spatialScale: 0, colScale: 0, flowY: 0,
          flowX: 0.014,     // tighter period → individual flowers tremble at own rate
          oscSpeed: 1.5,    // ~4s flutter cycle — lighter than mass
          maxShift: 1,
          heightPow: 0.4,
        },
      ];
      break;

    // ── Forest — heavy canopy swaying ────────────────────────────────────
    // Notes: larger mass, slower than flowers. Upper canopy leads the sway.
    case 'forest_wind':
      layers = [{
        mode: 'foliage',
        zoneRowStart: 0.04, zoneRowEnd: 0.92,
        densityMin: 7, densityMax: 22,
        spatialScale: 0, colScale: 0, flowY: 0,
        flowX: 0.002,   // very large spatial period → whole canopy as one mass
        oscSpeed: 0.55, // heavy and slow: ~11s cycle
        maxShift: 1,
      }];
      break;

    // ── Half Moon Bay — coastal shrubs in exposed wind ────────────────────
    // Notes: small tough shrubs near cliff top, faster than forest.
    case 'coastal_shrubs':
      layers = [{
        mode: 'foliage',
        zoneRowStart: 0.02, zoneRowEnd: 0.20,
        densityMin: 5, densityMax: 22,
        spatialScale: 0, colScale: 0, flowY: 0,
        flowX: 0.008,   // tighter period → wave ripple visible through shrubs
        oscSpeed: 1.4,  // coastal wind: ~4.5s cycle
        maxShift: 1,
      }];
      break;

    // ── Honolulu — screensaver clouds + rolling ocean ─────────────────────
    // Notes: sky clouds move LEFT TO RIGHT very slowly (one mass).
    //        Cloud mode horizontally scrolls the existing sky ASCII shapes.
    //        flowX = chars/sec. ~1.8 chars/sec → ~110s to cycle a 200-col grid.
    case 'dual_horizon':
      layers = [
        {
          // Sky: sine-oscillation cloud drift — no linear wrap, no seam.
          // flowX = angular frequency (rad/sec). Amplitude = min(cols*0.25, 60) chars.
          mode: 'cloud',
          zoneRowStart: 0.04, zoneRowEnd: 0.46,
          densityMin: 48, densityMax: 62,
          spatialScale: 0,
          colScale: 0,
          flowX: 0.05,   // rad/sec — ~125s period, slow screensaver oscillation
          flowY: 0,
          maxShift: 3,   // breathing noise amplitude in chars
          oscSpeed: 0,
        },
      ];
      break;

    // ── Montana d'Oro — horizontal ocean swells, left to right ───────────
    // Notes: waves before the rock island AND after. Sky/cliffs not animated.
    // Two zones: pre-island (0.32–0.52) slightly calmer, post-island (0.50–0.88).
    case 'coastal_waves':
      layers = [
        {
          // Pre-island water — calmer swells before the rocks
          mode: 'wave',
          zoneRowStart: 0.32, zoneRowEnd: 0.52,
          densityMin: 43, densityMax: 62,
          spatialScale: 0.04,
          colScale: 0.06,
          flowX: 0.80,
          flowY: -0.04,
          maxShift: 3,
          oscSpeed: 0,
        },
        {
          // Post-island water — active swells after the rocks
          mode: 'wave',
          zoneRowStart: 0.50, zoneRowEnd: 0.88,
          densityMin: 43, densityMax: 62,
          spatialScale: 0.04,
          colScale: 0.06,
          flowX: 0.80,
          flowY: -0.06,
          maxShift: 4,
          oscSpeed: 0,
        },
      ];
      break;

    // ── Pittsburgh — wire sway + bird flock ──────────────────────────────
    // Notes: wires sway very slowly as structural units, birds cross sky.
    case 'city_birds': {
      layers = [{
        mode: 'foliage',
        zoneRowStart: 0.08, zoneRowEnd: 0.58,
        densityMin: 38, densityMax: 47,
        spatialScale: 0, colScale: 0, flowY: 0,
        flowX: 0.001,   // very large period → each wire sways as a whole
        oscSpeed: 0.45, // structural slow tremor: ~14s cycle
        maxShift: 1,
      }];

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
    case 'cloud':   return applyCloudLayer(state, layer, tSec, output);
  }
}

// ── Wave layer — multi-frequency dispersion + direction weighting ─────────────
//
// Three noise components at harmonic frequency ratios (1 : 1.68 : 2.83) with
// speed ratios proportional to √k (physical ocean dispersion: ω = √(g·k)).
// This creates natural interference patterns and "sets" of larger waves.
//
// Direction is automatic: |flowX|/(|flowX|+|flowY|) blends how much the
// horizontal (column) vs vertical (row) component dominates.

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

  // Direction weights — determines col vs row dominance automatically
  const totalFlow = Math.abs(layer.flowX) + Math.abs(layer.flowY) + 0.001;
  const rowW = Math.abs(layer.flowY) / totalFlow;
  const colW = Math.abs(layer.flowX) / totalFlow;

  // Dispersion-correct speed ratios: ω ∝ √k → √1 : √1.68 : √2.83 ≈ 1 : 1.30 : 1.68
  const S1 = 1.00, S2 = 1.30, S3 = 1.68;

  // Slow wave-set envelope — mimics distant storm pulses (~90s period)
  const setMod = 0.75 + 0.25 * Math.sin(tSec * 0.07);

  for (let y = zoneTop; y < zoneBot; y++) {
    const rowFrac    = (y - zoneTop) / zoneH;
    const zoneWeight = Math.sin(rowFrac * Math.PI); // fade at zone edges

    // Row (vertical) noise: three frequencies, speeds scale with √k
    const sk = layer.spatialScale;
    const fy = layer.flowY;
    const rowNoise =
      noise2(y * sk          + fy * S1 * tSec, 2.71) * 0.50 +
      noise2(y * sk * 1.68   + fy * S2 * tSec, 3.14) * 0.35 +
      noise2(y * sk * 2.83   + fy * S3 * tSec, 1.57) * 0.15;

    let chars: string[] | null = null;

    for (let x = 0; x < cols; x++) {
      const idx = rampIndices[y * cols + x];
      if (idx < layer.densityMin || idx > layer.densityMax) continue;

      // Column (horizontal) noise: same three-frequency approach
      const ck = layer.colScale;
      const fx = layer.flowX;
      const colNoise =
        noise2(x * ck          + fx * S1 * tSec, 1.41) * 0.50 +
        noise2(x * ck * 1.68   + fx * S2 * tSec, 2.24) * 0.35 +
        noise2(x * ck * 2.83   + fx * S3 * tSec, 3.73) * 0.15;

      const n     = (rowNoise * rowW + colNoise * colW) * setMod;
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

// ── Foliage layer — travelling wind-front phase ───────────────────────────────
//
// Based on SpeedTree / Ghibli wind shader model:
//   Main: sin(x * flowX + t * oscSpeed + seed * 0.25) — phase front sweeps L→R
//   Flutter: sin(seed + t * oscSpeed * 2.8) — fast per-cell detail
//   Height: tips (zone top) move more than roots (zone bottom), pow 1.5 falloff.
//
// The travelling main component creates the coordinated sway seen in anime;
// flutter adds organic per-leaf texture without dominating.

function applyFoliageLayer(
  state:  KineticState,
  layer:  AnimLayer,
  tSec:   number,
  output: string[],
): void {
  const { rows, cols, numRows, rampIndices } = state;
  const zoneTop = Math.floor(layer.zoneRowStart * numRows);
  const zoneBot = Math.ceil(layer.zoneRowEnd   * numRows);
  const zoneH   = Math.max(1, zoneBot - zoneTop);

  for (let y = zoneTop; y < zoneBot; y++) {
    // Height factor: 1.0 at top of zone (tips), 0.0 at bottom (roots).
    // heightPow 1.5 = tree-like (tips dominate); 0.4 = flower-like (more uniform).
    const heightFrac = 1 - (y - zoneTop) / zoneH;
    const bendFactor = Math.pow(heightFrac, layer.heightPow ?? 1.5);

    let chars: string[] | null = null;

    for (let x = 0; x < cols; x++) {
      const idx = rampIndices[y * cols + x];
      if (idx < layer.densityMin || idx > layer.densityMax) continue;

      const seed = cellPhase(x, y);

      // Main: travelling wind front sweeping left → right
      const windFront = x * layer.flowX + tSec * layer.oscSpeed;
      const main    = Math.sin(windFront + seed * 0.25) * 0.70;

      // Flutter: fast per-cell oscillation (organic leaf detail)
      const flutter = Math.sin(seed + tSec * layer.oscSpeed * 2.8) * 0.30;

      const shift = Math.round((main + flutter) * layer.maxShift * bendFactor);
      if (shift === 0) continue;

      const newIdx = Math.max(0, Math.min(RAMP_LEN - 1, idx + shift));
      if (newIdx === idx) continue;

      if (!chars) chars = rows[y].split('');
      chars[x] = RAMP[newIdx];
    }

    if (chars) output[y] = chars.join('');
  }
}

// ── Cloud layer — horizontal oscillation of existing ASCII cloud shapes ───────
//
// Unlike wave mode (vertical char displacement), cloud mode shifts existing
// characters horizontally so cloud shapes drift across the sky.
//
// Uses sine oscillation instead of linear scroll to avoid the wraparound seam
// that appears as a moving edge artifact when content cycles past cols boundary.
// flowX = angular frequency (rad/sec). Amplitude = min(cols*0.25, 60) chars.
// A very slow Perlin noise adds subtle breathing on top of the sine wave.

function applyCloudLayer(
  state:  KineticState,
  layer:  AnimLayer,
  tSec:   number,
  output: string[],
): void {
  const { rows, cols, numRows, rampIndices } = state;
  const zoneTop = Math.floor(layer.zoneRowStart * numRows);
  const zoneBot = Math.ceil(layer.zoneRowEnd   * numRows);

  // Sine oscillation — no modular wrap, no seam. Amplitude capped for wide grids.
  const amp = Math.min(cols * 0.25, 60);
  const breathing = noise2(tSec * 0.003, 0.5) * layer.maxShift;
  const scrollAmt = Math.sin(tSec * layer.flowX) * amp + breathing;
  const scrollInt = Math.round(scrollAmt);

  if (scrollInt === 0) return;

  for (let y = zoneTop; y < zoneBot; y++) {
    let chars: string[] | null = null;

    for (let x = 0; x < cols; x++) {
      const destIdx = rampIndices[y * cols + x];
      if (destIdx < layer.densityMin || destIdx > layer.densityMax) continue;

      // Clamp srcX to valid range — no modular wrap, so edges hold their value
      const srcX = Math.max(0, Math.min(cols - 1, x - scrollInt));
      if (srcX === x) continue;

      const srcChar = rows[y][srcX];
      if (srcChar === rows[y][x]) continue;

      if (!chars) chars = rows[y].split('');
      chars[x] = srcChar;
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
