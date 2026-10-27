export type ArcPickerOption = {
    value: string;
    label: string;
    disabled?: boolean;
};
export type ArcPickerSide = "top" | "bottom" | "left" | "right";
type __VLS_Props = {
    options: readonly ArcPickerOption[];
    modelValue?: string;
    defaultValue?: string;
    side?: ArcPickerSide;
    radius?: number;
    itemHeight?: number;
    visibleCount?: number;
    disabled?: boolean;
    name?: string;
    ariaLabel?: string;
    ariaDescribedby?: string;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}>, {
    radius: number;
    side: ArcPickerSide;
    ariaLabel: string;
    itemHeight: number;
    visibleCount: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
