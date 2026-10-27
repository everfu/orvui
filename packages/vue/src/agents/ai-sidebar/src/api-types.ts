// Vue public prop types, derived from the actual components.
export type AISidebarProps = InstanceType<
  (typeof import("./AISidebar.vue"))["default"]
>["$props"];
