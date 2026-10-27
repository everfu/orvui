import { type DayKey } from "./types";
type __VLS_Props = {
    fromLabel: string;
    reduce: boolean;
    disabled?: boolean;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    apply: (targets: DayKey[]) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onApply?: ((targets: DayKey[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
