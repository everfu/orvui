import type { Candle } from "./context";
export function candleGeometry(
  candles: readonly Candle[],
  scale: { min: number; max: number; volumeMax: number },
  width: number,
  height: number,
) {
  const plotWidth = Math.max(0, width - 64),
    priceHeight = height * 0.82 - 8;
  const pitch = candles.length ? plotWidth / candles.length : 0,
    bodyWidth = Math.max(1, pitch * 0.62);
  const y = (price: number) =>
    ((scale.max - price) / (scale.max - scale.min || 1)) * priceHeight;
  const ticks = Array.from(
    { length: 5 },
    (_, index) => scale.max - ((scale.max - scale.min) * (index + 0.5)) / 5,
  );
  const bars = candles.map((candle, index) => {
    const center = index * pitch + pitch / 2;
    const volume = Math.max(
      0.5,
      (candle.volume / scale.volumeMax) * height * 0.18,
    );
    return {
      candle,
      index,
      center,
      left: center - bodyWidth / 2,
      wickTop: y(candle.high),
      wickHeight: Math.max(1, y(candle.low) - y(candle.high)),
      bodyTop: y(Math.max(candle.open, candle.close)),
      bodyHeight: Math.max(1, Math.abs(y(candle.open) - y(candle.close))),
      volumeTop: height - volume,
      volumeHeight: volume,
    };
  });
  return { plotWidth, priceHeight, pitch, bodyWidth, ticks, bars, y };
}
