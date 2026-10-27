type __VLS_Props = {
    label: string;
    state: "idle" | "uploading" | "complete" | "failed" | "removing";
    retryable: boolean;
    reduce: boolean;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    action: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onAction?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
