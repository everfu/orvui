import { computed, reactive } from "vue";
import { useMediaQuery, useReducedMotion } from "../../../lib/composables";
import { activeSelection, context, formatNumber } from "../../shared";
import { buildDonut, type DonutSegment } from "./model";
export interface DonutChartProps {
  segments: readonly DonutSegment[];
  thickness?: number;
  gap?: number;
  activeId?: string | null;
  defaultActiveId?: string | null;
  selectedId?: string | null;
  formatValue?: (value: number) => string;
  label?: string;
  className?: string;
}
export function createDonutModel(
  props: DonutChartProps,
  emit: (event: any, ...args: any[]) => void,
) {
  const dimensions = computed(() => {
    const thickness = props.thickness ?? 22;
    return { thickness, radius: 92 - thickness / 2, gap: props.gap ?? 3 };
  });
  const geometry = computed(() => buildDonut(props.segments, dimensions.value));
  const identities = computed(() =>
    geometry.value.placed.map((item) => item.id),
  );
  const active = activeSelection(
    () => props.activeId,
    props.defaultActiveId ?? null,
    identities,
    (id) => {
      emit("update:activeId", id);
      emit("activeChange", id);
    },
  );
  return reactive({
    placed: computed(() => geometry.value.placed),
    total: computed(() => geometry.value.total),
    radius: computed(() => dimensions.value.radius),
    thickness: computed(() => dimensions.value.thickness),
    active,
    setActive(id: string | null) {
      active.value = id;
    },
    select(id: string) {
      emit("select", id);
    },
    selectedId: computed(() => props.selectedId ?? null),
    formatValue: computed(() => props.formatValue ?? formatNumber),
    label: computed(() => props.label ?? "Donut chart"),
    reduce: useReducedMotion(),
    canHover: useMediaQuery("(hover: hover)"),
  });
}
export const donutContext =
  context<ReturnType<typeof createDonutModel>>("DonutChart");
export const useDonutChart = donutContext.use;
