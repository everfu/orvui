// Vue public prop types, derived from the actual components.
export type BouncyAccordionProps = InstanceType<
  (typeof import("./BouncyAccordion.vue"))["default"]
>["$props"];
