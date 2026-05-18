import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AsciiGrid, RAMP } from './useAsciiConverter';
import { buildKineticState, applyKineticFrame, KineticState, noise2 } from './kinetic';
import { Photo } from './photos';
import { asciiConfig, resolveTransitionMode } from './asciiConfig';
import { initMarathon, tickMarathon, MarathonState, FAMILY_CODES, FAMILY_COUNT, SHAPE_Q } from './marathonTransition';

const RESIZE_FADE_MS = 250;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Lazy ramp lookup tables — rebuild only when asciiConfig.ramp changes ────
let _cachedRamp = '';
let _rampCodes: Uint16Array = new Uint16Array(0);
let _codeToRamp: Uint8Array = new Uint8Array(128);
let _rampMax = 0;

function getRampTables() {
  const ramp = asciiConfig.ramp;
  if (ramp !== _cachedRamp) {
    _cachedRamp = ramp;
    _rampCodes = new Uint16Array(ramp.length);
    for (let i = 0; i < ramp.length; i++) _rampCodes[i] = ramp.charCodeAt(i);
    _rampMax = ramp.length - 1;
    _codeToRamp = new Uint8Array(128);
    _codeToRamp.fill(_rampMax);
    for (let i = 0; i < ramp.length; i++) {
      const c = ramp.charCodeAt(i);
      if (c < 128) _codeToRamp[c] = i;
    }
  }
  return { RAMP_CODES: _rampCodes, CODE_TO_RAMP: _codeToRamp, RAMP_MAX: _rampMax };
}

// Initialize with default ramp
getRampTables();

// Expose kinetic state for the tweak panel to mutate layers directly
export function getCurrentKineticState(): KineticState | null {
  return _kineticStateRef;
}
let _kineticStateRef: KineticState | null = null;

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
  mouseRef: React.RefObject<{ x: number; y: number } | null>;
}

