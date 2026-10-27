import type { Match, MatchSide, Round } from "./types";
export const finished = (match: Match) =>
  match.status ? match.status === "finished" : match.winner != null;
export function bracketLabel(round: string, match: Match) {
  const done = finished(match);
  const describe = (side: MatchSide) =>
    (side.team?.name ?? "TBD") +
    (side.score == null
      ? ""
      : ` ${side.score}` +
        (side.penalties == null ? "" : ` (${side.penalties} on penalties)`));
  const schedule = done ? [] : [match.date, match.time].filter(Boolean),
    winner = match.winner ? match[match.winner].team?.name : undefined;
  return (
    round +
    ": " +
    describe(match.home) +
    (done ? ", " : " versus ") +
    describe(match.away) +
    (schedule.length ? ", " + schedule.join(", ") : "") +
    (winner ? ", " + winner + " won" : "")
  );
}
export function bracketLayout(rounds: Round[], page: number, columns: number) {
  const centers: number[][] = rounds.map(() => []);
  centers[page] = (rounds[page]?.matches ?? []).map(
    (_, index) => 74 + index * 144,
  );
  for (let level = page + 1; level < rounds.length; level++) {
    const previous = centers[level - 1],
      current = centers[level];
    for (let index = 0; index < rounds[level].matches.length; index++) {
      const top = previous[index * 2];
      current[index] =
        top == null
          ? (current[index - 1] ?? -70) + 144
          : (top + (previous[index * 2 + 1] ?? top)) / 2;
    }
  }
  for (let level = page - 1; level >= 0; level--) {
    const distance = 144 / 2 ** (page - level + 1);
    centers[level] = rounds[level].matches.map(
      (_, index) =>
        (centers[level + 1][Math.floor(index / 2)] ?? 12) +
        (index % 2 ? distance : -distance),
    );
  }
  const inWindow = (level: number) => level >= page && level < page + columns;
  const connectors: {
    key: string;
    x: number;
    y: number;
    height: number;
    visible: boolean;
  }[] = [];
  for (let level = 1; level < rounds.length; level++)
    for (let index = 0; index < rounds[level].matches.length; index++) {
      const top = centers[level - 1][index * 2] ?? centers[level][index] ?? 74,
        bottom = centers[level - 1][index * 2 + 1] ?? top;
      connectors.push({
        key: `${level}-${index}`,
        x: 258 + (level - 1 - page) * 290,
        y: top,
        height: Math.max(0, bottom - top),
        visible: inWindow(level) && inWindow(level - 1),
      });
    }
  let height = 74;
  for (const row of centers.slice(page, page + columns))
    for (const center of row) height = Math.max(height, center);
  return { centers, connectors, height: height + 74 };
}
