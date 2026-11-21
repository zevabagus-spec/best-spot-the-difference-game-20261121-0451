// Shared constants for Lanternlight Twins: layout, timing, scoring and palette.
// One job only: every tunable number lives here so the rest of the game reads it.

export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;

// The two picture panels, side by side. Each panel shows the same scene in a
// 610 x 520 box; the header holds the title and timer, the footer the counter.
export const PANEL_WIDTH = 610;
export const PANEL_HEIGHT = 520;
export const PANEL_Y = 76;
export const PANEL_LEFT_X = 20;
export const PANEL_RIGHT_X = 650;
export const HEADER_HEIGHT = 64;
export const FOOTER_Y = 612;

export const LEVEL_TIME_SECONDS = 180;
export const WRONG_CLICK_TIME_PENALTY = 3;
export const HINTS_PER_LEVEL = 3;
export const HINT_POINTS_COST = 50;
export const HINT_GLOW_SECONDS = 3;
export const BASE_FIND_POINTS = 100;
export const COMBO_STEP = 0.1;
export const COMBO_MAX = 2.0;

// A click counts as a find when it lands this close (panel pixels) to a
// difference that is still unfound.
export const FIND_RADIUS = 34;

export const FONT_FAMILY = "'Trebuchet MS', 'Segoe UI', Verdana, sans-serif";

export const COLORS = {
  page: '#0d1026',
  panelFrame: '#f4c95d',
  panelFrameDark: '#8a6d2f',
  headerText: '#ffe9a8',
  accent: '#ffd166',
  danger: '#ff6b6b',
  good: '#7ee081',
  ink: '#1d2333',
};
