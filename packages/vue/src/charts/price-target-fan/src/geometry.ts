import type { PriceTargetFanProps } from "./types";
import { H, LOW, MID, PAD, UP, W } from "./utils";
export function buildPriceTargetGeometry(props: PriceTargetFanProps) {
  const history = props.history ?? [],
    targets = props.targets,
    current = props.current;
  let previous = -Infinity;
  const times: number[] = [],
    hist: number[] = [];
  for (const point of history) {
    const timestamp = Date.parse(point.date);
    if (
      !/^\d{4}-\d{2}-\d{2}(?:T.*(?:Z|[+-]\d{2}:\d{2}))?$/.test(point.date) ||
      !Number.isFinite(timestamp) ||
      timestamp <= previous ||
      !Number.isFinite(point.price) ||
      point.price <= 0
    )
      throw new RangeError(
        "PriceTargetFan history must contain positive prices and ascending, unique ISO dates",
      );
    previous = timestamp;
    times.push(timestamp);
    hist.push(point.price);
  }
  if (
    !Number.isFinite(current) ||
    current <= 0 ||
    targets.length !== 3 ||
    targets.some(
      (target) => !Number.isFinite(target.price) || target.price <= 0,
    ) ||
    new Set(targets.map((target) => target.key)).size !== 3
  )
    throw new RangeError(
      "PriceTargetFan requires a positive current price and three positive targets with unique keys",
    );
  let low = current,
    high = current;
  for (const value of hist) {
    low = Math.min(low, value);
    high = Math.max(high, value);
  }
  for (const target of targets) {
    low = Math.min(low, target.price);
    high = Math.max(high, target.price);
  }
  const padding = Math.max((high - low) * 0.06, 0.5),
    min = low - padding,
    max = high + padding;
  const y = (value: number) =>
    PAD.t + (1 - (value - min) / (max - min)) * (H - PAD.t - PAD.b);
  const pct = (price: number) => ((price - current) / current) * 100,
    fmt = (price: number) => "$" + price.toFixed(2);
  const historyWidth = (W - PAD.l - PAD.r) * 0.56,
    nowX = PAD.l + historyWidth,
    nowY = y(current),
    endX = W - PAD.r;
  const first = times[0] ?? 0,
    last = times.at(-1) ?? first;
  const hx = (index: number) =>
    last === first
      ? nowX - 12
      : PAD.l + ((times[index] - first) / (last - first)) * (historyWidth - 12);
  const line =
    hist
      .map(
        (price, index) =>
          `${index ? "L" : "M"}${hx(index).toFixed(1)},${y(price).toFixed(1)}`,
      )
      .join(" ") + (hist.length ? ` L${nowX},${nowY}` : "");
  const palette = [UP, MID, LOW];
  const proj = targets.map((target, index) => {
    const ty = y(target.price),
      cx = nowX + (endX - nowX) * 0.5,
      cy = nowY + (ty - nowY) * 0.15;
    return {
      ...target,
      color: target.color ?? palette[index],
      ty,
      cx,
      cy,
      d: `M${nowX},${nowY} Q${cx},${cy} ${endX},${ty}`,
    };
  });
  const span = max - min,
    magnitude = 10 ** Math.floor(Math.log10(span / 3.2));
  const step =
    [1, 2, 2.5, 5, 10]
      .map((factor) => factor * magnitude)
      .find((candidate) => span / candidate <= 4.2) ?? 10 * magnitude;
  const out: number[] = [];
  for (let tick = Math.ceil(min / step) * step; tick <= max; tick += step)
    out.push(tick);
  return {
    hist,
    history,
    targets,
    current,
    dates: props.dates ?? {},
    y,
    pct,
    fmt,
    geo: { hx, nowX, nowY, endX, line, proj },
    gridVals: { step, out },
  };
}
export function nearestProjection(
  geometry: ReturnType<typeof buildPriceTargetGeometry>,
  x: number,
  y: number,
) {
  const { nowX, nowY, endX, proj } = geometry.geo,
    progress = Math.min(1, (x - nowX) / (endX - nowX));
  const samples = proj.map(
    (target) =>
      (1 - progress) * (1 - progress) * nowY +
      2 * (1 - progress) * progress * target.cy +
      progress * progress * target.ty,
  );
  if (Math.max(...samples) - Math.min(...samples) < 24) return null;
  let selected = 0;
  for (let index = 1; index < samples.length; index++)
    if (Math.abs(y - samples[index]) < Math.abs(y - samples[selected]))
      selected = index;
  return selected;
}
