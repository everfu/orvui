export { default as StatusBar } from "./src/StatusBar.vue";
export { default as StatusBarLegend } from "./src/StatusBarLegend.vue";
export { default as StatusBarPlot } from "./src/StatusBarPlot.vue";
export { default as StatusBarTooltip } from "./src/StatusBarTooltip.vue";
export { useStatusBar, STATUS_BAR_STATUSES } from "./src/context";
export type {
  StatusBarProps,
  StatusBarDatum,
  StatusBarStatus,
} from "./src/context";
export type StatusBarPlotProps = InstanceType<
  (typeof import("./src/StatusBarPlot.vue"))["default"]
>["$props"];
export type StatusBarTooltipProps = InstanceType<
  (typeof import("./src/StatusBarTooltip.vue"))["default"]
>["$props"];
export type StatusBarLegendProps = InstanceType<
  (typeof import("./src/StatusBarLegend.vue"))["default"]
>["$props"];
export type StatusBarTooltipData = {
  datum: import("./src/context").StatusBarDatum;
  status: import("./src/context").StatusBarStatus;
  index: number;
};
