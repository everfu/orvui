export { default as HeatCalendar } from "./src/HeatCalendar.vue";
export { default as HeatCalendarGrid } from "./src/HeatCalendarGrid.vue";
export { default as HeatCalendarLegend } from "./src/HeatCalendarLegend.vue";
export { default as HeatCalendarTooltip } from "./src/HeatCalendarTooltip.vue";
export { useHeatCalendar } from "./src/context";
export type {
  HeatCalendarProps,
  HeatCalendarCell,
  HeatCalendarSelection,
} from "./src/types";
export type HeatCalendarTooltipProps = InstanceType<
  (typeof import("./src/HeatCalendarTooltip.vue"))["default"]
>["$props"];
export type HeatCalendarGridProps = InstanceType<
  (typeof import("./src/HeatCalendarGrid.vue"))["default"]
>["$props"];
export type HeatCalendarLegendProps = InstanceType<
  (typeof import("./src/HeatCalendarLegend.vue"))["default"]
>["$props"];
