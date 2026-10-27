// Vue public prop types, derived from the actual components.
export type ThemeToggleProps = InstanceType<
  (typeof import("./ThemeToggle.vue"))["default"]
>["$props"];
