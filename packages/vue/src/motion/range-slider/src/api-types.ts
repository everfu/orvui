// Vue public prop types, derived from the actual components.
export type BubbleSliderProps = InstanceType<
  (typeof import("./BubbleSlider.vue"))["default"]
>["$props"];
export type FluidSliderProps = InstanceType<
  (typeof import("./FluidSlider.vue"))["default"]
>["$props"];
export type InlineSliderProps = InstanceType<
  (typeof import("./InlineSlider.vue"))["default"]
>["$props"];
export type RangeSliderProps = InstanceType<
  (typeof import("./RangeSlider.vue"))["default"]
>["$props"];
export type RulerSliderProps = InstanceType<
  (typeof import("./RulerSlider.vue"))["default"]
>["$props"];
export type WaveSliderProps = InstanceType<
  (typeof import("./WaveSlider.vue"))["default"]
>["$props"];
