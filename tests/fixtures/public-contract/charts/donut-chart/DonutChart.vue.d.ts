import { type DonutChartProps } from "./context";
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<DonutChartProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    select: (...args: any[]) => void;
    "update:activeId": (...args: any[]) => void;
    activeChange: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<DonutChartProps> & Readonly<{
    onSelect?: ((...args: any[]) => any) | undefined;
    "onUpdate:activeId"?: ((...args: any[]) => any) | undefined;
    onActiveChange?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
