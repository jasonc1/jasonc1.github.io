import { useCallback, useEffect, useRef, useState } from 'react';
import { createFrame, frameToString, rasterize } from '../../lib/ascii/raster';
import { buildSphere, buildTorus } from '../../lib/ascii/sources/parametric';
import { cloudFromImage, type DecodedImage } from '../../lib/ascii/sources/heightfield';
import { cloudFromShape } from '../../lib/ascii/sources/shape';
import { demoSvg, ingestSvg } from '../../lib/ascii/sources/svgIngest';
import { DEFAULT_PARAMS } from '../../lib/ascii/schema';
import type { Camera, Frame, Params, PointCloud, ShapeData } from '../../lib/ascii/types';

/** Momentum decay per frame after a drag is released. */
const THROW_DECAY = 0.93;
const DRAG_SENSITIVITY = 0.009;

export interface EngineStats {
  points: number;
  cols: number;
  rows: number;
  ms: number;
}

export interface Engine {
  params: React.MutableRefObject<Params>;
  stats: EngineStats;
  running: boolean;
  setRunning: (v: boolean) => void;
  /** Rebuild the point cloud, then redraw. Call after a `rebuilds` control moves. */
  rebuild: () => void;
  /** Redraw with the existing cloud. Call after a display-only control moves. */
  redraw: () => void;
  setSource: (kind: Params['source']) => void;
  loadShape: (markup: string) => boolean;
  loadImage: (img: DecodedImage) => void;
  hasShape: boolean;
  hasImage: boolean;
}

/**
 * Owns the point cloud, the character grid, and the animation loop.
 *
 * Parameters live in a ref rather than state on purpose: the loop reads them
 * directly, so dragging a slider never triggers a React render. Only the stats
 * readout is state, and it updates a few times a second.
 */
