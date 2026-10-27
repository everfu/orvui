<script setup lang="ts">
import { defineComponent, h } from "vue";
const Surface = defineComponent({ name: "ColorSelectorLabel", setup(_, { slots }) {
  return () => h("legend", { class: "mb-3 p-0 text-sm font-medium text-muted-foreground" }, slots.default?.());
} });
defineSlots<{ default?: () => any }>();
</script>
<template><Surface><slot /></Surface></template>
