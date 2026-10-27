export { default as StatusBar } from "./StatusBar.vue";
export { default as StatusBarLegend } from "./StatusBarLegend.vue";
export { default as StatusBarPlot } from "./StatusBarPlot.vue";
export { default as StatusBarTooltip } from "./StatusBarTooltip.vue";
export { useStatusBar, STATUS_BAR_STATUSES } from "./context";
export type { StatusBarProps, StatusBarDatum, StatusBarStatus, } from "./context";
export type StatusBarPlotProps = InstanceType<(typeof import("./StatusBarPlot.vue"))["default"]>["$props"];
export type StatusBarTooltipProps = InstanceType<(typeof import("./StatusBarTooltip.vue"))["default"]>["$props"];
export type StatusBarLegendProps = InstanceType<(typeof import("./StatusBarLegend.vue"))["default"]>["$props"];
export type StatusBarTooltipData = {
    datum: import("./context").StatusBarDatum;
    status: import("./context").StatusBarStatus;
    index: number;
};
