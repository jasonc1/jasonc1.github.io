/**
 * Shared mutable config object for ASCII gallery parameters.
 *
 * RAF loops read from this object each frame. The dev-only leva tweak panel
 * writes to it via useEffect. In production, these are just the default values
 * — same as the previously hardcoded constants. Zero overhead.
 */

export const asciiConfig = {
  // ── Conversion (read during imageToGrid — requires reconvert to take effect) ──
  ramp: '@#%S&8WM$*oahkbdpqwZO0QLCJUYXzcvunxrjft/|()1?-_+~<>ilI;:\'"^`,.·  ',
  canvasContrast: 120,
  sigmoidSteepness: 5,
  percentileLo: 0.05,
  percentileHi: 0.95,
  edgeThreshold: 0.40,
  colsMobile: 120,
  colsTablet: 180,
  colsDesktop: 600,

  // ── Morph (read per-frame in RAF) ──
  morphMs: 1200,
  staggerFraction: 0.35,
  cellFraction: 0.45,

  // ── Color pulse (read per-frame in RAF) ──
  pulseFreq0: 0.25,
  pulseFreq1: 0.37,
  pulseFreq2: 0.49,
  pulseBaseOpacity: 0.14,
  pulseAmplitude: 0.08,

  // ── Echo (read per-frame in RAF) ──
  echoEveryNFrames: 4,
  echoOpacity: 0.20,

  // ── Cursor disturbance (read per-frame in RAF) ──
  disturbanceRadius: 25,
  disturbanceMaxDarken: 8,
};

export const ASCII_DEFAULTS = Object.freeze({ ...asciiConfig });
