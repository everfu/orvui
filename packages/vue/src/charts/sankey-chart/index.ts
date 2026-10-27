export { default as SankeyChart } from "./src/SankeyChart.vue";
export { default as SankeyChartPlot } from "./src/SankeyChartPlot.vue";
export { default as SankeyChartTooltip } from "./src/SankeyChartTooltip.vue";
export { useSankeyChart } from "./src/context";
export type { SankeyChartProps, SankeyActive } from "./src/context";
export type {
  SankeyNode,
  SankeyLink,
  PlacedNode as SankeyPlacedNode,
  PlacedLink as SankeyPlacedLink,
} from "./src/model";
export type SankeyChartPlotProps = InstanceType<
  (typeof import("./src/SankeyChartPlot.vue"))["default"]
>["$props"];
export type SankeyChartTooltipProps = InstanceType<
  (typeof import("./src/SankeyChartTooltip.vue"))["default"]
>["$props"];
