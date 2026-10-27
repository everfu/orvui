<script setup lang="ts">
import { computed, watch } from "vue";
import { useSelect } from "./context";
const props = defineProps<{ placeholder?: string; className?: string }>();
const state = useSelect();
const label = computed(() => state.labelFor(state.value.value));
watch(
  () => props.placeholder,
  (value) => {
    if (value) state.placeholder.value = value;
  },
  { immediate: true },
);
</script>
<template>
  <span
    :class="[label ? 'text-foreground' : 'text-muted-foreground', className]"
    >{{ label ?? placeholder ?? "Select" }}</span
  >
</template>
