// Vue public prop types, derived from the actual components.
export type MultiChainSwapProps = InstanceType<
  (typeof import("./MultiChainSwap.vue"))["default"]
>["$props"];
