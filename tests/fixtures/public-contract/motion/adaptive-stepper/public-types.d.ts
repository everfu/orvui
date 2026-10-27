import type { ButtonHTMLAttributes } from "vue";
export type AdaptiveStepperActionProps = Omit<InstanceType<(typeof import("./StepperAction.vue"))["default"]>["$props"], "direction"> & ButtonHTMLAttributes;
