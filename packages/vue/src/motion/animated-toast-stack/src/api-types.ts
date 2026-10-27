// Vue public prop types, derived from the actual components.
export type AnimatedToastStackProps = InstanceType<
  (typeof import("./AnimatedToastStack.vue"))["default"]
>["$props"];
