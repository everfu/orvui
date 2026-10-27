// Vue public prop types, derived from the actual components.
export type TimelineProps = InstanceType<
  (typeof import("./Timeline.vue"))["default"]
>["$props"];
