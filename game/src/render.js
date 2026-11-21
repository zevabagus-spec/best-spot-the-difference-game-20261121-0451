// Every pixel of Lanternlight Twins: the menu, the two picture panels with
// their found-markers and hint glow, the header and footer HUD, and the
// overlays for pause, level-clear, time-up and hunt-clear. The canvas is the
// whole game; the DOM holds only the buttons and the text HUD, which this
// file refreshes every frame so the two can never disagree.

import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COLORS,
  FONT_FAMILY,
  FOOTER_Y,
  HEADER_HEIGHT,
  LEVEL_TIME_SECONDS,
  PANEL_HEIGHT,
  PANEL_LEFT_X,
  PANEL_RIGHT_X,
  PANEL_WIDTH,
  PANEL_Y,
} from './config.js';
import { LEVELS } from './levels.js';
import {
  SCREEN_HUNT_DONE,
  SCREEN_LEVEL_DONE,
  SCREEN_MENU,
  SCREEN_PAUSED,
  SCREEN_PLAY,
  SCREEN_TIME_UP,
  currentLevel,
  differencesLeft,
} from './game.js';

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function formatTime(seconds) {
  const whole = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(whole / 60)).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`;
}

function drawFoundMarker(ctx, x, y, ageSeconds) {
  const pop = ageSeconds < 0.25 ? 1 + (0.25 - ageSeconds) * 1.6 : 1;
  const radius = 26 * pop;
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 5;
  ctx.shadowColor = 'rgba(255, 209, 102, 0.9)';
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#fff3c4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius - 6, 0, Math.PI * 2);
  ctx.stroke();
  // A small star in the middle of the ring.
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 === 0 ? 9 : 4;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawHintGlow(ctx, x, y, now) {
  const pulse = 1 + 0.12 * Math.sin(now * 6);
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = `rgba(126, 224, 129, ${0.65 + 0.3 * Math.sin(now * 6)})`;
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.arc(0, 0, 30 * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawMissRipple(ctx, x, y, ageSeconds) {
  const progress = ageSeconds / 0.45;
  ctx.save();
  ctx.globalAlpha = 1 - progress;
  ctx.strokeStyle = '#ff6b6b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, 8 + progress * 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawPanel(ctx, game, panelIndex, now) {
  const x = panelIndex === 0 ? PANEL_LEFT_X : PANEL_RIGHT_X;
  const level = currentLevel(game);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
  ctx.clip();
  ctx.translate(x, PANEL_Y);
  level.painter(ctx, panelIndex);
  // Markers for every difference already found, on both panels.
  for (const difference of level.differences) {
    if (!game.found.has(difference.id)) continue;
    const age = now - (game.foundAt[difference.id] ?? now);
    drawFoundMarker(ctx, difference.x, difference.y, age);
  }
  if (game.hintTarget !== null) {
    drawHintGlow(ctx, game.hintTarget.x, game.hintTarget.y, now);
  }
  if (game.missFlash !== null && game.missFlash.panel === panelIndex && now < game.missFlashUntil) {
    drawMissRipple(ctx, game.missFlash.x, game.missFlash.y, 0.45 - (game.missFlashUntil - now));
  }
  ctx.restore();
  // Frame and caption.
  ctx.strokeStyle = COLORS.panelFrame;
  ctx.lineWidth = 4;
  ctx.strokeRect(x, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
  ctx.fillStyle = 'rgba(13, 16, 38, 0.85)';
  ctx.fillRect(x + 8, PANEL_Y + 8, 118, 30);
  ctx.fillStyle = COLORS.headerText;
  ctx.font = `bold 17px ${FONT_FAMILY}`;
  ctx.textAlign = 'left';
  ctx.fillText(panelIndex === 0 ? 'PICTURE A' : 'PICTURE B', x + 18, PANEL_Y + 29);
}

function drawHeader(ctx, game, now) {
  ctx.fillStyle = '#141a38';
  ctx.fillRect(0, 0, CANVAS_WIDTH, HEADER_HEIGHT);
  ctx.fillStyle = COLORS.accent;
  ctx.font = `bold 30px ${FONT_FAMILY}`;
  ctx.textAlign = 'left';
  ctx.fillText('🔦 Lanternlight Twins', 20, 40);
  const level = currentLevel(game);
  ctx.fillStyle = '#b9c2e8';
  ctx.font = `20px ${FONT_FAMILY}`;
  ctx.fillText(`·  ${level.name}`, 330, 39);

  // Timer, centre-right, with a bar underneath.
  const low = game.timeLeft <= 30 && game.screen === SCREEN_PLAY;
  ctx.textAlign = 'right';
  ctx.fillStyle = low && Math.floor(now * 2) % 2 === 0 ? COLORS.danger : COLORS.headerText;
  ctx.font = `bold 30px ${FONT_FAMILY}`;
  ctx.fillText(formatTime(game.timeLeft), 1010, 40);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.fillRect(830, 50, 180, 7);
  ctx.fillStyle = low ? COLORS.danger : COLORS.accent;
  ctx.fillRect(830, 50, 180 * Math.max(0, game.timeLeft / LEVEL_TIME_SECONDS), 7);
  ctx.textAlign = 'left';
}

function drawFooter(ctx, game) {
  ctx.fillStyle = '#141a38';
  ctx.fillRect(0, FOOTER_Y, CANVAS_WIDTH, CANVAS_HEIGHT - FOOTER_Y);
  const left = differencesLeft(game);
  const total = currentLevel(game).differences.length;
  ctx.fillStyle = COLORS.headerText;
  ctx.font = `bold 30px ${FONT_FAMILY}`;
  ctx.textAlign = 'left';
  ctx.fillText(`Differences left:  ${left} / ${total}`, 20, FOOTER_Y + 52);
  // Found pips: a filled lantern for each find, an outline for each one left.
  for (let i = 0; i < total; i += 1) {
    const x = 430 + i * 30;
    const y = FOOTER_Y + 42;
    ctx.fillStyle = i < total - left ? COLORS.accent : 'rgba(255, 255, 255, 0.18)';
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
    if (i >= total - left) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  ctx.textAlign = 'left';
}

function drawOverlayPanel(ctx, title, lines, accent) {
  ctx.fillStyle = 'rgba(10, 13, 32, 0.72)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  const width = 640;
  const height = 150 + lines.length * 38;
  const x = (CANVAS_WIDTH - width) / 2;
  const y = (CANVAS_HEIGHT - height) / 2;
  ctx.fillStyle = '#1b2247';
  roundRect(ctx, x, y, width, height, 18);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = `bold 34px ${FONT_FAMILY}`;
  ctx.textAlign = 'center';
  ctx.fillText(title, CANVAS_WIDTH / 2, y + 58);
  ctx.fillStyle = '#e8ecff';
  ctx.font = `21px ${FONT_FAMILY}`;
  lines.forEach((line, index) => {
    ctx.fillText(line, CANVAS_WIDTH / 2, y + 108 + index * 38);
  });
  ctx.textAlign = 'left';
}

function drawStars(ctx, count, centreX, y) {
  for (let i = 0; i < 3; i += 1) {
    const x = centreX + (i - 1) * 52;
    ctx.fillStyle = i < count ? COLORS.accent : 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    for (let p = 0; p < 10; p += 1) {
      const angle = (p * Math.PI) / 5 - Math.PI / 2;
      const r = p % 2 === 0 ? 20 : 9;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      if (p === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }
}

function drawConfetti(ctx, game) {
  for (const flake of game.confetti) {
    ctx.save();
    ctx.translate(flake.x, flake.y);
    ctx.rotate(flake.spin);
    ctx.fillStyle = flake.colour;
    ctx.fillRect(-flake.size / 2, -flake.size / 4, flake.size, flake.size / 2);
    ctx.restore();
  }
}

function drawMenu(ctx, game) {
  ctx.fillStyle = '#0d1026';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // A quiet harbour glow behind the title.
  const glow = ctx.createRadialGradient(640, 200, 20, 640, 200, 420);
  glow.addColorStop(0, 'rgba(255, 180, 90, 0.16)');
  glow.addColorStop(1, 'rgba(255, 180, 90, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = COLORS.accent;
  ctx.font = `bold 56px ${FONT_FAMILY}`;
  ctx.textAlign = 'center';
  ctx.fillText('🔦 Lanternlight Twins', CANVAS_WIDTH / 2, 118);
  ctx.fillStyle = '#e8ecff';
  ctx.font = `24px ${FONT_FAMILY}`;
  ctx.fillText('A spot-the-difference hunt in three lantern-lit scenes', CANVAS_WIDTH / 2, 158);
  ctx.font = `19px ${FONT_FAMILY}`;
  ctx.fillStyle = '#b9c2e8';
  ctx.fillText('Click a difference in either picture to ring it. 10 per scene. Wrong clicks cost 3 seconds.', CANVAS_WIDTH / 2, 196);
  ctx.fillText('H for a hint (3 per scene) · P pause · R restart · M mute', CANVAS_WIDTH / 2, 224);

  LEVELS.forEach((level, index) => {
    const x = 140 + index * 340;
    const y = 268;
    ctx.fillStyle = '#1b2247';
    roundRect(ctx, x, y, 300, 250, 16);
    ctx.fill();
    ctx.strokeStyle = game.levelIndex === index ? COLORS.accent : '#39406e';
    ctx.lineWidth = game.levelIndex === index ? 3 : 2;
    ctx.stroke();
    ctx.fillStyle = COLORS.headerText;
    ctx.font = `bold 26px ${FONT_FAMILY}`;
    ctx.fillText(`Level ${index + 1}`, x + 150, y + 48);
    ctx.fillStyle = '#e8ecff';
    ctx.font = `bold 22px ${FONT_FAMILY}`;
    ctx.fillText(level.name, x + 150, y + 84);
    ctx.fillStyle = '#b9c2e8';
    ctx.font = `18px ${FONT_FAMILY}`;
    ctx.fillText(level.difficulty, x + 150, y + 114);
    ctx.fillText('10 differences · 3:00', x + 150, y + 142);
    drawStars(ctx, game.stars[index], x + 150, y + 190);
    ctx.fillStyle = COLORS.accent;
    ctx.font = `bold 19px ${FONT_FAMILY}`;
    ctx.fillText(index === 0 ? 'Click a card, or press 1 – 3' : '', x + 150, y + 232);
  });
  ctx.fillStyle = '#8a93b8';
  ctx.font = `17px ${FONT_FAMILY}`;
  ctx.fillText('All art, sound and names are original — drawn and synthesised for this game.', CANVAS_WIDTH / 2, 580);
  ctx.fillText(`Best score so far: ${Math.max(...game.levelScores)}  ·  Total differences: 30`, CANVAS_WIDTH / 2, 610);
  ctx.textAlign = 'left';
}

function refreshHud(game) {
  const setText = (id, text) => {
    const element = document.getElementById(id);
    if (element !== null) element.textContent = text;
  };
  const level = currentLevel(game);
  setText('hud-level', `Level ${game.levelIndex + 1} — ${level.name}`);
  setText('hud-timer', formatTime(game.timeLeft));
  setText('hud-score', `Score ${game.score}`);
  setText('hud-hints', `Hints: ${game.hintsLeft}`);
  setText('hud-counter', `Differences left: ${differencesLeft(game)} / ${level.differences.length}`);
  const toast = document.getElementById('hud-toast');
  if (toast !== null) {
    if (game.foundLabel !== null && game.now < game.foundLabelUntil) {
      toast.textContent = game.foundLabel.text;
      toast.style.opacity = '1';
    } else {
      toast.style.opacity = '0';
    }
  }
  const hintButton = document.getElementById('btn-hint');
  if (hintButton !== null) hintButton.disabled = game.hintsLeft <= 0 || game.screen !== SCREEN_PLAY;
}

/** Draw one frame and refresh the DOM HUD. `now` is seconds since load. */
export function drawFrame(ctx, game, now) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = COLORS.page;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  if (game.screen === SCREEN_MENU) {
    drawMenu(ctx, game);
    refreshHud(game);
    return;
  }
  drawHeader(ctx, game, now);
  drawPanel(ctx, game, 0, now);
  drawPanel(ctx, game, 1, now);
  drawFooter(ctx, game);
  drawConfetti(ctx, game);

  if (game.screen === SCREEN_PAUSED) {
    drawOverlayPanel(ctx, 'Paused', ['Take a breath — the lanterns wait for you.', 'P or Esc to carry on · R to restart the scene'], COLORS.accent);
  } else if (game.screen === SCREEN_LEVEL_DONE) {
    const level = currentLevel(game);
    drawOverlayPanel(ctx, `${level.name} — cleared!`, [
      `You found all ${level.differences.length} differences with ${formatTime(game.timeLeft)} to spare.`,
      'N for the next scene · R to replay it · M for the menu',
    ], COLORS.good);
    drawStars(ctx, game.stars[game.levelIndex], CANVAS_WIDTH / 2, 445);
  } else if (game.screen === SCREEN_TIME_UP) {
    drawOverlayPanel(ctx, 'Out of time!', [
      `${differencesLeft(game)} difference${differencesLeft(game) === 1 ? '' : 's'} still hiding in the dark.`,
      'R to try this scene again · M for the menu',
    ], COLORS.danger);
  } else if (game.screen === SCREEN_HUNT_DONE) {
    const totalStars = game.stars.reduce((a, b) => a + b, 0);
    drawOverlayPanel(ctx, 'The whole hunt is done!', [
      `All 30 differences found. Total score: ${game.score}. Stars: ${totalStars} / 9.`,
      'R to play the hunt again · M for the menu',
    ], COLORS.accent);
    drawStars(ctx, Math.round(totalStars / 3), CANVAS_WIDTH / 2, 445);
  }
  refreshHud(game);
}
