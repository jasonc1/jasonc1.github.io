import { useEffect, useRef, useState, useCallback } from 'react';
import { photos, shuffleInitial, nextPhoto } from './photos';
import { useAsciiConverter, preloadAll, computeGrid } from './useAsciiConverter';
import { AsciiTransition } from './AsciiTransition';
import { PhotoReveal, PHOTO_LAYERS } from './PhotoReveal';
import './AsciiGallery.scss';

export const AsciiGallery = () => {
  const [grid, setGrid]               = useState(() => computeGrid());
  const [current, setCurrent]         = useState(() => shuffleInitial());
  const [next, setNext]               = useState(current);
  const [transitioning, setTransitioning] = useState(false);
  const [entered, setEntered]         = useState(() => window.scrollY > 0);
  const [explodeMode, setExplodeMode] = useState(false);
  const [hoverPos, setHoverPos]       = useState<{ x: number; y: number } | null>(null);
  const [showReveal, setShowReveal]   = useState(false);
  const [layerIndex, setLayerIndex]   = useState(0);

  const touchStartX   = useRef<number | null>(null);
  const touchStartY   = useRef<number | null>(null);
  const stillTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showRevealRef = useRef(false);
  const layerIndexRef = useRef(0);

  // Keep refs in sync for use inside event handler closures
  useEffect(() => { showRevealRef.current = showReveal; }, [showReveal]);
  useEffect(() => { layerIndexRef.current = layerIndex; }, [layerIndex]);

  const { cols, rows, fontSize } = grid;

  useEffect(() => {
    preloadAll(photos.map(p => ({ src: p.src, accents: p.accents })), cols, rows, fontSize);
  }, [cols, rows, fontSize]);

  useEffect(() => {
    const handle = () => setGrid(computeGrid());
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  // ── Scroll lock + layer cycling on hover ──────────────────────────────
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (explodeMode || entered) return; // free scroll in portfolio or explode mode
      e.preventDefault();
      if (showRevealRef.current) {
        // Scroll up (deltaY < 0) → deeper layer, scroll down → back toward raw
        const dir = e.deltaY < 0 ? 1 : -1;
        const next = Math.max(0, Math.min(PHOTO_LAYERS.length - 1, layerIndexRef.current + dir));
        layerIndexRef.current = next;
        setLayerIndex(next);
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [entered, explodeMode]);

  useEffect(() => {
    if (entered || explodeMode) return;
    const lockTouch = (e: TouchEvent) => { e.preventDefault(); };
    window.addEventListener('touchmove', lockTouch, { passive: false });
    return () => window.removeEventListener('touchmove', lockTouch);
  }, [entered, explodeMode]);

  // ── Nav clicks while at gallery unlock the scroll gate ───────────────
  useEffect(() => {
    const unlock = () => setEntered(true);
    window.addEventListener('gallery-unlock', unlock);
    return () => window.removeEventListener('gallery-unlock', unlock);
  }, []);

  // ── Hide photo reveal when entering portfolio or explode mode ─────────
  useEffect(() => {
    if (entered || explodeMode) {
      if (stillTimerRef.current) { clearTimeout(stillTimerRef.current); stillTimerRef.current = null; }
      setShowReveal(false);
      setHoverPos(null);
    }
  }, [entered, explodeMode]);

  // ── Reset layer when photo changes ────────────────────────────────────
  useEffect(() => {
    setLayerIndex(0);
  }, [current.id]);

  // ── Scroll opacity + re-lock when scrolling back to gallery ──────────
  const [scrollOpacity, setScrollOpacity] = useState(() => {
    const progress = Math.min(window.scrollY / window.innerHeight, 1);
    return Math.max(0, 1 - progress * 1.6);
  });

  useEffect(() => {
    if (!entered) return;
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      setScrollOpacity(Math.max(0, 1 - progress * 1.6));
      if (window.scrollY === 0) setEntered(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [entered]);

  const currentGrid = useAsciiConverter(current.src, cols, rows, fontSize, current.accents);
  const nextGrid    = useAsciiConverter(next.src,    cols, rows, fontSize, next.accents);

  const advance = useCallback(() => {
    if (transitioning) return;
    const n = nextPhoto(current);
    setNext(n);
    setTransitioning(true);
  }, [current, transitioning]);

  const enterPortfolio = useCallback(() => {
    setEntered(true);
    const el = document.getElementById('portfolio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }, []);

  const handleTransitionEnd = useCallback(() => {
    setCurrent(next);
    setTransitioning(false);
  }, [next]);

  // ── Keyboard ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (explodeMode) setExplodeMode(false);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        if (!explodeMode) advance();
      } else if (e.key === 'ArrowUp') {
        if (!explodeMode) setExplodeMode(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [advance, explodeMode]);

  // ── Touch ─────────────────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const rawDx = e.changedTouches[0].clientX - touchStartX.current;
    const rawDy = e.changedTouches[0].clientY - touchStartY.current;
    const absDx = Math.abs(rawDx);
    const absDy = Math.abs(rawDy);
    touchStartX.current = null;
    touchStartY.current = null;

    if (explodeMode) {
      if (rawDy > 60 && absDy > absDx) setExplodeMode(false);
      return;
    }

    if (absDx > 40 && absDx > absDy) {
      advance();
    } else if (absDy > 60 && absDy > absDx) {
      if (rawDy < 0) setExplodeMode(true);
      else enterPortfolio();
    } else if (absDx < 10 && absDy < 10) {
      enterPortfolio();
    }
  };

  const activeGrid  = transitioning ? nextGrid  : currentGrid;
  const activePhoto = transitioning ? next      : current;

  return (
    <section
      className={`ascii-section${explodeMode ? ' ascii-section--explode' : ''}`}
      style={{ opacity: scrollOpacity }}
      onClick={explodeMode ? undefined : enterPortfolio}
      onMouseMove={!entered && !explodeMode ? (e) => {
        setHoverPos({ x: e.clientX, y: e.clientY });
        // Start stillness timer only if panel not yet visible
        if (!showRevealRef.current) {
          if (stillTimerRef.current) clearTimeout(stillTimerRef.current);
          stillTimerRef.current = setTimeout(() => setShowReveal(true), 700);
        }
      } : undefined}
      onMouseLeave={!entered && !explodeMode ? () => {
        if (stillTimerRef.current) { clearTimeout(stillTimerRef.current); stillTimerRef.current = null; }
        setShowReveal(false);
        hideTimerRef.current = setTimeout(() => setHoverPos(null), 300);
      } : undefined}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="ascii-art-container">
        <AsciiTransition
          grid={activeGrid}
          fontSize={fontSize}
          isTransitioning={transitioning}
          onTransitionEnd={handleTransitionEnd}
          currentPhoto={activePhoto}
          isExplodeMode={explodeMode}
        />
      </div>

      {current.coords && (
        <div key={`coords-${current.id}`} className="ascii-coords">{current.coords}</div>
      )}

      <div className="ascii-identity">
        <span className="ascii-name">Jason Chen</span>
        <span className="ascii-subtitle">DESIGN ENGINEER / SF</span>
      </div>

      <div key={`caption-${current.id}`} className="ascii-caption">
        ( {current.title} )
      </div>

      {explodeMode ? (
        <div className="ascii-orbit-hint" aria-hidden="true">LAYER VIEW · SWIPE DOWN TO EXIT</div>
      ) : (
        <div className="ascii-enter" aria-hidden="true">↓</div>
      )}

      {hoverPos && !entered && !explodeMode && (
        <PhotoReveal
          photo={current}
          mouseX={hoverPos.x}
          mouseY={hoverPos.y}
          visible={showReveal}
          layerIndex={layerIndex}
        />
      )}
    </section>
  );
};
