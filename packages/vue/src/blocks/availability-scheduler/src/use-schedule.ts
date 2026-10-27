import { computed, ref, useId, watch } from "vue";
import { useControllable, useReduced } from "../../shared";
import {
  WEEKDAYS,
  buildOptions,
  clampRange,
  defaultWeek,
  panelKey,
  toMinutes,
  toValue,
  type DayKey,
  type WeekAvailability,
} from "./types";
export function useSchedule(
  props: {
    modelValue?: WeekAvailability;
    defaultValue?: WeekAvailability;
    step: number;
  },
  change: (week: WeekAvailability) => void,
) {
  const week = useControllable(
      () => props.modelValue,
      props.defaultValue ?? defaultWeek(),
      change,
    ),
    reduce = useReduced(),
    id = useId();
  const options = computed(() => buildOptions(Math.max(1, props.step))),
    openDay = ref<DayKey | null>(null),
    openPanel = ref<string | null>(null);
  let sequence = 0;
  const makeId = (day: DayKey, copied = false) =>
    `${day}-${id}-${copied ? "c" : ""}${sequence++}`;
  const set = (day: DayKey, patch: Partial<WeekAvailability[DayKey]>) => {
    week.value = { ...week.value, [day]: { ...week.value[day], ...patch } };
  };
  function panel(
    day: DayKey,
    rangeId: string,
    edge: "start" | "end",
    show: boolean,
  ) {
    const key = panelKey(day, rangeId, edge);
    if (show) {
      openPanel.value = key;
      openDay.value = day;
    } else if (openPanel.value === key) openPanel.value = null;
  }
  function enabled(day: DayKey, on: boolean) {
    const entry = week.value[day];
    set(day, {
      enabled: on,
      ...(on && !entry.ranges.length
        ? { ranges: [{ id: makeId(day), start: "09:00", end: "17:00" }] }
        : {}),
    });
  }
  function time(
    day: DayKey,
    index: number,
    edge: "start" | "end",
    value: string,
  ) {
    set(day, {
      ranges: week.value[day].ranges.map((range, at) =>
        at !== index
          ? range
          : {
              ...range,
              ...clampRange(
                edge === "start" ? value : range.start,
                edge === "end" ? value : range.end,
                options.value,
                edge,
              ),
            },
      ),
    });
  }
  function add(day: DayKey) {
    const last = week.value[day].ranges.at(-1),
      start = last ? Math.min(toMinutes(last.end) + 60, 1380) : 540;
    set(day, {
      enabled: true,
      ranges: [
        ...week.value[day].ranges,
        { id: makeId(day), start: toValue(start), end: toValue(start + 60) },
      ],
    });
  }
  function remove(day: DayKey, id: string) {
    const ranges = week.value[day].ranges.filter((range) => range.id !== id);
    set(day, { enabled: !!ranges.length, ranges });
  }
  function copy(from: DayKey, targets: DayKey[]) {
    const source = week.value[from],
      next = { ...week.value };
    for (const target of targets)
      next[target] = {
        enabled: source.enabled,
        ranges: source.ranges.map((range) => ({
          ...range,
          id: makeId(target, true),
        })),
      };
    week.value = next;
  }
  watch(
    week,
    (value) => {
      const visible = new Set<string>();
      for (const { key } of WEEKDAYS)
        if (value[key].enabled)
          for (const range of value[key].ranges) {
            visible.add(panelKey(key, range.id, "start"));
            visible.add(panelKey(key, range.id, "end"));
          }
      if (openPanel.value && !visible.has(openPanel.value))
        openPanel.value = null;
    },
    { deep: true },
  );
  return {
    week,
    reduce,
    options,
    openDay,
    openPanel,
    panel,
    enabled,
    time,
    add,
    remove,
    copy,
  };
}