export function useAsciiEngine(
  stageRef: React.RefObject<HTMLPreElement | null>,
  viewportRef: React.RefObject<HTMLDivElement | null>,
): Engine {
  const params = useRef<Params>({ ...DEFAULT_PARAMS });
  const cloud = useRef<PointCloud | null>(null);
  const shape = useRef<ShapeData | null>(null);
  const image = useRef<DecodedImage | null>(null);
  const frame = useRef<Frame | null>(null);
  const lineBuf = useRef<Uint16Array>(new Uint16Array(0));
  const camera = useRef<Camera>({ pitch: 0, yaw: 0, roll: 0 });
  const velocity = useRef({ pitch: 0, yaw: 0 });
  const dragging = useRef(false);
  const msAvg = useRef(0);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [running, setRunning] = useState(!prefersReduced);
  const [stats, setStats] = useState<EngineStats>({ points: 0, cols: 0, rows: 0, ms: 0 });
  const [hasShape, setHasShape] = useState(false);
  const [hasImage, setHasImage] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const draw = useCallback(() => {
    const stage = stageRef.current;
    const f = frame.current;
    if (!stage || !f || !cloud.current) return;
    const t0 = performance.now();
    rasterize(cloud.current, params.current, camera.current, f);
    stage.textContent = frameToString(f, lineBuf.current);
    const ms = performance.now() - t0;
    msAvg.current = msAvg.current ? msAvg.current * 0.9 + ms * 0.1 : ms;
  }, [stageRef]);

  const rebuild = useCallback(() => {
    const p = params.current;
    if (p.source === 'path') {
      if (!shape.current) shape.current = ingestSvg(demoSvg());
      cloud.current = shape.current ? cloudFromShape(shape.current, p) : buildTorus(p);
    } else if (p.source === 'image') {
      cloud.current = image.current ? cloudFromImage(image.current, p) : buildTorus(p);
    } else if (p.source === 'sphere') {
      cloud.current = buildSphere(p);
    } else {
      cloud.current = buildTorus(p);
    }
    setStats((s) => ({ ...s, points: cloud.current?.count ?? 0 }));
    draw();
  }, [draw]);

  const setSource = useCallback(
    (kind: Params['source']) => {
      params.current.source = kind;
      rebuild();
    },
    [rebuild],
  );

  const loadShape = useCallback(
    (markup: string) => {
      const ingested = ingestSvg(markup);
      if (!ingested) return false;
      shape.current = ingested;
      setHasShape(true);
      params.current.source = 'path';
      rebuild();
      return true;
    },
    [rebuild],
  );

  const loadImage = useCallback(
    (img: DecodedImage) => {
      image.current = img;
      setHasImage(true);
      params.current.source = 'image';
      rebuild();
    },
    [rebuild],
  );

  // ── Grid sizing — measured from the real font, not assumed ───────────────
  const measure = useCallback(() => {
    const stage = stageRef.current;
    const viewport = viewportRef.current;
    if (!stage || !viewport) return;

    const probe = document.createElement('span');
    probe.textContent = 'M'.repeat(100);
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;';
    const cs = getComputedStyle(stage);
    probe.style.font = `${cs.fontWeight} ${cs.fontSize}/1 ${cs.fontFamily}`;
    viewport.appendChild(probe);
    const charWidth = probe.getBoundingClientRect().width / 100;
    probe.remove();

    const lineHeight = parseFloat(cs.fontSize);
    if (!charWidth || !lineHeight) return;

    const box = viewport.getBoundingClientRect();
    const cols = Math.max(20, Math.floor((box.width - 8) / charWidth));
    let rows = Math.max(12, Math.floor((box.height - 8) / lineHeight));
    if (cols * rows > 90000) rows = Math.floor(90000 / cols);

    frame.current = createFrame(cols, rows);
    lineBuf.current = new Uint16Array(cols);
    setStats((s) => ({ ...s, cols, rows }));

    // The measured aspect is the right default; the slider can override it.
    return charWidth / lineHeight;
  }, [stageRef, viewportRef]);

  // ── Boot ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const aspect = measure();
    if (aspect && Number.isFinite(aspect)) {
      params.current.charAspect = Math.min(1.1, Math.max(0.3, aspect));
    }
    rebuild();

    // Re-measure once webfonts land, since char width changes under us.
    document.fonts?.ready.then(() => {
      measure();
      draw();
    });
  }, [measure, rebuild, draw]);

  // ── Resize ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let timer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        measure();
        draw();
      }, 100);
    });
    ro.observe(viewport);
    return () => {
      window.clearTimeout(timer);
      ro.disconnect();
    };
  }, [viewportRef, measure, draw]);

  // ── Animation loop ───────────────────────────────────────────────────────
  useEffect(() => {
    let raf = 0;
    let last = 0;
    let hudAt = 0;

    const advance = (dt: number, auto: boolean) => {
      const p = params.current;
      const cam = camera.current;
      const vel = velocity.current;
      if (auto) {
        cam.pitch += p.spinPitch * dt;
        cam.yaw += p.spinYaw * dt;
        cam.roll += p.spinRoll * dt;
      }
      cam.pitch += vel.pitch;
      cam.yaw += vel.yaw;
      vel.pitch *= THROW_DECAY;
      vel.yaw *= THROW_DECAY;
      if (Math.abs(vel.pitch) < 1e-5) vel.pitch = 0;
      if (Math.abs(vel.yaw) < 1e-5) vel.yaw = 0;
    };

    const loop = (ts: number) => {
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
      last = ts;

      if (dragging.current) {
        // pointermove drives the frame; don't advance the clock underneath it
      } else if (runningRef.current) {
        advance(dt, true);
        draw();
      } else if (velocity.current.pitch !== 0 || velocity.current.yaw !== 0) {
        advance(dt, false);
        draw();
      }

      if (ts - hudAt > 320) {
        hudAt = ts;
        setStats((s) => ({ ...s, ms: msAvg.current }));
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  // ── Drag to rotate ───────────────────────────────────────────────────────
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let lastX = 0;
    let lastY = 0;
    let moved = 0;

    const onDown = (ev: PointerEvent) => {
      const target = ev.target as HTMLElement;
      // setPointerCapture retargets the follow-up click to the viewport, which
      // would eat presses on anything overlaid on it.
      if (target.closest?.('[data-no-drag]')) return;
      if (/^(BUTTON|INPUT|TEXTAREA|SELECT|A|LABEL)$/.test(target.tagName)) return;

      dragging.current = true;
      moved = 0;
      lastX = ev.clientX;
      lastY = ev.clientY;
      velocity.current.pitch = 0;
      velocity.current.yaw = 0;
      viewport.classList.add('is-dragging');
      try {
        viewport.setPointerCapture(ev.pointerId);
      } catch {
        /* not fatal */
      }
    };

    const onMove = (ev: PointerEvent) => {
      if (!dragging.current) return;
      const dx = ev.clientX - lastX;
      const dy = ev.clientY - lastY;
      lastX = ev.clientX;
      lastY = ev.clientY;
      moved += Math.abs(dx) + Math.abs(dy);

      const yaw = dx * DRAG_SENSITIVITY;
      const pitch = dy * DRAG_SENSITIVITY;
      camera.current.yaw += yaw;
      camera.current.pitch += pitch;
      velocity.current.yaw = yaw * 0.55;
      velocity.current.pitch = pitch * 0.55;
      draw();
    };

    const onUp = (ev: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      viewport.classList.remove('is-dragging');
      try {
        viewport.releasePointerCapture(ev.pointerId);
      } catch {
        /* not fatal */
      }
      if (moved < 3) {
        velocity.current.pitch = 0;
        velocity.current.yaw = 0;
      }
    };

    const onKey = (ev: KeyboardEvent) => {
      const step = ev.shiftKey ? 0.25 : 0.08;
      if (ev.key === 'ArrowLeft') camera.current.yaw -= step;
      else if (ev.key === 'ArrowRight') camera.current.yaw += step;
      else if (ev.key === 'ArrowUp') camera.current.pitch -= step;
      else if (ev.key === 'ArrowDown') camera.current.pitch += step;
      else return;
      ev.preventDefault();
      draw();
    };

    viewport.addEventListener('pointerdown', onDown);
    viewport.addEventListener('pointermove', onMove);
    viewport.addEventListener('pointerup', onUp);
    viewport.addEventListener('pointercancel', onUp);
    viewport.addEventListener('lostpointercapture', onUp);
    viewport.addEventListener('keydown', onKey);
    return () => {
      viewport.removeEventListener('pointerdown', onDown);
      viewport.removeEventListener('pointermove', onMove);
      viewport.removeEventListener('pointerup', onUp);
      viewport.removeEventListener('pointercancel', onUp);
      viewport.removeEventListener('lostpointercapture', onUp);
      viewport.removeEventListener('keydown', onKey);
    };
  }, [viewportRef, draw]);

  return {
    params,
    stats,
    running,
    setRunning,
    rebuild,
    redraw: draw,
    setSource,
    loadShape,
    loadImage,
    hasShape,
    hasImage,
  };
}
