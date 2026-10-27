<script setup lang="ts">
import { h, mergeProps, provide, renderSlot, useAttrs } from "vue";
import { registrarKey } from "./context";
defineOptions({ inheritAttrs: false });
const slots = defineSlots<{ default?(props: {}): any }>();
const attrs = useAttrs();
provide(registrarKey, true);
// Registration descendants stay mounted inside this injection boundary.
const RenderFrame = () =>
  h("div", mergeProps({ hidden: true }, attrs), [renderSlot(slots, "default")]);
</script>
<template><RenderFrame /></template>
