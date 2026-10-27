<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { motion } from "motion-v";
import { cn } from "../../lib/utils";
import { resolveElement } from "../../lib/composables";
import type { SearchController } from "./controller";

const props = withDefaults(defineProps<{
  context: SearchController;
  side?: "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  avoidCollisions?: boolean;
}>(), { side: "bottom", align: "start", sideOffset: 6, avoidCollisions: true });
const portalReady = ref(false), animationReady = ref(false);
const measure = ref<HTMLElement | null>(null);
const metrics = ref<{
  trigger: { left: number; top: number; bottom: number; width: number };
  content: { width: number; height: number };
  viewport: { width: number; height: number };
} | null>(null);
let observer: ResizeObserver | undefined;
let measurementFrame = 0, activationFrame = 0;
let disposed = false;
function measureNow() {
  const trigger = props.context.triggerRef.value;
  const content = measure.value;
  if (disposed || !trigger || !content) return;
  const anchorBounds = trigger.getBoundingClientRect(), contentBounds = content.getBoundingClientRect();
  metrics.value = {
    trigger: { left: anchorBounds.left, top: anchorBounds.top, bottom: anchorBounds.bottom, width: anchorBounds.width },
    content: { width: contentBounds.width, height: contentBounds.height },
    viewport: { width: window.innerWidth, height: window.innerHeight },
  };
}
function scheduleMeasurement() {
  cancelAnimationFrame(measurementFrame);
  measurementFrame = requestAnimationFrame(measureNow);
}
const actualSide = computed(() => {
  const box = metrics.value;
  if (!box || !props.avoidCollisions || !props.context.open.value) return props.side;
  const available = { top: box.trigger.top, bottom: box.viewport.height - box.trigger.bottom };
  const other = props.side === "top" ? "bottom" : "top";
  return available[props.side] < box.content.height + props.sideOffset && available[other] > available[props.side] ? other : props.side;
});
const style = computed(() => {
  const box = metrics.value;
  if (!box) return { visibility: "hidden" as const };
  const alignment = props.align === "end" ? 1 : props.align === "center" ? 0.5 : 0;
  const desired = box.trigger.left + alignment * (box.trigger.width - box.content.width);
  const left = Math.min(Math.max(desired, 8), Math.max(8, box.viewport.width - box.content.width - 8));
  return {
    left: `${left}px`,
    top: actualSide.value === "bottom" ? `${box.trigger.bottom}px` : undefined,
    bottom: actualSide.value === "top" ? `${box.viewport.height - box.trigger.top}px` : undefined,
    minWidth: `${box.trigger.width}px`, width: `${box.trigger.width}px`,
    pointerEvents: props.context.open.value ? "auto" as const : "none" as const,
    transformOrigin: actualSide.value === "bottom" ? "top" : "bottom",
    visibility: "visible" as const,
    "--combobox-trigger-width": `${box.trigger.width}px`,
  };
});
const transition = computed(() => props.context.reduce.value || !animationReady.value
  ? { duration: 0 } : { type: "spring" as const, duration: 0.5, bounce: 0.22 });
function observeElements() {
  observer?.disconnect();
  if (!observer) return;
  if (props.context.triggerRef.value) observer.observe(props.context.triggerRef.value);
  if (measure.value) observer.observe(measure.value);
}
watch(() => [props.context.open.value, props.context.query.value, props.side, props.align, props.sideOffset, props.avoidCollisions],
  () => void nextTick(measureNow), { flush: "post" });
watch(() => [props.context.triggerRef.value, measure.value], () => {
  observeElements();
  measureNow();
}, { flush: "post" });
onMounted(async () => {
  portalReady.value = true;
  await nextTick();
  if (disposed) return;
  if (typeof ResizeObserver !== "undefined") observer = new ResizeObserver(scheduleMeasurement);
  observeElements();
  measureNow();
  window.addEventListener("resize", scheduleMeasurement);
  document.addEventListener("scroll", scheduleMeasurement, true);
  activationFrame = requestAnimationFrame(() => { animationReady.value = true; });
});
onBeforeUnmount(() => {
  disposed = true;
  observer?.disconnect();
  cancelAnimationFrame(measurementFrame);
  cancelAnimationFrame(activationFrame);
  window.removeEventListener("resize", scheduleMeasurement);
  document.removeEventListener("scroll", scheduleMeasurement, true);
  props.context.contentRef.value = null;
});
</script>

<template>
  <Teleport v-if="portalReady" to="body">
    <motion.div v-bind="$attrs"
      :ref="element => context.contentRef.value = resolveElement<HTMLElement>(element)"
      :data-side="actualSide" :aria-hidden="!context.open.value" :inert="!context.open.value"
      :initial="false"
      :animate="{
        height: context.open.value ? (metrics?.content.height ?? 0) : 0,
        opacity: context.open.value ? 1 : 0,
        y: context.open.value ? (actualSide === 'bottom' ? sideOffset : -sideOffset) : 0,
      }"
      :transition="transition" :style="style"
      :class="cn('fixed z-[9999] overflow-hidden rounded-xl border border-border bg-background text-popover-foreground outline-none will-change-[height,transform]', $attrs.class as string)"
    >
      <div ref="measure">
        <motion.div :initial="false" :animate="{ opacity: context.open.value ? 1 : 0 }" :transition="transition"><slot /></motion.div>
      </div>
    </motion.div>
  </Teleport>
</template>
