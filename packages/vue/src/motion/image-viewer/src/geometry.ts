export function imagePanBounds(imageWidth: number, imageHeight: number, boundsWidth: number, boundsHeight: number) {
  const overflow = (image: number, bounds: number) => Math.max(0, image - bounds / 2);
  return { x: overflow(imageWidth, boundsWidth), y: overflow(imageHeight, boundsHeight) };
}
export function clampImagePan(value: number, bound: number) { return value > bound ? bound : value < -bound ? -bound : value; }
export function imageSwipe(start: { x: number; y: number }, end: { x: number; y: number }): 1 | -1 | null {
  const horizontal = end.x - start.x;
  if (Math.abs(horizontal) <= 50 || Math.abs(horizontal) <= Math.abs(end.y - start.y) * 1.5) return null;
  return horizontal < 0 ? 1 : -1;
}
