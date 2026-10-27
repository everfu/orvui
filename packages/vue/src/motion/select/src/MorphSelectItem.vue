<script setup lang="ts">
import SelectItem from "./SelectItem.vue";
const props = defineProps<{
  value: string;
  disabled?: boolean;
  label?: string;
  className?: string;
}>();
</script>
<template>
  <SelectItem v-bind="props"><slot /></SelectItem>
</template>
