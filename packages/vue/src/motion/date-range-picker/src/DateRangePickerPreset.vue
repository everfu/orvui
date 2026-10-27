<script setup lang="ts">
import { computed, inject, ref } from "vue";
import { cn } from "../../../lib/utils";
import type { DateRange } from "./types";
import type { createDateRangePicker } from "./controller";
const props = defineProps<{
  value: DateRange;
  label?: string;
  disabled?: boolean;
}>();
const state =
  inject<ReturnType<typeof createDateRangePicker>>("orvui-date-range")!;
const root = ref<HTMLButtonElement | null>(null);
const selected = computed(
  () =>
    state.value.value?.from === props.value.from &&
    state.value.value?.to === props.value.to,
);
function choose() {
  if (!props.disabled && state.rangeAvailable(props.value))
    state.selectPreset(
      props.value,
      props.label ?? root.value?.textContent?.trim() ?? "Preset",
    );
}
</script>
<template>
  <button
    ref="root"
    type="button"
    :aria-label="label"
    :aria-pressed="selected"
    :disabled="disabled || !state.rangeAvailable(value)"
    @click="choose"
    :class="
      cn(
        'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40',
        selected
          ? 'bg-foreground text-background'
          : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
      )
    "
  >
    <slot>{{ label }}</slot>
  </button>
</template>
