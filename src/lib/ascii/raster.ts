import { EDGE_CHAR_CODES, RAMPS } from './ramps';
import type { Camera, Frame, Params, PointCloud } from './types';

const TAU = Math.PI * 2;

export function createFrame(cols: number, rows: number): Frame {
  return {
    chars: new Uint16Array(cols * rows),
    depth: new Float32Array(cols * rows),
    cols,
    rows,
  };
}

/**
 * donut.c, generalized.
 *
 * For every point: rotate (yaw, then pitch, then roll), divide by depth to get
 * perspective, land it in a character cell, and keep it only if it is nearer
 * than whatever is already there. The character comes from how much the surface
 * faces the light.
 *
 * Allocation-free — every buffer is passed in and reused.
 */
export function rasterize(cloud: PointCloud, p: Params, cam: Camera, frame: Frame): void {
  const { chars, depth, cols, rows } = frame;
  chars.fill(32);
  depth.fill(0);

  const sinP = Math.sin(cam.pitch);
  const cosP = Math.cos(cam.pitch);
  const sinR = Math.sin(cam.roll);
  const cosR = Math.cos(cam.roll);
  const sinY = Math.sin(cam.yaw);
  const cosY = Math.cos(cam.yaw);

  // 0.375 is donut.c's 30/80 — horizontal scale as a fraction of grid width.
  const scaleX = cols * 0.375 * p.zoom;
  const scaleY = scaleX * p.charAspect;
  const midX = cols * 0.5;
  const midY = rows * 0.5;

  const ramp = RAMPS[p.ramp] ?? RAMPS.classic;
  const rampLen = ramp.length;
  const rampCodes = new Uint16Array(rampLen);
  for (let i = 0; i < rampLen; i++) rampCodes[i] = ramp.charCodeAt(i);

  let lx = p.lightX;
  let ly = p.lightY;
  let lz = p.lightZ;
  const lightLen = Math.sqrt(lx * lx + ly * ly + lz * lz) || 1;
  lx /= lightLen;
  ly /= lightLen;
  lz /= lightLen;

  const mix = p.source === 'image' ? p.albedoMix : 0;
  const { pos, nrm, alb, arc, edge, edgeDir, count } = cloud;
  const reveal = p.reveal;
  const edgeCut = p.edgeThreshold;
  const useEdges = edge !== null && edgeDir !== null && edgeCut < 1;

  for (let i = 0; i < count; i++) {
    // The loading reveal, in one line.
    if (arc !== null && arc[i] > reveal) continue;

    const i3 = i * 3;
    const px = pos[i3];
    const py = pos[i3 + 1];
    const pz = pos[i3 + 2];

    // Ry(yaw) — donut.c has no such axis; drag needs it.
    const x0 = px * cosY + pz * sinY;
    const z0 = pz * cosY - px * sinY;

    // Rx(pitch), then the perspective divide.
    const zc = py * sinP + z0 * cosP + p.distance;
    if (zc < 0.2) continue;
    const inv = 1 / zc;
    const t = py * cosP - z0 * sinP;

    // Rz(roll) and land it on the grid.
    const sx = (midX + scaleX * inv * (x0 * cosR - t * sinR)) | 0;
    if (sx < 0 || sx >= cols) continue;
    const sy = (midY + scaleY * inv * (x0 * sinR + t * cosR)) | 0;
    if (sy < 0 || sy >= rows) continue;

    const o = sy * cols + sx;
    if (inv <= depth[o]) continue; // nearer wins

    // Same three rotations on the normal, so lighting follows the shape.
    const nx = nrm[i3];
    const ny = nrm[i3 + 1];
    const nz = nrm[i3 + 2];
    const mx = nx * cosY + nz * sinY;
    const mz = nz * cosY - nx * sinY;
    const my1 = ny * cosP - mz * sinP;
    const mz1 = ny * sinP + mz * cosP;
    const nX = mx * cosR - my1 * sinR;
    const nY = mx * sinR + my1 * cosR;

    let lum = nX * lx + nY * ly + mz1 * lz;
    if (lum < 0) lum = 0;
    if (mix > 0) lum = lum * (1 - mix) + alb[i] * mix;

    depth[o] = inv;

    // A cell on a strong edge draws the edge's direction instead of its
    // brightness. Structure survives the ramp; a gradient character cannot
    // tell you which way a contour runs.
    if (useEdges && edge![i] > edgeCut) {
      const dir = edgeDir![i];
      if (dir > 0) {
        const shade = p.invert ? lum : 1 - lum;
        let band = (shade * 5) | 0;
        if (band > 4) band = 4;
        chars[o] = EDGE_CHAR_CODES[dir][band];
        continue;
      }
    }

    let ci = (lum * rampLen) | 0;
    if (ci >= rampLen) ci = rampLen - 1;
    if (p.invert) ci = rampLen - 1 - ci;
    chars[o] = rampCodes[ci];
  }
}

/** One string per frame — the caller assigns it to a single <pre>. */
export function frameToString(frame: Frame, lineBuf: Uint16Array): string {
  const { chars, cols, rows } = frame;
  let out = '';
  for (let y = 0; y < rows; y++) {
    lineBuf.set(chars.subarray(y * cols, y * cols + cols));
    out += String.fromCharCode.apply(null, lineBuf as unknown as number[]);
    if (y < rows - 1) out += '\n';
  }
  return out;
}

export { TAU };
