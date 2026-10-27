export type ImageGenerationStatus = "queued" | "generating" | "refining" | "complete" | "error";
type __VLS_Props = {
    status?: ImageGenerationStatus;
    label?: string;
    prompt?: string;
    resolution?: string;
    aspectRatio?: string | number;
    size?: "compact" | "fluid";
    interactive?: boolean;
    statusText?: string;
    showStatus?: boolean;
    mediaClassName?: string;
    statusClassName?: string;
};
declare var __VLS_7: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_7) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    retry: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onRetry?: (() => any) | undefined;
}>, {
    size: "compact" | "fluid";
    aspectRatio: string | number;
    status: ImageGenerationStatus;
    resolution: string;
    interactive: boolean;
    showStatus: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
