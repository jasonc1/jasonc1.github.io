import { useEffect, useRef, useState } from 'react';
import { AsciiGrid, N_COLORS } from './useAsciiConverter';
import { buildKineticState, applyKineticFrame, KineticState } from './kinetic';
import { Photo } from './photos';

const FADE_MS = 500;
const PERSP   = 'perspective(600px)';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Layer Z positions (front → back) ──────────────────────────────────────
// outline  : +5px   (floats just in front of main — parallaxes opposite direction)
// main     :  0px   (reference plane)
// blur     : −24px  × zoomScale
// bw/desat : −48px  × zoomScale
// color[0] : −72px  × zoomScale (closest color plane)
// color[4] : −144px × zoomScale (furthest)
const Z_OUTLINE    =    5;
const Z_MAIN       =    0;
const Z_BLUR_BASE  =  -24;
const Z_BW_BASE    =  -48;
const Z_COLOR_BASES = [-72, -108, -144] as const;

// Normal mode: cursor X magnitude spreads layers (parallax depth cue)
// Explode mode: cursor only orbits — no additional spread (zoom controls that)
const CURSOR_EXPLODE_NORMAL = 1.15;

// Cursor rotation range — expanded in explode/orbit mode
const ROT_Y_NORMAL  = 44;  const ROT_X_NORMAL  = 30;
const ROT_Y_EXPLODE = 80;  const ROT_X_EXPLODE = 55;

interface Props {
  grid: AsciiGrid | null;
  fontSize: number;
  isTransitioning: boolean;
  onTransitionEnd: () => void;
  registerCursorHandler: (fn: (x: number, y: number) => void) => void;
  currentPhoto: Photo | null;
  isExplodeMode: boolean;
  zoomScale: number;
}

