export { default as FunnelChart } from "./FunnelChart.vue";
export { default as FunnelChartPlot } from "./FunnelChartPlot.vue";
export { default as FunnelChartSummary } from "./FunnelChartSummary.vue";
export { useFunnelChart } from "./context";
export type { FunnelChartProps } from "./context";
export type { FunnelStage } from "./model";
export type FunnelChartSummaryProps = InstanceType<(typeof import("./FunnelChartSummary.vue"))["default"]>["$props"];
export type FunnelChartPlotProps = InstanceType<(typeof import("./FunnelChartPlot.vue"))["default"]>["$props"];
