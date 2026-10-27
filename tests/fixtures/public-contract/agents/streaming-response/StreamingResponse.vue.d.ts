import { type CitationItem } from "../citations";
export type StreamingResponseStatus = "streaming" | "complete" | "error";
export type StreamingResponseFeedback = "up" | "down" | null;
type __VLS_Props = {
    status?: StreamingResponseStatus;
    copyText?: string;
    onCopy?: () => void | Promise<void>;
    sources?: CitationItem[];
    sourcesOpen?: boolean;
    defaultSourcesOpen?: boolean;
    sourceIdPrefix?: string;
    feedback?: StreamingResponseFeedback;
    defaultFeedback?: StreamingResponseFeedback;
    announce?: boolean;
    showActions?: boolean;
    contentClassName?: string;
    actionsClassName?: string;
};
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    retry: () => any;
    "update:sourcesOpen": (open: boolean) => any;
    sourcesOpenChange: (open: boolean) => any;
    "update:feedback": (feedback: StreamingResponseFeedback) => any;
    feedbackChange: (feedback: StreamingResponseFeedback) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onRetry?: (() => any) | undefined;
    "onUpdate:sourcesOpen"?: ((open: boolean) => any) | undefined;
    onSourcesOpenChange?: ((open: boolean) => any) | undefined;
    "onUpdate:feedback"?: ((feedback: StreamingResponseFeedback) => any) | undefined;
    onFeedbackChange?: ((feedback: StreamingResponseFeedback) => any) | undefined;
}>, {
    status: StreamingResponseStatus;
    sources: CitationItem[];
    sourcesOpen: boolean;
    defaultSourcesOpen: boolean;
    defaultFeedback: StreamingResponseFeedback;
    announce: boolean;
    showActions: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
