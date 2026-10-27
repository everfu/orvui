type __VLS_Props = {
    open: boolean;
    side?: "left" | "right" | "bottom" | "center";
    ariaLabel?: string;
    ariaDescribedBy?: string;
    dismissible?: boolean;
    panelClass?: string;
    backdropClass?: string;
    layoutId?: string;
};
declare var __VLS_26: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_26) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:open"?: ((...args: any[]) => any) | undefined;
}>, {
    side: "left" | "right" | "center" | "bottom";
    ariaLabel: string;
    dismissible: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
