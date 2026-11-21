// The three levels of Lanternlight Twins: each names its scene painter and
// its ten differences. A difference is a point in panel space (610 x 520)
// with a hit radius and a short label shown when it is found. Positions match
// the exact spots the painter in scenes.js changes between the two variants.

import { drawGarden, drawHarbour, drawMarket } from './scenes.js';

export const LEVELS = [
  {
    id: 'harbour',
    name: 'Harbour at Dusk',
    subtitle: 'Lanterns lit, boats in — ten things changed between the twins.',
    difficulty: 'Gentle',
    painter: drawHarbour,
    differences: [
      { id: 'gull', x: 340, y: 95, r: 30, label: 'A gull vanished' },
      { id: 'lighthouse-band', x: 95, y: 235, r: 30, label: 'Lighthouse band repainted' },
      { id: 'boat-flag', x: 430, y: 208, r: 28, label: 'The sailboat lost its flag' },
      { id: 'lantern', x: 545, y: 372, r: 30, label: 'A lantern went dark' },
      { id: 'buoy', x: 480, y: 420, r: 30, label: 'The buoy gained a stripe' },
      { id: 'crate', x: 255, y: 467, r: 30, label: 'An extra crate appeared' },
      { id: 'moon-crater', x: 520, y: 60, r: 34, label: 'The moon lost a crater' },
      { id: 'cat-tail', x: 340, y: 465, r: 30, label: 'The dock cat lowered its tail' },
      { id: 'rope', x: 140, y: 482, r: 28, label: 'A rope coil went missing' },
      { id: 'star', x: 465, y: 40, r: 26, label: 'A star blinked out' },
    ],
  },
  {
    id: 'garden',
    name: 'Moonlit Garden',
    subtitle: 'Koi, fireflies and one folded ear — ten quiet changes.',
    difficulty: 'Tricky',
    painter: drawGarden,
    differences: [
      { id: 'koi', x: 505, y: 410, r: 28, label: 'A koi swam away' },
      { id: 'lantern-window', x: 91, y: 307, r: 28, label: 'The stone lantern went dark' },
      { id: 'maple-branch', x: 560, y: 100, r: 28, label: 'The maple grew a branch' },
      { id: 'firefly', x: 300, y: 200, r: 26, label: 'A firefly went out' },
      { id: 'mushroom-cap', x: 180, y: 420, r: 28, label: 'A mushroom changed colour' },
      { id: 'stepping-stone', x: 300, y: 470, r: 28, label: 'A stepping stone sank' },
      { id: 'bamboo-leaf', x: 168, y: 118, r: 26, label: 'The bamboo sprouted a leaf' },
      { id: 'bridge-plank', x: 390, y: 375, r: 28, label: 'A bridge plank darkened' },
      { id: 'moon', x: 80, y: 60, r: 30, label: 'The moon turned full' },
      { id: 'cat-ear', x: 420, y: 324, r: 28, label: 'The bridge cat folded an ear' },
    ],
  },
  {
    id: 'market',
    name: 'Starlight Market',
    subtitle: 'Stalls, bunting and balloons — ten changes hiding in the crowd.',
    difficulty: 'Sharp-eyed',
    painter: drawMarket,
    differences: [
      { id: 'balloon', x: 160, y: 105, r: 28, label: 'A balloon floated off' },
      { id: 'awning-stripe', x: 287, y: 167, r: 28, label: 'An awning stripe changed colour' },
      { id: 'bunting-flag', x: 390, y: 112, r: 26, label: 'A bunting flag is missing' },
      { id: 'jar', x: 330, y: 318, r: 26, label: 'A jar left the stall' },
      { id: 'paper-lantern', x: 548, y: 222, r: 30, label: 'A paper lantern went dark' },
      { id: 'cart-wheel', x: 515, y: 460, r: 30, label: 'The cart lost a wheel' },
      { id: 'star', x: 500, y: 45, r: 24, label: 'A star blinked out' },
      { id: 'cat', x: 305, y: 125, r: 30, label: 'The market cat slipped away' },
      { id: 'sign-star', x: 130, y: 196, r: 26, label: 'A star appeared on the sign' },
      { id: 'cobble-stone', x: 150, y: 470, r: 28, label: 'A cobble turned violet' },
    ],
  },
];

/** The total differences across the whole hunt. */
export const TOTAL_DIFFERENCES = LEVELS.reduce((sum, level) => sum + level.differences.length, 0);
