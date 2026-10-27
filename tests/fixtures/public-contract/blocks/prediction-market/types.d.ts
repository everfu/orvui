export type PredictionMarketMode = "buy" | "sell";
export type PredictionMarketOutcome = {
    id: string;
    label: string;
    price: number;
};
export type PredictionMarketOrderValue = {
    mode: PredictionMarketMode;
    outcomeId: string;
    amount: string;
};
export type PredictionMarketQuote = {
    valid: boolean;
    amount: number;
    price: number;
    shares: number;
    payout: number;
    error?: string;
};
