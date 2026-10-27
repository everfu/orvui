export interface VolumeProfileBin {
  id: string;
  priceLow: number;
  priceHigh: number;
  volume: number;
}

function validate(data: readonly VolumeProfileBin[]) {
  const bins = data.slice().sort((a, b) => a.priceLow - b.priceLow);
  const identities = new Set<string>();
  let total = 0,
    maximum = 0,
    peak = -1;
  bins.forEach((bin, index) => {
    if (identities.has(bin.id))
      throw new Error(`VolumeProfile: duplicate bin ID "${bin.id}".`);
    identities.add(bin.id);
    if (
      !Number.isFinite(bin.priceLow) ||
      !Number.isFinite(bin.priceHigh) ||
      bin.priceHigh <= bin.priceLow ||
      !Number.isFinite(bin.volume) ||
      bin.volume < 0
    )
      throw new Error(
        "VolumeProfile: bins need finite increasing price bounds and nonnegative volume.",
      );
    if (index && bin.priceLow < bins[index - 1].priceHigh)
      throw new Error("VolumeProfile: price ranges must not overlap.");
    total += bin.volume;
    if (bin.volume > maximum) {
      peak = index;
      maximum = bin.volume;
    }
  });
  const priceLow = bins[0]?.priceLow ?? 0;
  const priceHigh = bins.at(-1)?.priceHigh ?? 1;
  if (!Number.isFinite(total) || !Number.isFinite(priceHigh - priceLow))
    throw new Error(
      "VolumeProfile: the total volume and price span must remain finite.",
    );
  return { bins, total, maximum, peak, priceLow, priceHigh };
}

function growArea(
  bins: readonly VolumeProfileBin[],
  peak: number,
  target: number | false,
  total: number,
) {
  let low = peak,
    high = peak;
  let volume = peak >= 0 ? bins[peak].volume : 0;
  if (peak >= 0 && target === 1)
    return { low: 0, high: bins.length - 1, volume: total };
  if (peak < 0 || target === false) return { low, high, volume };
  while (volume < total * target) {
    const below = bins[low - 1];
    const above = bins[high + 1];
    if (!above && !below) break;
    const up =
      !below ||
      (!!above &&
        (above.volume > below.volume ||
          (above.volume === below.volume &&
            high + 1 - peak <= peak - low + 1)));
    const adjacent = up ? above : below;
    if (!adjacent || volume + adjacent.volume > total * target) break;
    volume += adjacent.volume;
    if (up) high++;
    else low--;
  }
  return { low, high, volume };
}

export function buildVolumeProfile(
  data: readonly VolumeProfileBin[],
  target: number | false,
) {
  if (
    target !== false &&
    (!Number.isFinite(target) || target <= 0 || target > 1)
  )
    throw new Error(
      "VolumeProfile: valueArea must be a fraction above 0 and at most 1, or false.",
    );
  const { bins, total, maximum, peak, priceLow, priceHigh } = validate(data);
  const area = growArea(bins, peak, target, total);
  const valueArea =
    target !== false && peak >= 0
      ? {
          priceLow: bins[area.low].priceLow,
          priceHigh: bins[area.high].priceHigh,
          volume: area.volume,
          share: area.volume / total,
          target,
        }
      : null;
  const span = priceHigh - priceLow;
  const rows = bins.map((bin, index) => {
    const price = bin.priceLow + (bin.priceHigh - bin.priceLow) / 2;
    return {
      ...bin,
      price,
      top: (priceHigh - bin.priceHigh) / span,
      height: (bin.priceHigh - bin.priceLow) / span,
      center: (priceHigh - price) / span,
      proportion: maximum ? bin.volume / maximum : 0,
      share: total ? bin.volume / total : 0,
      isPoc: index === peak,
      inValueArea:
        valueArea !== null && index >= area.low && index <= area.high,
    };
  });
  return {
    rows,
    poc: rows[peak] ?? null,
    valueArea,
    totalVolume: total,
    maxVolume: maximum,
    priceLow,
    priceHigh,
  };
}
export type VolumeProfileRow = ReturnType<
  typeof buildVolumeProfile
>["rows"][number];
