export interface LiquiditySnapshot {
    id: string;
    label: string;
    levels: readonly {
        price: number;
        size: number;
    }[];
    price?: number;
}
export declare function buildLiquidityHeatmap(snapshots: readonly LiquiditySnapshot[]): {
    columns: {
        levels: Map<number, number>;
        id: string;
        label: string;
        price?: number;
    }[];
    prices: number[];
    maximum: number;
};
export declare function pricePosition(price: number, prices: readonly number[]): number | null;
