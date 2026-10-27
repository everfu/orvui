import type { TimeOption } from "./types";
type __VLS_Props = {
    value: string;
    open: boolean;
    options: TimeOption[];
    disabled?: boolean;
    label?: string;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: string) => any;
    "update:open": (open: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((value: string) => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
