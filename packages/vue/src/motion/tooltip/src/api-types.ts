// Vue public prop types, derived from the actual components.
export type TooltipProviderProps = InstanceType<
  (typeof import("./TooltipProvider.vue"))["default"]
>["$props"];
export type TooltipTriggerProps = InstanceType<
  (typeof import("./TooltipTrigger.vue"))["default"]
>["$props"];
