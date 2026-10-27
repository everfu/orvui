import type { ScrollProgressProps } from "./api-types";
export type ScrollProgressBarProps = Omit<
  ScrollProgressProps,
  "variant" | "size" | "thickness"
>;
export type ScrollProgressCircleProps = Omit<
  ScrollProgressProps,
  "variant" | "position" | "height" | "fixed"
>;
