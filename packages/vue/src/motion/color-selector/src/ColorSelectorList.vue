<script setup lang="ts">
import { defineComponent, h } from "vue";
const Surface = defineComponent({ name: "ColorSelectorList", setup(_, { slots }) {
  return () => h("div", { class: "flex flex-wrap items-center gap-3 p-1" }, slots.default?.());
} });
defineSlots<{ default?: () => any }>();
</script>
<template><Surface><slot /></Surface></template>
