// Vue public prop types, derived from the actual components.
export type ExpandableButtonProps = InstanceType<
  (typeof import("./ExpandableButton.vue"))["default"]
>["$props"];
export type ExpandableChipProps = InstanceType<
  (typeof import("./ExpandableChip.vue"))["default"]
>["$props"];
