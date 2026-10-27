<script setup lang="ts">
import { computed, inject } from "vue";
import type { createDateRangePicker } from "./controller";
const state =
  inject<ReturnType<typeof createDateRangePicker>>("orvui-date-range")!;
function identity() {
  return state.view.value === "days"
    ? state.month.value
    : `${state.view.value}-${state.view.value === "years" ? state.yearPage.value : state.year.value}`;
}
const captured = identity();
const current = computed(() => captured === identity());
</script>
<template>
  <div :inert="!current"><slot /></div>
</template>
