import { type LiquiditySnapshot } from "./model";
export interface LiquidityHeatmapProps {
    snapshots: readonly LiquiditySnapshot[];
    maxSize?: number;
    unit?: string;
    label?: string;
    formatPrice?: (v: number) => string;
    formatSize?: (v: number) => string;
    className?: string;
}
export declare function createLiquidityModel(p: LiquidityHeatmapProps): {
    columns: {
        levels: Map<number, number>;
        id: string;
        label: string;
        price?: number;
    }[];
    prices: number[];
    ceiling: number;
    unit: string;
    label: string;
    formatPrice: (value: number) => string;
    formatSize: (value: number) => string;
    reduce: boolean;
};
export declare const liquidityContext: {
    key: import("vue").InjectionKey<{
        columns: {
            levels: Map<number, number>;
            id: string;
            label: string;
            price?: number;
        }[];
        prices: number[];
        ceiling: number;
        unit: string;
        label: string;
        formatPrice: (value: number) => string;
        formatSize: (value: number) => string;
        reduce: boolean;
    }>;
    use: () => {
        columns: {
            levels: Map<number, number>;
            id: string;
            label: string;
            price?: number;
        }[];
        prices: number[];
        ceiling: number;
        unit: string;
        label: string;
        formatPrice: (value: number) => string;
        formatSize: (value: number) => string;
        reduce: boolean;
    };
};
export declare const useLiquidityHeatmap: () => {
    columns: {
        levels: Map<number, number>;
        id: string;
        label: string;
        price?: number;
    }[];
    prices: number[];
    ceiling: number;
    unit: string;
    label: string;
    formatPrice: (value: number) => string;
    formatSize: (value: number) => string;
    reduce: boolean;
};
export declare const LIQUIDITY_COLORS: string[];
export declare const heatColor: (v: number, max: number) => string;
