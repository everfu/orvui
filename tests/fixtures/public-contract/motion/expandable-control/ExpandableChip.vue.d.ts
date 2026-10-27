type __VLS_Props = {
    expanded?: boolean;
    defaultExpanded?: boolean;
    label: string;
    actionIcon?: any;
    actionLabel?: string;
    collapseOnAction?: boolean;
    disabled?: boolean;
    labelClassName?: string;
    actionClassName?: string;
};
declare var __VLS_35: {};
type __VLS_Slots = {} & {
    actionIcon?: (props: typeof __VLS_35) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    action: (...args: any[]) => void;
    "update:expanded": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onAction?: ((...args: any[]) => any) | undefined;
    "onUpdate:expanded"?: ((...args: any[]) => any) | undefined;
}>, {
    expanded: boolean;
    actionLabel: string;
    defaultExpanded: boolean;
    collapseOnAction: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
