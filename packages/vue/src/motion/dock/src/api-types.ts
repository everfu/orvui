// Vue public prop types, derived from the actual components.
export type DockItemProps = InstanceType<
  (typeof import("./DockItem.vue"))["default"]
>["$props"];
export type DockProps = InstanceType<
  (typeof import("./Dock.vue"))["default"]
>["$props"];
