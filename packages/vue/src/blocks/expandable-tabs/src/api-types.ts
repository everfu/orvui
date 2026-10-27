// Vue public prop types, derived from the actual components.
export type ExpandableTabsProps = InstanceType<
  (typeof import("./ExpandableTabs.vue"))["default"]
>["$props"];
