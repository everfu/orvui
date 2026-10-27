export { default as DonutChart } from "./src/DonutChart.vue";
export { default as DonutChartCenter } from "./src/DonutChartCenter.vue";
export { default as DonutChartLegend } from "./src/DonutChartLegend.vue";
export { default as DonutChartPlot } from "./src/DonutChartPlot.vue";
export { useDonutChart } from "./src/context";
export type { DonutChartProps } from "./src/context";
export type {
  DonutSegment,
  PlacedSegment as DonutPlacedSegment,
} from "./src/model";
export type DonutChartLegendProps = InstanceType<
  (typeof import("./src/DonutChartLegend.vue"))["default"]
>["$props"];
export type DonutChartPlotProps = InstanceType<
  (typeof import("./src/DonutChartPlot.vue"))["default"]
>["$props"];
export type DonutChartCenterProps = InstanceType<
  (typeof import("./src/DonutChartCenter.vue"))["default"]
>["$props"];
