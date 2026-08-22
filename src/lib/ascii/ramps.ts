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

/**
 * Directional characters for cells that sit on a strong edge.
 *
 * Indexed [direction][brightness band]. Direction 0 is unused — it means no
 * edge. At the light end every direction collapses to a dot: there is not
 * enough ink left to convey structure.
 *
 * Same table as the AsciiGallery converter, which is where the convention
 * comes from.
 */
export const EDGE_CHARS: readonly (readonly string[])[] = [
  [],
  ['|', '|', 'l', 'i', '.'], // 1 vertical
  ['=', '=', '-', '~', '.'], // 2 horizontal
  ['/', '/', 'r', "'", '.'], // 3 diagonal /
  ['\\', '%', 'k', '`', '.'], // 4 diagonal \\
];

export const EDGE_CHAR_CODES: readonly Uint16Array[] = EDGE_CHARS.map(
  (row) => new Uint16Array(row.map((ch) => ch.charCodeAt(0))),
);

/**
 * atan2 gives an angle; this collapses it into the four directions a monospace
 * grid can actually draw. Index is the eighth-turn sector.
 */
export const DIR_MAP: readonly number[] = [2, 2, 4, 1, 1, 1, 3, 2];
