export { default as Treemap } from "./src/Treemap.vue";
export { default as TreemapCell } from "./src/TreemapCell.vue";
export { default as TreemapLegend } from "./src/TreemapLegend.vue";
export { default as TreemapPlot } from "./src/TreemapPlot.vue";
export { default as TreemapTooltip } from "./src/TreemapTooltip.vue";
export { useTreemap } from "./src/context";
export type { TreemapProps } from "./src/context";
export type {
  TreemapNode,
  TreemapLeaf,
  TreemapGroup,
  TreemapItem,
  TreemapTile,
} from "./src/model";
export type TreemapPlotProps = InstanceType<
  (typeof import("./src/TreemapPlot.vue"))["default"]
>["$props"];
export type TreemapTooltipProps = InstanceType<
  (typeof import("./src/TreemapTooltip.vue"))["default"]
>["$props"];
export type TreemapCellProps = InstanceType<
  (typeof import("./src/TreemapCell.vue"))["default"]
>["$props"];
export type TreemapLegendProps = InstanceType<
  (typeof import("./src/TreemapLegend.vue"))["default"]
>["$props"];
