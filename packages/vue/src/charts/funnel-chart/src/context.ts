import { computed, reactive } from "vue";
import { useReducedMotion } from "../../../lib/composables";
import { context, formatNumber } from "../../shared";
import { buildFunnel, type FunnelStage } from "./model";
export interface FunnelChartProps {
  stages: readonly FunnelStage[];
  direction?: "vertical" | "horizontal";
  unit?: string;
  label?: string;
  formatValue?: (value: number) => string;
  className?: string;
}
export function createFunnelModel(props: FunnelChartProps) {
  const model = computed(() => buildFunnel(props.stages));
  const { rows, first, last, conversion } = {
    rows: computed(() => model.value.rows),
    first: computed(() => model.value.first),
    last: computed(() => model.value.last),
    conversion: computed(() => model.value.conversion),
  };
  return reactive({
    model,
    rows,
    first,
    last,
    conversion,
    direction: computed(() => props.direction ?? "vertical"),
    unit: computed(() => props.unit ?? "people"),
    label: computed(() => props.label ?? "Conversion funnel"),
    formatValue: computed(() => props.formatValue ?? formatNumber),
    reduce: useReducedMotion(),
  });
}
export const funnelContext =
  context<ReturnType<typeof createFunnelModel>>("FunnelChart");
export const useFunnelChart = funnelContext.use;
export const percentage = (value: number | null) =>
  value === null ? "—" : `${value.toFixed(1)}%`;
