import { type Content } from "../shared";
export interface PromptModel {
    value: string;
    label: Content;
    icon?: Content;
    disabled?: boolean;
}
export interface PromptAction {
    value: string;
    label: Content;
    description?: Content;
    icon?: Content;
    disabled?: boolean;
}
type __VLS_Props = {
    modelValue?: string;
    defaultValue?: string;
    models?: PromptModel[];
    model?: string;
    defaultModel?: string;
    actions?: PromptAction[];
    loading?: boolean;
    minRows?: number;
    maxRows?: number;
    disabled?: boolean;
    placeholder?: string;
};
declare var __VLS_52: {};
type __VLS_Slots = {} & {
    'leading-action'?: (props: typeof __VLS_52) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    stop: () => any;
    submit: (value: string, model?: string | undefined) => any;
    action: (action: string) => any;
    "update:modelValue": (value: string) => any;
    valueChange: (value: string) => any;
    "update:model": (value: string) => any;
    modelChange: (value: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onStop?: (() => any) | undefined;
    onSubmit?: ((value: string, model?: string | undefined) => any) | undefined;
    onAction?: ((action: string) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onValueChange?: ((value: string) => any) | undefined;
    "onUpdate:model"?: ((value: string) => any) | undefined;
    onModelChange?: ((value: string) => any) | undefined;
}>, {
    placeholder: string;
    loading: boolean;
    defaultValue: string;
    models: PromptModel[];
    actions: PromptAction[];
    minRows: number;
    maxRows: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
