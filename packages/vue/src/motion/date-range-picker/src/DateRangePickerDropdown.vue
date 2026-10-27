<script setup lang="ts">
import type { DateRangeOptions } from "./controller";
import DateRangePicker from "./DateRangePicker.vue";
import DateRangePickerTrigger from "./DateRangePickerTrigger.vue";
import DateRangePickerContent from "./DateRangePickerContent.vue";
import DateRangePickerCalendar from "./DateRangePickerCalendar.vue";
const props = withDefaults(
  defineProps<
    DateRangeOptions & {
      placeholder?: string;
      triggerClassName?: string;
      calendarClassName?: string;
    }
  >(),
  { open: undefined, autoFocus: true, showSummary: false },
);
const emit = defineEmits([
  "update:modelValue",
  "valueChange",
  "change",
  "update:open",
  "openChange",
]);
</script>
<template>
  <DateRangePicker
    v-bind="props"
    @update:model-value="emit('update:modelValue', $event)"
    @value-change="emit('valueChange', $event)"
    @change="emit('change', $event)"
    @update:open="emit('update:open', $event)"
    @open-change="emit('openChange', $event)"
    ><DateRangePickerTrigger
      :placeholder="placeholder"
      :class="triggerClassName" /><DateRangePickerContent
      :auto-focus="autoFocus"
      ><DateRangePickerCalendar
        :class="[
          'w-full rounded-none border-0',
          calendarClassName,
        ]" /></DateRangePickerContent
  ></DateRangePicker>
</template>
