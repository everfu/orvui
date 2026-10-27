<script setup lang="ts">
import { inject, useSlots } from "vue";
import type { createDateRangePicker } from "./controller";
import DateRangePickerPreset from "./DateRangePickerPreset.vue";
const state =
  inject<ReturnType<typeof createDateRangePicker>>("orvui-date-range")!;
const slots = useSlots();
</script>
<template>
  <div
    v-if="slots.default || state.props.presets?.length"
    class="mt-2.5 flex flex-wrap justify-center gap-1.5"
  >
    <slot
      ><DateRangePickerPreset
        v-for="preset in state.props.presets"
        :key="preset.label"
        v-bind="preset"
        >{{ preset.label }}</DateRangePickerPreset
      ></slot
    >
  </div>
</template>
