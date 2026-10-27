<script setup lang="ts">
import { defineComponent, h } from "vue";
const Surface = defineComponent({ name: "AlertDescription", setup(_, { slots }) {
  return () => h("div", { "data-slot": "alert-description", class: "text-pretty leading-relaxed text-muted-foreground [&_a]:underline [&_a]:underline-offset-4" }, slots.default?.());
} });
defineSlots<{ default?: () => any }>();
</script>
<template><Surface><slot /></Surface></template>
