<script setup lang="ts">
import { h, mergeProps, renderSlot, useAttrs } from "vue";
import DateRangePickerSelection from "./DateRangePickerSelection.vue";
import DateRangePickerClear from "./DateRangePickerClear.vue";
import DateRangePickerPresets from "./DateRangePickerPresets.vue";
defineOptions({ inheritAttrs: false });
const slots = defineSlots<{ default?(props: {}): any }>();
const attrs = useAttrs();
const summaryParts = [DateRangePickerSelection, DateRangePickerClear] as const;
const defaultContent = () => [
  h(
    "div",
    { class: "flex items-center justify-between gap-2" },
    summaryParts.map((part) => h(part)),
  ),
  h(DateRangePickerPresets),
];
const RenderFrame = () =>
  h(
    "div",
    mergeProps({ class: "mt-2.5 border-t border-border pt-2.5" }, attrs),
    [renderSlot(slots, "default", {}, defaultContent)],
  );
</script>
<template><RenderFrame /></template>
