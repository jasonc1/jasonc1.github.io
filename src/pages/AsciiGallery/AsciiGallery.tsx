import { useEffect, useRef, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { photos, Photo, shuffleInitial, nextPhoto, prevPhoto } from './photos';
import { useAsciiConverter, preloadAll, computeGrid } from './useAsciiConverter';
import { AsciiTransition } from './AsciiTransition';
import { PhotoReveal, PHOTO_LAYERS, RevealPhase } from './PhotoReveal';
import './AsciiGallery.scss';

// Dev-only tweak panel — dynamic import ensures leva isn't in prod bundle
const LazyTweakPanel = import.meta.env.DEV
  ? lazy(() => import('./AsciiTweakPanel').then(m => ({ default: m.AsciiTweakPanel })))
  : null;

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
  const [hoverActive, setHoverActive] = useState(false);
  const [revealPhase, setRevealPhase] = useState<RevealPhase>('hidden');
  const [layerIndex, setLayerIndex]   = useState(0);
  const [isExiting, setIsExiting]     = useState(false);
  const [tweakPanelOpen, setTweakPanelOpen] = useState(false);
  const touchStartX    = useRef<number | null>(null);
  const touchStartY    = useRef<number | null>(null);
  const idleTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const layerIndexRef  = useRef(0);
  const exitAnimRef    = useRef<number | null>(null);
  const scrollOpacityRef = useRef(1.0);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const hoverPosRef = useRef<{ x: number; y: number } | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Refs for stable callback access (avoid recreating callbacks on state change)
  const transitioningRef = useRef(false);
  const isExitingRef = useRef(false);
  const enteredRef = useRef<boolean | null>(null);
  const explodeModeRef = useRef(false);
  const tweakPanelOpenRef = useRef(false);

  // Nav hover → photo preview: shuffled mapping set once per page load
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navPhotoMap = useMemo(() => buildNavPhotoMap(), []);
  const preHoverPhotoRef = useRef<Photo | null>(null);
  const nextRef = useRef(current);
  const currentRef = useRef(current);

  // Keep refs in sync for use inside stable callbacks
  useEffect(() => { layerIndexRef.current = layerIndex; }, [layerIndex]);
  useEffect(() => { nextRef.current = next; }, [next]);
  useEffect(() => { currentRef.current = current; }, [current]);
  useEffect(() => { transitioningRef.current = transitioning; }, [transitioning]);
  useEffect(() => { isExitingRef.current = isExiting; }, [isExiting]);
  useEffect(() => { enteredRef.current = entered; }, [entered]);
  useEffect(() => { explodeModeRef.current = explodeMode; }, [explodeMode]);
  useEffect(() => { tweakPanelOpenRef.current = tweakPanelOpen; }, [tweakPanelOpen]);

  // Cleanup timers/RAF on unmount
  useEffect(() => () => {
    if (exitAnimRef.current) cancelAnimationFrame(exitAnimRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  }, []);

  const { cols, rows, fontSize, gridAR } = grid;

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
      mouseRef.current = null;
      hoverPosRef.current = null;
      if (idleTimerRef.current) { clearTimeout(idleTimerRef.current); idleTimerRef.current = null; }
      if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null; }
      setRevealPhase('hidden');
      setHoverActive(false);
    }
  }, [entered, explodeMode]);

  // ── Reset layer when photo changes ────────────────────────────────────
  useEffect(() => {
    setLayerIndex(0);
  }, [current.id]);

  // ── Scroll opacity: ref + direct DOM mutation (no state updates) ──────
  // Initialize opacity on the section element after mount
  useEffect(() => {
    const progress = Math.min(window.scrollY / window.innerHeight, 1);
    scrollOpacityRef.current = Math.max(0, 1 - progress * 1.6);
    if (sectionRef.current) {
      sectionRef.current.style.opacity = String(scrollOpacityRef.current);
    }
  }, []);

  useEffect(() => {
    if (!entered) return;
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      const op = Math.max(0, 1 - progress * 1.6);
      scrollOpacityRef.current = op;
      if (sectionRef.current) sectionRef.current.style.opacity = String(op);
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

  // ── Stable callbacks: read state from refs to avoid dependency churn ──
  const advance = useCallback(() => {
    if (transitioningRef.current) return;
    const n = nextPhoto(currentRef.current);
    setNext(n);
    setTransitioning(true);
  }, []);

  const back = useCallback(() => {
    if (transitioningRef.current) return;
    const p = prevPhoto();
    if (!p) return;
    setNext(p);
    setTransitioning(true);
  }, []);

  const enterPortfolio = useCallback(() => {
    if (isExitingRef.current) return;
    setIsExiting(true);
    const from = scrollOpacityRef.current;
    const startTime = performance.now();
    const DURATION = 380;

    const tick = (now: number) => {
      const t    = Math.min(1, (now - startTime) / DURATION);
      const ease = t * t; // ease-in — accelerates out
      const op   = from * (1 - ease);
      scrollOpacityRef.current = op;
      if (sectionRef.current) sectionRef.current.style.opacity = String(op);
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
  }, []);

  const handleTransitionEnd = useCallback(() => {
    setCurrent(nextRef.current);
    setTransitioning(false);
  }, []);

  // ── Keyboard ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (enteredRef.current) {
        if (e.key === 'ArrowUp' && window.scrollY <= window.innerHeight * 1.1) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape'].includes(e.key)) return;
      e.preventDefault();
      if (e.key === 'Escape') {
        if (explodeModeRef.current) setExplodeMode(false);
      } else if (e.key === 'ArrowRight') {
        if (!explodeModeRef.current) advance();
      } else if (e.key === 'ArrowLeft') {
        if (!explodeModeRef.current) back();
      } else if (e.key === 'ArrowDown') {
        if (explodeModeRef.current) setExplodeMode(false);
        else if (!tweakPanelOpenRef.current) enterPortfolio();
      } else if (e.key === 'ArrowUp') {
        if (!explodeModeRef.current) setExplodeMode(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [advance, back, enterPortfolio]);

  // ── Touch ─────────────────────────────────────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const rawDx = e.changedTouches[0].clientX - touchStartX.current;
    const rawDy = e.changedTouches[0].clientY - touchStartY.current;
    const absDx = Math.abs(rawDx);
    const absDy = Math.abs(rawDy);
    touchStartX.current = null;
    touchStartY.current = null;

    if (explodeModeRef.current) {
      if (rawDy > 60 && absDy > absDx) setExplodeMode(false);
      return;
    }

    if (absDx > 40 && absDx > absDy) {
      if (rawDx < 0) advance();
      else back();
    } else if (absDy > 60 && absDy > absDx) {
      if (rawDy < 0) setExplodeMode(true);
      else enterPortfolio();
    } else if (absDx < 10 && absDy < 10) {
      enterPortfolio();
    }
  }, [advance, back, enterPortfolio]);

  // ── Mouse handlers (stable via useCallback) ───────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (enteredRef.current || explodeModeRef.current) return;
    hoverPosRef.current = { x: e.clientX, y: e.clientY };
    mouseRef.current = { x: e.clientX, y: e.clientY };
    // Mount PhotoReveal on first move (only state update needed for mount/unmount)
    setHoverActive(true);
    setRevealPhase('active');
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setRevealPhase('idle');
      hideTimerRef.current = setTimeout(() => {
        setRevealPhase('hidden');
      }, 3000);
    }, 400);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (enteredRef.current || explodeModeRef.current) return;
    mouseRef.current = null;
    if (idleTimerRef.current) { clearTimeout(idleTimerRef.current); idleTimerRef.current = null; }
    if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null; }
    setRevealPhase('hidden');
    hideTimerRef.current = setTimeout(() => {
      hoverPosRef.current = null;
      setHoverActive(false);
    }, 700);
  }, []);

  const handleClick = useCallback(() => {
    if (explodeModeRef.current || tweakPanelOpenRef.current) return;
    enterPortfolio();
  }, [enterPortfolio]);

  const activeGrid  = (transitioning && nextGrid) ? nextGrid  : currentGrid;
  const activePhoto = (transitioning && nextGrid) ? next      : current;

  // Reconvert callback for tweak panel — clears cache and forces grid recomputation
  const handleReconvert = useCallback(() => {
    setGrid(computeGrid());
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`ascii-section${explodeMode ? ' ascii-section--explode' : ''}${!entered ? ' ascii-section--gallery' : ''}`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
          mouseRef={mouseRef}
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

      {hoverActive && !entered && !explodeMode && (
        <PhotoReveal
          photo={current}
          posRef={hoverPosRef}
          phase={revealPhase}
          layerIndex={layerIndex}
          gridAR={gridAR}
        />
      )}

      {LazyTweakPanel && (
        <Suspense fallback={null}>
          <LazyTweakPanel currentPhoto={activePhoto} onReconvert={handleReconvert} onVisibilityChange={setTweakPanelOpen} />
        </Suspense>
      )}
    </section>
  );
};
