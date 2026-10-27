export interface BumpSeries {
    id: string;
    name: string;
    ranks: readonly (number | null)[];
    color?: string;
}
export declare const BUMP_COLORS: string[];
export declare const PLOT: {
    width: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    rowHeight: number;
};
export declare function buildBumpChart(series: readonly BumpSeries[], periodCount: number): {
    rows: (Omit<BumpSeries, "color" | "ranks"> & {
        color: string;
        ranks: (number | null)[];
    })[];
    ranks: number[];
    maxRank: number;
    height: number;
    x: (period: number) => number;
    y: (rank: number) => number;
};
export declare function bumpPath(ranks: readonly (number | null)[], x: (i: number) => number, y: (rank: number) => number): string;
