import type { RampKey } from './types';

/**
 * Character ramps, ordered dark-to-light in ink terms: index 0 is the lightest
 * mark, the last index is the heaviest. `Params.invert` flips which end a lit
 * surface reaches for, because a black terminal and a white page want opposites.
 */
export const RAMPS: Record<RampKey, string> = {
  classic: '.,-~:;=!*#$@',
  fine: ' .·\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
  blocks: ' ·:-=+*#%@',
  dots: ' .:!/r(l1Z4H9W8$@',
  binary: ' 01',
};

export const RAMP_LABELS: Record<RampKey, string> = {
  classic: 'Classic 12',
  fine: 'Fine 64',
  blocks: 'Blocks',
  dots: 'Dots',
  binary: 'Binary',
};

export const RAMP_KEYS = Object.keys(RAMPS) as RampKey[];
