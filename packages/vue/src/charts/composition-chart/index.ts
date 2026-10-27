export { default as CompositionChart } from "./src/CompositionChart.vue";
export { default as CompositionChartLegend } from "./src/CompositionChartLegend.vue";
export { default as CompositionChartPlot } from "./src/CompositionChartPlot.vue";
export { default as CompositionTooltipContent } from "./src/CompositionTooltipContent.vue";
export { useCompositionChart } from "./src/context";
export type { CompositionChartProps } from "./src/context";
export type { CompositionSeries as CompositionChartSeries } from "./src/model";
export type CompositionChartPlotProps = InstanceType<
  (typeof import("./src/CompositionChartPlot.vue"))["default"]
>["$props"];
export type CompositionChartLegendProps = InstanceType<
  (typeof import("./src/CompositionChartLegend.vue"))["default"]
>["$props"];
export type CompositionTooltipContentProps = InstanceType<
  (typeof import("./src/CompositionTooltipContent.vue"))["default"]
>["$props"];
