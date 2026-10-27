import { type CompositionChartProps } from "./context";
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<CompositionChartProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:period": (...args: any[]) => void;
    periodChange: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<CompositionChartProps> & Readonly<{
    "onUpdate:period"?: ((...args: any[]) => any) | undefined;
    onPeriodChange?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
