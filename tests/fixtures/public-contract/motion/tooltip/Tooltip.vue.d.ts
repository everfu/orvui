import { type VNodeChild } from "vue";
import { type TooltipRootProps, type TooltipContentProps } from "./context";
export interface TooltipProps extends TooltipRootProps, TooltipContentProps {
    content?: VNodeChild;
}
declare var __VLS_7: {}, __VLS_20: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_7) => any;
} & {
    default?: (props: typeof __VLS_20) => any;
};
declare const __VLS_base: import("vue").DefineComponent<TooltipProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (...args: any[]) => void;
    openChange: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<TooltipProps> & Readonly<{
    "onUpdate:open"?: ((...args: any[]) => any) | undefined;
    onOpenChange?: ((...args: any[]) => any) | undefined;
}>, {
    open: boolean;
    content: string | number | boolean | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | import("vue").VNodeArrayChildren | null;
    defaultOpen: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
