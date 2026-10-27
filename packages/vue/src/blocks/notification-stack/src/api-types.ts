// Vue public prop types, derived from the actual components.
export type NotificationStackProps = InstanceType<
  (typeof import("./NotificationStack.vue"))["default"]
>["$props"];
