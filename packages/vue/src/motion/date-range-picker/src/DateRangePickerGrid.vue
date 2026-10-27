<script setup lang="ts">
import { computed, inject, onMounted } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { SPRING_PRESS, EASE_OUT } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import type { createDateRangePicker } from "./controller";
import CalendarChoices from "./CalendarChoices.vue";
import CalendarPresence from "./CalendarPresence.vue";
const state =
  inject<ReturnType<typeof createDateRangePicker>>("orvui-date-range")!;
const grid = state.grid;
const weekdays = computed(() =>
  Array.from({ length: 7 }, (_, index) => {
    const date = `2026-01-${String(index + 4).padStart(2, "0")}`;
    return {
      long: state.format(date, { weekday: "long" }),
      short: state.format(date, { weekday: "short" }),
    };
  }),
);
const key = computed(() =>
  state.view.value === "days"
    ? state.month.value
    : `${state.view.value}-${state.view.value === "years" ? state.yearPage.value : state.year.value}`,
);
const weekRows = computed(() =>
  state.weeks.value.map((week) =>
    week.map((date, index) => {
      const range = state.shownRange.value,
        selected = state.value.value;
      const inRange = !!(
        date &&
        range &&
        date >= range.from &&
        date <= (range.to ?? range.from)
      );
      const endpoint = !!(
        date &&
        selected &&
        (date === selected.from || date === selected.to)
      );
      return {
        date,
        index,
        inRange,
        endpoint,
        selected: !!(
          date &&
          selected &&
          date >= selected.from &&
          date <= (selected.to ?? selected.from)
        ),
        start: inRange && (index === 0 || date === range?.from),
        end: inRange && (index === 6 || date === range?.to || !range?.to),
        left:
          endpoint && (date === range?.from || !week[index - 1]) ? "50%" : 0,
        right:
          endpoint && (date === (range?.to ?? range?.from) || !week[index + 1])
            ? "50%"
            : 0,
      };
    }),
  ),
);
const variants = {
  enter: (custom: unknown) => {
    const state = custom as { direction: number; reduce: boolean };
    return { opacity: 0, x: state.reduce ? 0 : state.direction * 12 };
  },
  exit: (custom: unknown) => {
    const state = custom as { direction: number; reduce: boolean };
    return {
      opacity: 0,
      x: state.reduce ? 0 : state.direction * -8,
      transition: { duration: 0.12, ease: EASE_OUT },
    };
  },
};
function hover(event: PointerEvent, date: string | null) {
  if (
    event.pointerType !== "touch" &&
    typeof matchMedia !== "undefined" &&
    matchMedia("(hover: hover)").matches &&
    date &&
    !state.unavailable(date) &&
    state.value.value &&
    !state.value.value.to
  )
    state.preview.value = date;
}
function focus(date: string) {
  state.cursor.value = date;
  if (state.value.value && !state.value.value.to) state.preview.value = date;
}
function choose(id: string) {
  state.goToMonth(
    state.view.value === "months"
      ? id
      : `${id.padStart(4, "0")}-${state.month.value.slice(5, 7)}-01`,
  );
}
onMounted(() => {
  if (state.props.autoFocus) void state.focusDay();
});
</script>
<template>
  <div class="overflow-hidden" @pointerleave="state.preview.value = null">
    <AnimatePresence
      :initial="false"
      mode="popLayout"
      :custom="{ direction: state.direction.value, reduce: state.reduce.value }"
      ><motion.div
        :key="key"
        :custom="{
          direction: state.direction.value,
          reduce: state.reduce.value,
        }"
        :variants="variants"
        initial="enter"
        :animate="{ opacity: 1, x: 0 }"
        exit="exit"
        :transition="{
          duration: state.reduce.value ? 0.1 : 0.18,
          ease: EASE_OUT,
        }"
        ><CalendarPresence
          ><CalendarChoices
            v-if="state.view.value !== 'days'"
            :id="state.choicesId"
            :label="
              state.view.value === 'months'
                ? `Choose a month in ${state.year.value}`
                : `Choose a year from ${state.yearPage.value} to ${state.yearPageEnd.value}`
            "
            :choices="state.choices.value"
            :selected="
              state.view.value === 'months'
                ? state.month.value
                : String(state.year.value)
            "
            :focus-on-mount="state.focusChoices.value"
            :reduce="state.reduce.value"
            @close="state.closeChoices"
            @select="choose"
          />
          <table
            v-else
            ref="grid"
            role="grid"
            :aria-labelledby="state.heading"
            :aria-describedby="state.help"
            :tabindex="state.active.value === null ? 0 : undefined"
            class="w-full table-fixed select-none border-separate border-spacing-x-0 border-spacing-y-1"
          >
            <thead>
              <tr>
                <th
                  v-for="day in weekdays"
                  :key="day.long"
                  scope="col"
                  :abbr="day.long"
                  class="h-6 pb-1.5 text-center text-[11px] font-medium text-muted-foreground"
                >
                  {{ day.short }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(week, row) in weekRows" :key="row">
                <td
                  v-for="cell in week"
                  :key="cell.date ?? cell.index"
                  role="gridcell"
                  :aria-selected="cell.date ? cell.selected : undefined"
                  :class="
                    cn(
                      'relative h-8 p-0 text-center',
                      cell.start && 'rounded-l-full',
                      cell.end && 'rounded-r-full',
                    )
                  "
                  @pointerenter="hover($event, cell.date)"
                >
                  <span
                    v-if="cell.date"
                    aria-hidden="true"
                    :class="
                      cn(
                        'pointer-events-none absolute inset-y-0 rounded-[inherit] bg-foreground/[0.08]',
                        cell.inRange ? 'opacity-100' : 'opacity-0',
                      )
                    "
                    :style="{ left: cell.left, right: cell.right }"
                  /><motion.button
                    v-if="cell.date"
                    type="button"
                    :data-date="cell.date"
                    :disabled="state.unavailable(cell.date)"
                    :aria-label="state.format(cell.date, { dateStyle: 'full' })"
                    :aria-current="
                      cell.date === state.today ? 'date' : undefined
                    "
                    :tabindex="cell.date === state.active.value ? 0 : -1"
                    :while-press="
                      state.reduce.value ? undefined : { scale: 0.9 }
                    "
                    :transition="SPRING_PRESS"
                    :class="
                      cn(
                        'relative mx-auto flex h-8 w-full max-w-8 items-center justify-center rounded-full text-xs tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-30',
                        cell.endpoint
                          ? 'rounded-[9px] bg-foreground font-medium text-background'
                          : !state.unavailable(cell.date) &&
                              !cell.inRange &&
                              'hover:bg-muted',
                        cell.date === state.today &&
                          !cell.endpoint &&
                          'font-semibold after:absolute after:bottom-1 after:size-0.75 after:rounded-full after:bg-current',
                      )
                    "
                    @click="state.select(cell.date)"
                    @focus="focus(cell.date)"
                    @keydown="state.onKey($event, cell.date)"
                    >{{ Number(cell.date.slice(-2)) }}</motion.button
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </CalendarPresence></motion.div
      ></AnimatePresence
    >
  </div>
</template>
