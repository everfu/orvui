import { type VNodeChild, type Component } from "vue";
type __VLS_Props = {
    completeLabel?: VNodeChild | Component;
    threshold?: number;
    resetDelay?: number;
    thumbClassName?: string;
    fillClassName?: string;
    disabled?: boolean;
};
declare var __VLS_12: {}, __VLS_20: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_12) => any;
} & {
    completeLabel?: (props: typeof __VLS_20) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    complete: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onComplete?: ((...args: any[]) => any) | undefined;
}>, {
    threshold: number;
    completeLabel: string | number | boolean | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | import("vue").VNodeArrayChildren | import("vue").ComponentOptions<any, any, any, import("vue").ComputedOptions, import("vue").MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, import("vue").ComponentProvideOptions> | import("vue").FunctionalComponent<any, {}, any, {}> | {
        new (...args: any[]): any;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } | null;
    resetDelay: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
