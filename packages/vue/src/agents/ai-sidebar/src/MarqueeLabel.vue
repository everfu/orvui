<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { motion } from "motion-v";
import { EASE_OUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
const props = defineProps<{ active: boolean; label: string }>();
const viewport = ref<HTMLElement>();
const text = ref<HTMLElement>();
const travel = ref(0);
const reduced = useReducedMotion();
const running = computed(
  () => props.active && travel.value > 0 && !reduced.value,
);
let observer: ResizeObserver | undefined;
let alive = false;
function measure() {
  if (alive && viewport.value && text.value)
    travel.value =
      text.value.scrollWidth > viewport.value.clientWidth
        ? text.value.scrollWidth + 24
        : 0;
}
watch(
  () => props.label,
  () => nextTick(measure),
);
onMounted(() => {
  alive = true;
  measure();
  if (typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(measure);
    if (viewport.value) observer.observe(viewport.value);
    if (text.value) observer.observe(text.value);
  }
});
onBeforeUnmount(() => {
  alive = false;
  observer?.disconnect();
});
</script>
<template>
  <span ref="viewport" class="block min-w-0 flex-1 overflow-hidden"
    ><motion.span
      class="flex w-max items-center gap-6 whitespace-nowrap"
      :animate="{ x: running ? [0, -travel] : 0 }"
      :transition="
        running
          ? {
              duration: Math.max(2.4, travel / 34),
              ease: 'linear',
              repeat: Infinity,
              repeatDelay: 2,
            }
          : { duration: 0.16, ease: EASE_OUT }
      "
      ><span ref="text">{{ label }}</span
      ><span v-if="running" aria-hidden="true">{{ label }}</span></motion.span
    ></span
  >
</template>
