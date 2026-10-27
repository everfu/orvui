// Vue public prop types, derived from the actual components.
export type KnockoutBracketProps = InstanceType<
  (typeof import("./KnockoutBracket.vue"))["default"]
>["$props"];
export type KnockoutWheelProps = InstanceType<
  (typeof import("./KnockoutWheel.vue"))["default"]
>["$props"];
