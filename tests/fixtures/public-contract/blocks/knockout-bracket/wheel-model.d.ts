import type { Team, Match, MatchSide, Round } from "./types";
export declare const SIZE = 760;
export declare const CENTER: number;
export declare const TROPHY_SIZE = 24;
export declare const TROPHY_PATH = "M5 1h12v3h3a2 2 0 0 1 2 2c0 3.3-2.2 5.6-5.2 6A6 6 0 0 1 12 15a6 6 0 0 1-4.8-2.9C4.2 11.6 2 9.3 2 6a2 2 0 0 1 2-2h1V1Zm0 5H4c0 1.9 1.1 3.2 2.6 3.7A12 12 0 0 1 5 6Zm14 0h-1a12 12 0 0 1-1.6 3.7C17.9 9.2 19 7.9 19 6ZM9 16.5h6V19h2.5v2h-11v-2H9v-2.5Z";
export declare const TROPHY_GAP = 6;
export declare const OUTER_R = 318;
export declare const HUB_R = 34;
export declare const NODE_MIN = 14.2;
export declare const NODE_STEP = 2.2;
export declare const INITIALS_MIN = 15;
export declare const SIBLING_GAP = 0.9;
export declare const HUB_ANGLE = 90;
export declare const DIM_TRANSITION: {
    readonly duration: 0.18;
};
export declare const NO_TRANSITION: {
    readonly duration: 0;
};
export declare const quantize: (n: number) => number;
export declare const polar: (radius: number, deg: number) => {
    x: number;
    y: number;
};
export declare const point: (radius: number, deg: number) => string;
export declare const pct: (value: number) => string;
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
export type WheelLink = {
    id: string;
    d: string;
    depth: number;
};
export declare const keepTogether: (text: string) => string;
export declare const teamName: (side: MatchSide) => string;
export declare const crestSrc: (team: Team) => string | null;
export declare const initials: (name: string) => string;
export declare function matchLabel(match: Match): string;
export declare function buildWheel(rounds: Round[]): {
    nodes: WheelNode[];
    links: WheelLink[];
    champion: Team | null;
};
export declare function championPath(rounds: Round[]): Set<string>;
