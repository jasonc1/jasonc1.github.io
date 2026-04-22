import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { photos, Photo, shuffleInitial, nextPhoto, prevPhoto } from './photos';
import { useAsciiConverter, preloadAll, computeGrid } from './useAsciiConverter';
import { AsciiTransition } from './AsciiTransition';
import { PhotoReveal, PHOTO_LAYERS } from './PhotoReveal';
import './AsciiGallery.scss';

// Shuffled mapping of nav labels → photos, created once per page load
function buildNavPhotoMap(): Record<string, Photo> {
  const shuffled = [...photos].sort(() => Math.random() - 0.5);
  return { Work: shuffled[0], Photo: shuffled[1], About: shuffled[2] };
}

export const AsciiGallery = () => {
  const [current, setCurrent]         = useState(() => shuffleInitial());
  const [grid, setGrid]               = useState(() => computeGrid());
  const [next, setNext]               = useState(current);
  const [transitioning, setTransitioning] = useState(false);
  const [entered, setEntered]         = useState<boolean | null>(null);
  const [explodeMode, setExplodeMode] = useState(false);
  const [hoverPos, setHoverPos]       = useState<{ x: number; y: number } | null>(null);
  const [showReveal, setShowReveal]   = useState(false);
  const [layerIndex, setLayerIndex]   = useState(0);
  const [isExiting, setIsExiting]     = useState(false);
  const touchStartX    = useRef<number | null>(null);
  const touchStartY    = useRef<number | null>(null);
  const stillTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showRevealRef  = useRef(false);
  const layerIndexRef  = useRef(0);
  const exitAnimRef    = useRef<number | null>(null);
  const scrollOpacityRef = useRef(1.0);

  // Nav hover → photo preview: shuffled mapping set once per page load
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navPhotoMap = useMemo(() => buildNavPhotoMap(), []);
  const preHoverPhotoRef = useRef<Photo | null>(null);
  const nextRef = useRef(current);
  const currentRef = useRef(current);

  // Keep refs in sync for use inside event handler closures
  useEffect(() => { showRevealRef.current = showReveal; }, [showReveal]);
  useEffect(() => { layerIndexRef.current = layerIndex; }, [layerIndex]);
  useEffect(() => { nextRef.current = next; }, [next]);
  useEffect(() => { currentRef.current = current; }, [current]);

  // Cleanup timers/RAF on unmount
  useEffect(() => () => {
    if (exitAnimRef.current) cancelAnimationFrame(exitAnimRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (stillTimerRef.current) clearTimeout(stillTimerRef.current);
  }, []);

  const { cols, rows, fontSize } = grid;

  // Browser may restore scroll after React initializes state, so `entered` starts
  // as null (undecided). After the browser has restored scroll position, sync the state.
  // While null, scroll lock is disabled so the user isn't trapped.
  // Delay snap activation until after scroll restoration so it doesn't yank us to top.
  useEffect(() => {
    const sync = () => {
      setEntered(window.scrollY > 0);
      document.documentElement.classList.add('snap-enabled');
    };
    // Double-rAF: ensures browser has completed layout + scroll restoration
    // before we read scrollY (single rAF can fire before restoration in some browsers).
    requestAnimationFrame(() => requestAnimationFrame(sync));
  }, []);

  useEffect(() => {
    preloadAll(photos.map(p => ({ src: p.src, accents: p.accents })), cols, rows, fontSize);
  }, [cols, rows, fontSize]);

  // On resize: update font-size immediately via CSS var (no React rerender = no snap),
  // then debounce full grid recomputation for when cols/rows actually need to change.
  useEffect(() => {
    document.documentElement.style.setProperty('--ascii-fs', `${fontSize}px`);
    document.documentElement.style.setProperty('--ascii-vh', `${window.innerHeight}px`);
  }, [fontSize]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const handle = () => {
      // Update font-size CSS var immediately so the existing <pre> scales
      // with the viewport — avoids visual misalignment during drag-resize.
      const g = computeGrid();
      document.documentElement.style.setProperty('--ascii-fs', `${g.fontSize}px`);
      document.documentElement.style.setProperty('--ascii-vh', `${window.innerHeight}px`);

      // Debounce the full grid recomputation (cols/rows change triggers
      // heavy canvas reconversion). Old content stays visible via
      // useAsciiConverter's lastGoodRef and AsciiTransition's frozen frame.
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setGrid(g);
      }, 250);
    };
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('resize', handle);
      if (timer) clearTimeout(timer);
    };
  }, []);

  // ── Scroll: enter portfolio when scrolling down, re-enter gallery at top ──
  useEffect(() => {
    const handleScroll = () => {
      if (!entered && window.scrollY > 10) {
        setEntered(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [entered]);

  useEffect(() => {
    if (!entered) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY < 0 && window.scrollY <= window.innerHeight * 1.1) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [entered]);

  // ── Nav clicks while at gallery unlock the scroll gate ───────────────
  useEffect(() => {
    const unlock = () => setEntered(true);
    window.addEventListener('gallery-unlock', unlock);
    return () => window.removeEventListener('gallery-unlock', unlock);
  }, []);

  // ── Nav hover → morph preview ────────────────────────────────────────
  useEffect(() => {
    if (entered) return;
    const onHover = (e: Event) => {
      const id = (e as CustomEvent).detail as string;
      const photo = navPhotoMap[id];
      if (!photo) return;
      // Save the "home" photo only on first hover (not if already previewing)
      if (!preHoverPhotoRef.current) {
        preHoverPhotoRef.current = current;
      }
      if (photo.id === current.id && !transitioning) return;
      setNext(photo);
      setTransitioning(true);
    };
    const onLeave = () => {
      const home = preHoverPhotoRef.current;
      if (!home) return;
      preHoverPhotoRef.current = null;
      setNext(home);
      setTransitioning(true);
    };
    window.addEventListener('gallery-nav-hover', onHover);
    window.addEventListener('gallery-nav-leave', onLeave);
    return () => {
      window.removeEventListener('gallery-nav-hover', onHover);
      window.removeEventListener('gallery-nav-leave', onLeave);
    };
  }, [entered, current, transitioning, navPhotoMap]);

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
      const op = Math.max(0, 1 - progress * 1.6);
      scrollOpacityRef.current = op;
      setScrollOpacity(op);
      if (window.scrollY === 0) {
        setEntered(false);
        setIsExiting(false);
        if (exitAnimRef.current) { cancelAnimationFrame(exitAnimRef.current); exitAnimRef.current = null; }
      }
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

  const back = useCallback(() => {
    if (transitioning) return;
    const p = prevPhoto();
    if (!p) return;
    setNext(p);
    setTransitioning(true);
  }, [transitioning]);

  const enterPortfolio = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    const from = scrollOpacityRef.current;
    const startTime = performance.now();
    const DURATION = 380;

    const tick = (now: number) => {
      const t    = Math.min(1, (now - startTime) / DURATION);
      const ease = t * t; // ease-in — accelerates out
      const op   = from * (1 - ease);
      scrollOpacityRef.current = op;
      setScrollOpacity(op);
      if (t < 1) {
        exitAnimRef.current = requestAnimationFrame(tick);
      } else {
        // Gallery fully faded — jump to portfolio and trigger its entrance
        setEntered(true);
        window.scrollTo({ top: window.innerHeight });
        window.dispatchEvent(new CustomEvent('portfolio-enter'));
      }
    };
    exitAnimRef.current = requestAnimationFrame(tick);
  }, [isExiting]);

  const handleTransitionEnd = useCallback(() => {
    setCurrent(nextRef.current);
    setTransitioning(false);
  }, []);

  // ── Keyboard ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (entered) {
        // ArrowUp near the top of portfolio → scroll back to 0, which triggers
        // the scroll handler to call setEntered(false) and re-enter gallery.
        if (e.key === 'ArrowUp' && window.scrollY <= window.innerHeight * 1.1) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape'].includes(e.key)) return;
      e.preventDefault(); // block browser scroll in gallery mode
      if (e.key === 'Escape') {
        if (explodeMode) setExplodeMode(false);
      } else if (e.key === 'ArrowRight') {
        if (!explodeMode) advance();
      } else if (e.key === 'ArrowLeft') {
        if (!explodeMode) back();
      } else if (e.key === 'ArrowDown') {
        if (explodeMode) setExplodeMode(false);
        else enterPortfolio();
      } else if (e.key === 'ArrowUp') {
        if (!explodeMode) setExplodeMode(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [advance, back, entered, explodeMode, enterPortfolio]);

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
      if (rawDx < 0) advance(); // swipe left → next
      else back();              // swipe right → previous
    } else if (absDy > 60 && absDy > absDx) {
      if (rawDy < 0) setExplodeMode(true);
      else enterPortfolio();
    } else if (absDx < 10 && absDy < 10) {
      enterPortfolio();
    }
  };

  const activeGrid  = (transitioning && nextGrid) ? nextGrid  : currentGrid;
  const activePhoto = (transitioning && nextGrid) ? next      : current;

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
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
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

      {!explodeMode && (
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
