export const MORPH_POINTS = 24;
const fullTurn = 2 * Math.PI;
function polygonRadius(angle: number, sides: number, orientation = 0) {
  const repeated = sides * (angle - orientation - Math.PI / sides);
  const local = Math.atan2(Math.sin(repeated), Math.cos(repeated)) / sides;
  return Math.cos(Math.PI / sides) / Math.cos(local);
}
function sample(radius: (angle: number) => number) {
  return Array.from({ length: MORPH_POINTS }, (_, index) => {
    const angle = index * fullTurn / MORPH_POINTS - Math.PI / 2;
    const distance = 46 * Math.min(1.05, radius(angle));
    const x = (50 + distance * Math.cos(angle)).toFixed(2);
    const y = (50 + distance * Math.sin(angle)).toFixed(2);
    return `${index === 0 ? "M" : "L"}${x} ${y}`;
  }).join(" ") + " Z";
}
export const MORPH_PATHS = [
  sample(() => 1), sample(angle => polygonRadius(angle, 4, Math.PI / 4)),
  sample(angle => polygonRadius(angle, 3)), sample(angle => polygonRadius(angle, 6)),
  sample(angle => polygonRadius(angle, 4)),
];
export const MORPH_SEQ = Array.from({ length: 11 }, (_, index) => MORPH_PATHS[Math.floor(index / 2) % 5]!);
export const MORPH_ROT = Array.from({ length: 11 }, (_, index) => Math.floor(index / 2) * 72);
export const MORPH_SCALE = Array.from({ length: 11 }, (_, index) => index < 10 && Math.floor(index / 2) % 2 ? 0.88 : 1);
const quadrants = [[0, 2], [3, 1]];
export const BAYER_4 = Array.from({ length: 16 }, (_, index) => {
  const x = index % 4, y = Math.floor(index / 4);
  return 4 * quadrants[y % 2]![x % 2]! + quadrants[Math.floor(y / 2)]![Math.floor(x / 2)]!;
});
