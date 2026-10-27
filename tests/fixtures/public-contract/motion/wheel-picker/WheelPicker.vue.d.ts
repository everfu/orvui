export type WheelPickerOption = string | {
    label: string;
    value: string;
};
type __VLS_Props = {
    options: WheelPickerOption[];
    modelValue?: string;
    defaultValue?: string;
    visibleCount?: number;
    itemHeight?: number;
    disabled?: boolean;
    sound?: boolean;
    ariaLabel?: string;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}>, {
    itemHeight: number;
    visibleCount: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
