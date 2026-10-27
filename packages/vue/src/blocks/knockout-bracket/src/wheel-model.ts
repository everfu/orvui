import type { Team, Match, MatchSide, Round } from "./types";
export const SIZE = 760,
  CENTER = SIZE / 2,
  TROPHY_SIZE = 24,
  TROPHY_GAP = 6,
  OUTER_R = 318,
  HUB_R = 34,
  NODE_MIN = 14.2,
  NODE_STEP = 2.2,
  INITIALS_MIN = 15,
  SIBLING_GAP = 0.9,
  HUB_ANGLE = 90;
export const TROPHY_PATH =
  "M5 1H17V4H20Q22 4 22 6C22 9.3 19.8 11.6 16.8 12A6 6 0 0 1 12 15A6 6 0 0 1 7.2 12.1C4.2 11.6 2 9.3 2 6Q2 4 4 4H5ZM4 6C4 7.9 5.1 9.2 6.6 9.7A12 12 0 0 1 5 6ZM18 6A12 12 0 0 1 16.4 9.7C17.9 9.2 19 7.9 19 6ZM9 16.5H15V19H17.5V21H6.5V19H9Z";
export const DIM_TRANSITION = { duration: 0.18 } as const,
  NO_TRANSITION = { duration: 0 } as const;
export const quantize = (value: number) => Math.round(value * 1000) / 1000;
export function polar(radius: number, degrees: number) {
  const angle = (degrees / 180) * Math.PI;
  return {
    x: quantize(CENTER + radius * Math.cos(angle)),
    y: quantize(CENTER + radius * Math.sin(angle)),
  };
}
export function point(radius: number, degrees: number) {
  const position = polar(radius, degrees);
  return position.x.toFixed(2) + " " + position.y.toFixed(2);
}
export const pct = (value: number) => ((value / SIZE) * 100).toFixed(4) + "%";
export type WheelNode = {
  id: string;
  parentId: string | null;
  depth: number;
  angle: number;
  x: number;
  y: number;
  r: number;
  team: Team | null;
  label: string;
  round: string | null;
};
export type WheelLink = { id: string; d: string; depth: number };
export const keepTogether = (text: string) => text.split(" ").join(" ");
export const teamName = (side: MatchSide) =>
  keepTogether(side.team?.name ?? "TBD");
export const crestSrc = (team: Team) =>
  team.logo ??
  (team.code ? "https://flagcdn.com/w80/" + team.code + ".png" : null);
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => Array.from(word)[0])
    .join("")
    .toUpperCase();
export function matchLabel(match: Match) {
  const names = teamName(match.home) + " v " + teamName(match.away);
  if (match.home.score == null || match.away.score == null) return names;
  const penalties =
    match.home.penalties != null && match.away.penalties != null
      ? ` (${match.home.penalties}–${match.away.penalties} pens)`
      : "";
  return `${names} · ${match.home.score}–${match.away.score}${penalties}`;
}
export function buildWheel(rounds: Round[]) {
  const nodes: WheelNode[] = [],
    links: WheelLink[] = [];
  const levels = rounds.length,
    final = rounds.at(-1)?.matches[0];
  if (!final) return { nodes, links, champion: null };
  const champion = final.winner ? final[final.winner].team : null;
  const hub: WheelNode = {
    id: final.id,
    parentId: null,
    depth: 0,
    angle: HUB_ANGLE,
    x: CENTER,
    y: CENTER,
    r: HUB_R,
    team: champion,
    label: matchLabel(final),
    round: rounds.at(-1)!.name,
  };
  nodes.push(hub);
  const radius = (depth: number) => (depth / levels) * OUTER_R;
  type Work = {
    match: Match;
    level: number;
    index: number;
    parent: WheelNode;
    angle: number;
    wedge: number;
  };
  const pending: Work[] = [
    {
      match: final,
      level: levels - 1,
      index: 0,
      parent: hub,
      angle: HUB_ANGLE,
      wedge: 360,
    },
  ];
  while (pending.length) {
    const job = pending.pop()!,
      depth = job.parent.depth + 1,
      ring = radius(depth),
      offset = (job.wedge / 4) * (job.parent.depth === 0 ? 1 : SIBLING_GAP),
      angles = [job.angle - offset, job.angle + offset];
    const children = angles.map((angle, side) => {
      const key = side === 0 ? "home" : "away",
        feeder =
          job.level > 0
            ? rounds[job.level - 1].matches[job.index * 2 + side]
            : undefined;
      const node: WheelNode = {
        id: feeder?.id ?? `${job.match.id}-${key}`,
        parentId: job.parent.id,
        depth,
        angle,
        ...polar(ring, angle),
        r: NODE_MIN + (depth - 1) * NODE_STEP,
        team: feeder
          ? feeder.winner
            ? feeder[feeder.winner].team
            : null
          : job.match[key].team,
        label: feeder
          ? matchLabel(feeder)
          : (job.match[key].team?.name ?? "TBD"),
        round: feeder ? rounds[job.level - 1].name : null,
      };
      nodes.push(node);
      return { node, feeder, angle };
    });
    if (job.parent.depth === 0)
      for (const child of children)
        links.push({
          id: `${job.parent.id}-${child.node.id}`,
          d: `M ${point(ring, child.angle)} L ${CENTER} ${CENTER}`,
          depth,
        });
    else {
      const middle = (radius(job.parent.depth) + ring) / 2;
      links.push(
        {
          id: job.parent.id + "-arc",
          d: `M ${point(ring, angles[0])} L ${point(middle, angles[0])} A ${middle} ${middle} 0 0 1 ${point(middle, angles[1])} L ${point(ring, angles[1])}`,
          depth,
        },
        {
          id: job.parent.id + "-stem",
          d: `M ${point(middle, job.angle)} L ${point(radius(job.parent.depth), job.angle)}`,
          depth,
        },
      );
    }
    for (let side = children.length - 1; side >= 0; side--) {
      const child = children[side];
      if (child.feeder)
        pending.push({
          match: child.feeder,
          level: job.level - 1,
          index: job.index * 2 + side,
          parent: child.node,
          angle: child.angle,
          wedge: job.wedge / 2,
        });
    }
  }
  return { nodes, links, champion };
}
export function championPath(rounds: Round[]) {
  const path = new Set<string>();
  let branch = 0;
  for (let level = rounds.length - 1; level >= 0; level--) {
    const match = rounds[level].matches[branch];
    if (!match?.winner) break;
    path.add(match.id);
    if (level === 0) path.add(`${match.id}-${match.winner}`);
    branch = 2 * branch + (match.winner === "home" ? 0 : 1);
  }
  return path;
}
