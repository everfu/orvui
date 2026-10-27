<script setup lang="ts">
import { provide } from "vue";
import { createReturnsModel, returnsContext } from "./context";
import type { ReturnsCalendarProps } from "./types";
import ReturnsCalendarGrid from "./ReturnsCalendarGrid.vue";
import ReturnsCalendarTooltip from "./ReturnsCalendarTooltip.vue";
const props = defineProps<ReturnsCalendarProps>();
const emit = defineEmits(["update:selection", "selectionChange"]);
const calendar = createReturnsModel(props, emit);
provide(returnsContext.key, calendar);
</script>
<template>
  <section
    aria-label="Monthly returns calendar"
    :class="[
      'relative w-[480px] max-w-full [--ink-l:0.5] dark:[--ink-l:1]',
      props.className,
    ]"
  >
    <slot
      ><ReturnsCalendarGrid><ReturnsCalendarTooltip /></ReturnsCalendarGrid
    ></slot>
    <div class="sr-only">
      <table>
        <caption>
          Monthly returns in percent
        </caption>
        <thead>
          <tr>
            <th>Year</th>
            <th v-for="month in 12" :key="month">{{ month }}</th>
            <th>Year total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(year, index) in calendar.years" :key="year">
            <th>{{ year }}</th>
            <td v-for="month in 12" :key="month">
              {{ calendar.valueAt(index, month - 1) }}
            </td>
            <td>{{ calendar.totals[index] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
