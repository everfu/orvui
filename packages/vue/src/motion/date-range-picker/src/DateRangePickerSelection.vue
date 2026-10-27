<script setup lang="ts">
import { computed, inject } from "vue";
import type { createDateRangePicker } from "./controller";
const state =
  inject<ReturnType<typeof createDateRangePicker>>("orvui-date-range")!;
const label = computed(() =>
  state.dayCount.value
    ? `${state.dayCount.value} ${state.dayCount.value === 1 ? "day" : "days"} selected`
    : state.value.value
      ? "Choose an end date"
      : "Choose a start date",
);
</script>
<template>
  <p class="text-xs text-muted-foreground">
    <slot :value="state.value.value">{{ label }}</slot>
  </p>
</template>
