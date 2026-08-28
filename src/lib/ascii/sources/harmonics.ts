import type { Contour, FourierCoef } from '../types';

const TAU = Math.PI * 2;

/** Uniform samples taken around a contour before transforming. */
const DFT_SAMPLES = 512;

/** Highest harmonic stored. 8*sqrt(2) worth of detail is plenty for a logo. */
export const MAX_HARMONICS = 64;

let twiddleCos: Float64Array | null = null;
let twiddleSin: Float64Array | null = null;

function twiddle(): void {
  if (twiddleCos) return;
  twiddleCos = new Float64Array(DFT_SAMPLES);
  twiddleSin = new Float64Array(DFT_SAMPLES);
  for (let m = 0; m < DFT_SAMPLES; m++) {
    const a = (TAU * m) / DFT_SAMPLES;
    twiddleCos[m] = Math.cos(a);
    twiddleSin[m] = Math.sin(a);
  }
}

/** Point at arc distance `t` along a contour, plus the local tangent. */
export function sampleContour(
  c: Contour,
  t: number,
  out: { x: number; y: number; dx: number; dy: number },
): void {
  const { cum } = c;
  let lo = 1;
  let hi = c.segments;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] < t) lo = mid + 1;
    else hi = mid;
  }
  const i = lo;
  const seg = cum[i] - cum[i - 1];
  const f = seg > 1e-9 ? (t - cum[i - 1]) / seg : 0;
  const ax = c.x[i - 1];
  const ay = c.y[i - 1];
  const bx = c.x[i];
  const by = c.y[i];
  out.x = ax + (bx - ax) * f;
  out.y = ay + (by - ay) * f;
  out.dx = bx - ax;
  out.dy = by - ay;
}

/**
 * Turn a closed contour into an equation.
 *
 * Read the outline as a complex function of arc length, z(t) = x(t) + i·y(t),
 * and take its DFT. What comes back is a parametric equation of the same species
 * as the torus — the difference being that the torus's coefficients were chosen
 * by hand and these were measured.
 *
 *     p(t) = Σ c[k] · e^(2πi k t),   k = -K … K
 *
 * Cached on the contour: the harmonic slider is free after the first transform.
 *
 * Caveat: this assumes a closed loop. An open stroke joins end-to-start and
 * rings near the seam.
 */
export function coefficientsFor(c: Contour): FourierCoef {
  if (c.coef) return c.coef;
  twiddle();
  const tc = twiddleCos!;
  const ts = twiddleSin!;

  const zr = new Float64Array(DFT_SAMPLES);
  const zi = new Float64Array(DFT_SAMPLES);
  const probe = { x: 0, y: 0, dx: 0, dy: 0 };
  for (let m = 0; m < DFT_SAMPLES; m++) {
    sampleContour(c, (c.total * m) / DFT_SAMPLES, probe);
    zr[m] = probe.x;
    zi[m] = probe.y;
  }

  const maxK = MAX_HARMONICS;
  const width = 2 * maxK + 1;
  const re = new Float64Array(width);
  const im = new Float64Array(width);

  for (let idx = 0; idx < width; idx++) {
    const k = idx - maxK;
    let ar = 0;
    let ai = 0;
    for (let q = 0; q < DFT_SAMPLES; q++) {
      // e^(-2πi k q / M) by table lookup — no trig in the inner loop
      const w = (((k * q) % DFT_SAMPLES) + DFT_SAMPLES) % DFT_SAMPLES;
      const ca = tc[w];
      const sa = -ts[w];
      ar += zr[q] * ca - zi[q] * sa;
      ai += zr[q] * sa + zi[q] * ca;
    }
    re[idx] = ar / DFT_SAMPLES;
    im[idx] = ai / DFT_SAMPLES;
  }

  c.coef = { re, im, maxK };
  return c.coef;
}

/**
 * Evaluate the truncated series and its analytic derivative at t in [0,1).
 *
 * Keeping fewer terms does not crop the shape, it smooths it: K=1 is a circle,
 * K=64 is the asset. Which makes the harmonic count a loading animation.
 */
export function evaluate(
  coef: FourierCoef,
  harmonics: number,
  t: number,
  out: { x: number; y: number; dx: number; dy: number },
): void {
  const { re, im, maxK } = coef;
  const k0 = Math.max(0, maxK - harmonics);
  const k1 = Math.min(re.length - 1, maxK + harmonics);

  let zr = 0;
  let zi = 0;
  let dr = 0;
  let di = 0;

  for (let idx = k0; idx <= k1; idx++) {
    const k = idx - maxK;
    const ang = TAU * k * t;
    const ca = Math.cos(ang);
    const sa = Math.sin(ang);
    const cr = re[idx];
    const ci = im[idx];
    const pr = cr * ca - ci * sa;
    const pi = cr * sa + ci * ca;
    zr += pr;
    zi += pi;
    // d/dt of e^(2πikt) is 2πik·(…), so the normal comes out exactly.
    const w = TAU * k;
    dr -= pi * w;
    di += pr * w;
  }

  out.x = zr;
  out.y = zi;
  out.dx = dr;
  out.dy = di;
}
