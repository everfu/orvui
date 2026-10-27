// Vue public prop types, derived from the actual components.
export type BottomSheetProps = InstanceType<
  (typeof import("./BottomSheet.vue"))["default"]
>["$props"];
