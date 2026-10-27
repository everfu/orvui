import { type VNodeChild, type Component } from "vue";
type __VLS_Props = {
    items: {
        id: string;
        label: VNodeChild | Component;
        icon?: VNodeChild | Component;
        ariaLabel?: string;
    }[];
    modelValue?: string;
    value?: string;
    defaultValue?: string;
    cycle?: boolean;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg" | "icon";
};
declare var __VLS_12: {
    item: {
        id: string;
        label: VNodeChild | Component;
        icon?: VNodeChild | Component;
        ariaLabel?: string;
    };
}, __VLS_15: {
    item: {
        id: string;
        label: VNodeChild | Component;
        icon?: VNodeChild | Component;
        ariaLabel?: string;
    };
};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_12) => any;
} & {
    icon?: (props: typeof __VLS_15) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (...args: any[]) => void;
    "update:value": (...args: any[]) => void;
    valueChange: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    "onUpdate:value"?: ((...args: any[]) => any) | undefined;
    onValueChange?: ((...args: any[]) => any) | undefined;
}>, {
    cycle: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
