// Vue public prop types, derived from the actual components.
export type TiltCardProps = InstanceType<
  (typeof import("./TiltCard.vue"))["default"]
>["$props"];
