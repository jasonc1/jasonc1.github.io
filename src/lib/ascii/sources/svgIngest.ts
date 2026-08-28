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

/** Elements that can execute, fetch, or animate geometry out from under us. */
const DROP_ELEMENTS =
  'script,foreignObject,iframe,audio,video,animate,animateTransform,animateMotion,set,handler,listener,feImage';

/** Attributes whose value may be a url(), which must stay same-document. */
const URL_VALUED_ATTRS = new Set([
  'fill',
  'stroke',
  'filter',
  'mask',
  'clip-path',
  'marker',
  'marker-start',
  'marker-mid',
  'marker-end',
  'cursor',
]);

/** True for a url(...) that points off-page rather than at this document. */
function isOffPageUrl(value: string): boolean {
  return /url\s*\(/i.test(value) && !/url\s*\(\s*['"]?#/i.test(value);
}

function scrubElement(el: Element): void {
  for (const attr of Array.from(el.attributes)) {
    const name = attr.name;
    const value = attr.value;
    const lower = name.toLowerCase();

    if (/^on/i.test(name)) {
      el.removeAttribute(name);
    } else if (/^(href|xlink:href|src)$/i.test(name)) {
      if (!/^#/.test(value) && !/^data:image\//i.test(value)) el.removeAttribute(name);
    } else if (lower === 'style') {
      if (isOffPageUrl(value) || /@import/i.test(value)) el.removeAttribute(name);
    } else if (URL_VALUED_ATTRS.has(lower) && isOffPageUrl(value)) {
      // e.g. filter="url(https://...)" — a paint server we did not author.
      el.removeAttribute(name);
    }
  }
}

/**
 * Strip off-page references out of a <style> block without dropping the block.
 *
 * <style> is kept because CSS here can carry `transform`, which moves geometry
 * we are about to measure; deleting it would silently change the sampled shape.
 * Only the parts that would reach the network are removed.
 */
function scrubStyleText(el: Element): void {
  const text = el.textContent ?? '';
  if (!/@import|url\s*\(/i.test(text)) return;
  el.textContent = text
    .replace(/@import[^;}]*;?/gi, '')
    .replace(/url\s*\(\s*(['"]?)(?!#)[^)]*\1\s*\)/gi, 'none');
}

/**
 * Parse untrusted SVG markup and return a scrubbed root element.
 *
 * This is the only way markup should ever become a node. Returning an element
 * rather than a string is deliberate: the caller adopts this node directly, so
 * the markup is never handed back to the HTML parser. Sanitizing with one
 * parser and re-inserting with another is the classic mutation-XSS shape, and
 * `innerHTML` used to be exactly how this module put SVG in the page.
 *
 * Returns null if the input is not SVG at all.
 */
export function sanitizeSvgElement(markup: string): SVGSVGElement | null {
  // Exports routinely carry a BOM, leading whitespace, or markup that is not
  // strict XML.
  const src = String(markup).replace(/^\uFEFF/, '').replace(/^\s+/, '');
  const parser = new DOMParser();
  let root: Element | null = null;

  // The HTML parser is the primary path on purpose. It applies HTML's foreign
  // content rules, so `<svg>` with no xmlns — very common in exported and
  // hand-pasted markup — still lands in the SVG namespace. The XML parser
  // leaves that same input in the null namespace, where the element gets no
  // layout and getBBox()/getCTM() report nothing, so no geometry is sampled.
  // parseFromString() builds an inert document: no scripts run, nothing loads.
  try {
    root = parser.parseFromString(src, 'text/html').querySelector('svg');
  } catch {
    root = null;
  }

  // Strict XML documents that the HTML parser cannot find an <svg> in.
  if (!root) {
    try {
      const xml = parser.parseFromString(src, 'image/svg+xml');
      if (!xml.querySelector('parsererror')) {
        const el = xml.documentElement;
        root = el?.nodeName.toLowerCase() === 'svg' ? el : (el?.querySelector('svg') ?? null);
      }
    } catch {
      root = null;
    }
  }
  if (!root) return null;

  for (const el of Array.from(root.querySelectorAll(DROP_ELEMENTS))) {
    el.parentNode?.removeChild(el);
  }
  for (const el of Array.from(root.querySelectorAll('style'))) scrubStyleText(el);

  scrubElement(root);
  for (const el of Array.from(root.querySelectorAll('*'))) scrubElement(el);

  return root as SVGSVGElement;
}

/**
 * String form of {@link sanitizeSvgElement}, for callers that only need to know
 * whether the input is usable SVG.
 */
export function sanitizeSvg(markup: string): string | null {
  const root = sanitizeSvgElement(markup);
  return root ? new XMLSerializer().serializeToString(root) : null;
}

/**
 * Put already-sanitized markup in the measuring sandbox and hand back its root.
 *
 * Adopts the parsed node instead of assigning innerHTML, so untrusted markup is
 * never round-tripped through the HTML parser.
 */
/** Drop the measured markup once its geometry has been read out. */
function clearSandbox(): void {
  if (sandbox) sandbox.textContent = '';
}

function mountForMeasurement(markup: string): SVGSVGElement | null {
  const root = sanitizeSvgElement(markup);
  if (!root) return null;
  const host = getSandbox();
  host.replaceChildren(document.importNode(root, true));
  return host.querySelector('svg');
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
  const svg = mountForMeasurement(markup);
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
      clearSandbox();
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

  clearSandbox();
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
    const svg = mountForMeasurement(markup);
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
    clearSandbox(); // geometry is captured; the markup can go

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
