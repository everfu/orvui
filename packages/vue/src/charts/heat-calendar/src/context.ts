import { computed, onMounted, ref, useId, watch } from "vue";
import { useMediaQuery, useReducedMotion } from "../../../lib/composables";
import { context, selection, unwrapModel } from "../../shared";
import type {
  HeatCalendarProps,
  HeatCalendarCell,
  HeatCalendarSelection,
} from "./types";
import { startOfDay } from "./utils";
import { buildHeatCalendar } from "./model";
export function createHeatModel(
  props: HeatCalendarProps,
  emit: (event: any, ...args: any[]) => void,
) {
  const reduce = useReducedMotion(),
    canHover = useMediaQuery("(hover: hover)");
  const hovered = ref<HeatCalendarCell | null>(null),
    step = ref<number | null>(null),
    today = ref<Date | null>(null),
    tooltipId = useId();
  const requested = selection(
    () => props.selection,
    props.defaultSelection ?? null,
    (value) => {
      emit("update:selection", value);
      emit("selectionChange", value);
    },
  );
  const data = computed(() =>
    buildHeatCalendar(props, today.value, requested.value, hovered.value),
  );
  function clear() {
    requested.value = null;
  }
  function select(cell: HeatCalendarCell) {
    const current = data.value;
    if (!current.valid(cell)) return;
    if (
      current.spanEnd ||
      (current.pinned &&
        current.ordinal(current.pinned) === current.ordinal(cell))
    )
      clear();
    else
      requested.value = current.pinned
        ? { start: current.pinned, end: cell }
        : { start: cell };
  }
  const model = computed(() => {
    const { valid: _, ordinal: __, ...visible } = data.value;
    return {
      ...visible,
      reduce: reduce.value,
      canHover: canHover.value,
      step: step.value,
      setStep(value: number | null) {
        step.value = value;
      },
      clear,
      select,
      setHover(value: HeatCalendarCell | null) {
        hovered.value = value;
      },
      tooltipId,
      setSelection(value: HeatCalendarSelection | null) {
        requested.value = value;
      },
    };
  });
  onMounted(() => {
    today.value = startOfDay(new Date());
  });
  watch(
    () => model.value.selection,
    (value) => {
      if (!value && requested.value && props.selection === undefined)
        requested.value = null;
    },
  );
  return unwrapModel(model);
}
export const heatContext =
  context<ReturnType<typeof createHeatModel>>("HeatCalendar");
export const useHeatCalendar = heatContext.use;
