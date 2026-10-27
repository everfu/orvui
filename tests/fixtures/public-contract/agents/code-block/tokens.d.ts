import { type MaybeRefOrGetter } from "vue";
import type { AgentCodeLanguage } from "./AgentCode.vue";
export interface AgentCodeToken {
    content: string;
    offset: number;
    light?: string;
    dark?: string;
}
export type AgentCodeTokenLines = AgentCodeToken[][];
export declare function useAgentCodeTokens(code: MaybeRefOrGetter<string>, language: MaybeRefOrGetter<AgentCodeLanguage>): import("vue").ComputedRef<AgentCodeTokenLines | null>;
