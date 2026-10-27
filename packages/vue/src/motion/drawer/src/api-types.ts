// Vue public prop types, derived from the actual components.
export type DrawerProps = InstanceType<
  (typeof import("./Drawer.vue"))["default"]
>["$props"];
