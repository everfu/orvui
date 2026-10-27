export function unfoldGeometry(
  progress: number,
  height: number,
  top: boolean,
  reduced: boolean,
) {
  const bounded = (value: number) => Math.min(1, Math.max(0, value));
  const phase = bounded(progress);
  const separation = bounded((phase - 0.4) / 0.6);
  const moving = height > 0 && !reduced;
  const near = moving ? 12 * separation : 12;
  const radius = top
    ? `12px 12px ${near}px ${near}px`
    : `${near}px ${near}px 12px 12px`;
  const hidden = Math.max(0, (height - 8) * (1 - phase));
  return {
    y: moving ? (top ? 8 : -8) * (1 - separation) : 0,
    radius,
    clip:
      !moving || phase === 1
        ? "none"
        : `inset(${top ? `${hidden}px 0 0 0` : `0 0 ${hidden}px 0`} round ${radius})`,
    opacity: bounded(progress / (reduced ? 1 : 0.12)),
  };
}
