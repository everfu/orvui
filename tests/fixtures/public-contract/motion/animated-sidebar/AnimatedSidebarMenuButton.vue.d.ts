type __VLS_Props = {
    href?: string;
    isActive?: boolean;
    ariaExpanded?: boolean;
    disabled?: boolean;
    closeOnSelect?: boolean;
    icon?: any;
    badge?: any;
    target?: string;
    rel?: string;
};
declare var __VLS_14: {}, __VLS_27: {};
type __VLS_Slots = {} & {
    icon?: (props: typeof __VLS_14) => any;
} & {
    default?: (props: typeof __VLS_27) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    select: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSelect?: ((...args: any[]) => any) | undefined;
}>, {
    ariaExpanded: boolean;
    closeOnSelect: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
