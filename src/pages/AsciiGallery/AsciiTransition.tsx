import { useEffect, useRef, useState } from 'react';
import { AsciiGrid } from './useAsciiConverter';
import { buildKineticState, applyKineticFrame, KineticState } from './kinetic';
import { Photo } from './photos';

const FADE_MS = 500;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  const [prevContent, setPrevContent] = useState('');
  const [fading,      setFading]      = useState(false);

  const mainRef     = useRef<HTMLPreElement>(null);
  const fadeOutRef  = useRef<HTMLPreElement>(null);

  const stableGridRef  = useRef<AsciiGrid | null>(grid);
  const timerRef       = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Kinetic animation ──────────────────────────────────────────────────
  const kineticStateRef  = useRef<KineticState | null>(null);
  const kineticOutputRef = useRef<string[]>([]);
  const kineticFrameRef  = useRef<number | null>(null);

  useEffect(() => {
    if (!grid || !currentPhoto) return;
    kineticStateRef.current = buildKineticState(grid, currentPhoto.kinetic);
    kineticOutputRef.current = [...grid.rows];
  }, [grid, currentPhoto?.kinetic]);

  useEffect(() => {
    if (reducedMotion || isExplodeMode) {
      if (kineticFrameRef.current) {
        cancelAnimationFrame(kineticFrameRef.current);
        kineticFrameRef.current = null;
      }
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

  // ── Grid sync ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isTransitioning && grid) {
      setDisplayGrid(grid);
      stableGridRef.current = grid;
    }
  }, [grid, isTransitioning]);

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

  return (
    <div className="ascii-layers">
      {/* RAF controls textContent directly — no React children to avoid
          one-frame flash of raw static grid on every grid swap */}
      <pre
        ref={mainRef}
        className={`ascii-art ascii-art--main${fading ? ' ascii-art--fade-in' : ''}`}
        style={{ fontSize: fs }}
      />

      {fading && (
        <pre
          ref={fadeOutRef}
          className="ascii-art ascii-art--fade-out"
          style={{ fontSize: fs }}
        >
          {prevContent}
        </pre>
      )}
    </div>
  );
};
