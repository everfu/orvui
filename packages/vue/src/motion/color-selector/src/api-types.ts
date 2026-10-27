// Vue public prop types, derived from the actual components.
export type ColorSelectorItemProps = InstanceType<
  (typeof import("./ColorSelectorItem.vue"))["default"]
>["$props"];
export type ColorSelectorLabelProps = InstanceType<
  (typeof import("./ColorSelectorLabel.vue"))["default"]
>["$props"];
export type ColorSelectorListProps = InstanceType<
  (typeof import("./ColorSelectorList.vue"))["default"]
>["$props"];
export type ColorSelectorProps = InstanceType<
  (typeof import("./ColorSelector.vue"))["default"]
>["$props"];
