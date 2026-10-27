export type DepthLevel = {
    price: number;
    size: number;
    total: number;
};
type Level = {
    price: number;
    size: number;
};
export type DepthSummary = {
    side: "bid" | "ask";
    levels: number;
    size: number;
    quote: number;
    averagePrice: number;
};
export declare function summarizeDepth(levels: readonly DepthLevel[], side: "bid" | "ask"): DepthSummary;
export declare function buildOrderBook(bids: readonly Level[], asks: readonly Level[], levels: number): {
    bidTotal: number;
    askTotal: number;
    maxTotal: number;
    midpoint: number | null;
    spread: number | null;
    bids: DepthLevel[];
    asks: DepthLevel[];
};
export {};
