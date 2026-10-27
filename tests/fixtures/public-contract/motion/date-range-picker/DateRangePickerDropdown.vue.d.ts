import type { DateRangeOptions } from "./controller";
type __VLS_Props = DateRangeOptions & {
    placeholder?: string;
    triggerClassName?: string;
    calendarClassName?: string;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (...args: any[]) => void;
    "update:open": (...args: any[]) => void;
    openChange: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
    valueChange: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:open"?: ((...args: any[]) => any) | undefined;
    onOpenChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    onValueChange?: ((...args: any[]) => any) | undefined;
}>, {
    open: boolean;
    autoFocus: boolean;
    showSummary: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
