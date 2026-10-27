import { type CompositionSeries } from "./model";
export interface CompositionChartProps {
    series: readonly CompositionSeries[];
    periods: readonly string[];
    view?: "bar" | "area";
    period?: string;
    defaultPeriod?: string;
    formatValue?: (v: number) => string;
    label?: string;
    className?: string;
}
export declare function createCompositionModel(p: CompositionChartProps, emit: (e: any, ...a: any[]) => void): {
    rows: CompositionSeries[];
    columns: {
        id: string;
        valid: boolean;
        segments: (CompositionSeries & {
            value: number | null;
            share: number;
            offset: number;
        })[];
    }[];
    index: number;
    column: {
        id: string;
        valid: boolean;
        segments: (CompositionSeries & {
            value: number | null;
            share: number;
            offset: number;
        })[];
    };
    select: (v: string) => void;
    pinned: string | null;
    highlight: string | null;
    setPinned: (v: string | null) => void;
    setHovered: (v: string | null) => void;
    setFocused: (v: string | null) => void;
    view: "area" | "bar";
    label: string;
    formatValue: (value: number) => string;
    reduce: boolean;
    canHover: boolean;
};
export declare const compositionContext: {
    key: import("vue").InjectionKey<{
        rows: CompositionSeries[];
        columns: {
            id: string;
            valid: boolean;
            segments: (CompositionSeries & {
                value: number | null;
                share: number;
                offset: number;
            })[];
        }[];
        index: number;
        column: {
            id: string;
            valid: boolean;
            segments: (CompositionSeries & {
                value: number | null;
                share: number;
                offset: number;
            })[];
        };
        select: (v: string) => void;
        pinned: string | null;
        highlight: string | null;
        setPinned: (v: string | null) => void;
        setHovered: (v: string | null) => void;
        setFocused: (v: string | null) => void;
        view: "area" | "bar";
        label: string;
        formatValue: (value: number) => string;
        reduce: boolean;
        canHover: boolean;
    }>;
    use: () => {
        rows: CompositionSeries[];
        columns: {
            id: string;
            valid: boolean;
            segments: (CompositionSeries & {
                value: number | null;
                share: number;
                offset: number;
            })[];
        }[];
        index: number;
        column: {
            id: string;
            valid: boolean;
            segments: (CompositionSeries & {
                value: number | null;
                share: number;
                offset: number;
            })[];
        };
        select: (v: string) => void;
        pinned: string | null;
        highlight: string | null;
        setPinned: (v: string | null) => void;
        setHovered: (v: string | null) => void;
        setFocused: (v: string | null) => void;
        view: "area" | "bar";
        label: string;
        formatValue: (value: number) => string;
        reduce: boolean;
        canHover: boolean;
    };
};
export declare const useCompositionChart: () => {
    rows: CompositionSeries[];
    columns: {
        id: string;
        valid: boolean;
        segments: (CompositionSeries & {
            value: number | null;
            share: number;
            offset: number;
        })[];
    }[];
    index: number;
    column: {
        id: string;
        valid: boolean;
        segments: (CompositionSeries & {
            value: number | null;
            share: number;
            offset: number;
        })[];
    };
    select: (v: string) => void;
    pinned: string | null;
    highlight: string | null;
    setPinned: (v: string | null) => void;
    setHovered: (v: string | null) => void;
    setFocused: (v: string | null) => void;
    view: "area" | "bar";
    label: string;
    formatValue: (value: number) => string;
    reduce: boolean;
    canHover: boolean;
};
