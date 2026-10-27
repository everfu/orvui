// Vue public prop types, derived from the actual components.
export type LoaderProps = InstanceType<
  (typeof import("./Loader.vue"))["default"]
>["$props"];
