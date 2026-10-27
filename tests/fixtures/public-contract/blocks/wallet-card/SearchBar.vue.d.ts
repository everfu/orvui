type __VLS_Props = {
    placeholder?: string;
    recent?: string[];
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (query: string) => any;
    submit: (query: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((query: string) => any) | undefined;
    onSubmit?: ((query: string) => any) | undefined;
}>, {
    placeholder: string;
    recent: string[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
