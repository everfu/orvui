// Vue public prop types, derived from the actual components.
export type DynamicIslandProps = InstanceType<
  (typeof import("./DynamicIsland.vue"))["default"]
>["$props"];
export type DynamicIslandViewProps = InstanceType<
  (typeof import("./DynamicIslandView.vue"))["default"]
>["$props"];
