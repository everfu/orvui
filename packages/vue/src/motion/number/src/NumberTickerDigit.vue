<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { animate, motion } from "motion-v";
import { EASE_OUT } from "../../../lib/ease";
import { resolveElement, useReducedMotion } from "../../../lib/composables";
const props = defineProps<{ digit: number; delay: number; duration: number; blur: boolean; className?: string }>();
const column = ref<HTMLElement | null>(null), reduced = useReducedMotion();
let animation: ReturnType<typeof animate> | undefined;
watch([() => props.digit, () => props.delay, () => props.duration, () => props.blur, reduced, column], () => {
  animation?.stop();
  const target = column.value;
  if (!target) return;
  if (reduced.value || !props.blur || !Number.isFinite(props.digit)) { target.style.filter = "blur(0px)"; return; }
  animation = animate(target, { filter: ["blur(10px)", "blur(0px)"] }, { duration: Math.min(0.32, props.duration * 0.75), delay: props.delay, ease: EASE_OUT });
}, { flush: "post" });
onBeforeUnmount(() => { animation?.stop(); if (column.value) column.value.style.filter = "blur(0px)"; });
</script>
<template>
  <span :class="['relative inline-block text-center [clip-path:inset(0)]', className]" :style="{ height: '1.1em', lineHeight: '1.1em', width: '1ch' }">
    <span class="invisible">{{ digit }}</span>
    <motion.span :ref="node => column = resolveElement<HTMLElement>(node)" :initial="{ y: 0 }" :animate="{ y: `-${digit * 1.1}em` }"
      :transition="reduced ? { duration: 0 } : { duration, delay, ease: EASE_OUT }" class="absolute inset-x-0 top-0 flex flex-col items-center will-change-[transform,filter]">
      <span v-for="digitValue in 10" :key="digitValue - 1" class="flex h-[1.1em] items-center justify-center leading-none">{{ digitValue - 1 }}</span>
    </motion.span>
  </span>
</template>
