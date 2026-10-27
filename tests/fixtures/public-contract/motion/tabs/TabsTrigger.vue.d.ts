type __VLS_Props = {
    value: string;
    disabled?: boolean;
    icon?: any;
    indicatorClassName?: string;
};
declare var __VLS_8: {}, __VLS_10: {}, __VLS_34: {}, __VLS_36: {}, __VLS_45: {}, __VLS_47: {};
type __VLS_Slots = {} & {
    icon?: (props: typeof __VLS_8) => any;
} & {
    default?: (props: typeof __VLS_10) => any;
} & {
    icon?: (props: typeof __VLS_34) => any;
} & {
    default?: (props: typeof __VLS_36) => any;
} & {
    icon?: (props: typeof __VLS_45) => any;
} & {
    default?: (props: typeof __VLS_47) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
