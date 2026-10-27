type __VLS_Props = {
    open: boolean;
    anchor: HTMLElement | null;
    id: string;
    point?: {
        x: number;
        y: number;
    };
    side?: "top" | "right" | "bottom" | "left";
    followCursor?: boolean;
};
declare var __VLS_13: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_13) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:open"?: ((...args: any[]) => any) | undefined;
}>, {
    side: "top" | "left" | "right" | "bottom";
    followCursor: boolean;
    point: {
        x: number;
        y: number;
    };
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
