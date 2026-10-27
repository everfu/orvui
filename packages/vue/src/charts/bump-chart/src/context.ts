import { computed, reactive, ref } from "vue";
import { useMediaQuery, useReducedMotion } from "../../../lib/composables";
import { activeSelection, context } from "../../shared";
import { buildBumpChart, type BumpSeries } from "./model";
export interface BumpChartProps {
  series: readonly BumpSeries[];
  periods: readonly string[];
  active?: string | null;
  defaultActive?: string | null;
  label?: string;
  className?: string;
}
export function createBumpModel(
  props: BumpChartProps,
  emit: (event: any, ...args: any[]) => void,
) {
  const model = computed(() =>
    buildBumpChart(props.series, props.periods.length),
  );
  const hovered = ref<string | null>(null);
  const focused = ref<string | null>(null);
  const identities = computed(() => model.value.rows.map((row) => row.id));
  const pinned = activeSelection(
    () => props.active,
    props.defaultActive ?? null,
    identities,
    (id) => {
      emit("update:active", id);
      emit("activeChange", id);
    },
  );
  const highlighted = computed(() => {
    const available = new Set(identities.value);
    for (const candidate of [hovered.value, focused.value, pinned.value])
      if (candidate !== null && available.has(candidate)) return candidate;
    return null;
  });
  return reactive({
    model,
    pinned,
    highlighted,
    rows: computed(() => model.value.rows),
    ranks: computed(() => model.value.ranks),
    height: computed(() => model.value.height),
    periods: computed(() => props.periods),
    label: computed(() => props.label ?? "Rankings over time"),
    x: (period: number) => model.value.x(period),
    y: (rank: number) => model.value.y(rank),
    select(id: string | null) {
      pinned.value = id;
    },
    setHovered(id: string | null) {
      hovered.value = id;
    },
    setFocused(id: string | null) {
      focused.value = id;
    },
    reduce: useReducedMotion(),
    canHover: useMediaQuery("(hover: hover)"),
  });
}
export const bumpContext =
  context<ReturnType<typeof createBumpModel>>("BumpChart");
export const useBumpChart = bumpContext.use;
