import type { VNodeChild } from "vue";
import { type Content } from "../shared";
import type { ApprovalCardStatus, ApprovalCardQuestion, ApprovalCardAnswers } from "./types";
type __VLS_Slots = {
    default?: () => VNodeChild;
};
type __VLS_Props = {
    title?: Content;
    description?: Content;
    questions?: ApprovalCardQuestion[];
    status?: ApprovalCardStatus;
    answers?: ApprovalCardAnswers;
    defaultAnswers?: ApprovalCardAnswers;
    step?: number;
    defaultStep?: number;
    approveLabel?: Content;
    submitLabel?: Content;
    result?: Content;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    submit: (answers: ApprovalCardAnswers) => any;
    "update:answers": (answers: ApprovalCardAnswers) => any;
    answersChange: (answers: ApprovalCardAnswers) => any;
    "update:step": (step: number) => any;
    stepChange: (step: number) => any;
    approve: () => any;
    reject: () => any;
    requestChanges: () => any;
    dismiss: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSubmit?: ((answers: ApprovalCardAnswers) => any) | undefined;
    "onUpdate:answers"?: ((answers: ApprovalCardAnswers) => any) | undefined;
    onAnswersChange?: ((answers: ApprovalCardAnswers) => any) | undefined;
    "onUpdate:step"?: ((step: number) => any) | undefined;
    onStepChange?: ((step: number) => any) | undefined;
    onApprove?: (() => any) | undefined;
    onReject?: (() => any) | undefined;
    onRequestChanges?: (() => any) | undefined;
    onDismiss?: (() => any) | undefined;
}>, {
    title: string | number | boolean | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | import("vue").VNodeArrayChildren | import("vue").ComponentOptions<any, any, any, import("vue").ComputedOptions, import("vue").MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, import("vue").ComponentProvideOptions> | import("vue").FunctionalComponent<any, {}, any, {}> | {
        new (...args: any[]): any;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } | null;
    result: string | number | boolean | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | import("vue").VNodeArrayChildren | import("vue").ComponentOptions<any, any, any, import("vue").ComputedOptions, import("vue").MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, import("vue").ComponentProvideOptions> | import("vue").FunctionalComponent<any, {}, any, {}> | {
        new (...args: any[]): any;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } | null;
    status: ApprovalCardStatus;
    questions: ApprovalCardQuestion[];
    defaultAnswers: ApprovalCardAnswers;
    defaultStep: number;
    approveLabel: string | number | boolean | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | import("vue").VNodeArrayChildren | import("vue").ComponentOptions<any, any, any, import("vue").ComputedOptions, import("vue").MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, import("vue").ComponentProvideOptions> | import("vue").FunctionalComponent<any, {}, any, {}> | {
        new (...args: any[]): any;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } | null;
    submitLabel: string | number | boolean | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
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
