import { type BumpSeries } from "./model";
export interface BumpChartProps {
    series: readonly BumpSeries[];
    periods: readonly string[];
    active?: string | null;
    defaultActive?: string | null;
    label?: string;
    className?: string;
}
export declare function createBumpModel(p: BumpChartProps, emit: (event: any, ...args: any[]) => void): {
    model: {
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
    rows: (Omit<BumpSeries, "color" | "ranks"> & {
        color: string;
        ranks: (number | null)[];
    })[];
    periods: readonly string[];
    ranks: number[];
    height: number;
    x: (i: number) => number;
    y: (r: number) => number;
    pinned: string | null;
    highlighted: string | null;
    select: (id: string | null) => void;
    setHovered: (id: string | null) => void;
    setFocused: (id: string | null) => void;
    label: string;
    reduce: boolean;
    canHover: boolean;
};
export declare const bumpContext: {
    key: import("vue").InjectionKey<{
        model: {
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
        rows: (Omit<BumpSeries, "color" | "ranks"> & {
            color: string;
            ranks: (number | null)[];
        })[];
        periods: readonly string[];
        ranks: number[];
        height: number;
        x: (i: number) => number;
        y: (r: number) => number;
        pinned: string | null;
        highlighted: string | null;
        select: (id: string | null) => void;
        setHovered: (id: string | null) => void;
        setFocused: (id: string | null) => void;
        label: string;
        reduce: boolean;
        canHover: boolean;
    }>;
    use: () => {
        model: {
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
        rows: (Omit<BumpSeries, "color" | "ranks"> & {
            color: string;
            ranks: (number | null)[];
        })[];
        periods: readonly string[];
        ranks: number[];
        height: number;
        x: (i: number) => number;
        y: (r: number) => number;
        pinned: string | null;
        highlighted: string | null;
        select: (id: string | null) => void;
        setHovered: (id: string | null) => void;
        setFocused: (id: string | null) => void;
        label: string;
        reduce: boolean;
        canHover: boolean;
    };
};
export declare const useBumpChart: () => {
    model: {
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
    rows: (Omit<BumpSeries, "color" | "ranks"> & {
        color: string;
        ranks: (number | null)[];
    })[];
    periods: readonly string[];
    ranks: number[];
    height: number;
    x: (i: number) => number;
    y: (r: number) => number;
    pinned: string | null;
    highlighted: string | null;
    select: (id: string | null) => void;
    setHovered: (id: string | null) => void;
    setFocused: (id: string | null) => void;
    label: string;
    reduce: boolean;
    canHover: boolean;
};
