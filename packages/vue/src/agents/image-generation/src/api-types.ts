// Vue public prop types, derived from the actual components.
export type ImageGenerationProps = InstanceType<
  (typeof import("./ImageGeneration.vue"))["default"]
>["$props"];
