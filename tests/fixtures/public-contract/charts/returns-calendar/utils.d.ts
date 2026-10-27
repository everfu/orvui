import type { ReturnsCalendarCell } from "./types";
export declare const UP = "var(--success)";
export declare const DOWN = "var(--destructive)";
export declare const MONTHS: string[];
export declare const COLS: {
    name: string;
    initial: string;
    m: number;
}[];
export declare const YEAR = 12;
export declare const compound: (run: number[]) => number;
export declare const signed: (v: number, dp: number) => string;
export declare const ink: (c: string) => string;
export declare const tint: (v: number, range: number, on: boolean) => string;
export declare const same: (a: ReturnsCalendarCell | null, y: number, m: number) => boolean;
export declare const RING = "inset 0 0 0 1.5px var(--foreground)";
