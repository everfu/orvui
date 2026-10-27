// Vue public prop types, derived from the actual components.
export type SwitchProps = InstanceType<
  (typeof import("./Switch.vue"))["default"]
>["$props"];
