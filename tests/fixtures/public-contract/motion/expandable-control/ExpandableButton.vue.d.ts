type __VLS_Props = {
    expanded?: boolean;
    defaultExpanded?: boolean;
    icon?: any;
    label?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
};
declare var __VLS_21: {}, __VLS_40: {};
type __VLS_Slots = {} & {
    icon?: (props: typeof __VLS_21) => any;
} & {
    default?: (props: typeof __VLS_40) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:expanded": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:expanded"?: ((...args: any[]) => any) | undefined;
}>, {
    label: string;
    type: "button" | "reset" | "submit";
    expanded: boolean;
    defaultExpanded: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
