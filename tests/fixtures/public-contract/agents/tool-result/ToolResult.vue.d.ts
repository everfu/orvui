import { type Content } from "../shared";
export type ToolResultStatus = "running" | "success" | "error" | "cancelled";
export type ToolResultKind = "terminal" | "request" | "custom";
type __VLS_Props = {
    tool: Content;
    title: Content;
    status?: ToolResultStatus;
    kind?: ToolResultKind;
    meta?: Content;
    icon?: Content;
    open?: boolean;
    defaultOpen?: boolean;
    collapseOnComplete?: boolean;
    maxHeight?: number;
    copyText?: string;
    onCopy?: () => void | Promise<void>;
    contentClassName?: string;
};
declare var __VLS_97: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_97) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (open: boolean) => any;
    openChange: (open: boolean) => any;
    retry: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
    onRetry?: (() => any) | undefined;
}>, {
    open: boolean;
    maxHeight: number;
    status: ToolResultStatus;
    defaultOpen: boolean;
    collapseOnComplete: boolean;
    kind: ToolResultKind;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
