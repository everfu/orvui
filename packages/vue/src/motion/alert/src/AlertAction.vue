<script setup lang="ts">
import { defineComponent, h } from "vue";
const Surface = defineComponent({ name: "AlertAction", setup(_, { slots }) {
  return () => h("div", { "data-slot": "alert-action", class: "flex flex-wrap items-center gap-2 pt-2" }, slots.default?.());
} });
defineSlots<{ default?: () => any }>();
</script>
<template><Surface><slot /></Surface></template>
