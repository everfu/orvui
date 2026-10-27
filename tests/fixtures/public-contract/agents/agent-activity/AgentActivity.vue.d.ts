import { type VNodeChild } from "vue";
import { type Content } from "../shared";
import type { AgentActivityItem, AgentActivityStatus, AgentActivityContentType } from "./types";
type __VLS_Slots = {
    "working-status"?: (context: {
        label: Content;
        duration: number;
    }) => VNodeChild;
    "completed-status"?: (context: {
        summary: Content;
        duration: number;
    }) => VNodeChild;
};
type __VLS_Props = {
    items: AgentActivityItem[];
    contentType?: AgentActivityContentType;
    status?: AgentActivityStatus;
    duration?: number;
    open?: boolean;
    defaultOpen?: boolean;
    collapseOnComplete?: boolean;
    activeLabel?: Content;
    summary?: Content;
    maxHeight?: number;
    contentClassName?: string;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (open: boolean) => any;
    openChange: (open: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
}>, {
    summary: string | number | boolean | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | import("vue").VNodeArrayChildren | import("vue").ComponentOptions<any, any, any, import("vue").ComputedOptions, import("vue").MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, import("vue").ComponentProvideOptions> | import("vue").FunctionalComponent<any, {}, any, {}> | {
        new (...args: any[]): any;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } | null;
    open: boolean;
    maxHeight: number;
    duration: number;
    status: AgentActivityStatus;
    defaultOpen: boolean;
    collapseOnComplete: boolean;
    activeLabel: string | number | boolean | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | import("vue").VNodeArrayChildren | import("vue").ComponentOptions<any, any, any, import("vue").ComputedOptions, import("vue").MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, import("vue").ComponentProvideOptions> | import("vue").FunctionalComponent<any, {}, any, {}> | {
        new (...args: any[]): any;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } | null;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
