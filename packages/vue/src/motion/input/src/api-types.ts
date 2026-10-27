// Vue public prop types, derived from the actual components.
export type InputProps = InstanceType<
  (typeof import("./Input.vue"))["default"]
>["$props"];
