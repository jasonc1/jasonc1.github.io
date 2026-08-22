/**
 * The one contract the whole engine is built on.
 *
 * Every source — a parametric equation, a traced SVG path, an uploaded photo —
 * produces this and nothing else. Downstream, the rasterizer has no idea where
 * the points came from and does not need to.
 */
export interface PointCloud {
  /** 3n — x, y, z in world space (shapes are normalized to roughly ±3) */
  pos: Float32Array;
  /** 3n — unit surface normal, used for the n·L lighting term */
  nrm: Float32Array;
  /** n — 0..1 source brightness. 1 for anything without its own color */
  alb: Float32Array;
  /** n — 0..1 position along the path. Null unless the source is a path. */
  arc: Float32Array | null;
  count: number;
}

export type SourceKind = 'torus' | 'sphere' | 'path' | 'image';

/** How a traced shape is held: replayed samples, or a Fourier series. */
export type Repr = 'poly' | 'fourier';

export type RampKey = 'classic' | 'fine' | 'blocks' | 'dots' | 'binary';

/** 'horizontal' locks the auto-spin to yaw, giving a turntable. */
export type SpinAxis = 'free' | 'horizontal';

export interface Params {
  source: SourceKind;

  // Parametric
  ringRadius: number;
  tubeRadius: number;
  density: number;

  // Path
  repr: Repr;
  harmonics: number;
  spacing: number;
  extrude: number;
  reveal: number;

  // Raster
  reliefDepth: number;
  albedoMix: number;

  // Camera
  spinAxis: SpinAxis;
  /** Turntable lean, in radians. Drives pitch while spinAxis is 'horizontal'. */
  tilt: number;
  spinPitch: number;
  spinYaw: number;
  spinRoll: number;
  distance: number;
  zoom: number;
  charAspect: number;

  // Shading
  ramp: RampKey;
  invert: boolean;
  lightX: number;
  lightY: number;
  lightZ: number;
}

/** The three rotation angles, in radians. */
export interface Camera {
  pitch: number;
  yaw: number;
  roll: number;
}

/** A character grid plus its depth buffer. Allocated once, reused every frame. */
export interface Frame {
  chars: Uint16Array;
  depth: Float32Array;
  cols: number;
  rows: number;
}

/** One flattened contour in world space, with cumulative arc length. */
export interface Contour {
  x: Float32Array;
  y: Float32Array;
  /** cumulative arc length, same length as x/y */
  cum: Float32Array;
  total: number;
  segments: number;
  /** Fourier coefficients, computed lazily and cached */
  coef: FourierCoef | null;
}

export interface FourierCoef {
  re: Float64Array;
  im: Float64Array;
  /** highest harmonic stored; array index k maps to harmonic (k - maxK) */
  maxK: number;
}

/** What `ingestSvg` produces. The SVG DOM is never consulted again after this. */
export interface ShapeData {
  contours: Contour[];
  totalLength: number;
}
