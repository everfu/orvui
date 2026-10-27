// Vue public prop types, derived from the actual components.
export type FileDiffProps = InstanceType<
  (typeof import("./FileDiff.vue"))["default"]
>["$props"];
