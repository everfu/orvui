import type { PredictionMarketOrderValue, PredictionMarketOutcome, PredictionMarketQuote } from "./types";
export declare function sanitizeAmount(value: string): string;
export declare function parseAmount(value: string): number;
export declare function formatCurrency(value: number, maximumFractionDigits?: number): string;
export declare function formatCompactCurrency(value: number): string;
export declare function formatCents(value: number): string;
export declare function buildQuote({ order, outcome, balance, position, minTrade, }: {
    order: PredictionMarketOrderValue;
    outcome: PredictionMarketOutcome;
    balance: number;
    position: number;
    minTrade: number;
}): PredictionMarketQuote;
export declare function keyedAmountChars(value: string): {
    id: string;
    char: string;
}[];
export declare function amountInputSize(value: string): "text-3xl sm:text-4xl" | "text-4xl sm:text-5xl" | "text-[44px] sm:text-[56px]" | "text-5xl sm:text-6xl";
export declare function payoutTickerSize(value: number): "text-xl sm:text-2xl" | "text-2xl" | "text-3xl" | "text-4xl";
