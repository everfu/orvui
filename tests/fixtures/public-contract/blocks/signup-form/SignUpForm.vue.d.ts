import { type Content } from "../shared";
import { type SignUpValues, type SignUpStatus, type SignUpErrors } from "./types";
import type { SignUpFormClassNames } from "./source-types";
type __VLS_Props = {
    modelValue?: SignUpValues;
    values?: SignUpValues;
    defaultValues?: Partial<SignUpValues>;
    validate?: (values: SignUpValues) => SignUpErrors;
    status?: SignUpStatus;
    errorMessage?: string;
    title?: Content;
    description?: Content;
    submitLabel?: string;
    footer?: Content;
    strengthMeter?: boolean;
    className?: string;
    classNames?: SignUpFormClassNames;
    onSubmit?: (values: SignUpValues) => void | Promise<void>;
};
declare var __VLS_110: {};
type __VLS_Slots = {} & {
    footer?: (props: typeof __VLS_110) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    error: (error: unknown) => any;
    "update:modelValue": (values: SignUpValues) => any;
    success: (values: SignUpValues) => any;
    valuesChange: (values: SignUpValues) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onError?: ((error: unknown) => any) | undefined;
    "onUpdate:modelValue"?: ((values: SignUpValues) => any) | undefined;
    onSuccess?: ((values: SignUpValues) => any) | undefined;
    onValuesChange?: ((values: SignUpValues) => any) | undefined;
}>, {
    title: string | number | boolean | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | import("vue").VNodeArrayChildren | import("vue").ComponentOptions<any, any, any, import("vue").ComputedOptions, import("vue").MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, import("vue").ComponentProvideOptions> | import("vue").FunctionalComponent<any, {}, any, {}> | {
        new (...args: any[]): any;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } | null;
    description: string | number | boolean | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | import("vue").VNodeArrayChildren | import("vue").ComponentOptions<any, any, any, import("vue").ComputedOptions, import("vue").MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, import("vue").ComponentProvideOptions> | import("vue").FunctionalComponent<any, {}, any, {}> | {
        new (...args: any[]): any;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } | null;
    submitLabel: string;
    strengthMeter: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
