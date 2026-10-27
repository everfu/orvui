// Vue public prop types, derived from the actual components.
export type SwipeableListProps = InstanceType<
  (typeof import("./SwipeableList.vue"))["default"]
>["$props"];
