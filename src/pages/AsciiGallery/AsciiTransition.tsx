import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AsciiGrid, RAMP } from './useAsciiConverter';
import { buildKineticState, applyKineticFrame, KineticState, noise2 } from './kinetic';
import { Photo } from './photos';

const MORPH_MS = 1200;
const RESIZE_FADE_MS = 250;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Pre-built RAMP char codes for intermediate blending
const RAMP_CODES = new Uint16Array(RAMP.length);
for (let i = 0; i < RAMP.length; i++) RAMP_CODES[i] = RAMP.charCodeAt(i);
const RAMP_MAX = RAMP.length - 1;

// Reverse lookup: char code → ramp index (for blending old/new through the ramp)
const CODE_TO_RAMP = new Uint8Array(128);
CODE_TO_RAMP.fill(RAMP_MAX); // default to lightest
for (let i = 0; i < RAMP.length; i++) {
  const c = RAMP.charCodeAt(i);
  if (c < 128) CODE_TO_RAMP[c] = i;
}

// ── Ferrofluid morph: Perlin noise blob boundaries ──────────────────────────
let morphSeed = 0;
// Per-transition warp parameters — randomized so each morph has unique blob timing
let warpA = 0;  // controls which blobs rush vs linger
let warpB = 0;  // controls asymmetry of expansion

/**
 * Multi-scale Perlin noise with per-blob timing variation.
 * A second noise field warps the delay values so each blob region
 * has its own motion curve — some rush early, some linger, some pause.
 */
function cellDelay(x: number, y: number, cols: number, rows: number): number {
  const nx = x / cols;
  const ny = y / rows;

  const ox = morphSeed;
  const oy = morphSeed + 97.13;

  // 3 scales of noise at different frequencies for organic shape variety
  // Scale 1: very low freq — 1-2 massive base blobs
  const n1 = noise2((nx * 1.2) + ox, (ny * 1.2) + oy);
  // Scale 2: medium freq — irregular edges
  const n2 = noise2((nx * 2.4) + ox + 31.7, (ny * 2.4) + oy + 14.3);
  // Scale 3: asymmetric warp — stretches blobs in random directions per transition
  const n3 = noise2((nx * 0.8 + ny * 0.5) + warpA, (ny * 0.9 - nx * 0.3) + warpB);

  // Weighted blend: base shape dominates, edges add character, warp adds asymmetry
  let n = 0.55 * n1 + 0.25 * n2 + 0.20 * n3;

  // Remap -1..1 → 0..1
  let t = (n + 1) * 0.5;
  if (t < 0) t = 0; else if (t > 1) t = 1;

  // Per-blob timing warp: a second noise field offsets when each region triggers.
  // This makes some blobs rush ahead while others linger — varied motion curves.
  const timingWarp = noise2((nx * 1.6) + morphSeed + 53.1, (ny * 1.6) + morphSeed + 71.9);
  t = t + timingWarp * 0.18; // shift timing ±18%
  if (t < 0) t = 0; else if (t > 1) t = 1;

  // Steep cubic for defined blob edges (viscous, not dissolve)
  return t * t * (3 - 2 * t);
}

interface Props {
  grid: AsciiGrid | null;
  fontSize: number;
  isTransitioning: boolean;
  onTransitionEnd: () => void;
  currentPhoto: Photo | null;
  isExplodeMode: boolean;
}

