// Vue public prop types, derived from the actual components.
export type WheelPickerProps = InstanceType<
  (typeof import("./WheelPicker.vue"))["default"]
>["$props"];
