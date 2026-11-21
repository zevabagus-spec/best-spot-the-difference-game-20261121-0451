// Deterministic screenshot scenes behind ?shot=cover|garden|market|win.
// Each one stages a real game state — no faked pixels: it starts the level,
// marks the found differences a player would have rung, sets the score and
// the clock, then freezes — so the frame is exactly what a short session
// looks like, and the same shot always gives the same frame. Unknown names
// fall back to the title menu.

import { SCREEN_LEVEL_DONE, SCREEN_MENU, SCREEN_PLAY, startLevel } from './game.js';

/**
 * Stage `game` for the named shot and return the screen to draw. `now` is the
 * frozen clock (seconds) the frame is rendered at.
 */
export function stageShot(name, game, now) {
  const markFound = (ids) => {
    for (const id of ids) {
      game.found.add(id);
      game.foundAt[id] = now - 2;
    }
  };
  if (name === 'cover') {
    // Harbour, mid-hunt: four found (rings visible), six still hiding.
    startLevel(game, 0);
    markFound(['gull', 'lighthouse-band', 'boat-flag', 'lantern']);
    game.score = 430;
    game.combo = 4;
    game.timeLeft = 151;
    game.lastTickSecond = 151;
    return SCREEN_PLAY;
  }
  if (name === 'garden') {
    // Garden, five found, five left, clock running low: time pressure visible.
    startLevel(game, 1);
    markFound(['koi', 'lantern-window', 'maple-branch', 'firefly', 'mushroom-cap']);
    game.score = 560;
    game.combo = 2;
    game.hintsLeft = 2;
    game.timeLeft = 72;
    game.lastTickSecond = 72;
    return SCREEN_PLAY;
  }
  if (name === 'market') {
    // Market, early hunt: two found, eight left, fresh clock.
    startLevel(game, 2);
    markFound(['balloon', 'awning-stripe']);
    game.score = 210;
    game.combo = 2;
    game.timeLeft = 178;
    game.lastTickSecond = 178;
    return SCREEN_PLAY;
  }
  if (name === 'win') {
    // Harbour cleared: all ten found, stars and confetti over the panels.
    startLevel(game, 0);
    markFound(['gull', 'lighthouse-band', 'boat-flag', 'lantern', 'buoy', 'crate',
      'moon-crater', 'cat-tail', 'rope', 'star']);
    game.score = 1150;
    game.timeLeft = 96;
    game.lastTickSecond = 96;
    game.stars[0] = 3;
    game.screen = SCREEN_LEVEL_DONE;
    game.confetti = [];
    for (let i = 0; i < 60; i += 1) {
      game.confetti.push({
        x: 140 + ((i * 173) % 1000),
        y: 60 + ((i * 97) % 480),
        vx: 0,
        vy: 0,
        size: 5 + (i % 4) * 2,
        colour: ['#ffd166', '#e05252', '#7ee081', '#4f8ad9', '#e08ad9'][i % 5],
        spin: (i % 7) * 0.9,
        spinSpeed: 0,
      });
    }
    return SCREEN_LEVEL_DONE;
  }
  game.screen = SCREEN_MENU;
  return SCREEN_MENU;
}
