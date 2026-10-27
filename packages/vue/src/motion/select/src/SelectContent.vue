<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { motion, useTransform } from "motion-v";
import { resolveElement } from "../../../lib/composables";
import { useSelect } from "./context";
import { unfoldGeometry } from "./unfold";
defineProps<{ className?: string }>();
const state = useSelect();
const panel = state.list;
const height = ref(0);
const exiting = ref(false);
let disposed = false;
let measureRevision = 0;
let observer: ResizeObserver | undefined;
let unsubscribe: (() => void) | undefined;
async function measure() {
  const revision = ++measureRevision;
  await nextTick();
  if (disposed || revision !== measureRevision) return;
  const element = resolveElement<HTMLElement>(panel.value);
  if (!element) return;
  height.value = element.offsetHeight;
  const trigger = resolveElement<HTMLElement>(state.trigger.value);
  if (state.open.value && trigger) {
    const rect = trigger.getBoundingClientRect();
    const room = window.innerHeight - rect.bottom;
    state.placement.value =
      room < height.value + 16 && rect.top > room ? "top" : "bottom";
  }
}
watch(
  state.open,
  (open, previous) => {
    if (!open && previous) exiting.value = true;
    if (open) void measure();
  },
  { flush: "post" },
);
onMounted(() => {
  void measure();
  const node = resolveElement<HTMLElement>(panel.value);
  if (node && typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(() => void measure());
    observer.observe(node);
  }
  unsubscribe = state.progress.on("animationComplete", () => {
    if (state.progress.get() === 0) exiting.value = false;
  });
  window.addEventListener("resize", measure);
});
onBeforeUnmount(() => {
  disposed = true;
  ++measureRevision;
  observer?.disconnect();
  unsubscribe?.();
  window.removeEventListener("resize", measure);
});
const geometry = () =>
  unfoldGeometry(
    state.progress.get(),
    height.value,
    state.placement.value === "top",
    state.reduce.value,
  );
const y = useTransform(() => geometry().y);
const borderRadius = useTransform(() => geometry().radius);
const clipPath = useTransform(() => geometry().clip);
const opacity = useTransform(() => geometry().opacity);
function keydown(event: KeyboardEvent) {
  if (event.key === "Tab") state.close();
  else state.keydown(event);
}
</script>
<template>
  <motion.div
    ref="panel"
    :id="state.listId"
    role="listbox"
    :aria-labelledby="state.triggerId"
    :aria-hidden="!state.open.value"
    :inert="!state.open.value"
    @keydown="keydown"
    :style="{
      visibility: state.open.value || exiting ? 'visible' : 'hidden',
      maxHeight: state.open.value || exiting ? undefined : 0,
      borderWidth: state.open.value || exiting ? undefined : 0,
      y,
      clipPath,
      borderRadius,
      opacity,
      pointerEvents: state.open.value ? 'auto' : 'none',
      marginTop: state.placement.value === 'top' ? '0px' : '8px',
      marginBottom: state.placement.value === 'top' ? '8px' : '0px',
    }"
    :class="[
      'absolute inset-x-0 z-20 overflow-hidden border border-border bg-background shadow-lg',
      state.placement.value === 'top' ? 'bottom-full' : 'top-full',
      className,
    ]"
    ><motion.div
      :initial="false"
      :animate="state.open.value ? 'show' : 'hidden'"
      class="p-1"
      ><slot /></motion.div
  ></motion.div>
</template>
