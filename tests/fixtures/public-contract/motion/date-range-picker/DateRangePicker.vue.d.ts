import { type DateRangeOptions } from "./controller";
declare var __VLS_9: {
    value: import("./types").DateRange | null;
    selectDate: (date: string) => void;
    clear: () => void;
};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_9) => any;
};
declare const __VLS_base: import("vue").DefineComponent<DateRangeOptions, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (...args: any[]) => void;
    "update:open": (...args: any[]) => void;
    openChange: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
    valueChange: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<DateRangeOptions> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:open"?: ((...args: any[]) => any) | undefined;
    onOpenChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    onValueChange?: ((...args: any[]) => any) | undefined;
}>, {
    label: string;
    open: boolean;
    defaultOpen: boolean;
    defaultValue: import("./types").DateRange | null;
    closeOnSelect: boolean;
    locale: string;
    showSummary: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
