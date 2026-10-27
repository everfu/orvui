// Vue public prop types, derived from the actual components.
export type MarqueeProps = InstanceType<
  (typeof import("./Marquee.vue"))["default"]
>["$props"];
