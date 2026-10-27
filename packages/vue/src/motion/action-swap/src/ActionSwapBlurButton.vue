<script setup lang="ts">
import type { Component, VNodeChild } from "vue";
import ActionSwapButton from "./ActionSwapButton.vue";
const props = withDefaults(defineProps<{
  items: { id: string; label: VNodeChild | Component; icon?: VNodeChild | Component; ariaLabel?: string }[];
  modelValue?: string; value?: string; defaultValue?: string; cycle?: boolean; disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost"; size?: "sm" | "md" | "lg" | "icon";
}>(), { cycle: undefined });
const emit = defineEmits(["update:modelValue", "update:value", "valueChange"]);
function changed(value: string, item: typeof props.items[number]) { emit("valueChange", value, item); }
</script>
<template><ActionSwapButton v-bind="props" animation="blur" @update:model-value="emit('update:modelValue', $event)" @update:value="emit('update:value', $event)" @value-change="changed">
  <template v-if="$slots.default" #default="slotProps"><slot v-bind="slotProps" /></template>
  <template v-if="$slots.icon" #icon="slotProps"><slot name="icon" v-bind="slotProps" /></template>
</ActionSwapButton></template>
