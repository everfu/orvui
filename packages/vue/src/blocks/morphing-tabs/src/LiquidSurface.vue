<script setup lang="ts">
import { ref, watchEffect } from "vue";
import type { MotionValue } from "motion-v";
import { liquidTabPath } from "./model";
const props = defineProps<{
  left: MotionValue<number>;
  surfaceWidth: number;
  tabWidth: number;
}>();
const path = ref("");
watchEffect((cleanup) => {
  const driver = props.left,
    width = props.surfaceWidth,
    tab = props.tabWidth;
  const render = (position: number) => {
    path.value = liquidTabPath(position, width, tab);
  };
  render(driver.get());
  cleanup(driver.on("change", render));
});
</script>
<template><path :d="path" fill="currentColor" /></template>
