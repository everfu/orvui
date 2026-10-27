// Vue public prop types, derived from the actual components.
export type PullToRefreshProps = InstanceType<
  (typeof import("./PullToRefresh.vue"))["default"]
>["$props"];
