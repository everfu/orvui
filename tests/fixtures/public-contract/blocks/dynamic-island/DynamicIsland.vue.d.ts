import { type Content } from "../shared";
type __VLS_Props = {
    view: string | null;
    compact?: Content;
};
declare var __VLS_19: {}, __VLS_26: {};
type __VLS_Slots = {} & {
    compact?: (props: typeof __VLS_19) => any;
} & {
    default?: (props: typeof __VLS_26) => any;
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
