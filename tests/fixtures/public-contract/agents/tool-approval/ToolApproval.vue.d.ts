import { type Content } from "../shared";
export type ToolApprovalStatus = "pending" | "approving" | "approved" | "denied" | "running" | "complete" | "error";
export interface ToolApprovalParameter {
    id: string;
    label: Content;
    value: Content;
}
type __VLS_Props = {
    tool: Content;
    title?: Content;
    description?: Content;
    parameters?: ToolApprovalParameter[];
    status?: ToolApprovalStatus;
    open?: boolean;
    defaultOpen?: boolean;
};
declare var __VLS_69: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_69) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (open: boolean) => any;
    openChange: (open: boolean) => any;
    approve: () => any;
    alwaysAllow: () => any;
    deny: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
    onApprove?: (() => any) | undefined;
    onAlwaysAllow?: (() => any) | undefined;
    onDeny?: (() => any) | undefined;
}>, {
    title: string | number | boolean | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | import("vue").VNodeArrayChildren | import("vue").ComponentOptions<any, any, any, import("vue").ComputedOptions, import("vue").MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, import("vue").ComponentProvideOptions> | import("vue").FunctionalComponent<any, {}, any, {}> | {
        new (...args: any[]): any;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } | null;
    open: boolean;
    status: ToolApprovalStatus;
    defaultOpen: boolean;
    parameters: ToolApprovalParameter[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
