import { useEffect, useRef, useState, useCallback } from 'react';
import { photos, shuffleInitial, nextPhoto } from './photos';
import { useAsciiConverter, preloadAll, computeGrid } from './useAsciiConverter';
import { AsciiTransition } from './AsciiTransition';
import './AsciiGallery.scss';

export const AsciiGallery = () => {
  const [grid, setGrid]               = useState(() => computeGrid());
  const [current, setCurrent]         = useState(() => shuffleInitial());
  const [next, setNext]               = useState(current);
  const [transitioning, setTransitioning] = useState(false);
  const [entered, setEntered]         = useState(() => window.scrollY > 0);
  const [explodeMode, setExplodeMode] = useState(false);
  const [zoomScale, setZoomScale]     = useState(1.0);

  const zoomScaleRef   = useRef(1.0);
  const touchStartX    = useRef<number | null>(null);
  const touchStartY    = useRef<number | null>(null);
  const zoomAnimRef    = useRef<number | null>(null);
  const cursorHandlerRef = useRef<((x: number, y: number) => void) | null>(null);

  // Keep zoom ref in sync — cursor handler reads this to avoid stale closure
  const setZoom = useCallback((val: number) => {
    zoomScaleRef.current = val;
    setZoomScale(val);
  }, []);

  // Smooth zoom animation when entering / exiting explode mode
  const animateZoom = useCallback((target: number) => {
    if (zoomAnimRef.current) cancelAnimationFrame(zoomAnimRef.current);
    const from = zoomScaleRef.current;
    const startTime = performance.now();
    const DURATION  = 700; // ms

    const tick = (now: number) => {
      const t    = Math.min(1, (now - startTime) / DURATION);
      const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
      setZoom(from + (target - from) * ease);
      if (t < 1) zoomAnimRef.current = requestAnimationFrame(tick);
    };
    zoomAnimRef.current = requestAnimationFrame(tick);
  }, [setZoom]);

  const { cols, rows, fontSize } = grid;

  useEffect(() => {
    preloadAll(photos.map(p => ({ src: p.src, accents: p.accents })), cols, rows, fontSize);
  }, [cols, rows, fontSize]);

  useEffect(() => {
    const handle = () => setGrid(computeGrid());
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  // ── Zoom: animate when entering / exiting explode mode ────────────────
  useEffect(() => {
    animateZoom(explodeMode ? 3.0 : 1.0);
  }, [explodeMode, animateZoom]);

  // ── Scroll lock + scroll-wheel zoom in explode mode ───────────────────
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (explodeMode) {
        // Scroll wheel spreads / compresses layers
        e.preventDefault();
        const next = Math.max(1.0, Math.min(6.0, zoomScaleRef.current - e.deltaY * 0.004));
        setZoom(next);
      } else if (!entered) {
        e.preventDefault(); // locked at gallery
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [entered, explodeMode, setZoom]);

  useEffect(() => {
    if (entered || explodeMode) return; // touch scroll free
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
      // Swipe down exits orbit mode
      if (rawDy > 60 && absDy > absDx) setExplodeMode(false);
      return;
    }

    if (absDx > 40 && absDx > absDy) {
      advance(); // horizontal swipe → next photo
    } else if (absDy > 60 && absDy > absDx) {
      if (rawDy < 0) setExplodeMode(true);  // swipe up → orbit mode
      else enterPortfolio();                  // swipe down → enter portfolio
    } else if (absDx < 10 && absDy < 10) {
      enterPortfolio(); // tap
    }
  };

  // ── Cursor → ghost transform ──────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!cursorHandlerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    cursorHandlerRef.current(x, y);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cursorHandlerRef.current) cursorHandlerRef.current(0, 0);
  }, []);

  const registerCursorHandler = useCallback((fn: (x: number, y: number) => void) => {
    cursorHandlerRef.current = fn;
  }, []);

  const activeGrid  = transitioning ? nextGrid  : currentGrid;
  const activePhoto = transitioning ? next      : current;

  return (
    <section
      className={`ascii-section${explodeMode ? ' ascii-section--explode' : ''}`}
      style={{ opacity: scrollOpacity }}
      onClick={explodeMode ? undefined : enterPortfolio}
      // onMouseMove={handleMouseMove}   // disabled: live-wall mode
      // onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="ascii-art-container">
        <AsciiTransition
          grid={activeGrid}
          fontSize={fontSize}
          isTransitioning={transitioning}
          onTransitionEnd={handleTransitionEnd}
          registerCursorHandler={registerCursorHandler}
          currentPhoto={activePhoto}
          isExplodeMode={explodeMode}
          zoomScale={zoomScale}
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
        <div className="ascii-orbit-hint" aria-hidden="true">LAYER VIEW · SCROLL TO ZOOM · SWIPE DOWN TO EXIT</div>
      ) : (
        <div className="ascii-enter" aria-hidden="true">↓</div>
      )}
    </section>
  );
};
