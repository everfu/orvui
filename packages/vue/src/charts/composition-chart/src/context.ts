import { computed, reactive, ref } from "vue";
import { useMediaQuery, useReducedMotion } from "../../../lib/composables";
import { context, selection, formatNumber } from "../../shared";
import { buildComposition, type CompositionSeries } from "./model";
export interface CompositionChartProps {
  series: readonly CompositionSeries[];
  periods: readonly string[];
  view?: "bar" | "area";
  period?: string;
  defaultPeriod?: string;
  formatValue?: (value: number) => string;
  label?: string;
  className?: string;
}
export function createCompositionModel(
  props: CompositionChartProps,
  emit: (event: any, ...args: any[]) => void,
) {
  const model = computed(() => buildComposition(props.series, props.periods));
  const period = selection(
    () => props.period,
    props.defaultPeriod ?? "",
    (value) => {
      emit("update:period", value);
      emit("periodChange", value);
    },
  );
  const pinned = ref<string | null>(null),
    hovered = ref<string | null>(null),
    focused = ref<string | null>(null);
  const index = computed(() => {
    const found = model.value.columns.findIndex(
      (column) => column.id === period.value,
    );
    return found === -1 ? model.value.columns.length - 1 : found;
  });
  const highlight = computed(() => {
    const ids = new Set(model.value.rows.map((row) => row.id));
    for (const candidate of [hovered.value, focused.value, pinned.value])
      if (candidate !== null && ids.has(candidate)) return candidate;
    return null;
  });
  return reactive({
    rows: computed(() => model.value.rows),
    columns: computed(() => model.value.columns),
    index,
    column: computed(() => model.value.columns[index.value]),
    pinned,
    highlight,
    select(value: string) {
      period.value = value;
    },
    setPinned(value: string | null) {
      pinned.value = value;
    },
    setHovered(value: string | null) {
      hovered.value = value;
    },
    setFocused(value: string | null) {
      focused.value = value;
    },
    view: computed(() => props.view ?? "bar"),
    label: computed(() => props.label ?? "Composition over time"),
    formatValue: computed(() => props.formatValue ?? formatNumber),
    reduce: useReducedMotion(),
    canHover: useMediaQuery("(hover: hover)"),
  });
}
export const compositionContext =
  context<ReturnType<typeof createCompositionModel>>("CompositionChart");
export const useCompositionChart = compositionContext.use;
