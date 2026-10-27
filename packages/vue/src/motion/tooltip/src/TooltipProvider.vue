<script setup lang="ts">
import { computed, inject, provide } from "vue";
import { timingKey } from "./context";
const props = defineProps<{
  delay?: number;
  closeDelay?: number;
  skipDelay?: number;
  skipDelayDuration?: number;
}>();
const inherited = inject(
  timingKey,
  computed(() => ({ delay: 120, closeDelay: 0, skipDelay: 300 })),
);
provide(
  timingKey,
  computed(() => ({
    delay: props.delay ?? inherited.value.delay,
    closeDelay: props.closeDelay ?? inherited.value.closeDelay,
    skipDelay:
      props.skipDelay ?? props.skipDelayDuration ?? inherited.value.skipDelay,
  })),
);
</script>
<template><slot /></template>
