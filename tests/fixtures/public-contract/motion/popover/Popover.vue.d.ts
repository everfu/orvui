import { type PopoverProps } from "./context";
declare var __VLS_1: {
    open: boolean;
};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<PopoverProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (...args: any[]) => void;
    openChange: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<PopoverProps> & Readonly<{
    "onUpdate:open"?: ((...args: any[]) => any) | undefined;
    onOpenChange?: ((...args: any[]) => any) | undefined;
}>, {
    open: boolean;
    side: import("./geometry").Side;
    trigger: "click" | "hover";
    defaultOpen: boolean;
    align: import("./geometry").Align;
    sideOffset: number;
    panelRadius: number;
    gooStrength: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
