// The state machine of Lanternlight Twins: screens, scoring, the timer,
// hints and click resolution. It knows nothing about pixels — render.js draws
// whatever state this holds — and nothing about the DOM except through the
// callbacks input.js wires up.

import {
  BASE_FIND_POINTS,
  COMBO_MAX,
  COMBO_STEP,
  FIND_RADIUS,
  HINTS_PER_LEVEL,
  HINT_GLOW_SECONDS,
  HINT_POINTS_COST,
  LEVEL_TIME_SECONDS,
  WRONG_CLICK_TIME_PENALTY,
} from './config.js';
import { LEVELS } from './levels.js';
import {
  ensureAudio,
  playFoundChime,
  playHintShimmer,
  playLevelFanfare,
  playMissBuzz,
  playTick,
} from './audio.js';

export const SCREEN_MENU = 'menu';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_LEVEL_DONE = 'level-done';
export const SCREEN_TIME_UP = 'time-up';
export const SCREEN_HUNT_DONE = 'hunt-done';

export function createGame() {
  return {
    screen: SCREEN_MENU,
    levelIndex: 0,
    found: new Set(),
    foundAt: {},
    score: 0,
    combo: 0,
    hintsLeft: HINTS_PER_LEVEL,
    hintTarget: null,
    hintUntil: 0,
    timeLeft: LEVEL_TIME_SECONDS,
    lastTickSecond: LEVEL_TIME_SECONDS,
    stars: [0, 0, 0],
    levelScores: [0, 0, 0],
    foundLabel: null,
    foundLabelUntil: 0,
    missFlash: null,
    missFlashUntil: 0,
    confetti: [],
    now: 0,
  };
}

export function currentLevel(game) {
  return LEVELS[game.levelIndex];
}

export function differencesLeft(game) {
  return currentLevel(game).differences.length - game.found.size;
}

export function startLevel(game, levelIndex) {
  game.levelIndex = levelIndex;
  game.found = new Set();
  game.foundAt = {};
  game.combo = 0;
  game.hintsLeft = HINTS_PER_LEVEL;
  game.hintTarget = null;
  game.timeLeft = LEVEL_TIME_SECONDS;
  game.lastTickSecond = LEVEL_TIME_SECONDS;
  game.foundLabel = null;
  game.missFlash = null;
  game.confetti = [];
  game.screen = SCREEN_PLAY;
}

/** Stars for a cleared level: 3 with a minute or more left, else 2, else 1. */
export function starsForTimeLeft(timeLeft) {
  if (timeLeft >= 60) return 3;
  if (timeLeft >= 20) return 2;
  return 1;
}

function spawnConfetti(game) {
  game.confetti = [];
  for (let i = 0; i < 90; i += 1) {
    game.confetti.push({
      x: 140 + Math.random() * 1000,
      y: -20 - Math.random() * 160,
      vx: (Math.random() - 0.5) * 60,
      vy: 90 + Math.random() * 140,
      size: 5 + Math.random() * 7,
      colour: ['#ffd166', '#e05252', '#7ee081', '#4f8ad9', '#e08ad9'][i % 5],
      spin: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 8,
    });
  }
}

function finishLevel(game) {
  const earned = starsForTimeLeft(game.timeLeft);
  game.stars[game.levelIndex] = Math.max(game.stars[game.levelIndex], earned);
  game.levelScores[game.levelIndex] = game.score;
  spawnConfetti(game);
  playLevelFanfare();
  game.screen = game.levelIndex === LEVELS.length - 1 ? SCREEN_HUNT_DONE : SCREEN_LEVEL_DONE;
}

/** Advance the clock by `dt` seconds; only the play screen ticks. */
export function tickGame(game, dt, now) {
  game.now = now;
  if (game.screen !== SCREEN_PLAY) return;
  game.timeLeft = Math.max(0, game.timeLeft - dt);
  const whole = Math.ceil(game.timeLeft);
  if (whole !== game.lastTickSecond) {
    game.lastTickSecond = whole;
    if (whole <= 10 && whole > 0) playTick();
  }
  if (game.hintTarget !== null && now > game.hintUntil) game.hintTarget = null;
  if (game.timeLeft <= 0) {
    game.screen = SCREEN_TIME_UP;
    game.combo = 0;
  }
  for (const flake of game.confetti) {
    flake.x += flake.vx * dt;
    flake.y += flake.vy * dt;
    flake.spin += flake.spinSpeed * dt;
  }
  game.confetti = game.confetti.filter((flake) => flake.y < 760);
}

/**
 * Resolve a click at panel coordinates (`panel` 0 = left, 1 = right).
 * Returns 'found' | 'already' | 'miss' | 'ignored'.
 */
export function clickAt(game, panel, x, y, now) {
  if (game.screen !== SCREEN_PLAY) return 'ignored';
  ensureAudio();
  const level = currentLevel(game);
  let best = null;
  let bestDistance = Infinity;
  for (const difference of level.differences) {
    if (game.found.has(difference.id)) continue;
    const distance = Math.hypot(difference.x - x, difference.y - y);
    if (distance <= FIND_RADIUS && distance < bestDistance) {
      best = difference;
      bestDistance = distance;
    }
  }
  if (best === null) {
    // A click on a difference already found is a no-op, never a penalty:
    // the player is re-checking a ring they already earned.
    for (const difference of level.differences) {
      if (!game.found.has(difference.id)) continue;
      if (Math.hypot(difference.x - x, difference.y - y) <= FIND_RADIUS) return 'already';
    }
    const inside = x >= 0 && x <= 610 && y >= 0 && y <= 520;
    if (!inside) return 'ignored';
    game.combo = 0;
    game.timeLeft = Math.max(0, game.timeLeft - WRONG_CLICK_TIME_PENALTY);
    game.missFlash = { panel, x, y };
    game.missFlashUntil = now + 0.45;
    playMissBuzz();
    return 'miss';
  }
  game.found.add(best.id);
  game.foundAt[best.id] = now;
  game.combo += 1;
  const multiplier = Math.min(COMBO_MAX, 1 + (game.combo - 1) * COMBO_STEP);
  const points = Math.round(BASE_FIND_POINTS * multiplier);
  game.score += points;
  game.foundLabel = { text: `${best.label}  +${points}`, points };
  game.foundLabelUntil = now + 1.6;
  playFoundChime();
  if (game.found.size === level.differences.length) finishLevel(game);
  return 'found';
}

/** Spend a hint: pulse a ring around one unfound difference for a few seconds. */
export function useHint(game, now) {
  if (game.screen !== SCREEN_PLAY) return false;
  if (game.hintsLeft <= 0) return false;
  const level = currentLevel(game);
  const remaining = level.differences.filter((d) => !game.found.has(d.id));
  if (remaining.length === 0) return false;
  game.hintsLeft -= 1;
  game.score = Math.max(0, game.score - HINT_POINTS_COST);
  game.hintTarget = remaining[Math.floor(Math.random() * remaining.length)];
  game.hintUntil = now + HINT_GLOW_SECONDS;
  playHintShimmer();
  return true;
}

export function pauseGame(game) {
  if (game.screen === SCREEN_PLAY) game.screen = SCREEN_PAUSED;
}

export function resumeGame(game) {
  if (game.screen === SCREEN_PAUSED) game.screen = SCREEN_PLAY;
}

export function restartLevel(game) {
  startLevel(game, game.levelIndex);
}

export function nextLevel(game) {
  if (game.levelIndex < LEVELS.length - 1) startLevel(game, game.levelIndex + 1);
}

export function backToMenu(game) {
  game.screen = SCREEN_MENU;
  game.confetti = [];
}