export const AsciiTransition = ({
  grid, fontSize, isTransitioning, onTransitionEnd,
  currentPhoto, isExplodeMode, mouseRef,
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
  // Hybrid mode: 'ferrofluid' uses darken/snap/lighten, 'hybrid' uses marathon shapes in the blob wave
  const morphModeRef = useRef<'ferrofluid' | 'hybrid'>('ferrofluid');
  const morphRampRef = useRef<Uint8Array | null>(null);
  const morphRampMaxRef = useRef(0);

  // ── Marathon transition ─────────────────────────────────────────────────
  const marathonActiveRef = useRef(false);
  const marathonStateRef = useRef<MarathonState | null>(null);
  const marathonCallbackRef = useRef<(() => void) | null>(null);
  const marathonNewGridRef = useRef<AsciiGrid | null>(null);
  // Fade-in after dissolve: ramps opacity 0→1 so new photo emerges smoothly
  const marathonFadeRef = useRef<{ start: number; duration: number } | null>(null);

  // ── Kinetic animation ──────────────────────────────────────────────────
  const kineticStateRef = useRef<KineticState | null>(null);
  const kineticOutputRef = useRef<string[]>([]);
  const kineticFrameRef = useRef<number | null>(null);

  // Monotonically increasing elapsed -- never resets across RAF loop restarts.
  const kineticElapsedRef = useRef(0);
  const kineticLastTsRef = useRef<number | null>(null);

  // ── Accent color pulse (tint layers) ────────────────────────────────
  const tintRefs = useRef<(HTMLPreElement | null)[]>([null, null, null]);
  // ── Temporal echo ───────────────────────────────────────────────────
  const echoRef = useRef<HTMLPreElement>(null);
  const echoTickRef = useRef(0);
  const echoCacheRef = useRef('');
  // ── Entry materialization ───────────────────────────────────────────
  const materializedRef = useRef(false);

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
    _kineticStateRef = state; // expose for tweak panel
    // Pre-allocate output array — avoid spread copy
    const out = new Array(grid.rows.length);
    for (let i = 0; i < grid.rows.length; i++) out[i] = grid.rows[i];
    kineticOutputRef.current = out;

    // Update tint layer content + color
    const tints = tintRefs.current;
    for (let i = 0; i < 3; i++) {
      const pre = tints[i];
      if (pre && grid.colorMaps[i]) {
        pre.textContent = grid.colorMaps[i].join('\n');
        pre.style.color = grid.palette[i];
      }
    }
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

      // ── Marathon dissolve pass ──────────────────────────────────────
      if (marathonActiveRef.current && marathonStateRef.current) {
        const frame = tickMarathon(marathonStateRef.current);
        pre.textContent = frame.text;

        if (frame.done) {
          marathonActiveRef.current = false;
          marathonStateRef.current = null;
          // Keep monochrome color — restored after fade-in completes
          pre.style.transition = '';

          // Update grid so kinetic renders the new photo during fade-in
          if (marathonNewGridRef.current) {
            stableGridRef.current = marathonNewGridRef.current;
          }

          // Start at opacity 0 — the fade-in phase will ramp it up
          pre.style.opacity = '0';

          // Keep tint layers + echo HIDDEN during fade-in (stay monochrome)
          echoCacheRef.current = '';

          // Begin fade-in phase (handled in the kinetic branch below)
          marathonFadeRef.current = { start: performance.now(), duration: 350 };
        }

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
        // Read config once per frame
        const morphMs = asciiConfig.morphMs;
        // Tight stagger window → blobs advance as solid fronts
        const staggerWindow = morphMs * asciiConfig.staggerFraction;
        // Short cell duration with 3-phase blend: darken → flip → lighten
        const cellDuration = morphMs * asciiConfig.cellFraction;
        const { RAMP_CODES, CODE_TO_RAMP, RAMP_MAX } = getRampTables();

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
            } else if (morphModeRef.current === 'hybrid' && morphRampRef.current) {
              // ── Hybrid: old char → marathon shapes → new char ──
              const ct = cellElapsed / cellDuration; // 0→1

              if (ct < 0.03) {
                // Brief hold on old char
                buf[x] = oldRow.charCodeAt(x) || 32;
              } else if (ct > 0.97) {
                // Resolve to new char
                buf[x] = newRow.charCodeAt(x) || 32;
              } else {
                // Marathon shape zone: pick family based on overall progress
                const overallT = elapsed / morphMs;
                const rawPhase = Math.min(FAMILY_COUNT - 0.001, overallT * FAMILY_COUNT);
                const pi = Math.floor(rawPhase);
                const pBlend = rawPhase - pi;
                // Deterministic per-cell pseudo-random for phase blending
                const pr = ((x * 7 + y * 13) & 0xff) / 255;
                const codes = pr < pBlend
                  ? FAMILY_CODES[Math.min(pi + 1, FAMILY_COUNT - 1)]
                  : FAMILY_CODES[Math.min(pi, FAMILY_COUNT - 1)];

                // Weight from old grid brightness — boosted so light areas stay visible
                const rIdx = morphRampRef.current[yOff + x] || 0;
                const w = 1 - rIdx / morphRampMaxRef.current;
                const boosted = w * 0.75 + 0.25;
                const qi = Math.min(SHAPE_Q - 1, (boosted * SHAPE_Q) | 0);
                buf[x] = codes[qi];
              }
              allDone = false;
            } else {
              // ── Ferrofluid: 3-phase viscous blend ──
              const t = cellElapsed / cellDuration;
              const oldCode = oldRow.charCodeAt(x) || 32;
              const newCode = newRow.charCodeAt(x) || 32;

              if (t < 0.4) {
                // Phase 1: darken old char (ink pooling in)
                const darkT = t / 0.4; // 0→1
                const oldIdx = oldCode < 128 ? CODE_TO_RAMP[oldCode] : RAMP_MAX;
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
          // Update cursor position for disturbance effect
          const mouse = mouseRef.current;
          if (mouse) {
            state.mouseCol = mouse.x * state.cols / window.innerWidth;
            state.mouseRow = mouse.y * state.numRows / window.innerHeight;
          } else {
            state.mouseCol = -1;
            state.mouseRow = -1;
          }

          applyKineticFrame(state, kineticElapsedRef.current, kineticOutputRef.current);
          const frameText = kineticOutputRef.current.join('\n');
          pre.textContent = frameText;

          // ── Temporal echo: update every Nth frame for visible trailing ──
          echoTickRef.current++;
          if (echoRef.current && echoTickRef.current % asciiConfig.echoEveryNFrames === 0) {
            echoRef.current.textContent = echoCacheRef.current;
            echoCacheRef.current = frameText;
          } else if (!echoCacheRef.current) {
            echoCacheRef.current = frameText;
          }
        }

        // ── Marathon fade-in: blur/contrast → sharp, monochrome → color ──
        if (marathonFadeRef.current) {
          const fadeT = Math.min(1, (performance.now() - marathonFadeRef.current.start) / marathonFadeRef.current.duration);
          const ease = 1 - (1 - fadeT) * (1 - fadeT); // ease-out

          // Opacity ramp
          pre.style.opacity = String(ease);

          // Blur + contrast: starts blurred/low-contrast, sharpens to normal
          const blur = (1 - ease) * 3;
          const contrast = 0.6 + ease * 0.4;
          pre.style.filter = `blur(${blur}px) contrast(${contrast})`;

          if (fadeT >= 1) {
            marathonFadeRef.current = null;
            pre.style.opacity = '';
            pre.style.color = '';
            pre.style.filter = '';

            // Restore tint layers and echo
            const tints = tintRefs.current;
            for (let i = 0; i < 3; i++) {
              const el = tints[i];
              if (el) el.style.display = '';
            }
            if (echoRef.current) {
              echoRef.current.style.display = '';
              echoRef.current.style.opacity = '';
            }

            if (marathonCallbackRef.current) {
              marathonCallbackRef.current();
              marathonCallbackRef.current = null;
            }
          }
        }

        // ── Accent color pulse: independent sine opacity per tint layer ──
        // Skip during marathon fade-in (tint layers stay hidden until fade completes)
        if (!marathonFadeRef.current) {
          const tSec = kineticElapsedRef.current / 1000;
          const tints = tintRefs.current;
          const pulseFreqs = [asciiConfig.pulseFreq0, asciiConfig.pulseFreq1, asciiConfig.pulseFreq2];
          const pBase = asciiConfig.pulseBaseOpacity;
          const pAmp = asciiConfig.pulseAmplitude;
          for (let i = 0; i < 3; i++) {
            const el = tints[i];
            if (!el) continue;
            const freq = pulseFreqs[i];
            const phase = i * 2.09;        // ~120° apart
            const op = pBase + Math.sin(tSec * freq * 6.2832 + phase) * pAmp;
            el.style.opacity = String(op < 0 ? 0 : op);
          }
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

  // ── Photo-to-photo transition (morph or marathon) ──────────────────────
  useEffect(() => {
    if (!isTransitioning || !grid) return;
    setDisplayGrid(grid);

    if (reducedMotion) {
      stableGridRef.current = grid;
      onTransitionEnd();
      return;
    }

    // Resolve once per transition (handles 'cycle' mode)
    const resolvedMode = resolveTransitionMode();

    // ── Marathon mode: dissolve old grid → black → snap new ──
    if (resolvedMode === 'marathon') {
      const oldGrid = stableGridRef.current;
      if (!oldGrid?.rampIndices) {
        // No old data — fall through to ferrofluid
      } else {
        const mState = initMarathon(
          oldGrid.rampIndices,
          oldGrid.cols,
          oldGrid.rows.length,
          asciiConfig.marathonMs,
        );
        marathonStateRef.current = mState;
        marathonNewGridRef.current = grid;
        marathonCallbackRef.current = () => {
          onTransitionEnd();
        };
        marathonActiveRef.current = true;

        // Monochrome accent color during dissolve
        const mainEl = mainRef.current;
        if (mainEl) {
          mainEl.style.color = currentPhoto?.accents[0] || '#c8ff00';
          mainEl.style.transition = 'none';
        }

        // Hide tint layers and echo during marathon dissolve
        const tints = tintRefs.current;
        for (let i = 0; i < 3; i++) {
          const el = tints[i];
          if (el) el.style.display = 'none';
        }
        if (echoRef.current) {
          echoRef.current.style.display = 'none';
          echoRef.current.textContent = '';
        }
        echoCacheRef.current = '';

        // Safety timeout (dissolve + fade-in + buffer)
        timerRef.current = setTimeout(() => {
          if (marathonActiveRef.current || marathonFadeRef.current) {
            marathonActiveRef.current = false;
            marathonStateRef.current = null;
            marathonFadeRef.current = null;
            const el = mainRef.current;
            if (el) { el.style.color = ''; el.style.transition = ''; el.style.opacity = ''; }
            const ts = tintRefs.current;
            for (let i = 0; i < 3; i++) { const t = ts[i]; if (t) { t.style.display = ''; t.style.opacity = ''; } }
            if (echoRef.current) { echoRef.current.style.display = ''; echoRef.current.style.opacity = ''; }
            stableGridRef.current = grid;
            onTransitionEnd();
          }
        }, asciiConfig.marathonMs + 1200);

        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
      }
    }

    // ── Ferrofluid morph (default) / Hybrid ──
    // Hybrid reuses ferrofluid blob wave but with marathon shapes in the transition zone
    if (resolvedMode === 'hybrid') {
      const oldGrid = stableGridRef.current;
      morphModeRef.current = 'hybrid';
      morphRampRef.current = oldGrid?.rampIndices || null;
      morphRampMaxRef.current = oldGrid?.rampIndices
        ? Math.max(1, oldGrid.rampIndices.reduce((m: number, v: number) => v > m ? v : m, 0))
        : 1;

      // Monochrome accent color during hybrid morph (like marathon)
      const mainEl = mainRef.current;
      if (mainEl) {
        mainEl.style.color = currentPhoto?.accents[0] || '#c8ff00';
      }
      // Hide tint layers during hybrid (monochrome only)
      const tints = tintRefs.current;
      for (let i = 0; i < 3; i++) {
        const el = tints[i];
        if (el) el.style.display = 'none';
      }
    } else {
      morphModeRef.current = 'ferrofluid';
      morphRampRef.current = null;
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
      // Restore color after hybrid morph
      if (morphModeRef.current === 'hybrid') {
        const el = mainRef.current;
        if (el) el.style.color = '';
        const ts = tintRefs.current;
        for (let i = 0; i < 3; i++) {
          const t = ts[i];
          if (t) t.style.display = '';
        }
      }
      onTransitionEnd();
    };
    morphActiveRef.current = true;

    // Clear echo to prevent stale trailing during morph
    if (echoRef.current) echoRef.current.textContent = '';
    echoCacheRef.current = '';

    // Safety timeout in case morph doesn't complete naturally
    timerRef.current = setTimeout(() => {
      if (morphActiveRef.current) {
        morphActiveRef.current = false;
        stableGridRef.current = grid;
        onTransitionEnd();
      }
    }, asciiConfig.morphMs + 200);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isTransitioning, grid]);

  // ── Entry materialization: solid '@' → photo via ferrofluid morph ────
  useEffect(() => {
    if (materializedRef.current || !grid || reducedMotion) return;
    materializedRef.current = true;

    morphSeed = Math.random() * 1000;
    warpA = Math.random() * 500;
    warpB = Math.random() * 500;

    const solidRow = ' '.repeat(grid.cols);
    const solidRows = Array.from({ length: grid.rows.length }, () => solidRow);
    const mCols = grid.cols;
    const numRows = grid.rows.length;

    const delays = new Float32Array(mCols * numRows);
    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < mCols; x++) {
        delays[y * mCols + x] = cellDelay(x, y, mCols, numRows);
      }
    }

    if (morphBufRef.current.length < mCols) {
      morphBufRef.current = new Uint16Array(mCols);
    }

    morphOldRowsRef.current = solidRows;
    morphNewRowsRef.current = [...grid.rows];
    morphDelaysRef.current = delays;
    morphColsRef.current = mCols;
    morphNumRowsRef.current = numRows;
    morphStartRef.current = performance.now();
    morphCallbackRef.current = () => { stableGridRef.current = grid; };
    morphActiveRef.current = true;

    // Clear echo so it doesn't flash stale content after materialization
    if (echoRef.current) echoRef.current.textContent = '';
    echoCacheRef.current = '';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid]);

  if (!displayGrid) return null;

  return (
    <div className="ascii-layers">
      {/* Temporal echo — faded previous frame for motion trails */}
      <pre
        ref={echoRef}
        className="ascii-art ascii-art--echo"
        style={{ fontSize: 'var(--ascii-fs)' }}
      />

      {/* Accent color tint layers — palette breathes via sine opacity */}
      <pre ref={el => { tintRefs.current[0] = el; }} className="ascii-art ascii-art--tint" style={{ fontSize: 'var(--ascii-fs)' }} />
      <pre ref={el => { tintRefs.current[1] = el; }} className="ascii-art ascii-art--tint" style={{ fontSize: 'var(--ascii-fs)' }} />
      <pre ref={el => { tintRefs.current[2] = el; }} className="ascii-art ascii-art--tint" style={{ fontSize: 'var(--ascii-fs)' }} />

      {/* Main layer — RAF controls textContent directly */}
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
