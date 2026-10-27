import { type Ref } from "vue";
export interface InputProps {
    modelValue?: string;
    defaultValue?: string;
    label?: string;
    error?: string | boolean;
    reserveErrorLine?: boolean;
    success?: boolean;
    disabled?: boolean;
    type?: string;
    id?: string;
    leftIcon?: any;
    rightIcon?: any;
    classNames?: Record<string, string>;
}
declare var __VLS_1: {}, __VLS_19: {};
type __VLS_Slots = {} & {
    leftIcon?: (props: typeof __VLS_1) => any;
} & {
    rightIcon?: (props: typeof __VLS_19) => any;
};
declare const __VLS_base: import("vue").DefineComponent<InputProps, {
    focus: () => void | undefined;
    input: Ref<HTMLInputElement | null, HTMLInputElement | null>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    focus: (...args: any[]) => void;
    change: (...args: any[]) => void;
    blur: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<InputProps> & Readonly<{
    onFocus?: ((...args: any[]) => any) | undefined;
    onChange?: ((...args: any[]) => any) | undefined;
    onBlur?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}>, {
    type: string;
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
