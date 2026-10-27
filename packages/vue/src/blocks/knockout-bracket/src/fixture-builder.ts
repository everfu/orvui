import type { Match, Round, Team } from "./types";
export type GameSeed = [
  string,
  string | null,
  number | null,
  string | null,
  number | null,
  string?,
  string?,
  ("finished" | "upcoming")?,
  ("home" | "away")?,
  number?,
  number?,
];
export function fixture(teams: Record<string, Team>, row: GameSeed): Match {
  const [
    id,
    home,
    homeScore,
    away,
    awayScore,
    date,
    time,
    status,
    winner,
    homePenalties,
    awayPenalties,
  ] = row;
  const side = (
    key: string | null,
    score: number | null,
    penalties?: number,
  ) => ({
    team: key ? teams[key] : null,
    score,
    ...(penalties === undefined ? {} : { penalties }),
  });
  return {
    id,
    ...(date === undefined ? {} : { date }),
    ...(time === undefined ? {} : { time }),
    ...(status === undefined ? {} : { status }),
    home: side(home, homeScore, homePenalties),
    away: side(away, awayScore, awayPenalties),
    ...(winner === undefined ? {} : { winner }),
  };
}
export function roundsFrom(
  teams: Record<string, Team>,
  seeds: [string, GameSeed[]][],
): Round[] {
  return seeds.map(([name, games]) => ({
    name,
    matches: games.map((row) => fixture(teams, row)),
  }));
}
