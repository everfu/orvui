declare var __VLS_2: {
    segment: import("./model").PlacedSegment;
}, __VLS_4: {
    segment: import("./model").PlacedSegment;
};
type __VLS_Slots = {} & {
    value?: (props: typeof __VLS_2) => any;
} & {
    detail?: (props: typeof __VLS_4) => any;
};
declare const __VLS_base: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
