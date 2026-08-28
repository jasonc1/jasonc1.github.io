import type { Contour, ShapeData } from '../types';

const GEOMETRY_SELECTOR = 'path,line,polyline,polygon,rect,circle,ellipse';

/** SVG units per flattening step. Fixed on purpose — see ingestSvg. */
const FLATTEN_STEP = 0.5;

/** World-space span a shape is normalized into, matching the parametric sources. */
const WORLD_SPAN = 6;

let sandbox: HTMLDivElement | null = null;

/**
 * Off-screen host used to measure geometry.
 *
 * Deliberately NOT display:none and NOT zero-sized: getCTM() folds in the
 * viewBox-to-viewport scale, so a 0x0 host collapses every sampled point onto
 * the origin, and display:none breaks getBBox in some browsers.
 */
function getSandbox(): HTMLDivElement {
  if (!sandbox) {
    sandbox = document.createElement('div');
    sandbox.setAttribute('aria-hidden', 'true');
    sandbox.style.cssText =
      'position:absolute;left:-99999px;top:0;opacity:0;pointer-events:none;';
    document.body.appendChild(sandbox);
  }
  sandbox.textContent = '';
  return sandbox;
}

/**
 * Imported SVG is untrusted markup that we put in the DOM to measure it, so a
 * dropped file could carry <script> or onload=. Strip anything executable or
 * anything that would reach off-page, then re-serialize.
 *
 * Returns null if the input is not SVG at all.
 */
