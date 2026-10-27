import { computed, inject } from "vue";
import type { createDateRangePicker } from "./controller";
export function useDateRangePicker() {
  const state =
    inject<ReturnType<typeof createDateRangePicker>>("orvui-date-range");
  if (!state) throw Error("useDateRangePicker must be inside DateRangePicker");
  return {
    ...state,
    label: computed(() => state.props.label),
    locale: computed(() => state.props.locale),
    disabled: computed(() => state.props.disabled),
  };
}
