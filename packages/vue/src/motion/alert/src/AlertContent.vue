<script setup lang="ts">
import { defineComponent, h } from "vue";
const Surface = defineComponent({ name: "AlertContent", setup(_, { slots }) {
  return () => h("div", { "data-slot": "alert-content", class: "min-w-0 flex-1 space-y-1" }, slots.default?.());
} });
defineSlots<{ default?: () => any }>();
</script>
<template><Surface><slot /></Surface></template>
