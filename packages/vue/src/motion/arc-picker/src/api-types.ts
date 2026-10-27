// Vue public prop types, derived from the actual components.
export type ArcPickerProps = InstanceType<
  (typeof import("./ArcPicker.vue"))["default"]
>["$props"];
