<script setup lang="ts">
import { computed, inject } from "vue";
import type { createDateRangePicker } from "./controller";
const props = defineProps<{ disabled?: boolean }>();
const state =
  inject<ReturnType<typeof createDateRangePicker>>("orvui-date-range")!;
const blocked = computed(
  () => props.disabled || !state.value.value || state.props.disabled,
);
function clear() {
  if (!blocked.value) state.clear();
}
</script>
<template>
  <button
    type="button"
    aria-label="Clear date range"
    :disabled="blocked"
    @click="clear"
    class="rounded-md px-1.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30"
  >
    <slot>Clear</slot>
  </button>
</template>
