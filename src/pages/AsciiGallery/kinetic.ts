/**
 * Kinetic typography engine — per-photo, element-aware animation.
 *
 * Three animation modes:
 *   'foliage' — Travelling wind-front phase with height-dependent bend.
 *   'cloud'   — Horizontal sine oscillation of existing ASCII shapes.
 *   'fog'     — Drifting Perlin mist that lightens chars as it passes.
 *
 * Pittsburgh additionally runs a procedural bird flock overlay.
 */

import { AsciiGrid, RAMP, EDGE_CHAR_CODES, STRUCTURAL_EDGE_THRESH } from './useAsciiConverter';
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

export function noise2(x: number, y: number): number {
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

export type LayerMode = 'foliage' | 'cloud' | 'fog';

/**
 * mode: 'foliage' — wind spatial freq (flowX), travel speed (oscSpeed), bend (heightPow).
 * mode: 'fog'     — drifting noise field (spatialScale, flowX/Y, fogThreshold, maxShift).
 * mode: 'cloud'   — sine oscillation (flowX = rad/sec, spatialScale = amplitude fraction).
 */
interface AnimLayer {
  mode:          LayerMode;
  zoneRowStart:  number;
  zoneRowEnd:    number;
  zoneColStart?: number; // 0.0–1.0 fraction, default 0.0
  zoneColEnd?:   number; // 0.0–1.0 fraction, default 1.0
  densityMin:    number;
  densityMax:    number;
  spatialScale:  number;
  colScale:      number;
  flowX:         number;
  flowY:         number;
  maxShift:      number;
  oscSpeed:      number;
  heightPow?:    number;
  seedScale?:    number;  // foliage mode: scales per-cell seed (default 0.25). Lower = longer coherent lengths, less sparkle.
  colPhaseScale?: number; // foliage mode: spatially-smooth column phase via noise (replaces per-cell hash).
                          // nearby columns share phase → coherent lengths. Lower = wider groups. Try 0.06–0.15.
  rowPhaseScale?: number; // cloud mode: each row gets a smooth noise phase offset so rows oscillate independently.
                          // creates physical left/right displacement varying by height — branch/frond sway.
                          // Lower = larger coherent bands. Try 0.04–0.08.
  fogThreshold?:  number; // fog mode: noise threshold below which fog is absent (default 0.50).
  noFade?:       boolean; // cloud mode: skip bottom-35% fade (use for full-frame zones)
  colorIndex?:   number;  // if set, only animate cells whose accent color matches this index.
                          // Indices correspond to the photo's accents array in photos.ts (0,1,2).
}

interface BirdState {
  x:     number;
  y:     number;
  speed: number;
}

interface PetalState {
  x:     number;
  y:     number;
  speedX: number;
  speedY: number;
  phase:  number; // wobble offset
}

export interface KineticState {
  dir:          KineticDir;
  rows:         string[];
  cols:         number;
  numRows:      number;
  rampIndices:  Uint8Array;
  edgeDirs:     Uint8Array;    // per-cell edge direction (0=none, 1-4)
  edges:        Float32Array;  // per-cell normalized edge magnitude
  colorAssign:  Uint8Array;    // per-cell accent color index — used for colorIndex layer filter
  layers:       AnimLayer[];
  birds:        BirdState[] | null;
  petals:       PetalState[] | null;
  petalPool:    [number, number][] | null; // red-position spawn candidates
  prevElapsed:  number;
  // Pre-allocated typed array for per-frame character mutation (avoids split/join)
  charBuf:      Uint16Array;
  // Pre-computed row char codes from source image (read-only reference)
  rowCodes:     Uint16Array;
  // Pre-built RAMP char code lookup
  rampCodes:    Uint16Array;
  // Track which rows were modified this frame (dirty flags)
  dirtyRows:    Uint8Array;
}

// ── Build per-photo state ─────────────────────────────────────────────────────

export function buildKineticState(grid: AsciiGrid, dir: KineticDir): KineticState {
  const { rows, cols, rampIndices, edgeDirs, edges, colorAssign } = grid;
  const numRows = rows.length;
  let layers: AnimLayer[] = [];
  let birds: BirdState[] | null = null;
  let petals: PetalState[] | null = null;
  let petalPool: [number, number][] | null = null;

  switch (dir) {

    // ── Bodega Bay — coastal mist, mid-frame sine drift ─────────────────
    case 'ocean_waves':
      layers = [{
        mode: 'cloud',
        zoneRowStart: 0.25, zoneRowEnd: 0.70,
        densityMin: 50, densityMax: 62,
        spatialScale: 0.04,
        colScale: 0,
        flowX: 0.12,
        flowY: 0,
        maxShift: 1,
        oscSpeed: 0,
      }];
      break;

    // ── Flora — foliage sway + facade light + falling petals ────────────
    case 'flower_wind': {
      layers = [
        {
          // Bush sway — starts below building top, heightPow 1.5 fades in gradually.
          mode: 'foliage',
          zoneRowStart: 0.18, zoneRowEnd: 1.0,
          zoneColStart: 0.00, zoneColEnd: 0.50,
          densityMin: 0, densityMax: 42,
          spatialScale: 0, colScale: 0, flowY: 0,
          flowX: 0.006, oscSpeed: 0.90, maxShift: 4, heightPow: 1.5,
          colPhaseScale: 0.10,
        },
        {
          // Light play — dappled sunlight on the building facade.
          mode: 'fog',
          zoneRowStart: 0.05, zoneRowEnd: 0.75,
          zoneColStart: 0.35, zoneColEnd: 1.0,
          densityMin: 48, densityMax: 65,
          spatialScale: 0.022,
          colScale: 0.65, oscSpeed: 0,
          flowX: 0.008, flowY: 0.002,
          maxShift: 4, fogThreshold: 0.46,
        },
      ];

      // Collect red (colorIndex 0) positions as petal spawn candidates.
      // Bias toward the drape zone above the garage (cols 0.25–0.55, rows 0.15–0.55)
      // by adding those positions twice — petals cluster where the red cascades.
      const redSpawns: [number, number][] = [];
      const drapeColStart = Math.floor(0.25 * cols);
      const drapeColEnd   = Math.floor(0.55 * cols);
      const drapeRowStart = Math.floor(0.15 * numRows);
      const drapeRowEnd   = Math.floor(0.55 * numRows);
      for (let y = 0; y < numRows; y++) {
        for (let x = 0; x < cols; x++) {
          if (colorAssign[y * cols + x] !== 0) continue;
          redSpawns.push([x, y]);
          // Double-weight the drape zone above garage.
          const inDrape = x >= drapeColStart && x < drapeColEnd
                       && y >= drapeRowStart && y < drapeRowEnd;
          if (inDrape) redSpawns.push([x, y]);
        }
      }
      // Subsample to ~300 candidates to keep memory light.
      const pool: [number, number][] = [];
      const step = Math.max(1, Math.floor(redSpawns.length / 300));
      for (let i = 0; i < redSpawns.length; i += step) pool.push(redSpawns[i]);

      const pickSpawn = () => pool[Math.floor(Math.random() * pool.length)];

      petals = Array.from({ length: 25 }, () => {
        const [sx, sy] = pickSpawn();
        return {
          x: sx, y: sy,
          speedX: 3 + Math.random() * 4,
          speedY: 3 + Math.random() * 5,
          phase:  Math.random() * Math.PI * 2,
        };
      });

      petalPool = pool;
      break;
    }

    // ── Forest — fog drifting through the trees ─────────────────────────
    // Two atmospheric layers (ground + upper) set the overall fog field.
    // Two depth-parallax layers create interweaving: behind-trees fog fills
    // light canopy gaps at medium speed, in-front fog rolls over dark trunks
    // at a slower speed. The speed difference produces depth parallax.
    case 'forest_fog':
      layers = [
        {
          // Layer 1: Ground fog — broad, heavy, hugging the forest floor.
          // Slowest horizontal drift (0.020): heavy fog creeps, doesn't blow.
          // ~50s per noise period at spatialScale 0.018 — visible within ~8s.
          // maxShift 7: enough to clearly see brightness rolling through.
          // Flat aspect (colScale 0.20) for horizontal ground-hugging banks.
          mode: 'fog',
          zoneRowStart: 0.40, zoneRowEnd: 1.0,
          densityMin: 0, densityMax: 55,
          spatialScale: 0.011,
          colScale: 0.20, oscSpeed: 0,
          flowX: 0.060, flowY: 0.009,
          maxShift: 7, fogThreshold: 0.52,
        },
        {
          // Layer 2: Upper wisps — thin canopy haze.
          mode: 'fog',
          zoneRowStart: 0.0, zoneRowEnd: 0.55,
          densityMin: 10, densityMax: 58,
          spatialScale: 0.030,
          colScale: 0.45, oscSpeed: 0,
          flowX: 0.165, flowY: 0.024,
          maxShift: 6, fogThreshold: 0.55,
        },
        {
          // Layer 3: Behind-trees — star parallax layer (light chars, fast).
          mode: 'fog',
          zoneRowStart: 0.05, zoneRowEnd: 0.85,
          densityMin: 40, densityMax: 62,
          spatialScale: 0.017,
          colScale: 0.25, oscSpeed: 0,
          flowX: 0.144, flowY: 0.015,
          maxShift: 12, fogThreshold: 0.50,
        },
        {
          // Layer 4: In-front — slow foreground mist over trunks (3x parallax).
          mode: 'fog',
          zoneRowStart: 0.15, zoneRowEnd: 1.0,
          densityMin: 0, densityMax: 30,
          spatialScale: 0.013,
          colScale: 0.22, oscSpeed: 0,
          flowX: 0.048, flowY: 0.006,
          maxShift: 9, fogThreshold: 0.54,
        },
      ];
      break;

    // ── Half Moon Bay — shrubs + metal shimmer + ground shadows ──────────
    case 'coastal_shrubs':
      layers = [
        {
          // Shrub sway — grass/shrubs at the top of the fence.
          mode: 'foliage',
          zoneRowStart: 0.02, zoneRowEnd: 0.22,
          densityMin: 5, densityMax: 30,
          spatialScale: 0, colScale: 0, flowY: 0,
          flowX: 0.009,
          oscSpeed: 1.7,
          maxShift: 3,
          heightPow: 1.0,
          colPhaseScale: 0.09,
        },
        {
          // Shrub flutter — leaf-tip trembling.
          mode: 'foliage',
          zoneRowStart: 0.02, zoneRowEnd: 0.20,
          densityMin: 8, densityMax: 32,
          spatialScale: 0, colScale: 0, flowY: 0,
          flowX: 0.015,
          oscSpeed: 3.2,
          maxShift: 2,
          heightPow: 1.2,
          colPhaseScale: 0.13,
        },
        {
          // Metal wall shimmer — sunlight glinting off corrugated ridges.
          // Larger patches (spatialScale 0.015), stronger effect (maxShift 5),
          // lower threshold (0.42) for broader coverage.
          mode: 'fog',
          zoneRowStart: 0.18, zoneRowEnd: 0.72,
          densityMin: 30, densityMax: 60,
          spatialScale: 0.015,
          colScale: 0.70, oscSpeed: 0,
          flowX: 0.010, flowY: 0.003,
          maxShift: 5, fogThreshold: 0.42,
        },
        {
          // Ground shadow play — cloud shadows drifting across sand.
          // Faster drift, more visible (maxShift 6, threshold 0.40).
          mode: 'fog',
          zoneRowStart: 0.72, zoneRowEnd: 1.0,
          densityMin: 35, densityMax: 65,
          spatialScale: 0.022,
          colScale: 0.50, oscSpeed: 0,
          flowX: 0.016, flowY: 0.002,
          maxShift: 6, fogThreshold: 0.40,
        },
      ];
      break;

    // ── Honolulu — slow screensaver sky drift ────────────────────────────
    case 'dual_horizon':
      layers = [
        {
          mode: 'cloud',
          zoneRowStart: 0.04, zoneRowEnd: 0.46,
          densityMin: 48, densityMax: 62,
          spatialScale: 0,
          colScale: 0,
          flowX: 0.05,   // rad/sec — ~125s period, slow screensaver oscillation
          flowY: 0,
          maxShift: 3,
          oscSpeed: 0,
        },
      ];
      break;

    // ── Montana d'Oro — slow sky + distant ocean swells ──────────────────
    case 'coastal_waves':
      layers = [
        {
          // Sky drift — tight zone: top 18%, starts at col 30% to clear cliff/ridge.
          // densityMin 58 excludes cliff silhouette (darker structure chars).
          mode: 'cloud',
          zoneRowStart: 0.0, zoneRowEnd: 0.18,
          zoneColStart: 0.30,
          densityMin: 58, densityMax: 65,
          spatialScale: 0.02,
          colScale: 0,
          flowX: 0.06,
          flowY: 0,
          maxShift: 2,
          oscSpeed: 0,
        },
        {
          // Ocean — starts at row 0.72 (below coastline/island).
          // colStart 0.35 clears the left rock outcrop; densityMin 58
          // excludes the island silhouette and dark rock textures.
          mode: 'cloud',
          zoneRowStart: 0.72, zoneRowEnd: 1.0,
          zoneColStart: 0.35,
          densityMin: 58, densityMax: 65,
          spatialScale: 0.04,
          colScale: 0,
          flowX: 0.18,
          flowY: 0,
          maxShift: 1,
          oscSpeed: 0,
        },
      ];
      break;

    // ── Pillars — ivy breeze + warm light leak pulse ─────────────────────
    case 'ivy_light':
      layers = [
        {
          // Dappled sunlight on stone — shifting light filtering through ivy.
          // Targets mid-bright facade/window cells (the stone has plenty of
          // visible ASCII characters). Slow drift, broad patches.
          mode: 'fog',
          zoneRowStart: 0.0, zoneRowEnd: 0.85,
          zoneColStart: 0.15, zoneColEnd: 0.90,
          densityMin: 35, densityMax: 62,
          spatialScale: 0.018,
          colScale: 0.55, oscSpeed: 0,
          flowX: 0.010, flowY: 0.003,
          maxShift: 6, fogThreshold: 0.44,
        },
      ];
      break;

    // ── Pittsburgh — wire sway + bird flock ──────────────────────────────
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

  // Pre-allocate typed arrays for per-frame mutation — avoids split/join every frame
  const totalCells = cols * numRows;
  const charBuf = new Uint16Array(totalCells);
  const rowCodes = new Uint16Array(totalCells);
  for (let y = 0; y < numRows; y++) {
    const off = y * cols;
    const row = rows[y];
    for (let x = 0; x < cols; x++) {
      rowCodes[off + x] = row.charCodeAt(x);
    }
  }
  // Pre-build RAMP char code lookup
  const rampCodes = new Uint16Array(RAMP_LEN);
  for (let i = 0; i < RAMP_LEN; i++) rampCodes[i] = RAMP.charCodeAt(i);

  const dirtyRows = new Uint8Array(numRows);

  return { dir, rows, cols, numRows, rampIndices, edgeDirs, edges, colorAssign, layers, birds, petals, petalPool, prevElapsed: 0, charBuf, rowCodes, rampCodes, dirtyRows };
}

// ── Per-frame update ──────────────────────────────────────────────────────────

export function applyKineticFrame(
  state:   KineticState,
  elapsed: number,
  output:  string[],
): void {
  const { rows, numRows, charBuf, rowCodes, dirtyRows } = state;
  const tSec  = elapsed / 1000;
  const dtSec = Math.min((elapsed - state.prevElapsed) / 1000, 0.1);
  state.prevElapsed = elapsed;

  // Reset char buffer to source image codes (fast typed array copy)
  charBuf.set(rowCodes);
  dirtyRows.fill(0);

  // Apply animation layers — they mutate charBuf directly via char codes
  for (const layer of state.layers) applyLayer(state, layer, tSec, output);
  if (state.birds) applyBirds(state, dtSec, output);
  if (state.petals) applyPetals(state, tSec, dtSec, output);

  // Only rebuild strings for rows that were actually modified
  const cols = state.cols;
  for (let y = 0; y < numRows; y++) {
    if (dirtyRows[y]) {
      const off = y * cols;
      output[y] = String.fromCharCode.apply(null, charBuf.subarray(off, off + cols) as unknown as number[]);
    } else {
      output[y] = rows[y];
    }
  }
}

// Resolve a shifted ramp index to a char code, respecting structural edge direction.
// If the cell is a strong edge, pick from the directional table; otherwise use the flat ramp.
function edgeAwareCharCode(
  newIdx: number, cellI: number, rampCodes: Uint16Array,
  edgeDirs: Uint8Array, edges: Float32Array,
): number {
  const dir = edgeDirs[cellI];
  if (dir > 0 && edges[cellI] > STRUCTURAL_EDGE_THRESH) {
    const band = Math.min((newIdx / (RAMP.length - 1) * 4) | 0, 4);
    return EDGE_CHAR_CODES[dir][band];
  }
  return rampCodes[newIdx];
}

// ── Layer dispatch ────────────────────────────────────────────────────────────

function applyLayer(
  state:  KineticState,
  layer:  AnimLayer,
  tSec:   number,
  output: string[],
): void {
  switch (layer.mode) {
    case 'foliage': return applyFoliageLayer(state, layer, tSec, output);
    case 'cloud':   return applyCloudLayer(state, layer, tSec, output);
    case 'fog':     return applyFogLayer(state, layer, tSec, output);
  }
}

// ── Foliage layer — travelling wind-front phase ───────────────────────────────

function applyFoliageLayer(
  state:  KineticState,
  layer:  AnimLayer,
  tSec:   number,
  _output: string[],
): void {
  const { cols, numRows, rampIndices, edgeDirs, edges, colorAssign, charBuf, rampCodes, dirtyRows } = state;
  const zoneTop  = Math.floor(layer.zoneRowStart * numRows);
  const zoneBot  = Math.ceil(layer.zoneRowEnd   * numRows);
  const zoneH    = Math.max(1, zoneBot - zoneTop);
  const colStart = Math.floor((layer.zoneColStart ?? 0) * cols);
  const colEnd   = Math.ceil((layer.zoneColEnd   ?? 1) * cols);
  const heightPow = layer.heightPow ?? 1.5;
  const hasColPhase = layer.colPhaseScale != null;
  const cps = layer.colPhaseScale ?? 0;
  const ss  = layer.seedScale ?? 0.25;
  const hasColorFilter = layer.colorIndex != null;
  const colorIdx = layer.colorIndex ?? 0;
  const rampMax = RAMP_LEN - 1;

  for (let y = zoneTop; y < zoneBot; y++) {
    const heightFrac = 1 - (y - zoneTop) / zoneH;
    const bendFactor = Math.pow(heightFrac, heightPow);
    const yOff = y * cols;

    for (let x = colStart; x < colEnd; x++) {
      const cellI = yOff + x;
      const idx = rampIndices[cellI];
      if (idx < layer.densityMin || idx > layer.densityMax) continue;
      if (hasColorFilter && colorAssign[cellI] !== colorIdx) continue;

      let main: number, flutter: number;

      if (hasColPhase) {
        const phaseOffset =
          noise2(x * cps,          y * cps * 0.8 + 17.3) * 0.68 * Math.PI * 4 +
          noise2(x * cps * 2.2 + 5.7, y * cps * 2.2 + 3.1) * 0.32 * Math.PI * 4;

        const t = tSec * layer.oscSpeed + x * layer.flowX;
        main    = Math.sin(t + phaseOffset) * 0.70;
        flutter = Math.sin(t * 2.8 + phaseOffset * 1.4) * 0.30;
      } else {
        const seed = cellPhase(x, y);
        const windFront = x * layer.flowX + tSec * layer.oscSpeed;
        main    = Math.sin(windFront + seed * ss) * 0.70;
        flutter = Math.sin(seed * ss + tSec * layer.oscSpeed * 2.8) * 0.30;
      }

      const shift = Math.round((main + flutter) * layer.maxShift * bendFactor);
      if (shift === 0) continue;

      let newIdx = idx + shift;
      if (newIdx < 0) newIdx = 0;
      else if (newIdx > rampMax) newIdx = rampMax;
      if (newIdx === idx) continue;

      charBuf[cellI] = edgeAwareCharCode(newIdx, cellI, rampCodes, edgeDirs, edges);
      dirtyRows[y] = 1;
    }
  }
}

// ── Cloud layer — horizontal sine oscillation of ASCII shapes ─────────────────

function applyCloudLayer(
  state:  KineticState,
  layer:  AnimLayer,
  tSec:   number,
  _output: string[],
): void {
  const { cols, numRows, rampIndices, charBuf, rowCodes, dirtyRows } = state;
  const zoneTop = Math.floor(layer.zoneRowStart * numRows);
  const zoneBot = Math.ceil(layer.zoneRowEnd   * numRows);

  const amp = layer.spatialScale > 0
    ? cols * layer.spatialScale
    : Math.min(cols * 0.25, 60);
  const breathing = noise2(tSec * 0.003, 0.5) * layer.maxShift;

  const zoneH    = Math.max(1, zoneBot - zoneTop);
  const colStart = Math.floor((layer.zoneColStart ?? 0) * cols);
  const colEnd   = Math.ceil((layer.zoneColEnd   ?? 1) * cols);
  const hasRowPhase = layer.rowPhaseScale != null;
  const rowPhaseScale = layer.rowPhaseScale ?? 0;

  for (let y = zoneTop; y < zoneBot; y++) {
    const rowFrac = (y - zoneTop) / zoneH;
    const fade = (!layer.noFade && rowFrac > 0.65)
      ? Math.cos(((rowFrac - 0.65) / 0.35) * Math.PI * 0.5)
      : 1.0;

    const rowPhase = hasRowPhase
      ? noise2(y * rowPhaseScale, tSec * 0.012 + 4.3) * Math.PI * 2
      : 0;

    const effectiveScroll = Math.round((Math.sin(tSec * layer.flowX + rowPhase) * amp + breathing) * fade);
    if (effectiveScroll === 0) continue;

    const yOff = y * cols;

    for (let x = colStart; x < colEnd; x++) {
      const destIdx = rampIndices[yOff + x];
      if (destIdx < layer.densityMin || destIdx > layer.densityMax) continue;

      // Clamp to column zone
      let srcX = x - effectiveScroll;
      if (srcX < colStart) srcX = colStart;
      else if (srcX > colEnd - 1) srcX = colEnd - 1;
      if (srcX === x) continue;

      const srcCode = rowCodes[yOff + srcX];
      if (srcCode === rowCodes[yOff + x]) continue;

      charBuf[yOff + x] = srcCode;
      dirtyRows[y] = 1;
    }
  }
}

// ── Fog layer — drifting Perlin mist that lightens chars ──────────────────────
// colScale = yStretch (blob aspect ratio). frameFade tapers fog toward top of frame.

function applyFogLayer(
  state:  KineticState,
  layer:  AnimLayer,
  tSec:   number,
  _output: string[],
): void {
  const { cols, numRows, rampIndices, edgeDirs, edges, colorAssign, charBuf, rampCodes, dirtyRows } = state;
  const zoneTop  = Math.floor(layer.zoneRowStart * numRows);
  const zoneBot  = Math.ceil(layer.zoneRowEnd   * numRows);
  const colStart = Math.floor((layer.zoneColStart ?? 0) * cols);
  const colEnd   = Math.ceil((layer.zoneColEnd   ?? 1) * cols);
  const sk       = layer.spatialScale;
  const drift    = tSec * layer.flowX;
  const driftY   = tSec * (layer.flowY ?? 0);
  const yStretch = layer.colScale !== 0 ? layer.colScale : 0.60;

  const featherBand = 0.20;
  const invFeather = 1 / featherBand;
  const w0 = 0.55, w1 = 0.28, w2 = 0.17;
  const zoneH = Math.max(1, zoneBot - zoneTop);
  const thr = layer.fogThreshold ?? 0.50;
  const hasColorFilter = layer.colorIndex != null;
  const colorIdx = layer.colorIndex ?? 0;
  const rampMax = RAMP_LEN - 1;
  const invNumRowsM1 = 1 / Math.max(1, numRows - 1);
  const zoneStartsLow = layer.zoneRowStart > 0.02;
  const invZoneH = 1 / zoneH;

  for (let y = zoneTop; y < zoneBot; y++) {
    const ny = y * sk * yStretch + driftY;

    const rowFrac = y * invNumRowsM1;
    let ft = (rowFrac - 0.08) * (1 / 0.64);
    if (ft < 0) ft = 0; else if (ft > 1) ft = 1;
    const frameFade = 0.35 + 0.65 * (ft * ft * (3 - 2 * ft));

    const yFrac   = (y - zoneTop) * invZoneH;
    const topFade = zoneStartsLow
      ? (yFrac < 0.50 ? yFrac * 2 : 1.0)
      : 1.0;

    const fadeProduct = frameFade * topFade;
    const yOff = y * cols;

    for (let x = colStart; x < colEnd; x++) {
      const cellI = yOff + x;
      const idx = rampIndices[cellI];
      if (idx < layer.densityMin || idx > layer.densityMax) continue;
      if (hasColorFilter && colorAssign[cellI] !== colorIdx) continue;

      const nx = x * sk + drift;

      const fog =
        (noise2(nx,              ny             ) * 0.5 + 0.5) * w0 +
        (noise2(nx * 1.8 + 3.7,  ny * 1.8 + 1.1) * 0.5 + 0.5) * w1 +
        (noise2(nx * 3.3 + 7.3,  ny * 3.3 + 5.2) * 0.5 + 0.5) * w2;

      if (fog < thr) continue;
      let t = (fog - thr) * invFeather;
      if (t > 1) t = 1;
      const fogStrength = t * t * (3 - 2 * t);
      const shift = Math.round(fogStrength * layer.maxShift * fadeProduct);

      if (shift === 0) continue;

      let newIdx = idx + shift;
      if (newIdx < 0) newIdx = 0;
      else if (newIdx > rampMax) newIdx = rampMax;
      if (newIdx === idx) continue;

      charBuf[cellI] = edgeAwareCharCode(newIdx, cellI, rampCodes, edgeDirs, edges);
      dirtyRows[y] = 1;
    }
  }
}

// ── Bird flock (Pittsburgh) ───────────────────────────────────────────────────

const BIRD_CHAR = 'v';

const BIRD_CODE = BIRD_CHAR.charCodeAt(0);

function applyBirds(state: KineticState, dtSec: number, _output: string[]): void {
  const { birds, cols, numRows, rampIndices, charBuf, dirtyRows } = state;
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
    charBuf[yi * cols + xi] = BIRD_CODE;
    dirtyRows[yi] = 1;
  }
}

// ── Falling petals (Flora) ──────────────────────────────────────────────────

// Petal shapes — small 2–3 char clusters that read as tumbling bracts.
const PETAL_SHAPES = [
  [[0,0],[1,0]],           // --
  [[0,0],[0,1]],           // |
  [[0,0],[1,0],[0,1]],     // ┐
  [[0,0],[1,0],[1,1]],     // └
  [[0,0],[-1,0],[0,1]],    // ┘
] as const;

const PETAL_CODE = ';'.charCodeAt(0);

function applyPetals(state: KineticState, tSec: number, dtSec: number, _output: string[]): void {
  const { petals, petalPool, cols, numRows, charBuf, dirtyRows } = state;
  if (!petals || !petalPool || petalPool.length === 0) return;

  for (const p of petals) {
    p.x += p.speedX * dtSec + Math.sin(p.phase + tSec * 2.0) * 0.6;
    p.y += p.speedY * dtSec;

    // Respawn at a random red position.
    if (p.y > numRows || p.x > cols) {
      const [sx, sy] = petalPool[Math.floor(Math.random() * petalPool.length)];
      p.x = sx;
      p.y = sy;
      p.speedX = 3 + Math.random() * 4;
      p.speedY = 3 + Math.random() * 5;
    }

    // Pick shape based on phase (stable per petal, rotates slowly over time).
    const shapeIdx = Math.floor((p.phase + tSec * 0.3) % PETAL_SHAPES.length);
    const shape = PETAL_SHAPES[Math.abs(shapeIdx) % PETAL_SHAPES.length];

    for (const [dx, dy] of shape) {
      const xi = Math.round(p.x) + dx;
      const yi = Math.round(p.y) + dy;
      if (xi < 0 || xi >= cols || yi < 0 || yi >= numRows) continue;
      charBuf[yi * cols + xi] = PETAL_CODE;
      dirtyRows[yi] = 1;
    }
  }
}
