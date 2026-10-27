<script setup lang="ts">
import { inject } from "vue";
import DateRangePickerSummary from "./DateRangePickerSummary.vue";
import DateRangePickerHeader from "./DateRangePickerHeader.vue";
import DateRangePickerGrid from "./DateRangePickerGrid.vue";
import DateRangePickerFooter from "./DateRangePickerFooter.vue";
import type { createDateRangePicker } from "./controller";
withDefaults(defineProps<{ showSummary?: boolean }>(), {
  showSummary: undefined,
});
const state =
  inject<ReturnType<typeof createDateRangePicker>>("orvui-date-range")!;
</script>
<template>
  <section
    :aria-label="state.props.label"
    class="w-80 max-w-full rounded-2xl border border-border bg-background p-3.5"
  >
    <h3 :id="state.heading" aria-live="polite" class="sr-only">
      {{ state.format(state.month.value, { month: "long", year: "numeric" }) }}
    </h3>
    <slot
      ><DateRangePickerSummary
        v-if="
          showSummary ?? state.props.showSummary
        " /><DateRangePickerHeader /><DateRangePickerGrid /><DateRangePickerFooter
    /></slot>
    <p :id="state.help" class="sr-only">
      Use arrow keys to navigate dates, Home and End for the week, Page Up and
      Page Down for months, Shift with Page Up or Page Down for years. Enter or
      Space selects a date. Use the month and year buttons to jump directly. In
      the month or year choices, use arrow keys to move and Escape to return.
    </p>
    <span role="status" class="sr-only">{{ state.announcement.value }}</span>
  </section>
</template>
