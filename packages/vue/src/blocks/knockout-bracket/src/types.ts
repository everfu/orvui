export interface Team {
  name: string;
  logo?: string;
  code?: string;
}
export interface MatchSide {
  team: Team | null;
  score: number | null;
  penalties?: number | null;
}
export interface Match {
  id: string;
  date?: string;
  time?: string;
  status?: "finished" | "upcoming";
  home: MatchSide;
  away: MatchSide;
  winner?: "home" | "away";
  badge?: string;
}
export interface Round {
  name: string;
  matches: Match[];
}
