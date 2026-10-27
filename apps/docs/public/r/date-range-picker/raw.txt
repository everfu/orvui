<script setup lang="ts">
import { provide } from "vue";
import { MorphPopover } from "../../popover";
import { createDateRangePicker, type DateRangeOptions } from "./controller";
import DateRangePickerCalendar from "./DateRangePickerCalendar.vue";
const props = withDefaults(defineProps<DateRangeOptions>(), {
  open: undefined,
  defaultValue: null,
  locale: "en-US",
  label: "Choose a date range",
  showSummary: true,
  defaultOpen: false,
  closeOnSelect: false,
});
const emit = defineEmits([
  "update:modelValue",
  "valueChange",
  "change",
  "update:open",
  "openChange",
]);
const state = createDateRangePicker(props, emit);
provide("orvui-date-range", state);
</script>
<template>
  <MorphPopover
    :open="state.open.value"
    class="max-w-full"
    @update:open="state.setOpen"
    ><slot
      :value="state.value.value"
      :select-date="state.select"
      :clear="state.clear"
      ><DateRangePickerCalendar /></slot
  ></MorphPopover>
</template>
