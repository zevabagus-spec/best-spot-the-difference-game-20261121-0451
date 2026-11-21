// Mouse and keyboard input for Lanternlight Twins. Pointer coordinates are
// mapped from the page into canvas space (the canvas is fixed at 1280 x 720
// and CSS-scaled), then into the panel the click landed in. Clicks outside
// both panels are ignored, never punished.

import { CANVAS_HEIGHT, CANVAS_WIDTH, PANEL_HEIGHT, PANEL_LEFT_X, PANEL_RIGHT_X, PANEL_Y } from './config.js';
import {
  SCREEN_HUNT_DONE,
  SCREEN_LEVEL_DONE,
  SCREEN_MENU,
  SCREEN_PAUSED,
  SCREEN_PLAY,
  SCREEN_TIME_UP,
  backToMenu,
  clickAt,
  nextLevel,
  pauseGame,
  restartLevel,
  resumeGame,
  startLevel,
  useHint,
} from './game.js';
import { ensureAudio, toggleMute } from './audio.js';

function panelHit(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
  const y = ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
  if (y < PANEL_Y || y > PANEL_Y + PANEL_HEIGHT) return null;
  if (x >= PANEL_LEFT_X && x <= PANEL_LEFT_X + 610) return { panel: 0, x: x - PANEL_LEFT_X, y: y - PANEL_Y };
  if (x >= PANEL_RIGHT_X && x <= PANEL_RIGHT_X + 610) return { panel: 1, x: x - PANEL_RIGHT_X, y: y - PANEL_Y };
  return null;
}

function menuHit(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
  const y = ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
  if (y < 268 || y > 518) return -1;
  for (let i = 0; i < 3; i += 1) {
    const cardX = 140 + i * 340;
    if (x >= cardX && x <= cardX + 300) return i;
  }
  return -1;
}

export function attachInput(canvas, game, nowSeconds) {
  canvas.addEventListener('pointerdown', (event) => {
    ensureAudio();
    const now = nowSeconds();
    if (game.screen === SCREEN_MENU) {
      const card = menuHit(canvas, event);
      if (card >= 0) startLevel(game, card);
      return;
    }
    const hit = panelHit(canvas, event);
    if (hit !== null) clickAt(game, hit.panel, hit.x, hit.y, now);
  });

  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const now = nowSeconds();
    if (key === 'm') {
      const muted = toggleMute();
      const button = document.getElementById('btn-mute');
      if (button !== null) button.textContent = muted ? 'Unmute (M)' : 'Mute (M)';
      return;
    }
    if (game.screen === SCREEN_MENU) {
      if (key === '1' || key === '2' || key === '3') startLevel(game, Number(key) - 1);
      return;
    }
    if (key === 'h') {
      useHint(game, now);
    } else if (key === 'p' || key === 'escape') {
      if (game.screen === SCREEN_PLAY) pauseGame(game);
      else if (game.screen === SCREEN_PAUSED) resumeGame(game);
    } else if (key === 'r') {
      if (game.screen === SCREEN_PLAY || game.screen === SCREEN_PAUSED
        || game.screen === SCREEN_TIME_UP || game.screen === SCREEN_LEVEL_DONE
        || game.screen === SCREEN_HUNT_DONE) restartLevel(game);
    } else if (key === 'n') {
      if (game.screen === SCREEN_LEVEL_DONE) nextLevel(game);
    } else if (key === 'escape' || key === 'q') {
      backToMenu(game);
    }
  });

  const wireButton = (id, handler) => {
    const button = document.getElementById(id);
    if (button !== null) button.addEventListener('click', () => { ensureAudio(); handler(); });
  };
  wireButton('btn-hint', () => useHint(game, nowSeconds()));
  wireButton('btn-pause', () => {
    if (game.screen === SCREEN_PLAY) pauseGame(game);
    else if (game.screen === SCREEN_PAUSED) resumeGame(game);
  });
  wireButton('btn-restart', () => restartLevel(game));
  wireButton('btn-menu', () => backToMenu(game));
  wireButton('btn-mute', () => {
    const muted = toggleMute();
    const button = document.getElementById('btn-mute');
    if (button !== null) button.textContent = muted ? 'Unmute (M)' : 'Mute (M)';
  });
}
