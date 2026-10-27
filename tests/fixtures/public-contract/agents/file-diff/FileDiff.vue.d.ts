import { type AgentCodeLanguage } from "../code-block";
import { type Content } from "../shared";
import type { FileDiffStatus, FileDiffLine } from "./types";
type __VLS_Props = {
    file: Content;
    lines: FileDiffLine[];
    status?: FileDiffStatus;
    open?: boolean;
    defaultOpen?: boolean;
    collapseOnComplete?: boolean;
    maxHeight?: number;
    language?: AgentCodeLanguage;
    copyText?: string;
    onCopy?: () => void | Promise<void>;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (open: boolean) => any;
    openChange: (open: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
}>, {
    open: boolean;
    maxHeight: number;
    status: FileDiffStatus;
    defaultOpen: boolean;
    collapseOnComplete: boolean;
    language: AgentCodeLanguage;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