export function sanitizeSvg(markup: string): string | null {
  // Exports routinely carry a BOM, leading whitespace, or markup that is not
  // strict XML. Try XML first, then fall back to the forgiving HTML parser.
  const src = String(markup).replace(/^﻿/, '').replace(/^\s+/, '');
  const parser = new DOMParser();
  let root: Element | null = null;

  try {
    const xml = parser.parseFromString(src, 'image/svg+xml');
    if (!xml.querySelector('parsererror')) {
      const el = xml.documentElement;
      root = el?.nodeName.toLowerCase() === 'svg' ? el : (el?.querySelector('svg') ?? null);
    }
  } catch {
    root = null;
  }

  if (!root) {
    try {
      root = parser.parseFromString(src, 'text/html').querySelector('svg');
    } catch {
      root = null;
    }
  }
  if (!root) return null;

  for (const el of Array.from(
    root.querySelectorAll('script,foreignObject,iframe,audio,video,animate,set'),
  )) {
    el.parentNode?.removeChild(el);
  }

  const scrub = (el: Element) => {
    for (const attr of Array.from(el.attributes)) {
      const { name, value } = attr;
      if (/^on/i.test(name)) {
        el.removeAttribute(name);
      } else if (/^(href|xlink:href|src)$/i.test(name)) {
        if (!/^#/.test(value) && !/^data:image\//i.test(value)) el.removeAttribute(name);
      } else if (/^style$/i.test(name) && /url\s*\(/i.test(value)) {
        el.removeAttribute(name);
      }
    }
  };
  scrub(root);
  for (const el of Array.from(root.querySelectorAll('*'))) scrub(el);

  return new XMLSerializer().serializeToString(root);
}

/**
 * Stage one: touch the SVG DOM exactly once.
 *
 * Walks every geometry element, flattens it to a polyline at a FIXED resolution,
 * normalizes into world space, and records cumulative arc length. After this
 * returns, nothing downstream ever looks at the markup again — which is why the
 * flattening step is independent of any user parameter.
 */
export function ingestSvg(markup: string): ShapeData | null {
  const host = getSandbox();
  host.innerHTML = markup;
  const svg = host.querySelector('svg');
  if (!svg) return null;

  const box = svg.viewBox?.baseVal;
  let vx: number;
  let vy: number;
  let vw: number;
  let vh: number;

  if (box && box.width && box.height) {
    // Pin the viewport to the viewBox so getCTM()'s scale factor is exactly 1.
    svg.setAttribute('width', String(box.width));
    svg.setAttribute('height', String(box.height));
    svg.removeAttribute('preserveAspectRatio');
    ({ x: vx, y: vy, width: vw, height: vh } = box);
  } else {
    let bounds: DOMRect | null = null;
    try {
      bounds = svg.getBBox();
    } catch {
      bounds = null;
    }
    if (!bounds || !bounds.width) {
      host.textContent = '';
      return null;
    }
    ({ x: vx, y: vy, width: vw, height: vh } = bounds);
  }

  const scale = WORLD_SPAN / Math.max(vw, vh);
  const originX = vx + vw / 2;
  const originY = vy + vh / 2;

  const contours: Contour[] = [];
  let totalLength = 0;

  for (const el of Array.from(svg.querySelectorAll(GEOMETRY_SELECTOR))) {
    const geo = el as SVGGeometryElement;
    if (typeof geo.getTotalLength !== 'function') continue;

    let length = 0;
    try {
      length = geo.getTotalLength();
    } catch {
      continue;
    }
    if (!length || !Number.isFinite(length)) continue;

    // getPointAtLength returns element-local coordinates, so anything inside a
    // transformed <g> lands in the wrong place without this.
    let ctm: DOMMatrix | null = null;
    try {
      ctm = geo.getCTM();
    } catch {
      ctm = null;
    }

    const segments = Math.max(8, Math.min(20000, Math.round(length / FLATTEN_STEP)));
    const x = new Float32Array(segments + 1);
    const y = new Float32Array(segments + 1);
    let ok = true;

    for (let k = 0; k <= segments; k++) {
      let point: DOMPoint;
      try {
        point = geo.getPointAtLength((length * k) / segments);
      } catch {
        ok = false;
        break;
      }
      let px = point.x;
      let py = point.y;
      if (ctm) {
        const tx = ctm.a * px + ctm.c * py + ctm.e;
        py = ctm.b * px + ctm.d * py + ctm.f;
        px = tx;
      }
      x[k] = (px - originX) * scale;
      y[k] = (py - originY) * scale;
    }
    if (!ok) continue;

    const cum = new Float32Array(segments + 1);
    for (let k = 1; k <= segments; k++) {
      const dx = x[k] - x[k - 1];
      const dy = y[k] - y[k - 1];
      cum[k] = cum[k - 1] + Math.sqrt(dx * dx + dy * dy);
    }
    if (cum[segments] <= 1e-6) continue;

    contours.push({ x, y, cum, total: cum[segments], segments, coef: null });
    totalLength += cum[segments];
  }

  host.textContent = '';
  return contours.length ? { contours, totalLength } : null;
}

/**
 * Rasterize SVG markup into an image, for solid mode and as a fallback when a
 * file has no samplable geometry. Needs explicit pixel dimensions first — an
 * SVG with only a viewBox reports naturalWidth 0 in some browsers and draws
 * nothing to canvas.
 */
export function svgToImage(markup: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const host = getSandbox();
    host.innerHTML = markup;
    const svg = host.querySelector('svg');
    if (!svg) {
      resolve(null);
      return;
    }
    const box = svg.viewBox?.baseVal;
    const w = box?.width || parseFloat(svg.getAttribute('width') || '') || 400;
    const h = box?.height || parseFloat(svg.getAttribute('height') || '') || 400;
    const scale = 640 / Math.max(w, h);
    svg.setAttribute('width', String(Math.round(w * scale)));
    svg.setAttribute('height', String(Math.round(h * scale)));
    if (!box?.width) svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

    const serialized = new XMLSerializer().serializeToString(svg);
    host.textContent = '';

    const url = URL.createObjectURL(
      new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' }),
    );
    const img = new Image();
    img.onload = () => {
      resolve(img);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

/** Built-in demo shape — generated, not hand-authored path data. */
export function demoSvg(): string {
  let d = '';
  const steps = 720;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const r = 118 + 58 * Math.cos(3 * t);
    d += `${i ? 'L' : 'M'}${(200 + r * Math.cos(t)).toFixed(2)} ${(200 + r * Math.sin(t)).toFixed(2)}`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><path d="${d}Z" fill="none" stroke="#000"/></svg>`;
}
