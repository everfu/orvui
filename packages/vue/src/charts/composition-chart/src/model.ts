export interface CompositionSeries {
  id: string;
  name: string;
  color: string;
  values: readonly (number | null)[];
}

export function buildComposition(
  series: readonly CompositionSeries[],
  periods: readonly string[],
) {
  const unique = new Map<string, CompositionSeries>();
  for (const item of series)
    if (!unique.has(item.id)) unique.set(item.id, item);
  const rows = [...unique.values()];
  const used = new Set<string>();
  const columns: {
    id: string;
    valid: boolean;
    segments: (CompositionSeries & {
      value: number | null;
      share: number;
      offset: number;
    })[];
  }[] = [];
  for (let index = 0; index < periods.length; index++) {
    const id = periods[index];
    if (used.has(id)) continue;
    used.add(id);
    const observations = rows.map((row) => row.values[index]);
    const valid =
      observations.length > 0 &&
      observations.every(
        (value) =>
          typeof value === "number" && Number.isFinite(value) && value >= 0,
      );
    let scale = 0;
    if (valid)
      for (const value of observations) scale = Math.max(scale, value ?? 0);
    let denominator = 0;
    if (scale > 0)
      for (const value of observations) denominator += (value ?? 0) / scale;
    let position = 0;
    const segments = rows.map((row, seriesIndex) => {
      const value = observations[seriesIndex] ?? null;
      const share =
        denominator > 0 ? ((value ?? 0) / scale / denominator) * 100 : 0;
      const segment = { ...row, value, share, offset: position };
      position += share;
      return segment;
    });
    columns.push({ id, valid: valid && denominator > 0, segments });
  }
  return { rows, columns };
}

export function compositionArea(
  columns: ReturnType<typeof buildComposition>["columns"],
  row: number,
) {
  const paths: string[] = [];
  for (let start = 0; start < columns.length;) {
    if (!columns[start].valid) {
      start++;
      continue;
    }
    let end = start + 1;
    while (end < columns.length && columns[end].valid) end++;
    if (end - start === 1) {
      const segment = columns[start].segments[row];
      const left = (start / columns.length) * 100;
      const right = ((start + 1) / columns.length) * 100;
      const bottom = 100 - segment.offset;
      const top = bottom - segment.share;
      paths.push(
        `M${left},${bottom} L${left},${top} L${right},${top} L${right},${bottom} Z`,
      );
    } else {
      const points: string[] = [];
      for (let i = start; i < end; i++) {
        const segment = columns[i].segments[row];
        points.push(
          `${((i + 0.5) / columns.length) * 100},${100 - segment.offset - segment.share}`,
        );
      }
      for (let i = end - 1; i >= start; i--)
        points.push(
          `${((i + 0.5) / columns.length) * 100},${100 - columns[i].segments[row].offset}`,
        );
      paths.push(`M${points.join(" L")} Z`);
    }
    start = end;
  }
  return paths.join(" ");
}
