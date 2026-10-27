// Vue public prop types, derived from the actual components.
export type CheckboxProps = InstanceType<
  (typeof import("./Checkbox.vue"))["default"]
>["$props"];
