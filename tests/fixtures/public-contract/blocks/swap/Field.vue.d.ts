import type { Chain, Token, TokenSide } from "./types";
type __VLS_Props = {
    side: TokenSide;
    token: Token;
    chain: Chain;
    amount: string;
    editable: boolean;
    quoting: boolean;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    amount: (amount: string) => any;
    openPicker: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onAmount?: ((amount: string) => any) | undefined;
    onOpenPicker?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
