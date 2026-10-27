type __VLS_Props = {
    modelValue?: string[];
    defaultValue?: string[];
    open?: boolean;
    defaultOpen?: boolean;
    query?: string;
    defaultQuery?: string;
    disabled?: boolean;
    filter?: (value: string, query: string, keywords: string[]) => boolean;
};
declare var __VLS_1: {
    value: string | string[] | undefined;
    open: boolean;
    query: string;
};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (...args: any[]) => void;
    "update:open": (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
    "update:query": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:open"?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    "onUpdate:query"?: ((...args: any[]) => any) | undefined;
}>, {
    open: boolean;
    defaultOpen: boolean;
    defaultQuery: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
