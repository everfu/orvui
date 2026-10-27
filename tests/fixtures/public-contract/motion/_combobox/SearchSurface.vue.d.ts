import type { SearchController } from "./controller";
type __VLS_Props = {
    context: SearchController;
    side?: "top" | "bottom";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    avoidCollisions?: boolean;
};
declare var __VLS_19: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_19) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    side: "top" | "bottom";
    align: "center" | "end" | "start";
    sideOffset: number;
    avoidCollisions: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
