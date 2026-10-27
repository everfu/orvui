export type Candle = {
    id: string;
    label: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
};
export interface CandlestickChartProps {
    candles: readonly Candle[];
    lastPrice?: number;
    activeId?: string | null;
    defaultActiveId?: string | null;
    formatPrice?: (v: number) => string;
    formatVolume?: (v: number) => string;
    label?: string;
    className?: string;
}
export declare function createCandlestickModel(p: CandlestickChartProps, emit: (e: any, ...a: any[]) => void): {
    candles: readonly Candle[];
    lastPrice: number | undefined;
    active: number | null;
    setActive: (i: number | null) => void;
    scale: {
        min: number;
        max: number;
        volumeMax: number;
    };
    formatPrice: (value: number) => string;
    formatVolume: (value: number) => string;
    label: string;
    reduce: boolean;
};
export declare const candlestickContext: {
    key: import("vue").InjectionKey<{
        candles: readonly Candle[];
        lastPrice: number | undefined;
        active: number | null;
        setActive: (i: number | null) => void;
        scale: {
            min: number;
            max: number;
            volumeMax: number;
        };
        formatPrice: (value: number) => string;
        formatVolume: (value: number) => string;
        label: string;
        reduce: boolean;
    }>;
    use: () => {
        candles: readonly Candle[];
        lastPrice: number | undefined;
        active: number | null;
        setActive: (i: number | null) => void;
        scale: {
            min: number;
            max: number;
            volumeMax: number;
        };
        formatPrice: (value: number) => string;
        formatVolume: (value: number) => string;
        label: string;
        reduce: boolean;
    };
};
export declare const useCandlestickChart: () => {
    candles: readonly Candle[];
    lastPrice: number | undefined;
    active: number | null;
    setActive: (i: number | null) => void;
    scale: {
        min: number;
        max: number;
        volumeMax: number;
    };
    formatPrice: (value: number) => string;
    formatVolume: (value: number) => string;
    label: string;
    reduce: boolean;
};
