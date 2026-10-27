<script setup lang="ts">
import { defineComponent, h } from "vue";
const Surface = defineComponent({ name: "BreadcrumbPage", setup(_, { slots }) {
  return () => h("span", { "aria-current": "page", class: "relative isolate inline-flex min-h-8 min-w-0 items-center gap-1.5 rounded-md px-2 font-medium text-foreground [overflow-wrap:anywhere] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&>svg]:size-3.5 [&>svg]:shrink-0" }, slots.default?.());
} });
defineSlots<{ default?: () => any }>();
</script>
<template><Surface><slot /></Surface></template>
