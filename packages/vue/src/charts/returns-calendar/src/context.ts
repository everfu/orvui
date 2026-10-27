import { computed, ref, useId, watch } from "vue";
import { useMediaQuery, useReducedMotion } from "../../../lib/composables";
import { context, selection, unwrapModel } from "../../shared";
import type {
  ReturnsCalendarProps,
  ReturnsCalendarCell,
  ReturnsCalendarSelection,
} from "./types";
import { same } from "./utils";
import { buildReturnsCalendar } from "./model";
export function createReturnsModel(
  props: ReturnsCalendarProps,
  emit: (event: any, ...args: any[]) => void,
) {
  const reduce = useReducedMotion(),
    canHover = useMediaQuery("(hover: hover)"),
    hovered = ref<ReturnsCalendarCell | null>(null),
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
    buildReturnsCalendar(props, requested.value, hovered.value),
  );
  function clear() {
    requested.value = null;
  }
  function select(cell: ReturnsCalendarCell) {
    const current = data.value;
    if (!current.valid(cell)) return;
    if (current.spanEnd || same(current.pinned, cell.y, cell.m)) clear();
    else
      requested.value =
        current.pinned && current.sameTrack(current.pinned, cell)
          ? { start: current.pinned, end: cell }
          : { start: cell };
  }
  const model = computed(() => {
    const { valid: _, sameTrack: __, ...visible } = data.value;
    return {
      ...visible,
      reduce: reduce.value,
      canHover: canHover.value,
      clear,
      select,
      tooltipId,
      setHover(value: ReturnsCalendarCell | null) {
        hovered.value = value;
      },
      setSelection(value: ReturnsCalendarSelection | null) {
        requested.value = value;
      },
    };
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
export const returnsContext =
  context<ReturnType<typeof createReturnsModel>>("ReturnsCalendar");
export const useReturnsCalendar = returnsContext.use;
