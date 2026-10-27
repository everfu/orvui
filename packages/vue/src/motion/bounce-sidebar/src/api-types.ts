// Vue public prop types, derived from the actual components.
export type BounceSidebarProps = InstanceType<
  (typeof import("./BounceSidebar.vue"))["default"]
>["$props"];
