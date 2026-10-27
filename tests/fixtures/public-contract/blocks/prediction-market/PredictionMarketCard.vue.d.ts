import { type Content } from "../shared";
export interface PredictionMarketCardOutcome {
    id: string;
    label: string;
    probability: number;
    icon?: Content;
    color?: string;
}
export interface PredictionMarketCardSelection {
    outcomeId: string;
    side: "yes" | "no";
}
type __VLS_Props = {
    title: string;
    icon?: Content;
    category?: string;
    volume: string;
    volumeHistory?: number[];
    status?: string;
    live?: boolean;
    outcomes: PredictionMarketCardOutcome[];
    bookmarked?: boolean;
    defaultBookmarked?: boolean;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    outcomeClick: (selection: PredictionMarketCardSelection) => any;
    "update:bookmarked": (bookmarked: boolean) => any;
    bookmarkChange: (bookmarked: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onOutcomeClick?: ((selection: PredictionMarketCardSelection) => any) | undefined;
    "onUpdate:bookmarked"?: ((bookmarked: boolean) => any) | undefined;
    onBookmarkChange?: ((bookmarked: boolean) => any) | undefined;
}>, {
    volumeHistory: number[];
    live: boolean;
    bookmarked: boolean;
    defaultBookmarked: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
