// Vue public prop types, derived from the actual components.
export type CylinderCarouselProps = InstanceType<
  (typeof import("./CylinderCarousel.vue"))["default"]
>["$props"];
