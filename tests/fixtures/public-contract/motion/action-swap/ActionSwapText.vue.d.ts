type __VLS_Props = {
    value: string | number;
    animation?: "cascade" | "blur" | "roll";
};
declare var __VLS_2: {}, __VLS_35: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_2) => any;
} & {
    default?: (props: typeof __VLS_35) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    animation: "blur" | "cascade" | "roll";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
