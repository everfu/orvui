<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useAnimatedSidebar } from "../../../motion/animated-sidebar";
const props = withDefaults(defineProps<{ minWidth?: number }>(), {
  minWidth: 600,
});
const anchor = ref<HTMLElement>();
const sidebar = useAnimatedSidebar();
let observer: ResizeObserver | undefined;
let alive = false;
function subscribe() {
  observer?.disconnect();
  const shell = anchor.value?.parentElement;
  if (!alive || !shell || typeof ResizeObserver === "undefined") return;
  let previous: boolean | undefined;
  observer = new ResizeObserver((entries) => {
    const width = entries[0]?.contentRect.width;
    if (width === undefined) return;
    const compact = width < props.minWidth;
    if (compact === previous) return;
    const initial = previous === undefined;
    previous = compact;
    if (initial && !compact) return;
    if (sidebar.open.value === compact) sidebar.open.value = !compact;
  });
  observer.observe(shell);
}
watch(() => props.minWidth, subscribe);
onMounted(() => {
  alive = true;
  subscribe();
});
onBeforeUnmount(() => {
  alive = false;
  observer?.disconnect();
});
</script>
<template><div ref="anchor" class="hidden" /></template>
