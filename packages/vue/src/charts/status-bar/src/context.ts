import { computed, reactive, ref, useId } from "vue";
import { useMediaQuery, useReducedMotion } from "../../../lib/composables";
import { activeSelection, context } from "../../shared";
export interface StatusBarDatum {
  id: string;
  label: string;
  status: string;
  description?: string;
}
export interface StatusBarStatus {
  id: string;
  label: string;
  color: string;
}
export const STATUS_BAR_STATUSES: readonly StatusBarStatus[] = [
  { id: "operational", label: "Operational", color: "#059669" },
  { id: "degraded", label: "Degraded", color: "#d97706" },
  { id: "outage", label: "Outage", color: "#e11d48" },
  { id: "maintenance", label: "Maintenance", color: "#2563eb" },
  { id: "unknown", label: "No data", color: "var(--muted-foreground)" },
];
export interface StatusBarProps {
  data: readonly StatusBarDatum[];
  statuses?: readonly StatusBarStatus[];
  label?: string;
  activeId?: string | null;
  defaultActiveId?: string | null;
  className?: string;
}
export function createStatusBarModel(
  props: StatusBarProps,
  emit: (event: any, ...args: any[]) => void,
) {
  const statuses = computed(() => props.statuses ?? STATUS_BAR_STATUSES);
  const rows = computed(() => {
    const definitions = new Map<string, StatusBarStatus>();
    for (const status of statuses.value) {
      if (definitions.has(status.id))
        throw Error(`StatusBar: duplicate status ID "${status.id}".`);
      definitions.set(status.id, status);
    }
    const periods = new Set<string>();
    return props.data.map((datum) => {
      if (periods.has(datum.id))
        throw Error(`StatusBar: duplicate period ID "${datum.id}".`);
      periods.add(datum.id);
      const status = definitions.get(datum.status);
      if (!status)
        throw Error(
          `StatusBar: define the status "${datum.status}" in statuses.`,
        );
      return { datum, status };
    });
  });
  const activeId = activeSelection(
    () => props.activeId,
    props.defaultActiveId ?? null,
    computed(() => rows.value.map(({ datum }) => datum.id)),
    (value) => {
      emit("update:activeId", value);
      emit("activeChange", value);
    },
  );
  const activeIndex = computed(() =>
    rows.value.findIndex(({ datum }) => datum.id === activeId.value),
  );
  return reactive({
    rows,
    statuses,
    activeId,
    activeIndex,
    active: computed(() => rows.value[activeIndex.value] ?? null),
    label: computed(() => props.label ?? "Status history"),
    setActive(value: string | null) {
      activeId.value = value;
    },
    plotRef: ref<HTMLElement | null>(null),
    tooltipOpen: ref(false),
    tooltipId: useId(),
    reduce: useReducedMotion(),
    canHover: useMediaQuery("(hover: hover)"),
  });
}
export const statusBarContext =
  context<ReturnType<typeof createStatusBarModel>>("StatusBar");
export const useStatusBar = statusBarContext.use;
