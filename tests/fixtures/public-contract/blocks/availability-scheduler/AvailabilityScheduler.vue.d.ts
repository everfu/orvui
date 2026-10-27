import { type WeekAvailability } from "./types";
type __VLS_Props = {
    modelValue?: WeekAvailability;
    defaultValue?: WeekAvailability;
    step?: number;
    disabled?: boolean;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: WeekAvailability) => any;
    "update:modelValue": (value: WeekAvailability) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((value: WeekAvailability) => any) | undefined;
    "onUpdate:modelValue"?: ((value: WeekAvailability) => any) | undefined;
}>, {
    step: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
