type __VLS_Props = {
    open: boolean;
    anchor: HTMLElement | null;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    role?: string;
};
declare var __VLS_21: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_21) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClose?: ((...args: any[]) => any) | undefined;
}>, {
    role: string;
    side: "top" | "left" | "right" | "bottom";
    align: "center" | "end" | "start";
    sideOffset: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
