<script setup lang="ts">
import { defineComponent, h } from "vue";
const Surface = defineComponent({ name: "AlertTitle", setup(_, { slots }) {
  return () => h("div", { "data-slot": "alert-title", class: "font-medium leading-5 text-pretty" }, slots.default?.());
} });
defineSlots<{ default?: () => any }>();
</script>
<template><Surface><slot /></Surface></template>
