import { type Content } from "../shared";
import type { AgentCodeLanguage } from "./AgentCode.vue";
type __VLS_Props = {
    code: string;
    language?: AgentCodeLanguage;
    filename?: Content;
    status?: "streaming" | "complete";
    showLineNumbers?: boolean;
    highlightLines?: number[];
    maxHeight?: number;
    wrap?: boolean;
    copyable?: boolean;
    onCopy?: () => void | Promise<void>;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    maxHeight: number;
    status: "complete" | "streaming";
    wrap: boolean;
    language: AgentCodeLanguage;
    showLineNumbers: boolean;
    highlightLines: number[];
    copyable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
