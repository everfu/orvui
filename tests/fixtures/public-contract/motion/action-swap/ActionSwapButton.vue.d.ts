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
    animation?: "cascade" | "blur" | "roll";
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg" | "icon";
    iconOnly?: boolean;
    cycle?: boolean;
    disabled?: boolean;
};
declare var __VLS_21: {
    item: {
        id: string;
        label: VNodeChild | Component;
        icon?: VNodeChild | Component;
        ariaLabel?: string;
    };
}, __VLS_40: {
    item: {
        id: string;
        label: VNodeChild | Component;
        icon?: VNodeChild | Component;
        ariaLabel?: string;
    };
};
type __VLS_Slots = {} & {
    icon?: (props: typeof __VLS_21) => any;
} & {
    default?: (props: typeof __VLS_40) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (...args: any[]) => void;
    click: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
    "update:value": (...args: any[]) => void;
    valueChange: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
    onClick?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    "onUpdate:value"?: ((...args: any[]) => any) | undefined;
    onValueChange?: ((...args: any[]) => any) | undefined;
}>, {
    size: "icon" | "sm" | "md" | "lg";
    animation: "blur" | "cascade" | "roll";
    variant: "outline" | "primary" | "secondary" | "ghost";
    iconOnly: boolean;
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
