import type { Content } from "../../shared";

export type AgentActivityStatus = "working" | "complete";
export type AgentStepStatus = "pending" | "active" | "complete";

export interface AgentActivityStep {
  id: string;
  type: "step";
  label: Content;
  status?: AgentStepStatus;
  meta?: Content;
}

export interface AgentActivityText {
  id: string;
  type: "text";
  content: Content;
}

export interface AgentSearchResult {
  id: string;
  title: Content;
  domain?: Content;
  url?: string;
  icon?: Content;
}

export interface AgentActivitySearch {
  id: string;
  type: "search";
  query: Content;
  results?: AgentSearchResult[];
  moreCount?: number;
}

export interface AgentActivityTool {
  id: string;
  type: "tool";
  action: "read" | "edit" | "run" | (string & {});
  target: Content;
  additions?: number;
  deletions?: number;
}

export type AgentTraceKind =
  "thinking" | "message" | "write" | "run" | "read" | (string & {});

export interface AgentActivityTrace {
  id: string;
  type: "trace";
  kind: AgentTraceKind;
  label: Content;
  detail?: Content;
  icon?: Content;
}

export type AgentActivityItem =
  | AgentActivityStep
  | AgentActivityText
  | AgentActivitySearch
  | AgentActivityTool
  | AgentActivityTrace;

export type AgentActivityContentType = AgentActivityItem["type"] | "mixed";

/** Vue props; working-status/completed-status content is passed through scoped slots. */
export type AgentActivityProps = InstanceType<
  (typeof import("./AgentActivity.vue"))["default"]
>["$props"];
