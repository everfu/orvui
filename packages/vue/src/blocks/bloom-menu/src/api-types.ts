// Vue public prop types, derived from the actual components.
export type BloomMenuProps = InstanceType<
  (typeof import("./BloomMenu.vue"))["default"]
>["$props"];
