// Bootstrap for Lanternlight Twins: create the game, wire input, and run the
// frame loop. A ?shot=cover|garden|market|win query stages a deterministic
// screenshot scene instead of the live game (see shots.js); without one the
// menu opens and the player starts the hunt.

import { CANVAS_HEIGHT, CANVAS_WIDTH } from './config.js';
import { createGame, tickGame } from './game.js';
import { attachInput } from './input.js';
import { drawFrame } from './render.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const game = createGame();
const startedAt = performance.now();
const nowSeconds = () => (performance.now() - startedAt) / 1000;

const params = new URLSearchParams(window.location.search);
const shotName = params.get('shot');
const frozen = shotName !== null;

if (frozen) {
  // Screenshot scenes render one frozen frame: no loop, no ticking clock.
  stageShot(shotName, game, 10);
  game.now = 10;
  drawFrame(context, game, 10);
} else {
  attachInput(canvas, game, nowSeconds);
  let last = performance.now();
  const loop = (timestamp) => {
    const dt = Math.min(0.1, (timestamp - last) / 1000);
    last = timestamp;
    tickGame(game, dt, nowSeconds());
    drawFrame(context, game, nowSeconds());
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

// Announce state changes for screen readers, without ever showing the line.
const status = document.getElementById('status');
let lastScreen = game.screen;
setInterval(() => {
  if (game.screen !== lastScreen) {
    lastScreen = game.screen;
    if (status !== null) status.textContent = `Lanternlight Twins: ${game.screen}. Score ${game.score}.`;
  }
}, 500);
