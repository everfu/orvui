export { default as BumpChart } from "./src/BumpChart.vue";
export { default as BumpChartLegend } from "./src/BumpChartLegend.vue";
export { default as BumpChartPlot } from "./src/BumpChartPlot.vue";
export { useBumpChart } from "./src/context";
export type { BumpChartProps } from "./src/context";
export type { BumpSeries as BumpChartSeries } from "./src/model";
export type BumpChartLegendProps = InstanceType<
  (typeof import("./src/BumpChartLegend.vue"))["default"]
>["$props"];
export type BumpChartPlotProps = InstanceType<
  (typeof import("./src/BumpChartPlot.vue"))["default"]
>["$props"];