export const AsciiTransition = ({
  grid, fontSize, isTransitioning, onTransitionEnd,
  registerCursorHandler, currentPhoto, isExplodeMode, zoomScale,
}: Props) => {
  const [displayGrid, setDisplayGrid] = useState<AsciiGrid | null>(grid);
  const [prevContent, setPrevContent] = useState('');
  const [fading,      setFading]      = useState(false);

  // DOM refs for all layers
  const outlineRef  = useRef<HTMLPreElement>(null);
  const mainRef     = useRef<HTMLPreElement>(null);
  const blurRef     = useRef<HTMLPreElement>(null);
  const bwRef       = useRef<HTMLPreElement>(null);
  const colorRefs   = useRef<Array<HTMLPreElement | null>>(
    Array.from({ length: N_COLORS }, () => null),
  );
  const tintRefs    = useRef<Array<HTMLPreElement | null>>(
    Array.from({ length: N_COLORS }, () => null),
  );
  const fadeOutRef  = useRef<HTMLPreElement>(null);

  // Stable mutable refs — readable by closures without causing re-registration
  const rotRef         = useRef({ x: 0, y: 0 });
  const isExplodeRef   = useRef(isExplodeMode);
  const zoomScaleRef   = useRef(zoomScale);
  const stableGridRef  = useRef<AsciiGrid | null>(grid);
  const timerRef       = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep refs in sync with props (no re-render cost)
  useEffect(() => { isExplodeRef.current   = isExplodeMode; }, [isExplodeMode]);
  useEffect(() => { zoomScaleRef.current   = zoomScale;     }, [zoomScale]);

  // ── Kinetic animation ──────────────────────────────────────────────────
  const kineticStateRef  = useRef<KineticState | null>(null);
  const kineticOutputRef = useRef<string[]>([]);
  const kineticFrameRef  = useRef<number | null>(null);

  // Rebuild kinetic state when the photo or grid changes
  useEffect(() => {
    if (!grid || !currentPhoto) return;
    kineticStateRef.current = buildKineticState(grid, currentPhoto.kinetic);
    kineticOutputRef.current = [...grid.rows];
  }, [grid, currentPhoto?.kinetic]);

  // Run / pause the kinetic RAF loop
  useEffect(() => {
    if (reducedMotion || isExplodeMode) {
      if (kineticFrameRef.current) {
        cancelAnimationFrame(kineticFrameRef.current);
        kineticFrameRef.current = null;
      }
      // Restore static content when pausing
      if (mainRef.current && stableGridRef.current) {
        mainRef.current.textContent = stableGridRef.current.rows.join('\n');
      }
      return;
    }

    const start = performance.now();
    const tick = (timestamp: number) => {
      const elapsed = timestamp - start;
      const state = kineticStateRef.current;
      const pre   = mainRef.current;
      if (state && pre) {
        applyKineticFrame(state, elapsed, kineticOutputRef.current);
        pre.textContent = kineticOutputRef.current.join('\n');
      }
      kineticFrameRef.current = requestAnimationFrame(tick);
    };
    kineticFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (kineticFrameRef.current) cancelAnimationFrame(kineticFrameRef.current);
    };
  }, [isExplodeMode, grid, currentPhoto?.kinetic]);

  // ── Cursor → 3D tilt + layer parallax, direct DOM (no React re-renders) ──
  useEffect(() => {
    registerCursorHandler((x: number, y: number) => {
      const explode = isExplodeRef.current;
      const zoom    = zoomScaleRef.current;

      // Wider rotation range in orbit/explode mode
      const rotX = y * -(explode ? ROT_X_EXPLODE : ROT_X_NORMAL);
      const rotY = x *   (explode ? ROT_Y_EXPLODE : ROT_Y_NORMAL);
      rotRef.current = { x: rotX, y: rotY };

      // In normal mode, cursor X magnitude also spreads layers for depth cue.
      // In explode mode, cursor only orbits — scroll wheel controls spread.
      const spread = explode
        ? 1
        : 1 + Math.min(1, Math.abs(x) / 0.5) * CURSOR_EXPLODE_NORMAL;

      const t = (z: number) =>
        `${PERSP} rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${z}px)`;

      if (outlineRef.current) outlineRef.current.style.transform = t(Z_OUTLINE);
      if (mainRef.current)    mainRef.current.style.transform    = t(Z_MAIN);
      if (blurRef.current)    blurRef.current.style.transform    = t(Z_BLUR_BASE * spread * zoom);
      if (bwRef.current)      bwRef.current.style.transform      = t(Z_BW_BASE   * spread * zoom);
      Z_COLOR_BASES.forEach((zb, i) => {
        const el = colorRefs.current[i];
        if (el) el.style.transform = t(zb * spread * zoom);
      });
      // Tint layers sit at Z_MAIN — same plane as main, just colored overlay
      tintRefs.current.forEach(el => { if (el) el.style.transform = t(Z_MAIN); });
      if (fadeOutRef.current) fadeOutRef.current.style.transform = t(Z_MAIN);

      // Color planes: saturate with cursor distance from center
      // Center = muted / monochrome feel; edges = full photo color
      const dist = Math.min(1, Math.sqrt(x * x + y * y) / 0.4);
      const sat  = 30 + dist * 190;
      const colorFilter = `saturate(${sat}%)`;
      colorRefs.current.forEach(el => { if (el) el.style.filter = colorFilter; });
    });
  }, [registerCursorHandler]);

  // ── Grid sync ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isTransitioning && grid) {
      setDisplayGrid(grid);
      stableGridRef.current = grid;
    }
  }, [grid, isTransitioning]);

  // Cross-fade when new grid arrives during transition
  useEffect(() => {
    if (!isTransitioning || !grid) return;
    setPrevContent(stableGridRef.current?.rows.join('\n') ?? '');
    setDisplayGrid(grid);
    setFading(true);

    if (reducedMotion) {
      stableGridRef.current = grid;
      setFading(false);
      onTransitionEnd();
      return;
    }
    timerRef.current = setTimeout(() => {
      stableGridRef.current = grid;
      setFading(false);
      onTransitionEnd();
    }, FADE_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isTransitioning, grid]);

  if (!displayGrid) return null;

  const fs = `${fontSize}px`;
  // All non-main layers show the full static grid (kinetic only on main)
  const staticContent  = displayGrid.rows.join('\n');
  const outlineContent = displayGrid.outlineRows.join('\n');

  // Fade-out pre inherits current 3D rotation so the dissolve stays on-plane
  const fadeOutTransform =
    `${PERSP} rotateX(${rotRef.current.x}deg) rotateY(${rotRef.current.y}deg) translateZ(${Z_MAIN}px)`;

  // Z values with zoom applied (for initial JSX; cursor handler overrides each frame)
  const zBlur = Z_BLUR_BASE * zoomScale;
  const zBW   = Z_BW_BASE   * zoomScale;

  return (
    <div className="ascii-layers">

      {/* ── Main — kinetic animation runs here ── */}
      <pre
        ref={mainRef}
        className={`ascii-art ascii-art--main${fading ? ' ascii-art--fade-in' : ''}`}
        style={{ fontSize: fs, transform: `${PERSP} translateZ(${Z_MAIN}px)` }}
      >
        {staticContent}
      </pre>

      {/* ── Fade-out — old image dissolving on top ── */}
      {fading && (
        <pre
          ref={fadeOutRef}
          className="ascii-art ascii-art--fade-out"
          style={{ fontSize: fs, transform: fadeOutTransform }}
        >
          {prevContent}
        </pre>
      )}
    </div>
  );
};
