import type { PredictionMarketClassNames } from "./source-types";
import type { PredictionMarketOrderValue, PredictionMarketOutcome, PredictionMarketQuote } from "./types";
export type { PredictionMarketMode, PredictionMarketOutcome, PredictionMarketOrderValue, PredictionMarketQuote, } from "./types";
type __VLS_Props = {
    outcomes?: PredictionMarketOutcome[];
    modelValue?: PredictionMarketOrderValue;
    defaultValue?: Partial<PredictionMarketOrderValue>;
    authenticated?: boolean;
    orderTypeLabel?: string;
    balance?: number;
    positions?: Record<string, number>;
    quickAmounts?: number[];
    minTrade?: number;
    classNames?: PredictionMarketClassNames;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: PredictionMarketOrderValue) => any;
    valueChange: (value: PredictionMarketOrderValue) => any;
    trade: (order: PredictionMarketOrderValue, quote: PredictionMarketQuote) => any;
    signIn: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: PredictionMarketOrderValue) => any) | undefined;
    onValueChange?: ((value: PredictionMarketOrderValue) => any) | undefined;
    onTrade?: ((order: PredictionMarketOrderValue, quote: PredictionMarketQuote) => any) | undefined;
    onSignIn?: (() => any) | undefined;
}>, {
    balance: number;
    minTrade: number;
    outcomes: PredictionMarketOutcome[];
    authenticated: boolean;
    orderTypeLabel: string;
    positions: Record<string, number>;
    quickAmounts: number[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
