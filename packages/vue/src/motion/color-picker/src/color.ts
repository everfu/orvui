/** Hue in degrees, saturation/value in percent, and opacity in [0, 1]. */
export type Hsva = { h: number; s: number; v: number; a: number };
/** Red, green and blue in [0, 255], and opacity in [0, 1]. */
export type Rgba = { r: number; g: number; b: number; a: number };

export function hsvaToRgba(color: Hsva): Rgba {
  const brightness = color.v / 100;
  const chroma = brightness * color.s / 100;
  const sector = ((color.h % 360) + 360) % 360 / 60;
  const secondary = chroma * (1 - Math.abs(sector % 2 - 1));
  const channels = sector < 1 ? [chroma, secondary, 0]
    : sector < 2 ? [secondary, chroma, 0]
    : sector < 3 ? [0, chroma, secondary]
    : sector < 4 ? [0, secondary, chroma]
    : sector < 5 ? [secondary, 0, chroma] : [chroma, 0, secondary];
  const floor = brightness - chroma;
  const [r, g, b] = channels.map(channel => Math.round((channel + floor) * 255));
  return { r: r!, g: g!, b: b!, a: color.a };
}

/** Achromatic colors retain the otherwise unrepresentable editing channels. */
export function rgbaToHsva(color: Rgba, previous?: Hsva): Hsva {
  const channels = [color.r, color.g, color.b];
  const light = Math.max(...channels), dark = Math.min(...channels), span = light - dark;
  let hue = previous?.h ?? 0;
  if (span > 0) {
    const dominant = channels.indexOf(light);
    const angles = [
      (color.g - color.b) / span,
      (color.b - color.r) / span + 2,
      (color.r - color.g) / span + 4,
    ];
    hue = (angles[dominant]! * 60 + 360) % 360;
  }
  return {
    h: hue,
    s: light === 0 ? (previous?.s ?? 0) : 100 * span / light,
    v: 100 * light / 255,
    a: color.a,
  };
}

export function parseHex(input: string): Rgba | null {
  const digits = input.trim().replace(/^#/, "");
  if (![3, 4, 6, 8].includes(digits.length) || /[^0-9a-f]/i.test(digits)) return null;
  const expanded = digits.length < 5 ? Array.from(digits, digit => digit.repeat(2)).join("") : digits;
  const bytes = expanded.match(/../g)!.map(pair => Number.parseInt(pair, 16));
  return { r: bytes[0]!, g: bytes[1]!, b: bytes[2]!, a: bytes.length === 4 ? Math.round(bytes[3]! / 255 * 100) / 100 : 1 };
}

export function formatHex(color: Rgba): string {
  const components = [color.r, color.g, color.b];
  if (color.a < 1) components.push(color.a * 255);
  return "#" + components.map(component => Math.round(component).toString(16).padStart(2, "0")).join("");
}

export function hsvToHsl(color: Hsva) {
  const value = color.v / 100;
  const low = value * (1 - color.s / 100);
  const lightness = (value + low) / 2;
  const range = Math.min(lightness, 1 - lightness);
  return { h: color.h, s: range === 0 ? 0 : 100 * (value - lightness) / range, l: 100 * lightness };
}

export function hslToHsv(h: number, s: number, l: number, previous: Hsva, a: number): Hsva {
  const lightness = l / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * s / 100;
  const value = lightness + chroma / 2;
  return { h, s: value === 0 ? previous.s : chroma / value * 100, v: value * 100, a };
}
