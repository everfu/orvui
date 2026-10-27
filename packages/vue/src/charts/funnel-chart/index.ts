export { default as FunnelChart } from "./src/FunnelChart.vue";
export { default as FunnelChartPlot } from "./src/FunnelChartPlot.vue";
export { default as FunnelChartSummary } from "./src/FunnelChartSummary.vue";
export { useFunnelChart } from "./src/context";
export type { FunnelChartProps } from "./src/context";
export type { FunnelStage } from "./src/model";
export type FunnelChartSummaryProps = InstanceType<
  (typeof import("./src/FunnelChartSummary.vue"))["default"]
>["$props"];
export type FunnelChartPlotProps = InstanceType<
  (typeof import("./src/FunnelChartPlot.vue"))["default"]
>["$props"];
