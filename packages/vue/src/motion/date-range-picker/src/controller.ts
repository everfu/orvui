import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from "vue";
import { useReducedMotion } from "../../../lib/composables";
import { DAY, iso, monthOf, ordered, parse, shiftMonth } from "./date-utils";
import type { DateRange, DateRangePreset } from "./types";
export interface DateRangeOptions {
  modelValue?: DateRange | null;
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  defaultMonth?: string;
  min?: string;
  max?: string;
  isDateDisabled?: (date: string) => boolean;
  presets?: DateRangePreset[];
  locale?: string;
  label?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  showSummary?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  closeOnSelect?: boolean;
}

export function createDateRangePicker(
  props: DateRangeOptions,
  emit: (...args: any[]) => void,
) {
  const now = new Date();
  const today = [
    String(now.getFullYear()).padStart(4, "0"),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  const memory = ref<DateRange | null>(props.defaultValue ?? null);
  const expanded = ref(props.defaultOpen ?? false);
  const value = computed<DateRange | null>({
    get: () =>
      props.modelValue !== undefined
        ? props.modelValue
        : props.value !== undefined
          ? props.value
          : memory.value,
    set: (next) => {
      memory.value = next;
      emit("update:modelValue", next);
      emit("valueChange", next);
      emit("change", next);
    },
  });
  const open = computed({
    get: () => props.open ?? expanded.value,
    set: (next: boolean) => {
      if (next === open.value) return;
      expanded.value = next;
      emit("update:open", next);
      emit("openChange", next);
    },
  });
  const initial = computed(
    () =>
      props.defaultMonth ??
      value.value?.from ??
      (props.min && today < props.min
        ? props.min
        : props.max && today > props.max
          ? props.max
          : today),
  );
  const month = ref(monthOf(initial.value));
  const cursor = ref<string | null>(value.value?.from ?? initial.value);
  const preview = ref<string | null>(null);
  const view = ref<"days" | "months" | "years">("days");
  const yearPage = ref(Math.floor(Number(initial.value.slice(0, 4)) / 12) * 12);
  const direction = ref(1),
    announcement = ref("");
  const id = useId();
  const anchor = ref<HTMLElement | null>(null),
    content = ref<HTMLElement | null>(null),
    grid = ref<HTMLElement | null>(null);
  const monthTrigger = ref<HTMLButtonElement | null>(null),
    yearTrigger = ref<HTMLButtonElement | null>(null);
  const focusChoices = ref(false);
  const reduce = useReducedMotion();
  let disposed = false,
    focusRevision = 0;
  const bounded = (number: number, min: number, max: number) =>
    Math.min(max, Math.max(min, number));
  const format = (
    date: string,
    options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" },
  ) =>
    new Intl.DateTimeFormat(props.locale ?? "en-US", {
      ...options,
      timeZone: "UTC",
    }).format(parse(date));
  watch(
    () => [
      props.min,
      props.max,
      props.defaultMonth,
      value.value?.from,
      value.value?.to,
    ],
    () => {
      for (const date of [
        props.min,
        props.max,
        props.defaultMonth,
        value.value?.from,
        value.value?.to,
      ])
        if (date) parse(date);
      if (props.min && props.max && props.min > props.max)
        throw Error("DateRangePicker min must not exceed max.");
      if (value.value?.to && value.value.to < value.value.from)
        throw Error("DateRangePicker range must be ordered.");
    },
    { immediate: true },
  );
  function clampMonth(next: string) {
    const lower = props.min ? monthOf(props.min) : "0000-01-01",
      upper = props.max ? monthOf(props.max) : "9999-12-01";
    return next < lower ? lower : next > upper ? upper : next;
  }
  watch(
    () => [props.min, props.max],
    () => {
      month.value = clampMonth(month.value);
    },
    { immediate: true },
  );
  const unavailable = (date: string) =>
    !!(
      props.disabled ||
      (props.min && date < props.min) ||
      (props.max && date > props.max) ||
      props.isDateDisabled?.(date)
    );
  function rangeAvailable(range: DateRange) {
    const end = range.to ?? range.from;
    if (end < range.from || unavailable(range.from) || unavailable(end))
      return false;
    if (props.isDateDisabled)
      for (
        let time = parse(range.from) + DAY, last = parse(end);
        time < last;
        time += DAY
      )
        if (unavailable(iso(time))) return false;
    return true;
  }
  const dates = computed(() => {
    const first = parse(month.value);
    const test = new Date(first);
    test.setUTCMonth(test.getUTCMonth() + 1, 0);
    return Array.from({ length: test.getUTCDate() }, (_, index) =>
      iso(first + index * DAY),
    );
  });
  const weeks = computed(() => {
    const leading = new Date(parse(month.value)).getUTCDay();
    return Array.from({ length: 6 }, (_, row) =>
      Array.from(
        { length: 7 },
        (_, column) => dates.value[row * 7 + column - leading] ?? null,
      ),
    );
  });
  const active = computed(() =>
    cursor.value &&
    dates.value.includes(cursor.value) &&
    !unavailable(cursor.value)
      ? cursor.value
      : (dates.value.find((date) => !unavailable(date)) ?? null),
  );
  const shownRange = computed(() => {
    const range = value.value;
    if (!range || range.to || !preview.value) return range;
    const candidate = ordered(range.from, preview.value);
    return rangeAvailable(candidate) ? candidate : range;
  });
  const year = computed(() => Number(month.value.slice(0, 4)));
  const minYear = computed(() =>
    props.min ? Number(props.min.slice(0, 4)) : 0,
  );
  const maxYear = computed(() =>
    props.max ? Number(props.max.slice(0, 4)) : 9999,
  );
  const lastPage = computed(() => Math.max(minYear.value, maxYear.value - 11));
  const yearPageEnd = computed(() =>
    Math.min(yearPage.value + 11, maxYear.value),
  );
  watch(
    [minYear, maxYear, yearPage],
    () => {
      yearPage.value = bounded(yearPage.value, minYear.value, lastPage.value);
    },
    { immediate: true },
  );
  const previousDisabled = computed(
    () =>
      !!props.disabled ||
      (view.value === "years"
        ? yearPage.value <= minYear.value
        : view.value === "months"
          ? year.value <= minYear.value
          : month.value <= (props.min ? monthOf(props.min) : "0000-01-01")),
  );
  const nextDisabled = computed(
    () =>
      !!props.disabled ||
      (view.value === "years"
        ? yearPage.value >= lastPage.value
        : view.value === "months"
          ? year.value >= maxYear.value
          : month.value >= (props.max ? monthOf(props.max) : "9999-12-01")),
  );
  async function afterPaint(action: () => void) {
    const revision = ++focusRevision;
    await nextTick();
    if (!disposed && revision === focusRevision) action();
  }
  async function focusDay() {
    await afterPaint(() =>
      (
        grid.value?.querySelector<HTMLElement>('button[tabindex="0"]') ??
        grid.value
      )?.focus({ preventScroll: true }),
    );
  }
  async function closeChoices() {
    const previous = view.value;
    view.value = "days";
    await afterPaint(() =>
      (previous === "years" ? yearTrigger.value : monthTrigger.value)?.focus({
        preventScroll: true,
      }),
    );
  }
  function openChoices(next: "months" | "years") {
    if (props.disabled) return;
    if (view.value === next) {
      void closeChoices();
      return;
    }
    preview.value = null;
    focusChoices.value = true;
    if (next === "years")
      yearPage.value = bounded(
        minYear.value + Math.floor((year.value - minYear.value) / 12) * 12,
        minYear.value,
        lastPage.value,
      );
    view.value = next;
  }
  function goToMonth(next: string) {
    if (props.disabled) return;
    const destination = clampMonth(monthOf(next));
    direction.value = destination >= month.value ? 1 : -1;
    month.value = destination;
    cursor.value = destination;
    preview.value = null;
    void closeChoices();
  }
  function change(next: DateRange | null) {
    if (props.disabled) return;
    if (next === null) {
      value.value = null;
      preview.value = null;
      return;
    }
    if (!rangeAvailable(next)) return;
    value.value = next;
    preview.value = null;
    // Incomplete selections stay open. Closing is a separate complete-range effect.
    if (!next.to || !props.closeOnSelect) return;
    if (open.value) open.value = false;
  }
  function select(date: string) {
    if (unavailable(date)) return;
    cursor.value = date;
    const current = value.value;
    if (!current || current.to) {
      change({ from: date });
      announcement.value = `Start date ${format(date, { dateStyle: "full" })}. Choose an end date.`;
      return;
    }
    const next = ordered(current.from, date);
    if (!rangeAvailable(next)) {
      announcement.value =
        "This range includes unavailable dates. Choose another end date.";
      return;
    }
    change(next);
    announcement.value = `${format(next.from)} to ${format(next.to)} selected.`;
  }
  function navigate(
    offset: number,
    focus = false,
    target = active.value ?? month.value,
  ) {
    const next = shiftMonth(target, offset);
    if (monthOf(next) !== clampMonth(monthOf(next))) return;
    direction.value = offset > 0 ? 1 : -1;
    month.value = monthOf(next);
    cursor.value = next;
    preview.value = null;
    if (focus) void focusDay();
  }
  function page(step: number) {
    if (step < 0 ? previousDisabled.value : nextDisabled.value) return;
    focusChoices.value = false;
    direction.value = step > 0 ? 1 : -1;
    if (view.value === "years") {
      yearPage.value = bounded(
        yearPage.value + step * 12,
        minYear.value,
        lastPage.value,
      );
      if (yearPage.value === minYear.value || yearPage.value === lastPage.value)
        void afterPaint(() =>
          yearTrigger.value?.focus({ preventScroll: true }),
        );
    } else if (view.value === "months") {
      month.value = clampMonth(monthOf(shiftMonth(month.value, step * 12)));
      cursor.value = month.value;
      if (year.value === minYear.value || year.value === maxYear.value)
        void afterPaint(() =>
          monthTrigger.value?.focus({ preventScroll: true }),
        );
    } else {
      navigate(step);
      if (
        month.value === (props.min && monthOf(props.min)) ||
        month.value === (props.max && monthOf(props.max))
      )
        void afterPaint(() =>
          monthTrigger.value?.focus({ preventScroll: true }),
        );
    }
  }
  function onKey(event: KeyboardEvent, date: string) {
    if (
      event.defaultPrevented ||
      event.isComposing ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      props.disabled
    )
      return;
    if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      navigate(
        (event.key === "PageUp" ? -1 : 1) * (event.shiftKey ? 12 : 1),
        true,
        date,
      );
      return;
    }
    const base = active.value ?? date;
    const weekday = new Date(parse(base)).getUTCDay();
    const offset = (
      {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: -7,
        ArrowDown: 7,
        Home: -weekday,
        End: 6 - weekday,
      } as Record<string, number>
    )[event.key];
    if (offset === undefined) return;
    event.preventDefault();
    let time = parse(base) + offset * DAY;
    const lower = parse(props.min ?? "0000-01-01"),
      upper = parse(props.max ?? "9999-12-31");
    for (
      let attempts = 0;
      attempts < 367 && time >= lower && time <= upper;
      attempts++, time += (offset < 0 ? -1 : 1) * DAY
    ) {
      const next = iso(time);
      if (!unavailable(next)) {
        direction.value = monthOf(next) >= month.value ? 1 : -1;
        month.value = monthOf(next);
        cursor.value = next;
        preview.value = value.value && !value.value.to ? next : null;
        void focusDay();
        return;
      }
      if (event.key === "Home" || event.key === "End") return;
    }
  }
  const choices = computed(() =>
    view.value === "months"
      ? Array.from({ length: 12 }, (_, index) => {
          const id = `${String(year.value).padStart(4, "0")}-${String(index + 1).padStart(2, "0")}-01`;
          return {
            id,
            label: format(id, { month: "long" }),
            disabled: !!(
              props.disabled ||
              (props.min && id < monthOf(props.min)) ||
              (props.max && id > monthOf(props.max))
            ),
          };
        })
      : Array.from(
          { length: Math.max(0, yearPageEnd.value - yearPage.value + 1) },
          (_, index) => ({
            id: String(yearPage.value + index),
            label: String(yearPage.value + index),
            disabled: !!props.disabled,
          }),
        ),
  );
  function clear() {
    if (props.disabled) return;
    change(null);
    announcement.value = "Date range cleared.";
    if (view.value === "days") void focusDay();
    else void closeChoices();
  }
  function selectPreset(range: DateRange, name = "Preset") {
    if (!rangeAvailable(range)) return;
    change(range);
    direction.value = range.from >= month.value ? 1 : -1;
    month.value = monthOf(range.from);
    cursor.value = range.from;
    preview.value = null;
    if (view.value !== "days") void closeChoices();
    announcement.value = `${name} selected.`;
  }
  watch(
    () => value.value?.from,
    (next, previous) => {
      if (next && next !== previous) {
        month.value = clampMonth(monthOf(next));
        cursor.value = next;
        preview.value = null;
        view.value = "days";
      }
    },
  );
  watch(open, (next, previous) => {
    if (next && !previous) {
      month.value = clampMonth(monthOf(initial.value));
      cursor.value = value.value?.from ?? initial.value;
      preview.value = null;
      view.value = "days";
      focusChoices.value = false;
      announcement.value = "";
    } else if (
      !next &&
      content.value?.contains(content.value.ownerDocument.activeElement)
    )
      anchor.value?.focus({ preventScroll: true });
  });
  onBeforeUnmount(() => {
    disposed = true;
    ++focusRevision;
  });
  const dayCount = computed(() =>
    value.value?.to
      ? Math.round((parse(value.value.to) - parse(value.value.from)) / DAY) + 1
      : null,
  );
  return {
    props,
    id,
    heading: `${id}-heading`,
    help: `${id}-help`,
    choicesId: `${id}-choices`,
    today,
    value,
    open,
    month,
    cursor,
    preview,
    view,
    announcement,
    anchor,
    content,
    grid,
    monthTrigger,
    yearTrigger,
    focusChoices,
    reduce,
    direction,
    format,
    unavailable,
    rangeAvailable,
    available: rangeAvailable,
    change,
    setValue: change,
    select,
    selectDate: select,
    setOpen: (next: boolean) => (open.value = next),
    page,
    previous: () => page(-1),
    next: () => page(1),
    previousDisabled,
    nextDisabled,
    clear,
    openChoices,
    closeChoices,
    goToMonth,
    selectPreset,
    choices,
    year,
    yearPage,
    yearPageEnd,
    active,
    weeks,
    shownRange,
    onKey,
    dayCount,
    focusDay,
    chooseMonth: () => openChoices("months"),
    chooseYear: () => openChoices("years"),
  };
}
