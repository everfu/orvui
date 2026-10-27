export const AUDIO_BARS = [
  18, 31, 24, 39, 30, 43, 27, 18, 9, 29, 38, 24, 34, 18, 26, 37, 21, 14, 7, 11,
  22, 35, 18, 26, 41, 29, 17, 33,
];
export function audioClock(value?: number) {
  const seconds = Math.max(0, Math.round(value ?? 0));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
