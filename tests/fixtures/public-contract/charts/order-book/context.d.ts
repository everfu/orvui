import { type DepthLevel } from "./model";
export type OrderBookLevel = {
    price: number;
    size: number;
};
export type OrderBookActiveLevel = {
    side: "bid" | "ask";
    price: number;
} | null;
export interface OrderBookProps {
    bids: readonly OrderBookLevel[];
    asks: readonly OrderBookLevel[];
    levels?: number;
    lastPrice?: number;
    label?: string;
    baseSymbol?: string;
    quoteSymbol?: string;
    formatPrice?: (v: number) => string;
    formatSize?: (v: number) => string;
    activeLevel?: OrderBookActiveLevel;
    defaultActiveLevel?: OrderBookActiveLevel;
    className?: string;
}
export declare function createOrderBookModel(p: OrderBookProps, emit: (e: any, ...a: any[]) => void): {
    book: {
        bidTotal: number;
        askTotal: number;
        maxTotal: number;
        midpoint: number | null;
        spread: number | null;
        bids: DepthLevel[];
        asks: DepthLevel[];
    };
    selectable: boolean;
    bids: DepthLevel[];
    asks: DepthLevel[];
    bidTotal: number;
    askTotal: number;
    maxTotal: number;
    spread: number | null;
    midpoint: number | null;
    active: {
        side: "bid" | "ask";
        index: number;
    } | null;
    summary: import("./model").DepthSummary | null;
    setActiveLevel: (v: OrderBookActiveLevel) => void;
    select: (v: DepthLevel, side: "bid" | "ask") => void;
    price: number | null;
    label: string;
    baseSymbol: string;
    quoteSymbol: string;
    formatPrice: (v: number) => string;
    formatSize: (value: number) => string;
    reduce: boolean;
};
export declare const orderBookContext: {
    key: import("vue").InjectionKey<{
        book: {
            bidTotal: number;
            askTotal: number;
            maxTotal: number;
            midpoint: number | null;
            spread: number | null;
            bids: DepthLevel[];
            asks: DepthLevel[];
        };
        selectable: boolean;
        bids: DepthLevel[];
        asks: DepthLevel[];
        bidTotal: number;
        askTotal: number;
        maxTotal: number;
        spread: number | null;
        midpoint: number | null;
        active: {
            side: "bid" | "ask";
            index: number;
        } | null;
        summary: import("./model").DepthSummary | null;
        setActiveLevel: (v: OrderBookActiveLevel) => void;
        select: (v: DepthLevel, side: "bid" | "ask") => void;
        price: number | null;
        label: string;
        baseSymbol: string;
        quoteSymbol: string;
        formatPrice: (v: number) => string;
        formatSize: (value: number) => string;
        reduce: boolean;
    }>;
    use: () => {
        book: {
            bidTotal: number;
            askTotal: number;
            maxTotal: number;
            midpoint: number | null;
            spread: number | null;
            bids: DepthLevel[];
            asks: DepthLevel[];
        };
        selectable: boolean;
        bids: DepthLevel[];
        asks: DepthLevel[];
        bidTotal: number;
        askTotal: number;
        maxTotal: number;
        spread: number | null;
        midpoint: number | null;
        active: {
            side: "bid" | "ask";
            index: number;
        } | null;
        summary: import("./model").DepthSummary | null;
        setActiveLevel: (v: OrderBookActiveLevel) => void;
        select: (v: DepthLevel, side: "bid" | "ask") => void;
        price: number | null;
        label: string;
        baseSymbol: string;
        quoteSymbol: string;
        formatPrice: (v: number) => string;
        formatSize: (value: number) => string;
        reduce: boolean;
    };
};
export declare const useOrderBook: () => {
    book: {
        bidTotal: number;
        askTotal: number;
        maxTotal: number;
        midpoint: number | null;
        spread: number | null;
        bids: DepthLevel[];
        asks: DepthLevel[];
    };
    selectable: boolean;
    bids: DepthLevel[];
    asks: DepthLevel[];
    bidTotal: number;
    askTotal: number;
    maxTotal: number;
    spread: number | null;
    midpoint: number | null;
    active: {
        side: "bid" | "ask";
        index: number;
    } | null;
    summary: import("./model").DepthSummary | null;
    setActiveLevel: (v: OrderBookActiveLevel) => void;
    select: (v: DepthLevel, side: "bid" | "ask") => void;
    price: number | null;
    label: string;
    baseSymbol: string;
    quoteSymbol: string;
    formatPrice: (v: number) => string;
    formatSize: (value: number) => string;
    reduce: boolean;
};
