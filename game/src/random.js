// A tiny seeded random generator (mulberry32) so ambient details such as
// stars and fireflies are identical on every load and in every screenshot.

export function makeSeededRandom(seed) {
  let state = seed >>> 0;
  return function nextRandom() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick `count` points inside a rectangle, each at least `minGap` apart. */
export function scatterPoints(random, x, y, width, height, count, minGap) {
  const points = [];
  let guard = 0;
  while (points.length < count && guard < count * 40) {
    guard += 1;
    const candidate = { x: x + random() * width, y: y + random() * height };
    const tooClose = points.some(
      (point) => Math.hypot(point.x - candidate.x, point.y - candidate.y) < minGap,
    );
    if (!tooClose) points.push(candidate);
  }
  return points;
}