export const AsciiTransition = ({
  grid, fontSize, isTransitioning, onTransitionEnd,
  currentPhoto, isExplodeMode,
}: Props) => {
  const [displayGrid, setDisplayGrid] = useState<AsciiGrid | null>(grid);

  const mainRef = useRef<HTMLPreElement>(null);

  const stableGridRef = useRef<AsciiGrid | null>(grid);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track whether we're doing a resize crossfade (grid dimensions changed)
  const [resizeFading, setResizeFading] = useState(false);
  const resizeFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Snapshot of the old content to show during resize crossfade
  const resizeSnapshotRef = useRef<string>('');

  // ── Morph transition state ────────────────────────────────────────────────
  const morphActiveRef = useRef(false);
  const morphOldRowsRef = useRef<string[]>([]);
  const morphNewRowsRef = useRef<string[]>([]);
  const morphStartRef = useRef(0);
  const morphDelaysRef = useRef<Float32Array>(new Float32Array(0));
  const morphColsRef = useRef(0);
  const morphNumRowsRef = useRef(0);
  const morphCallbackRef = useRef<(() => void) | null>(null);
  // Reusable typed array for morph char-code building (avoids per-row allocation)
  const morphBufRef = useRef<Uint16Array>(new Uint16Array(1024));
  // Snapshot of old rows captured *before* kinetic state rebuilds for the new grid
  const morphSnapshotRef = useRef<string[]>([]);

  // ── Kinetic animation ──────────────────────────────────────────────────
  const kineticStateRef = useRef<KineticState | null>(null);
  const kineticOutputRef = useRef<string[]>([]);
  const kineticFrameRef = useRef<number | null>(null);

  // Monotonically increasing elapsed -- never resets across RAF loop restarts.
  const kineticElapsedRef = useRef(0);
  const kineticLastTsRef = useRef<number | null>(null);

  // Capture old rows synchronously before any effects overwrite kineticOutputRef.
  // useLayoutEffect fires before useEffect, so this snapshots the screen content
  // from the *previous* render before the kinetic state rebuilds for the new grid.
  useLayoutEffect(() => {
    if (isTransitioning && grid) {
      if (kineticOutputRef.current.length > 0) {
        morphSnapshotRef.current = [...kineticOutputRef.current];
      } else if (stableGridRef.current?.rows) {
        morphSnapshotRef.current = [...stableGridRef.current.rows];
      }
    }
  }, [isTransitioning, grid]);

  useEffect(() => {
    if (!grid || !currentPhoto) return;
    const state = buildKineticState(grid, currentPhoto.kinetic);
    state.prevElapsed = kineticElapsedRef.current;
    kineticStateRef.current = state;
    // Pre-allocate output array — avoid spread copy
    const out = new Array(grid.rows.length);
    for (let i = 0; i < grid.rows.length; i++) out[i] = grid.rows[i];
    kineticOutputRef.current = out;
  }, [grid, currentPhoto?.kinetic]);

  useEffect(() => {
    if (reducedMotion || isExplodeMode) {
      if (kineticFrameRef.current) {
        cancelAnimationFrame(kineticFrameRef.current);
        kineticFrameRef.current = null;
      }
      kineticLastTsRef.current = null;
      if (mainRef.current && stableGridRef.current) {
        mainRef.current.textContent = stableGridRef.current.rows.join('\n');
      }
      return;
    }

    kineticLastTsRef.current = null;

    const tick = (timestamp: number) => {
      if (kineticLastTsRef.current !== null) {
        kineticElapsedRef.current += timestamp - kineticLastTsRef.current;
      }
      kineticLastTsRef.current = timestamp;

      const pre = mainRef.current;
      if (!pre) {
        kineticFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      // ── Morph pass: blend old→new characters per-cell ──────────────
      if (morphActiveRef.current) {
        const elapsed = performance.now() - morphStartRef.current;
        const oldRows = morphOldRowsRef.current;
        const newRows = morphNewRowsRef.current;
        const delays = morphDelaysRef.current;
        const cols = morphColsRef.current;
        const numRows = morphNumRowsRef.current;
        const output: string[] = new Array(numRows);

        // Use a shared typed array buffer for building row strings
        const buf = morphBufRef.current;
        // Tight stagger window → blobs advance as solid fronts
        const staggerWindow = MORPH_MS * 0.35;
        // Short cell duration with 3-phase blend: darken → flip → lighten
        const cellDuration = MORPH_MS * 0.45;

        let allDone = true;
        for (let y = 0; y < numRows; y++) {
          const oldRow = oldRows[y] || '';
          const newRow = newRows[y] || '';
          const yOff = y * cols;

          // Fast path: if elapsed > max possible delay + duration, entire row is done
          if (elapsed >= staggerWindow + cellDuration) {
            output[y] = newRow;
            continue;
          }
          // Fast path: if elapsed <= 0, entire row is old
          if (elapsed <= 0) {
            output[y] = oldRow;
            allDone = false;
            continue;
          }

          for (let x = 0; x < cols; x++) {
            const cellElapsed = elapsed - delays[yOff + x] * staggerWindow;
            if (cellElapsed >= cellDuration) {
              buf[x] = newRow.charCodeAt(x) || 32;
            } else if (cellElapsed <= 0) {
              buf[x] = oldRow.charCodeAt(x) || 32;
              allDone = false;
            } else {
              // 3-phase viscous blend: darken old → snap to new → lighten new
              const t = cellElapsed / cellDuration;
              const oldCode = oldRow.charCodeAt(x) || 32;
              const newCode = newRow.charCodeAt(x) || 32;

              if (t < 0.4) {
                // Phase 1: darken old char (ink pooling in)
                const darkT = t / 0.4; // 0→1
                const oldIdx = oldCode < 128 ? CODE_TO_RAMP[oldCode] : RAMP_MAX;
                // Push toward darker end of ramp (lower index = darker)
                const shift = Math.round(darkT * darkT * 12);
                let idx = oldIdx - shift;
                if (idx < 0) idx = 0;
                buf[x] = RAMP_CODES[idx];
              } else if (t < 0.6) {
                // Phase 2: snap — show new char at darkest
                const newIdx = newCode < 128 ? CODE_TO_RAMP[newCode] : RAMP_MAX;
                let idx = newIdx - 8;
                if (idx < 0) idx = 0;
                buf[x] = RAMP_CODES[idx];
              } else {
                // Phase 3: lighten new char back to target (ink settling)
                const lightT = (t - 0.6) / 0.4; // 0→1
                const newIdx = newCode < 128 ? CODE_TO_RAMP[newCode] : RAMP_MAX;
                const shift = Math.round((1 - lightT * lightT) * 8);
                let idx = newIdx - shift;
                if (idx < 0) idx = 0;
                buf[x] = RAMP_CODES[idx];
              }
              allDone = false;
            }
          }
          output[y] = String.fromCharCode.apply(null, buf.subarray(0, cols) as unknown as number[]);
        }
        pre.textContent = output.join('\n');

        if (allDone) {
          morphActiveRef.current = false;
          if (morphCallbackRef.current) {
            morphCallbackRef.current();
            morphCallbackRef.current = null;
          }
        }
      } else {
        // Normal kinetic animation
        const state = kineticStateRef.current;
        if (state) {
          applyKineticFrame(state, kineticElapsedRef.current, kineticOutputRef.current);
          pre.textContent = kineticOutputRef.current.join('\n');
        }
      }

      kineticFrameRef.current = requestAnimationFrame(tick);
    };
    kineticFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (kineticFrameRef.current) cancelAnimationFrame(kineticFrameRef.current);
      kineticLastTsRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExplodeMode]);

  // ── Grid sync (non-transition updates, e.g. resize) ──────────────────
  useEffect(() => {
    if (!isTransitioning && grid) {
      // Detect resize: grid dimensions changed from what we were displaying
      const prev = stableGridRef.current;
      const dimsChanged = prev && (prev.cols !== grid.cols || prev.rows.length !== grid.rows.length);

      if (dimsChanged) {
        // Capture the current rendered text as a snapshot before switching
        if (mainRef.current) {
          resizeSnapshotRef.current = mainRef.current.textContent || '';
        }
        setResizeFading(true);
        if (resizeFadeTimerRef.current) clearTimeout(resizeFadeTimerRef.current);
        resizeFadeTimerRef.current = setTimeout(() => setResizeFading(false), RESIZE_FADE_MS);
      }

      setDisplayGrid(grid);
      stableGridRef.current = grid;
    }
  }, [grid, isTransitioning]);

  // ── Photo-to-photo transition (morph) ──────────────────────────────────
  useEffect(() => {
    if (!isTransitioning || !grid) return;
    setDisplayGrid(grid);

    if (reducedMotion) {
      stableGridRef.current = grid;
      onTransitionEnd();
      return;
    }

    // New random seeds so each morph has unique blob patterns + motion curves
    morphSeed = Math.random() * 1000;
    warpA = Math.random() * 500;
    warpB = Math.random() * 500;

    // Use the snapshot captured by useLayoutEffect (before kinetic state rebuilt)
    const oldRows = morphSnapshotRef.current.length > 0
      ? morphSnapshotRef.current
      : stableGridRef.current?.rows ? [...stableGridRef.current.rows] : [];

    const newRows = grid.rows;
    const cols = grid.cols;
    const numRows = newRows.length;

    // Precompute per-cell delays
    const delays = new Float32Array(cols * numRows);
    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < cols; x++) {
        delays[y * cols + x] = cellDelay(x, y, cols, numRows);
      }
    }

    // Ensure morph buffer is large enough
    if (morphBufRef.current.length < cols) {
      morphBufRef.current = new Uint16Array(cols);
    }

    // Set up morph state
    morphOldRowsRef.current = oldRows;
    morphNewRowsRef.current = [...newRows];
    morphDelaysRef.current = delays;
    morphColsRef.current = cols;
    morphNumRowsRef.current = numRows;
    morphStartRef.current = performance.now();
    morphCallbackRef.current = () => {
      stableGridRef.current = grid;
      onTransitionEnd();
    };
    morphActiveRef.current = true;

    // Safety timeout in case morph doesn't complete naturally
    timerRef.current = setTimeout(() => {
      if (morphActiveRef.current) {
        morphActiveRef.current = false;
        stableGridRef.current = grid;
        onTransitionEnd();
      }
    }, MORPH_MS + 200);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isTransitioning, grid]);

  if (!displayGrid) return null;

  return (
    <div className="ascii-layers">
      {/* RAF controls textContent directly -- no React children */}
      <pre
        ref={mainRef}
        className={`ascii-art ascii-art--main${resizeFading ? ' ascii-art--resize-in' : ''}`}
        style={{ fontSize: 'var(--ascii-fs)' }}
      />

      {/* Resize crossfade: old snapshot fades out over the new content */}
      {resizeFading && (
        <pre
          className="ascii-art ascii-art--resize-out"
          style={{ fontSize: 'var(--ascii-fs)' }}
        >
          {resizeSnapshotRef.current}
        </pre>
      )}
    </div>
  );
};
