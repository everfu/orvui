import type { PriceHistoryPoint } from "./types";
export declare const fmtScrubDate: Intl.DateTimeFormat;
export declare const UP = "var(--success)";
export declare const MID = "var(--accent)";
export declare const LOW = "var(--warning)";
export declare const W = 520;
export declare const H = 236;
export declare const PAD: {
    l: number;
    r: number;
    t: number;
    b: number;
};
export declare const ink: (c: string) => string;
export declare const EMPTY_HISTORY: PriceHistoryPoint[];
export declare const fmtAxisDate: (date: string) => string;
