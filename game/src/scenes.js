// The three hand-drawn scenes of Lanternlight Twins. Each painter draws one
// picture into a 610 x 520 panel; `variant` 0 is the original (left panel) and
// 1 is the altered twin (right panel). The ten differences of a level are the
// small `if (variant === 1)` branches inside its painter, keyed by the same ids
// levels.js lists, so the art and the answer key can never drift apart.
// No images, no fonts, no network: every shape is canvas paint.

import { makeSeededRandom, scatterPoints } from './random.js';

function skyGradient(ctx, top, middle, bottom, horizonY) {
  const gradient = ctx.createLinearGradient(0, 0, 0, horizonY);
  gradient.addColorStop(0, top);
  gradient.addColorStop(0.7, middle);
  gradient.addColorStop(1, bottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 610, horizonY);
}

function starField(ctx, seed, count, maxY) {
  const random = makeSeededRandom(seed);
  const stars = scatterPoints(random, 10, 8, 590, maxY, count, 26);
  for (const star of stars) {
    const size = 1 + random() * 1.8;
    ctx.fillStyle = `rgba(255, 244, 200, ${0.5 + random() * 0.5})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function moonDisc(ctx, x, y, radius, cratered) {
  const glow = ctx.createRadialGradient(x, y, radius * 0.4, x, y, radius * 2.4);
  glow.addColorStop(0, 'rgba(255, 240, 180, 0.35)');
  glow.addColorStop(1, 'rgba(255, 240, 180, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(x - radius * 2.4, y - radius * 2.4, radius * 4.8, radius * 4.8);
  ctx.fillStyle = '#ffeec0';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  if (cratered) {
    ctx.fillStyle = 'rgba(210, 180, 120, 0.7)';
    ctx.beginPath();
    ctx.arc(x - radius * 0.35, y - radius * 0.2, radius * 0.18, 0, Math.PI * 2);
    ctx.arc(x + radius * 0.3, y + radius * 0.25, radius * 0.13, 0, Math.PI * 2);
    ctx.fill();
  }
}

function gull(ctx, x, y, scale) {
  ctx.strokeStyle = '#1d2333';
  ctx.lineWidth = 2.4 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 11 * scale, y);
  ctx.quadraticCurveTo(x - 4 * scale, y - 7 * scale, x, y);
  ctx.quadraticCurveTo(x + 4 * scale, y - 7 * scale, x + 11 * scale, y);
  ctx.stroke();
}

function cloudPuff(ctx, x, y, scale, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.arc(x, y, 16 * scale, 0, Math.PI * 2);
  ctx.arc(x + 18 * scale, y + 3 * scale, 13 * scale, 0, Math.PI * 2);
  ctx.arc(x - 18 * scale, y + 4 * scale, 12 * scale, 0, Math.PI * 2);
  ctx.fill();
}

function lanternPost(ctx, x, y, lit) {
  ctx.fillStyle = '#2c2417';
  ctx.fillRect(x - 3, y - 52, 6, 52);
  ctx.fillStyle = '#3a2f1d';
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 52);
  ctx.lineTo(x + 10, y - 52);
  ctx.lineTo(x + 6, y - 66);
  ctx.lineTo(x - 6, y - 66);
  ctx.closePath();
  ctx.fill();
  if (lit) {
    const glow = ctx.createRadialGradient(x, y - 58, 2, x, y - 58, 30);
    glow.addColorStop(0, 'rgba(255, 200, 90, 0.55)');
    glow.addColorStop(1, 'rgba(255, 200, 90, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - 30, y - 88, 60, 60);
    ctx.fillStyle = '#ffd166';
  } else {
    ctx.fillStyle = '#5c5344';
  }
  ctx.fillRect(x - 6, y - 64, 12, 12);
}

/** Level 1 — Harbour at Dusk. Differences: gull, lighthouse-band, boat-flag,
 *  lantern, buoy, crate, moon-crater, cat-tail, rope, star. */
export function drawHarbour(ctx, variant) {
  skyGradient(ctx, '#1b2350', '#4a3a72', '#e07a4f', 300);
  starField(ctx, 11, 34, 150);
  moonDisc(ctx, 520, 60, 34, variant === 0);
  if (variant === 0) {
    ctx.fillStyle = '#fff4c8';
    ctx.beginPath();
    ctx.arc(465, 40, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }
  cloudPuff(ctx, 180, 90, 1.1, 'rgba(255, 190, 150, 0.35)');
  cloudPuff(ctx, 430, 150, 0.9, 'rgba(255, 190, 150, 0.28)');

  // Sea.
  const sea = ctx.createLinearGradient(0, 300, 0, 520);
  sea.addColorStop(0, '#2c4a6e');
  sea.addColorStop(1, '#16283f');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 300, 610, 220);
  ctx.strokeStyle = 'rgba(255, 200, 130, 0.35)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i += 1) {
    const y = 322 + i * 26;
    ctx.beginPath();
    ctx.moveTo(20 + i * 30, y);
    ctx.quadraticCurveTo(120 + i * 40, y - 6, 260 + i * 30, y);
    ctx.quadraticCurveTo(420 + i * 20, y + 5, 580, y - 3);
    ctx.stroke();
  }

  // Lighthouse, left, with its beam.
  ctx.fillStyle = 'rgba(255, 230, 140, 0.16)';
  ctx.beginPath();
  ctx.moveTo(95, 150);
  ctx.lineTo(300, 105);
  ctx.lineTo(300, 185);
  ctx.lineTo(95, 170);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e8e0d0';
  ctx.fillRect(72, 150, 46, 170);
  ctx.fillStyle = '#c94f4f';
  ctx.fillRect(72, 150, 46, 34);
  ctx.fillStyle = variant === 0 ? '#c94f4f' : '#e8e0d0';
  ctx.fillRect(72, 218, 46, 34);
  ctx.fillStyle = '#c94f4f';
  ctx.fillRect(72, 286, 46, 34);
  ctx.fillStyle = '#2c2417';
  ctx.fillRect(66, 138, 58, 14);
  ctx.fillStyle = '#ffd166';
  ctx.fillRect(80, 118, 30, 20);
  ctx.fillStyle = '#2c2417';
  ctx.beginPath();
  ctx.moveTo(74, 118);
  ctx.lineTo(116, 118);
  ctx.lineTo(108, 104);
  ctx.lineTo(82, 104);
  ctx.closePath();
  ctx.fill();

  // Sailboat with a flag, mid-sea.
  ctx.fillStyle = '#7a4a2b';
  ctx.beginPath();
  ctx.moveTo(375, 330);
  ctx.lineTo(455, 330);
  ctx.lineTo(440, 352);
  ctx.lineTo(390, 352);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2c2417';
  ctx.fillRect(412, 200, 5, 132);
  ctx.fillStyle = '#f5ead2';
  ctx.beginPath();
  ctx.moveTo(417, 210);
  ctx.lineTo(417, 320);
  ctx.lineTo(368, 320);
  ctx.closePath();
  ctx.fill();
  if (variant === 0) {
    ctx.fillStyle = '#e05252';
    ctx.beginPath();
    ctx.moveTo(417, 200);
    ctx.lineTo(445, 208);
    ctx.lineTo(417, 218);
    ctx.closePath();
    ctx.fill();
  }

  // Rowboat.
  ctx.fillStyle = '#5b7a4a';
  ctx.beginPath();
  ctx.moveTo(225, 385);
  ctx.lineTo(285, 385);
  ctx.lineTo(272, 400);
  ctx.lineTo(238, 400);
  ctx.closePath();
  ctx.fill();

  // Buoy with stripes.
  ctx.fillStyle = '#e05252';
  ctx.beginPath();
  ctx.arc(480, 420, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f5ead2';
  ctx.fillRect(464, 412, 32, 6);
  if (variant === 1) ctx.fillRect(464, 424, 32, 6);
  ctx.fillStyle = '#2c2417';
  ctx.fillRect(478, 396, 4, 10);

  // Gulls: three in the original, two in the twin.
  gull(ctx, 280, 70, 1);
  gull(ctx, 390, 60, 0.9);
  if (variant === 0) gull(ctx, 340, 95, 0.85);

  // Wooden dock across the bottom.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(0, 430, 610, 90);
  ctx.fillStyle = '#7d5a38';
  for (let y = 430; y < 520; y += 22) ctx.fillRect(0, y, 610, 3);
  ctx.strokeStyle = 'rgba(40, 25, 10, 0.6)';
  ctx.lineWidth = 2;
  for (let x = 60; x < 610; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x, 430);
    ctx.lineTo(x, 520);
    ctx.stroke();
  }

  // Crates: two in the original, three in the twin.
  ctx.fillStyle = '#a8763e';
  ctx.fillRect(168, 448, 34, 34);
  ctx.fillRect(206, 456, 30, 26);
  ctx.strokeStyle = '#6b4a2f';
  ctx.lineWidth = 2;
  ctx.strokeRect(168, 448, 34, 34);
  ctx.strokeRect(206, 456, 30, 26);
  if (variant === 1) {
    ctx.fillStyle = '#a8763e';
    ctx.fillRect(240, 452, 30, 30);
    ctx.strokeRect(240, 452, 30, 30);
  }

  // Lantern posts: the right one burns in the original, dark in the twin.
  lanternPost(ctx, 60, 430, true);
  lanternPost(ctx, 545, 430, variant === 0);

  // Rope coil: present in the original only.
  if (variant === 0) {
    ctx.strokeStyle = '#c9a86a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(140, 482, 14, 0, Math.PI * 2);
    ctx.arc(140, 482, 8, 0, Math.PI * 2);
    ctx.stroke();
  }

  // The dock cat, tail up in the original, tail down in the twin.
  ctx.fillStyle = '#3a3a4a';
  ctx.beginPath();
  ctx.ellipse(330, 472, 16, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(330, 452, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(323, 444);
  ctx.lineTo(326, 434);
  ctx.lineTo(330, 443);
  ctx.moveTo(337, 444);
  ctx.lineTo(340, 434);
  ctx.lineTo(342, 443);
  ctx.fill();
  ctx.strokeStyle = '#3a3a4a';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (variant === 0) {
    ctx.moveTo(346, 470);
    ctx.quadraticCurveTo(360, 462, 356, 446);
  } else {
    ctx.moveTo(346, 472);
    ctx.quadraticCurveTo(358, 480, 352, 488);
  }
  ctx.stroke();
}

/** Level 2 — Moonlit Garden. Differences: koi, lantern-window, maple-branch,
 *  firefly, mushroom-cap, stepping-stone, bamboo-leaf, bridge-plank, moon,
 *  cat-ear. */
export function drawGarden(ctx, variant) {
  skyGradient(ctx, '#0e2418', '#1d4a2e', '#3f7a4a', 260);
  starField(ctx, 22, 30, 130);
  moonDisc(ctx, 80, 60, 30, variant === 1);
  if (variant === 0) {
    ctx.fillStyle = '#0e2418';
    ctx.beginPath();
    ctx.arc(92, 52, 26, 0, Math.PI * 2);
    ctx.fill();
  }
  cloudPuff(ctx, 300, 70, 1, 'rgba(200, 230, 200, 0.22)');
  cloudPuff(ctx, 480, 120, 0.8, 'rgba(200, 230, 200, 0.18)');

  // Grass.
  const grass = ctx.createLinearGradient(0, 260, 0, 520);
  grass.addColorStop(0, '#2e6b3a');
  grass.addColorStop(1, '#173d22');
  ctx.fillStyle = grass;
  ctx.fillRect(0, 260, 610, 260);

  // Bamboo, back left.
  ctx.strokeStyle = '#4a8a3f';
  ctx.lineWidth = 7;
  for (const x of [120, 145, 168]) {
    ctx.beginPath();
    ctx.moveTo(x, 300);
    ctx.lineTo(x + 6, 130);
    ctx.stroke();
  }
  ctx.fillStyle = '#5da24e';
  ctx.beginPath();
  ctx.ellipse(150, 105, 16, 7, -0.5, 0, Math.PI * 2);
  ctx.ellipse(128, 150, 13, 6, 0.4, 0, Math.PI * 2);
  ctx.fill();
  if (variant === 1) {
    ctx.beginPath();
    ctx.ellipse(168, 118, 14, 6, 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Maple tree, right.
  ctx.fillStyle = '#4a2f1d';
  ctx.fillRect(516, 170, 14, 130);
  ctx.fillStyle = '#c94f4f';
  for (const [x, y, r] of [[500, 140, 34], [545, 130, 30], [525, 105, 28], [480, 165, 22], [560, 165, 24]]) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  if (variant === 1) {
    ctx.fillStyle = '#c94f4f';
    ctx.beginPath();
    ctx.arc(560, 100, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pond, bottom right.
  const pond = ctx.createRadialGradient(470, 430, 10, 470, 430, 150);
  pond.addColorStop(0, '#2a6a8a');
  pond.addColorStop(1, '#123a52');
  ctx.fillStyle = pond;
  ctx.beginPath();
  ctx.ellipse(470, 430, 132, 72, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(180, 230, 255, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(470, 430, 110, 56, 0, 0.2, Math.PI * 0.8);
  ctx.stroke();

  // Koi: three in the original, two in the twin.
  const koi = [[430, 420, '#ff8c42'], [490, 445, '#f5ead2'], [505, 410, '#ff8c42']];
  for (let i = 0; i < (variant === 0 ? 3 : 2); i += 1) {
    const [x, y, colour] = koi[i];
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.ellipse(x, y, 16, 7, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 14, y);
    ctx.lineTo(x - 24, y - 6);
    ctx.lineTo(x - 24, y + 6);
    ctx.closePath();
    ctx.fill();
  }

  // Wooden bridge over the pond.
  ctx.fillStyle = '#7a4a2b';
  ctx.beginPath();
  ctx.moveTo(330, 400);
  ctx.quadraticCurveTo(390, 340, 450, 395);
  ctx.lineTo(450, 412);
  ctx.quadraticCurveTo(390, 360, 330, 415);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = variant === 0 ? '#a8763e' : '#8a5a30';
  ctx.fillRect(382, 362, 16, 26);
  ctx.fillStyle = '#a8763e';
  ctx.fillRect(352, 378, 14, 24);
  ctx.fillRect(412, 378, 14, 24);

  // The bridge cat: both ears in the original, one folded in the twin.
  ctx.fillStyle = '#e8e0d0';
  ctx.beginPath();
  ctx.ellipse(415, 348, 13, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(415, 333, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(409, 327);
  ctx.lineTo(411, 318);
  ctx.lineTo(415, 325);
  if (variant === 0) {
    ctx.moveTo(421, 327);
    ctx.lineTo(424, 318);
    ctx.lineTo(426, 326);
  } else {
    ctx.moveTo(420, 326);
    ctx.lineTo(426, 322);
    ctx.lineTo(427, 328);
  }
  ctx.fill();

  // Stone lantern, left.
  ctx.fillStyle = '#8a8a7a';
  ctx.fillRect(78, 330, 26, 60);
  ctx.fillRect(70, 318, 42, 12);
  ctx.fillRect(74, 296, 34, 22);
  ctx.fillStyle = variant === 0 ? '#ffd166' : '#3a3a34';
  ctx.fillRect(82, 300, 18, 14);
  ctx.fillStyle = '#8a8a7a';
  ctx.beginPath();
  ctx.moveTo(68, 296);
  ctx.lineTo(114, 296);
  ctx.lineTo(104, 282);
  ctx.lineTo(78, 282);
  ctx.closePath();
  ctx.fill();
  if (variant === 0) {
    const glow = ctx.createRadialGradient(91, 307, 2, 91, 307, 34);
    glow.addColorStop(0, 'rgba(255, 200, 90, 0.4)');
    glow.addColorStop(1, 'rgba(255, 200, 90, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(57, 273, 68, 68);
  }

  // Mushrooms.
  ctx.fillStyle = '#e8e0d0';
  ctx.fillRect(176, 424, 7, 18);
  ctx.fillRect(198, 428, 6, 14);
  ctx.fillStyle = variant === 0 ? '#d94f4f' : '#4f8ad9';
  ctx.beginPath();
  ctx.arc(180, 424, 13, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#d94f4f';
  ctx.beginPath();
  ctx.arc(201, 428, 10, Math.PI, 0);
  ctx.fill();

  // Stepping stones: four in the original, three in the twin.
  ctx.fillStyle = '#9a9a8a';
  for (const [x, y] of [[220, 470], [260, 452], [340, 452]]) {
    ctx.beginPath();
    ctx.ellipse(x, y, 20, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (variant === 0) {
    ctx.beginPath();
    ctx.ellipse(300, 470, 20, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Fireflies at fixed spots: the one at (300, 200) is missing in the twin.
  const fireflySpots = [
    [230, 300], [265, 340], [300, 200], [330, 310], [370, 290],
    [410, 350], [440, 310],
  ];
  for (const [fx, fy] of fireflySpots) {
    if (variant === 1 && fx === 300 && fy === 200) continue;
    const glow = ctx.createRadialGradient(fx, fy, 1, fx, fy, 12);
    glow.addColorStop(0, 'rgba(220, 255, 140, 0.9)');
    glow.addColorStop(1, 'rgba(220, 255, 140, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(fx - 12, fy - 12, 24, 24);
    ctx.fillStyle = '#eaff8a';
    ctx.beginPath();
    ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Level 3 — Starlight Market. Differences: balloon, awning-stripe,
 *  bunting-flag, jar, paper-lantern, cart-wheel, star, cat, sign-star,
 *  cobble-stone. */
export function drawMarket(ctx, variant) {
  skyGradient(ctx, '#1a1440', '#3a2a6e', '#7a4a8a', 200);
  starField(ctx, 33, 36, 130);
  moonDisc(ctx, 560, 55, 28, true);
  if (variant === 0) {
    ctx.fillStyle = '#fff4c8';
    ctx.beginPath();
    ctx.arc(500, 45, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bunting strings across the top.
  ctx.strokeStyle = '#c9b8e8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 60);
  ctx.quadraticCurveTo(305, 130, 590, 60);
  ctx.stroke();
  const flagColours = ['#e05252', '#ffd166', '#7ee081', '#4f8ad9', '#e08ad9'];
  for (let i = 0; i < 9; i += 1) {
    if (variant === 1 && i === 6) continue;
    const x = 60 + i * 55;
    const y = 66 + Math.sin((x / 590) * Math.PI) * 52;
    ctx.fillStyle = flagColours[i % flagColours.length];
    ctx.beginPath();
    ctx.moveTo(x - 9, y);
    ctx.lineTo(x + 9, y);
    ctx.lineTo(x, y + 18);
    ctx.closePath();
    ctx.fill();
  }

  // Balloons, left: three in the original, two in the twin.
  const balloons = [[105, 95, '#e05252'], [135, 80, '#ffd166'], [160, 105, '#4f8ad9']];
  for (let i = 0; i < (variant === 0 ? 3 : 2); i += 1) {
    const [x, y, colour] = balloons[i];
    ctx.strokeStyle = 'rgba(230, 220, 255, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y + 16);
    ctx.quadraticCurveTo(x + 6, y + 40, x - 2, y + 62);
    ctx.stroke();
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.ellipse(x, y, 13, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.arc(x - 4, y - 5, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cobblestones.
  ctx.fillStyle = '#3a3348';
  ctx.fillRect(0, 380, 610, 140);
  ctx.fillStyle = '#4a4260';
  const cobbleRandom = makeSeededRandom(5);
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const x = 12 + col * 66 + (row % 2) * 30 + cobbleRandom() * 6;
      const y = 396 + row * 32;
      ctx.beginPath();
      ctx.ellipse(x, y, 26, 12, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (variant === 1) {
    ctx.fillStyle = '#6a5a9a';
    ctx.beginPath();
    ctx.ellipse(150, 470, 26, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Three stalls with striped awnings and counters.
  const stalls = [
    { x: 60, colour: '#e05252', sign: 'SWEETS' },
    { x: 230, colour: '#4f8ad9', sign: 'TOYS' },
    { x: 410, colour: '#7ee081', sign: 'FLOWERS' },
  ];
  for (let s = 0; s < stalls.length; s += 1) {
    const stall = stalls[s];
    ctx.fillStyle = '#5b4632';
    ctx.fillRect(stall.x, 180, 8, 160);
    ctx.fillRect(stall.x + 132, 180, 8, 160);
    // Awning: alternating stripes; the middle stall's centre stripe changes.
    for (let stripe = 0; stripe < 6; stripe += 1) {
      let stripeColour = stripe % 2 === 0 ? stall.colour : '#f5ead2';
      if (s === 1 && stripe === 2 && variant === 1) stripeColour = '#ffd166';
      ctx.fillStyle = stripeColour;
      ctx.fillRect(stall.x + stripe * 23, 150, 23, 34);
    }
    ctx.fillStyle = '#3a2f1d';
    ctx.fillRect(stall.x, 184, 140, 6);
    // Counter with goods.
    ctx.fillStyle = '#8a6a42';
    ctx.fillRect(stall.x - 6, 330, 152, 52);
    ctx.fillStyle = '#a8763e';
    ctx.fillRect(stall.x - 6, 330, 152, 8);
    // Sign board.
    ctx.fillStyle = '#2c2417';
    ctx.fillRect(stall.x + 20, 205, 100, 26);
    ctx.fillStyle = '#ffe9a8';
    ctx.font = 'bold 14px Trebuchet MS, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(stall.sign, stall.x + 70, 223);
    if (s === 0 && variant === 1) {
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(stall.x + 70, 196, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Jars on the middle stall: four in the original, three in the twin.
  const jarColours = ['#e08ad9', '#7ee081', '#ffd166', '#4f8ad9'];
  for (let i = 0; i < (variant === 0 ? 4 : 3); i += 1) {
    const x = 252 + i * 26;
    ctx.fillStyle = jarColours[i];
    ctx.fillRect(x, 306, 18, 24);
    ctx.fillStyle = '#2c2417';
    ctx.fillRect(x + 2, 300, 14, 6);
  }

  // Paper lantern hanging from the right stall, lit or dark.
  ctx.strokeStyle = '#c9b8e8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(548, 184);
  ctx.lineTo(548, 204);
  ctx.stroke();
  if (variant === 0) {
    const glow = ctx.createRadialGradient(548, 222, 4, 548, 222, 40);
    glow.addColorStop(0, 'rgba(255, 150, 90, 0.5)');
    glow.addColorStop(1, 'rgba(255, 150, 90, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(508, 182, 80, 80);
    ctx.fillStyle = '#ff9a5a';
  } else {
    ctx.fillStyle = '#6a5a50';
  }
  ctx.beginPath();
  ctx.ellipse(548, 222, 16, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(60, 30, 10, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(534, 214);
  ctx.lineTo(562, 214);
  ctx.moveTo(534, 230);
  ctx.lineTo(562, 230);
  ctx.stroke();

  // Cart, bottom right, with two wheels in the original and one in the twin.
  ctx.fillStyle = '#7a4a2b';
  ctx.fillRect(430, 420, 110, 34);
  ctx.fillStyle = '#a8763e';
  ctx.fillRect(430, 420, 110, 8);
  ctx.fillStyle = '#2c2417';
  ctx.beginPath();
  ctx.arc(455, 460, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c9b8e8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(455, 447);
  ctx.lineTo(455, 473);
  ctx.moveTo(442, 460);
  ctx.lineTo(468, 460);
  ctx.stroke();
  if (variant === 0) {
    ctx.fillStyle = '#2c2417';
    ctx.beginPath();
    ctx.arc(515, 460, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c9b8e8';
    ctx.beginPath();
    ctx.moveTo(515, 447);
    ctx.lineTo(515, 473);
    ctx.moveTo(502, 460);
    ctx.lineTo(528, 460);
    ctx.stroke();
  }

  // The market cat on the middle stall's roof: there in the original only.
  if (variant === 0) {
    ctx.fillStyle = '#2c2c3a';
    ctx.beginPath();
    ctx.ellipse(305, 138, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(305, 122, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(298, 115);
    ctx.lineTo(300, 106);
    ctx.lineTo(304, 114);
    ctx.moveTo(310, 115);
    ctx.lineTo(313, 106);
    ctx.lineTo(315, 114);
    ctx.fill();
    ctx.strokeStyle = '#2c2c3a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(319, 136);
    ctx.quadraticCurveTo(330, 130, 328, 118);
    ctx.stroke();
  }
}
