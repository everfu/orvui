<script setup lang="ts">
import { computed, watch } from "vue";
import { useSelect } from "./context";
const props = withDefaults(
  defineProps<{ placeholder?: string; className?: string }>(),
  { placeholder: "Select" },
);
const state = useSelect();
const label = computed(() => state.labelFor(state.value.value));
</script>
<template>
  <span
    :class="[label ? 'text-foreground' : 'text-muted-foreground', className]"
    >{{ label ?? placeholder }}</span
  >
</template>
