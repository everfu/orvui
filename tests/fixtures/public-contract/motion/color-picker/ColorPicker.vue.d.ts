type __VLS_Props = {
    modelValue?: string;
    value?: string;
    defaultValue?: string;
    open?: boolean;
    defaultOpen?: boolean;
    alpha?: boolean;
    disabled?: boolean;
    name?: string;
    form?: string;
};
declare function setColor(value: string): void;
declare var __VLS_1: {
    hex: string;
    hsva: {
        h: number;
        s: number;
        v: number;
        a: number;
    };
    setColor: typeof setColor;
};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (...args: any[]) => void;
    "update:open": (...args: any[]) => void;
    openChange: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
    valueChange: (...args: any[]) => void;
    valueCommit: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:open"?: ((...args: any[]) => any) | undefined;
    onOpenChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    onValueChange?: ((...args: any[]) => any) | undefined;
    onValueCommit?: ((...args: any[]) => any) | undefined;
}>, {
    open: boolean;
    alpha: boolean;
    defaultOpen: boolean;
    defaultValue: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
