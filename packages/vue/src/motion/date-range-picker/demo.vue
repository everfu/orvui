<script setup lang="ts">
import {
  DateRangePicker,
  DateRangePickerCalendar,
  DateRangePickerClear,
  DateRangePickerContent,
  DateRangePickerFooter,
  DateRangePickerGrid,
  DateRangePickerHeader,
  DateRangePickerSelection,
  DateRangePickerTrigger,
} from "./index";
const reporting = {
  label: "Reporting period",
  defaultMonth: "2026-10-25",
  defaultValue: { from: "2026-10-19", to: "2026-10-25" },
  max: "2026-10-25",
};
</script>
<template>
  <DateRangePicker v-bind="reporting"
    ><DateRangePickerTrigger /><DateRangePickerContent
      ><DateRangePickerCalendar class="w-full rounded-none border-0"
        ><DateRangePickerHeader /><DateRangePickerGrid /><DateRangePickerFooter
          ><div class="flex items-center justify-between gap-2">
            <DateRangePickerSelection /><DateRangePickerClear /></div></DateRangePickerFooter></DateRangePickerCalendar></DateRangePickerContent
  ></DateRangePicker>
</template>
