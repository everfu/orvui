// Vue public prop types, derived from the actual components.
export type AgentProgressProps = InstanceType<
  (typeof import("./AgentProgress.vue"))["default"]
>["$props"];
export type ReasoningTextProps = InstanceType<
  (typeof import("./ReasoningText.vue"))["default"]
>["$props"];
export type ThinkingShimmerProps = InstanceType<
  (typeof import("./ThinkingShimmer.vue"))["default"]
>["$props"];
