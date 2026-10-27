// Vue public prop types, derived from the actual components.
export type PreviewRailProps = InstanceType<
  (typeof import("./PreviewRail.vue"))["default"]
>["$props"];
