<script setup lang="ts">
import { provide } from "vue";
import { createSelect, selectKey, type SelectProps } from "./context";
const props = withDefaults(defineProps<SelectProps>(), { open: undefined });
const emit = defineEmits([
  "update:modelValue",
  "valueChange",
  "change",
  "update:open",
  "openChange",
]);
const state = createSelect(props, emit, true);
provide(selectKey, state);
const root = state.root;
</script>
<template>
  <div ref="root" :class="['relative', className]">
    <slot :value="state.value.value" :open="state.open.value" />
  </div>
</template>
