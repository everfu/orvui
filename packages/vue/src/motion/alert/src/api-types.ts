// Vue public prop types, derived from the actual components.
export type AlertActionProps = InstanceType<
  (typeof import("./AlertAction.vue"))["default"]
>["$props"];
export type AlertCloseProps = InstanceType<
  (typeof import("./AlertClose.vue"))["default"]
>["$props"];
export type AlertContentProps = InstanceType<
  (typeof import("./AlertContent.vue"))["default"]
>["$props"];
export type AlertDescriptionProps = InstanceType<
  (typeof import("./AlertDescription.vue"))["default"]
>["$props"];
export type AlertIconProps = InstanceType<
  (typeof import("./AlertIcon.vue"))["default"]
>["$props"];
export type AlertProps = InstanceType<
  (typeof import("./Alert.vue"))["default"]
>["$props"];
export type AlertTitleProps = InstanceType<
  (typeof import("./AlertTitle.vue"))["default"]
>["$props"];
