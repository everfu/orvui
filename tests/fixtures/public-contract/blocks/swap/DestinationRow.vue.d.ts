type __VLS_Props = {
    show: boolean;
    address: string;
    reduce: boolean;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    address: (address: string) => any;
    toggle: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onAddress?: ((address: string) => any) | undefined;
    onToggle?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
