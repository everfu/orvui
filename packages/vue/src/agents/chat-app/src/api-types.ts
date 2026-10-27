// Vue public prop types, derived from the actual components.
export type ChatAppProps = InstanceType<
  (typeof import("./ChatApp.vue"))["default"]
>["$props"];
