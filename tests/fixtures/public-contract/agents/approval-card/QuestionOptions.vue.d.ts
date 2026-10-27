import type { ApprovalCardAnswer, ApprovalCardQuestion } from "./types";
type __VLS_Props = {
    question: ApprovalCardQuestion;
    answer: ApprovalCardAnswer;
    disabled: boolean;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (answer: ApprovalCardAnswer) => any;
    singleSelect: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((answer: ApprovalCardAnswer) => any) | undefined;
    onSingleSelect?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
