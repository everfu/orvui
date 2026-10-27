<script setup lang="ts">
import { useSmoothScroll, type ScrollTarget } from "./useSmoothScroll";
const props = defineProps<{ to?: ScrollTarget; target?: ScrollTarget; offset?: number; duration?: number; disabled?: boolean }>();
const scrolling = useSmoothScroll();
function activate(event: MouseEvent) {
  if (props.disabled || event.defaultPrevented) return;
  scrolling.scrollTo(props.to ?? props.target ?? 0, { offset: props.offset, duration: props.duration });
}
</script>
<template><button type="button" :disabled="disabled" @click="activate"><slot /></button></template>
