import { TAU } from '../raster';
import type { Params, PointCloud } from '../types';

/**
 * donut.c's torus, ported verbatim behind the PointCloud contract.
 *
 * Two angles: theta sweeps the tube cross-section, phi sweeps the main ring.
 * The step sizes are the original's, scaled by density. They are ~3x oversampled
 * so no gaps open between splats.
 */
export function buildTorus(p: Params): PointCloud {
  const dTheta = 0.07 / p.density;
  const dPhi = 0.02 / p.density;
  const nTheta = Math.max(3, Math.ceil(TAU / dTheta));
  const nPhi = Math.max(3, Math.ceil(TAU / dPhi));
  const count = nTheta * nPhi;

  const pos = new Float32Array(count * 3);
  const nrm = new Float32Array(count * 3);
  const alb = new Float32Array(count).fill(1);

  let w = 0;
  for (let a = 0; a < nTheta; a++) {
    const theta = a * dTheta;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const rho = p.ringRadius + p.tubeRadius * cosT;

    for (let b = 0; b < nPhi; b++) {
      const phi = b * dPhi;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);
      const i3 = w * 3;

      pos[i3] = rho * cosPhi;
      pos[i3 + 1] = rho * sinPhi;
      pos[i3 + 2] = p.tubeRadius * sinT;

      // The normal is just the cross-section direction, revolved.
      nrm[i3] = cosT * cosPhi;
      nrm[i3 + 1] = cosT * sinPhi;
      nrm[i3 + 2] = sinT;

      w++;
    }
  }
  return { pos, nrm, alb, arc: null, count };
}

export function buildSphere(p: Params): PointCloud {
  const radius = p.tubeRadius + p.ringRadius * 0.5;
  const step = 0.032 / p.density;
  const nU = Math.max(4, Math.ceil(Math.PI / step));
  const nV = Math.max(4, Math.ceil(TAU / step));
  const count = nU * nV;

  const pos = new Float32Array(count * 3);
  const nrm = new Float32Array(count * 3);
  const alb = new Float32Array(count).fill(1);

  let w = 0;
  for (let a = 0; a < nU; a++) {
    const u = a * step;
    const sinU = Math.sin(u);
    const cosU = Math.cos(u);
    for (let b = 0; b < nV; b++) {
      const v = b * step;
      const i3 = w * 3;
      const x = sinU * Math.cos(v);
      const y = sinU * Math.sin(v);
      pos[i3] = x * radius;
      pos[i3 + 1] = y * radius;
      pos[i3 + 2] = cosU * radius;
      // On a unit sphere the normal is the position.
      nrm[i3] = x;
      nrm[i3 + 1] = y;
      nrm[i3 + 2] = cosU;
      w++;
    }
  }
  return { pos, nrm, alb, arc: null, count };
}
