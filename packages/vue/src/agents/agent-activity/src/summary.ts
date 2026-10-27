import type { Content } from "../../shared";
import type { AgentActivityContentType, AgentActivityItem } from "./types";
export function activityKind(
  items: AgentActivityItem[],
  empty: AgentActivityContentType = "mixed",
): AgentActivityContentType {
  if (!items.length) return empty;
  const first = items[0].type;
  return items.some((item) => item.type !== first) ? "mixed" : first;
}
export function activitySummary(
  items: AgentActivityItem[],
  kind: AgentActivityContentType,
  duration: number,
): Content {
  switch (kind) {
    case "text":
    case "step": {
      const seconds = Math.max(0, Math.round(duration));
      const parts =
        seconds < 60
          ? `${seconds}s`
          : `${Math.floor(seconds / 60)}m${seconds % 60 ? ` ${seconds % 60}s` : ""}`;
      return `Thought for ${parts}`;
    }
    case "search":
      return "Searched the web";
    case "tool":
      return `Ran ${items.length} ${items.length === 1 ? "tool" : "tools"}`;
    case "trace": {
      const messages = items.reduce(
        (count, item) =>
          count +
          Number(
            item.type === "trace" &&
              ["thinking", "message"].includes(item.kind),
          ),
        0,
      );
      const calls = items.length - messages;
      return `${calls} ${calls === 1 ? "tool call" : "tool calls"}, ${messages} ${messages === 1 ? "message" : "messages"}`;
    }
    default:
      return `Completed ${items.length} ${items.length === 1 ? "step" : "steps"}`;
  }
}
