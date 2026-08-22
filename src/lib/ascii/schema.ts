import { RAMP_KEYS, RAMP_LABELS } from './ramps';
import { MAX_HARMONICS } from './sources/harmonics';
import type { Params, SourceKind } from './types';

export const DEFAULT_PARAMS: Params = {
  source: 'torus',

  ringRadius: 2,
  tubeRadius: 1,
  density: 1,

  repr: 'poly',
  harmonics: 24,
  spacing: 0.02,
  extrude: 0,
  reveal: 1,

  reliefDepth: 1.4,
  albedoMix: 0.55,

  spinAxis: 'horizontal',
  tilt: -0.42,
  spinPitch: 0.7,
  spinYaw: 0.5,
  spinRoll: 0.35,
  distance: 5,
  zoom: 1,
  charAspect: 0.6,

  ramp: 'classic',
  invert: true,
  lightX: 0,
  lightY: -1,
  lightZ: -1,
};

type NumericKey = {
  [K in keyof Params]: Params[K] extends number ? K : never;
}[keyof Params];

interface BaseControl {
  /** Which sources this control applies to. Omitted means all of them. */
  only?: SourceKind[];
  /** Extra visibility test, for controls that only apply in certain modes. */
  when?: (p: Params) => boolean;
  label: string;
  /** Plain-English explanation. No graphics vocabulary. */
  hint?: string;
  /** Rebuild the point cloud when this changes, rather than just redrawing. */
  rebuilds?: boolean;
  /** Runs after the value is written. For knobs that imply another knob. */
  sideEffect?: (p: Params) => void;
}

export interface RangeControl extends BaseControl {
  kind: 'range';
  key: NumericKey;
  min: number;
  max: number;
  step: number;
  decimals: number;
  suffix?: string;
}

export interface ChoiceControl<K extends keyof Params = keyof Params> extends BaseControl {
  kind: 'choice';
  key: K;
  options: Array<{ value: Params[K]; label: string }>;
}

export interface SelectControl extends BaseControl {
  kind: 'select';
  key: 'ramp';
  options: Array<{ value: string; label: string }>;
}

export type Control = RangeControl | ChoiceControl | SelectControl;

export interface ControlGroup {
  title: string;
  controls: Control[];
}

/**
 * The panel is generated from this. Adding a knob is one object literal, never
 * a new component — and every knob carries its own plain-English hint, so the
 * explanation lives with the control instead of in a doc somewhere.
 */
