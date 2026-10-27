<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { motion } from "motion-v";
import { EASE_OUT, SPRING_LAYOUT } from "../../../lib/ease";
import { resolveElement, useReducedMotion } from "../../../lib/composables";
const element = ref<HTMLElement | null>(null), reduced = useReducedMotion();
let observer: ResizeObserver | undefined;
function measure() {
  const item = element.value;
  if (item) item.style.setProperty("--breadcrumb-exit-width", `${item.getBoundingClientRect().width}px`);
}
onMounted(() => {
  measure();
  if (element.value && typeof ResizeObserver !== "undefined") { observer = new ResizeObserver(measure); observer.observe(element.value); }
});
onBeforeUnmount(() => {
  observer?.disconnect();
  const item = element.value;
  if (item) { item.inert = true; item.style.minWidth = "var(--breadcrumb-exit-width)"; item.style.pointerEvents = "none"; item.setAttribute("aria-hidden", "true"); }
});
</script>
<template>
  <motion.li :ref="node => element = resolveElement<HTMLElement>(node)" :layout="reduced ? false : 'position'"
    :initial="{ opacity: 0, y: reduced ? 0 : 6 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: reduced ? 0 : 6 }"
    :transition="{ duration: 0.2, ease: EASE_OUT, layout: SPRING_LAYOUT }" class="relative inline-flex min-w-0 max-w-full items-center gap-1"><slot /></motion.li>
</template>
