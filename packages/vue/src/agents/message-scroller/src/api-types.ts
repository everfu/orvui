// Vue public prop types, derived from the actual components.
export type MessageScrollerProps = InstanceType<
  (typeof import("./MessageScroller.vue"))["default"]
>["$props"];
