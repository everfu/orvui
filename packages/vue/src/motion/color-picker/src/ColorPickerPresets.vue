<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from "vue";
import { animate, motion, motionValue } from "motion-v";
import { SPRING_LAYOUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { usePicker } from "./context";
import { createPresetArc } from "./preset-motion";
const state = usePicker();
const reduced = useReducedMotion();
const root = ref<HTMLElement | null>(null);
const visible = ref(false);
const x = motionValue(0),
  y = motionValue(0),
  width = motionValue(30),
  height = motionValue(30);
const entries = new Map<HTMLElement, string>();
const arc = createPresetArc();
let animation: ReturnType<typeof animate> | undefined;
let observer: ResizeObserver | undefined;
let disposed = false;
let revision = 0;
function measure() {
  const container = root.value;
  const selected = [...entries].find(
    ([, value]) => value === state.hex.value,
  )?.[0];
  if (!container || !selected || disposed) {
    visible.value = false;
    return;
  }
  let left = -3,
    top = -3;
  for (
    let element: HTMLElement | null = selected;
    element && element !== container;
    element = element.offsetParent as HTMLElement | null
  ) {
    left += element.offsetLeft;
    top += element.offsetTop;
  }
  animation?.stop();
  width.set(selected.offsetWidth + 6);
  height.set(selected.offsetHeight + 6);
  if (!visible.value || reduced.value) {
    x.jump(left);
    y.jump(top);
  } else {
    const curve = arc({ x: x.get(), y: y.get() }, { x: left, y: top });
    animation = animate(0, 1, {
      ...SPRING_LAYOUT,
      onUpdate: (phase) => {
        const point = curve(phase);
        x.set(point.x);
        y.set(point.y);
      },
      onComplete: () => {
        if (!disposed) {
          x.set(left);
          y.set(top);
        }
      },
    });
  }
  visible.value = true;
}
async function schedule() {
  const version = ++revision;
  await nextTick();
  if (!disposed && version === revision) measure();
}
provide("orvui-color-presets", {
  register(node: HTMLElement, value: string) {
    entries.set(node, value);
    void schedule();
    return () => {
      entries.delete(node);
      void schedule();
    };
  },
});
watch([state.hex, reduced], schedule);
onMounted(() => {
  if (root.value && typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(measure);
    observer.observe(root.value);
  }
  void schedule();
});
onBeforeUnmount(() => {
  disposed = true;
  ++revision;
  observer?.disconnect();
  animation?.stop();
  for (const value of [x, y, width, height]) value.destroy();
});
</script>
<template>
  <div ref="root" class="relative flex flex-wrap gap-2">
    <motion.span
      v-if="visible"
      aria-hidden="true"
      data-color-picker-preset-ring=""
      class="pointer-events-none absolute left-0 top-0 rounded-full border-2 border-foreground/70"
      :style="{ x, y, width, height }"
    /><slot />
  </div>
</template>
