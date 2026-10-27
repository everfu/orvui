import type { Content as ReactNode } from "../shared";
export type AgentActivityStatus = "working" | "complete";
export type AgentStepStatus = "pending" | "active" | "complete";
export interface AgentActivityStep {
    id: string;
    type: "step";
    label: ReactNode;
    status?: AgentStepStatus;
    meta?: ReactNode;
}
export interface AgentActivityText {
    id: string;
    type: "text";
    content: ReactNode;
}
export interface AgentSearchResult {
    id: string;
    title: ReactNode;
    domain?: ReactNode;
    url?: string;
    icon?: ReactNode;
}
export interface AgentActivitySearch {
    id: string;
    type: "search";
    query: ReactNode;
    results?: AgentSearchResult[];
    moreCount?: number;
}
export interface AgentActivityTool {
    id: string;
    type: "tool";
    action: "read" | "edit" | "run" | (string & {});
    target: ReactNode;
    additions?: number;
    deletions?: number;
}
export type AgentTraceKind = "thinking" | "message" | "write" | "run" | "read" | (string & {});
export interface AgentActivityTrace {
    id: string;
    type: "trace";
    kind: AgentTraceKind;
    label: ReactNode;
    detail?: ReactNode;
    icon?: ReactNode;
}
export type AgentActivityItem = AgentActivityStep | AgentActivityText | AgentActivitySearch | AgentActivityTool | AgentActivityTrace;
export type AgentActivityContentType = AgentActivityItem["type"] | "mixed";
export type AgentActivityProps = InstanceType<(typeof import("./AgentActivity.vue"))["default"]>["$props"];
