import type { Chain, Token } from "./types";
type __VLS_Props = {
    chains?: Chain[];
    tokens?: Token[];
    defaultFromId?: string;
    defaultToId?: string;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    swap: (order: {
        from: Token;
        to: Token;
        amount: number;
        toAmount: number;
        destination?: string;
    }) => any;
    connect: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSwap?: ((order: {
        from: Token;
        to: Token;
        amount: number;
        toAmount: number;
        destination?: string;
    }) => any) | undefined;
    onConnect?: (() => any) | undefined;
}>, {
    tokens: Token[];
    chains: Chain[];
    defaultFromId: string;
    defaultToId: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
