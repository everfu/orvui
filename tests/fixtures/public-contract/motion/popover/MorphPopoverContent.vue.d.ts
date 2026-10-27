import { type Ref } from "vue";
type __VLS_Props = {
    side?: "top" | "bottom";
    align?: "start" | "end";
    sideOffset?: number;
    radius?: number;
    shadow?: boolean;
    initialFocus?: HTMLElement | Ref<HTMLElement | null> | null;
    onOpenAutoFocus?: (content: HTMLDivElement) => void;
    className?: string;
};
declare var __VLS_19: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_19) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    radius: number;
    side: "top" | "bottom";
    align: "end" | "start";
    sideOffset: number;
    shadow: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
