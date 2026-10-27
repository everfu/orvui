export { default as BumpChart } from "./BumpChart.vue";
export { default as BumpChartLegend } from "./BumpChartLegend.vue";
export { default as BumpChartPlot } from "./BumpChartPlot.vue";
export { useBumpChart } from "./context";
export type { BumpChartProps } from "./context";
export type { BumpSeries as BumpChartSeries } from "./model";
export type BumpChartLegendProps = InstanceType<(typeof import("./BumpChartLegend.vue"))["default"]>["$props"];
export type BumpChartPlotProps = InstanceType<(typeof import("./BumpChartPlot.vue"))["default"]>["$props"];
