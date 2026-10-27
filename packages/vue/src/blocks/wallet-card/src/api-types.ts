// Vue public prop types, derived from the actual components.
export type WalletCardProps = InstanceType<
  (typeof import("./WalletCard.vue"))["default"]
>["$props"];
