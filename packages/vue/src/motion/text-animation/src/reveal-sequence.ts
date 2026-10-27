export interface RevealUnit { text: string; index: number }
export function revealSequence(input: string | string[], mode: "word" | "char"): RevealUnit[][][] {
  let ordinal = 0;
  return (typeof input === "string" ? [input] : input).map(line => {
    const chunks = line.match(/\S+\s*|\s+/g) ?? [];
    return chunks.map(chunk => (mode === "word" ? [chunk] : Array.from(chunk)).map(text => ({ text, index: ordinal++ })));
  });
}
export function chromaticGradient(colors: string[], foreground: string) {
  const palette = colors.length ? colors : ["#60a5fa", "#818cf8", "#c084fc", "#fb7185", "#fbbf24"];
  const stops = palette.map((color, index) => { const offset = palette.length === 1 ? 0 : 28 * index / (palette.length - 1) - 14; return `${color} calc(var(--chromatic-sweep) ${offset < 0 ? "-" : "+"} ${Number(Math.abs(offset).toFixed(2))}%)`; });
  return `linear-gradient(90deg,${foreground} 0%,${foreground} calc(var(--chromatic-sweep) - 14%),${stops.join(",")},transparent calc(var(--chromatic-sweep) + 14%),transparent 100%)`;
}
