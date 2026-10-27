// Vue public prop types, derived from the actual components.
export type AdaptiveStepperProps = InstanceType<
  (typeof import("./AdaptiveStepper.vue"))["default"]
>["$props"];
export type AdaptiveStepperValueProps = InstanceType<
  (typeof import("./AdaptiveStepperValue.vue"))["default"]
>["$props"];
