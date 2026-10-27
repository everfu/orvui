export type OTPStatus = "idle" | "error" | "success";
type __VLS_Props = {
    length?: number;
    modelValue?: string;
    value?: string;
    defaultValue?: string;
    label?: string;
    hint?: string;
    successMessage?: string;
    errorMessage?: string;
    status?: OTPStatus;
    mask?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
    ariaLabel?: string;
    className?: string;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: string) => any;
    complete: (value: string) => any;
    "update:modelValue": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((value: string) => any) | undefined;
    onComplete?: ((value: string) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    length: number;
    mask: boolean;
    status: OTPStatus;
    disabled: boolean;
    autoFocus: boolean;
    ariaLabel: string;
    defaultValue: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
