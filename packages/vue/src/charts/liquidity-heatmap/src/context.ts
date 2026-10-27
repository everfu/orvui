import { computed, reactive } from "vue";
import { useReducedMotion } from "../../../lib/composables";
import { context, formatNumber, formatCompact } from "../../shared";
import { buildLiquidityHeatmap, type LiquiditySnapshot } from "./model";
export interface LiquidityHeatmapProps {
  snapshots: readonly LiquiditySnapshot[];
  maxSize?: number;
  unit?: string;
  label?: string;
  formatPrice?: (value: number) => string;
  formatSize?: (value: number) => string;
  className?: string;
}
export function createLiquidityModel(props: LiquidityHeatmapProps) {
  const data = computed(() => buildLiquidityHeatmap(props.snapshots));
  const ceiling = computed(() => {
    const supplied = props.maxSize;
    return supplied !== undefined && Number.isFinite(supplied) && supplied > 0
      ? supplied
      : data.value.maximum;
  });
  return reactive({
    columns: computed(() => data.value.columns),
    prices: computed(() => data.value.prices),
    ceiling,
    unit: computed(() => props.unit ?? "units"),
    label: computed(() => props.label ?? "Liquidity heatmap"),
    formatPrice: computed(() => props.formatPrice ?? formatNumber),
    formatSize: computed(() => props.formatSize ?? formatCompact),
    reduce: useReducedMotion(),
  });
}
export const liquidityContext =
  context<ReturnType<typeof createLiquidityModel>>("LiquidityHeatmap");
export const useLiquidityHeatmap = liquidityContext.use;
export const LIQUIDITY_COLORS = [
  "#17233b",
  "#254f80",
  "#217c90",
  "#27af98",
  "#97d56b",
  "#f4df76",
];
export const heatColor = (value: number, maximum: number) =>
  LIQUIDITY_COLORS[
    Math.min(
      LIQUIDITY_COLORS.length - 1,
      Math.floor((maximum > 0 ? value / maximum : 0) * LIQUIDITY_COLORS.length),
    )
  ];
