<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate, motion, motionValue } from "motion-v";
import { EASE_OUT, SPRING_LAYOUT } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { resolveElement } from "../../../lib/composables";
import type { CollapsibleContext } from "./context";
defineProps<{ contentClassName?: string }>();
const state = inject<CollapsibleContext>("orvui-collapsible");
if (!state) throw new Error("CollapsibleContent must be inside Collapsible");
const surface = ref<HTMLElement | null>(null), inner = ref<HTMLElement | null>(null), height = ref(0);
// Keep projection's opacity current through the fade's last frame instead of
// letting native animation cleanup briefly restore the pre-animation value.
const opacity = motionValue(state.open.value ? 1 : 0);
let fade: ReturnType<typeof animate> | undefined;
let observer: ResizeObserver | undefined;
function measure() { height.value = inner.value?.offsetHeight ?? 0; }
onMounted(() => {
  measure();
  if (typeof ResizeObserver !== "undefined" && inner.value) {
    observer = new ResizeObserver(measure);
    observer.observe(inner.value);
  }
});
watch(state.open, opened => {
  fade?.stop();
  fade = animate(opacity, opened ? 1 : 0, { duration: opened ? 0.18 : 0.12, ease: EASE_OUT });
  const element = surface.value;
  if (!opened && element?.contains(element.ownerDocument.activeElement)) state.triggerRef.value?.focus({ preventScroll: true });
}, { flush: "sync" });
onBeforeUnmount(() => { observer?.disconnect(); fade?.stop(); opacity.destroy(); });
</script>
<template>
  <motion.div :ref="node => surface = resolveElement<HTMLElement>(node)" :id="state.id + '-content'"
    role="region" :aria-labelledby="state.id + '-trigger'" :aria-hidden="!state.open.value" :inert="!state.open.value"
    data-slot="collapsible-content" :data-state="state.open.value ? 'open' : 'closed'" :initial="false"
    :layout="!state.reduce.value" :transition="{ layout: SPRING_LAYOUT }"
    :style="{ height: state.open.value ? (height ? `${height}px` : 'auto') : '1px', originY: 0 }" class="overflow-hidden">
    <motion.div :ref="node => inner = resolveElement<HTMLElement>(node)" :layout="!state.reduce.value" :initial="false"
      :style="{ originY: 0, opacity }" :transition="{ layout: SPRING_LAYOUT }"
      :class="cn('flow-root', contentClassName)"><slot /></motion.div>
  </motion.div>
</template>
