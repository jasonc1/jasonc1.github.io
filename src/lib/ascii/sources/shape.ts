import { coefficientsFor, evaluate, sampleContour } from './harmonics';
import type { Params, PointCloud, ShapeData } from '../types';

/**
 * Stage two: pure math on typed arrays.
 *
 * Turns ingested contours into a point cloud at whatever density is asked for.
 * Re-runnable on every parameter change, and it never touches the DOM.
 */
export function cloudFromShape(shape: ShapeData, p: Params): PointCloud {
  const step = Math.max(0.004, p.spacing);
  const useFourier = p.repr === 'fourier';
  const { contours } = shape;

  const counts: number[] = [];
  let total = 0;
  for (const c of contours) {
    const n = Math.max(8, Math.min(40000, Math.round(c.total / step)));
    counts.push(n);
    total += n;
  }

  const pos = new Float32Array(total * 3);
  const nrm = new Float32Array(total * 3);
  const alb = new Float32Array(total).fill(1);
  const arc = new Float32Array(total);

  const out = { x: 0, y: 0, dx: 0, dy: 0 };
  let w = 0;
  let arcBase = 0;

  for (let ci = 0; ci < contours.length; ci++) {
    const c = contours[ci];
    const n = counts[ci];
    const coef = useFourier ? coefficientsFor(c) : null;

    for (let k = 0; k < n; k++) {
      const t = k / n;
      if (coef) evaluate(coef, p.harmonics, t, out);
      else sampleContour(c, c.total * t, out);

      const globalArc = (arcBase + c.total * t) / shape.totalLength;
      const i3 = w * 3;
      pos[i3] = out.x;
      pos[i3 + 1] = out.y;
      pos[i3 + 2] = (globalArc - 0.5) * p.extrude;

      // Tangent rotated 90 degrees, tilted toward the viewer so a flat outline
      // still catches the light instead of reading as a uniform silhouette.
      let nx = -out.dy;
      let ny = out.dx;
      const len = Math.sqrt(nx * nx + ny * ny);
      if (len < 1e-9) {
        nx = 0;
        ny = 0;
      } else {
        nx /= len;
        ny /= len;
      }
      const tilt = -0.55;
      const nl = Math.sqrt(nx * nx + ny * ny + tilt * tilt);
      nrm[i3] = nx / nl;
      nrm[i3 + 1] = ny / nl;
      nrm[i3 + 2] = tilt / nl;

      arc[w] = globalArc;
      w++;
    }
    arcBase += c.total;
  }

  return { pos, nrm, alb, arc, edge: null, edgeDir: null, count: w };
}
