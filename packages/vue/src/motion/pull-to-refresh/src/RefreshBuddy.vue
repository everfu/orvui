<script setup lang="ts">
import { computed } from "vue";
import { motion, useTransform, type MotionValue } from "motion-v";
import { EASE_IN_OUT, SPRING_SWAP } from "../../../lib/ease";
const props = defineProps<{ progress: MotionValue<number>; status: string; reduce: boolean }>();
const y = useTransform(props.progress, [0, 1], [-7, 0]);
const rotate = useTransform(props.progress, [0, 1], [-10, 0]);
const scaleY = useTransform(props.progress, [0, .55, 1], [.68, 1.1, .92]);
const ready = computed(() => props.status === "ready");
const busy = computed(() => props.status === "refreshing");
const repeat = computed(() => ({ duration: props.reduce ? 1.2 : .9, ease: EASE_IN_OUT, repeat: Infinity }));
const body = computed(() => busy.value ? props.reduce ? { opacity: [.55, 1, .55] } : { y: [0, -2, 0], rotate: [-3, 3, -3] } : props.reduce ? { opacity: 1 } : { y: 0, rotate: 0, scale: ready.value ? 1.08 : 1 });
const orbit = computed(() => busy.value && !props.reduce ? { rotate: [0, 360] } : props.reduce ? undefined : { rotate: ready.value ? 0 : -35 });
const eyes = computed(() => busy.value && !props.reduce ? { scaleY: [1, 1, .15, 1, 1] } : props.reduce ? { opacity: 1 } : { scaleY: ready.value ? 1.18 : 1 });
</script>
<template>
  <motion.span :style="reduce ? undefined : { y, rotate, scaleY }" class="block h-9 w-9 origin-bottom"><motion.svg aria-hidden="true" viewBox="0 0 36 36" :style="{ opacity: 1 }" class="h-full w-full overflow-visible" :animate="body" :transition="busy ? repeat : SPRING_SWAP">
    <motion.g :style="{ transformOrigin: '18px 18px' }" :animate="orbit" :transition="busy ? repeat : SPRING_SWAP" :class="['transition-opacity duration-150', ready || busy ? 'opacity-100' : 'opacity-0']"><path d="M18 2.5a15.5 15.5 0 0 1 12.7 6.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="text-muted-foreground" /><circle cx="31.3" cy="10.2" r="2.2" class="fill-foreground" /></motion.g>
    <rect x="7" y="7" width="22" height="22" rx="9" class="fill-foreground" />
    <motion.g :style="{ opacity: 1, transformOrigin: '18px 16px' }" :animate="eyes" :transition="busy && !reduce ? repeat : SPRING_SWAP"><circle v-for="x in [14.2, 21.8]" :key="x" :cx="x" cy="16" r="1.45" class="fill-background" /></motion.g>
    <path v-for="mouth in [{ path: 'M14.5 21h7', show: !ready && !busy }, { path: 'M14 20.5c1 2.4 7 2.4 8 0', show: ready }]" :key="mouth.path" :d="mouth.path" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" :class="['text-background transition-opacity duration-150', mouth.show ? 'opacity-100' : 'opacity-0']" /><circle cx="18" cy="21" r="1.6" :class="['fill-background transition-opacity duration-150', busy ? 'opacity-100' : 'opacity-0']" />
  </motion.svg></motion.span>
</template>