export const SCHEMA: ControlGroup[] = [
  {
    title: 'View',
    controls: [
      {
        kind: 'choice',
        key: 'spinAxis',
        label: 'Rotation',
        hint: 'Horizontal is a turntable: it leans the subject toward you and turns it, which is the easiest way to read a 3D form. Free lets it tumble on all three axes.',
        options: [
          { value: 'horizontal', label: 'Horizontal' },
          { value: 'free', label: 'Free' },
        ],
        sideEffect: (p) => {
          // A turntable with no yaw speed is just a still frame.
          if (p.spinAxis === 'horizontal' && p.spinYaw === 0) p.spinYaw = 0.5;
          // Free mode is donut.c's tumble, which is pitch and roll only.
          if (p.spinAxis === 'free') p.spinYaw = 0;
        },
      },
      {
        kind: 'range',
        key: 'tilt',
        when: (p) => p.spinAxis === 'horizontal',
        label: 'Tilt',
        hint: 'How far the subject leans toward you. Drag up and down in the viewport to change it.',
        min: -1.2,
        max: 1.2,
        step: 0.01,
        decimals: 2,
      },
      {
        kind: 'range',
        key: 'spinPitch',
        when: (p) => p.spinAxis === 'free',
        label: 'Spin — pitch',
        hint: 'How fast it tilts. Dragging up and down does the same thing.',
        min: -2.5,
        max: 2.5,
        step: 0.02,
        decimals: 2,
      },
      {
        kind: 'range',
        key: 'spinYaw',
        label: 'Spin — yaw',
        hint: 'How fast it turns left and right. Dragging sideways does the same thing.',
        min: -2.5,
        max: 2.5,
        step: 0.02,
        decimals: 2,
      },
      {
        kind: 'range',
        key: 'spinRoll',
        when: (p) => p.spinAxis === 'free',
        label: 'Spin — roll',
        hint: 'How fast it spins like a wheel. A different speed here is what makes it wobble.',
        min: -2.5,
        max: 2.5,
        step: 0.02,
        decimals: 2,
      },
      {
        kind: 'range',
        key: 'distance',
        label: 'Distance',
        hint: 'How far back the camera sits. Further away looks smaller and flatter.',
        min: 3,
        max: 14,
        step: 0.1,
        decimals: 2,
      },
      {
        kind: 'range',
        key: 'zoom',
        label: 'Zoom',
        min: 0.3,
        max: 2.6,
        step: 0.02,
        decimals: 2,
      },
      {
        kind: 'range',
        key: 'charAspect',
        label: 'Char aspect',
        hint: 'Text characters are taller than they are wide. This stops circles looking like ovals.',
        min: 0.3,
        max: 1.1,
        step: 0.01,
        decimals: 2,
      },
    ],
  },
  {
    title: 'Shape',
    controls: [
      {
        kind: 'range',
        key: 'ringRadius',
        only: ['torus', 'sphere'],
        label: 'Ring radius',
        hint: 'How far the ring sits from the middle. Slide it to zero and you get a ball.',
        min: 0,
        max: 4,
        step: 0.05,
        decimals: 2,
        rebuilds: true,
      },
      {
        kind: 'range',
        key: 'tubeRadius',
        only: ['torus', 'sphere'],
        label: 'Tube radius',
        min: 0.2,
        max: 2,
        step: 0.02,
        decimals: 2,
        rebuilds: true,
      },
      {
        kind: 'choice',
        key: 'repr',
        only: ['path'],
        label: 'Representation',
        hint: 'Polyline keeps the outline as traced. Harmonics rebuilds it out of stacked spinning circles.',
        options: [
          { value: 'poly', label: 'Polyline' },
          { value: 'fourier', label: 'Harmonics' },
        ],
        rebuilds: true,
      },
      {
        kind: 'range',
        key: 'harmonics',
        only: ['path'],
        label: 'Harmonics',
        hint: 'How many spinning circles. One is a circle, sixty-four is your artwork.',
        min: 1,
        max: MAX_HARMONICS,
        step: 1,
        decimals: 0,
        rebuilds: true,
      },
      {
        kind: 'range',
        key: 'spacing',
        only: ['path'],
        label: 'Sample spacing',
        hint: 'How far apart the dots sit. Closer together is smoother but slower.',
        min: 0.004,
        max: 0.12,
        step: 0.001,
        decimals: 3,
        rebuilds: true,
      },
      {
        kind: 'range',
        key: 'extrude',
        only: ['path'],
        label: 'Extrude',
        hint: 'Pushes the outline backwards as it goes, turning a flat shape into a spiral ribbon.',
        min: -3,
        max: 3,
        step: 0.05,
        decimals: 2,
        rebuilds: true,
      },
      {
        kind: 'range',
        key: 'reveal',
        only: ['path'],
        label: 'Reveal',
        hint: 'How much of the outline is drawn yet. This is the loading animation — slide it.',
        min: 0,
        max: 1,
        step: 0.005,
        decimals: 3,
      },
      {
        kind: 'range',
        key: 'reliefDepth',
        only: ['image'],
        label: 'Relief depth',
        hint: 'How much the bright parts pop out toward you.',
        min: 0,
        max: 4,
        step: 0.05,
        decimals: 2,
        rebuilds: true,
      },
      {
        kind: 'range',
        key: 'density',
        label: 'Density',
        hint: 'How many dots. Too few and you start seeing gaps.',
        min: 0.35,
        max: 1.7,
        step: 0.05,
        decimals: 2,
        suffix: '×',
        rebuilds: true,
      },
    ],
  },
  {
    title: 'Shading',
    controls: [
      {
        kind: 'select',
        key: 'ramp',
        label: 'Ramp',
        options: RAMP_KEYS.map((k) => ({ value: k, label: RAMP_LABELS[k] })),
      },
      {
        kind: 'choice',
        key: 'invert',
        label: 'Ink',
        hint: 'On a white page the shadows should be the heavy characters, not the highlights.',
        options: [
          { value: false, label: 'Lit = heavy' },
          { value: true, label: 'Lit = light' },
        ],
      },
      {
        kind: 'range',
        key: 'lightY',
        label: 'Light — elevation',
        min: -1.5,
        max: 1.5,
        step: 0.05,
        decimals: 2,
      },
      {
        kind: 'range',
        key: 'lightZ',
        label: 'Light — depth',
        hint: 'Whether the light sits behind you or in front of the shape.',
        min: -1.5,
        max: 1.5,
        step: 0.05,
        decimals: 2,
      },
      {
        kind: 'range',
        key: 'albedoMix',
        only: ['image'],
        label: 'Albedo mix',
        hint: 'Slide left and it looks carved. Slide right and it looks like the photo.',
        min: 0,
        max: 1,
        step: 0.02,
        decimals: 2,
      },
    ],
  },
];

export function visibleControls(group: ControlGroup, p: Params): Control[] {
  return group.controls.filter(
    (c) => (!c.only || c.only.includes(p.source)) && (!c.when || c.when(p)),
  );
}
