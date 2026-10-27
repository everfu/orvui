export type AgentCodeLanguage = "bash" | "diff" | "json" | "text" | "tsx" | "typescript" | "javascript" | "vue" | "css" | "html";
type __VLS_Props = {
    code: string;
    language?: AgentCodeLanguage;
    showLineNumbers?: boolean;
    highlightLines?: number[];
    wrap?: boolean;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    wrap: boolean;
    language: AgentCodeLanguage;
    showLineNumbers: boolean;
    highlightLines: number[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
