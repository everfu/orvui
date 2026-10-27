<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from "vue";
import { motion, useMotionValue, useSpring, type MotionValue } from "motion-v";
import { cn } from "../../../lib/utils";
import { useReducedMotion } from "../../../lib/composables";
import { useSmoothScroll } from "./useSmoothScroll";

const props = withDefaults(defineProps<{
  variant?: "bar" | "circle"; progress?: MotionValue<number>; spring?: boolean;
  position?: "top" | "bottom"; height?: number; fixed?: boolean; size?: number; thickness?: number;
}>(), { variant: "bar", spring: true, position: "top", height: 2, fixed: true, size: 40, thickness: 3 });
const reduced = useReducedMotion();
const fallback = useSmoothScroll().progress;
const raw = useMotionValue(0);
const eased = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.6 });
const value = computed(() => props.spring && !reduced.value ? eased : raw);
const radius = computed(() => (props.size - props.thickness) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const dashOffset = useMotionValue(circumference.value);
let unsubscribe: (() => void) | undefined;
function updateDash() { dashOffset.set(circumference.value * (1 - value.value.get())); }
watch(() => props.progress ?? fallback, source => {
  unsubscribe?.();
  raw.set(source.get());
  unsubscribe = source.on("change", fraction => raw.set(fraction));
}, { immediate: true });
const unraw = raw.on("change", updateDash), uneased = eased.on("change", updateDash);
watch([circumference, value], updateDash, { immediate: true });
onBeforeUnmount(() => { unsubscribe?.(); unraw(); uneased(); raw.destroy(); dashOffset.destroy(); });
</script>
<template>
  <motion.div v-if="variant === 'bar'" aria-hidden="true" :style="{ height: `${height}px`, scaleX: value }"
    :class="cn('left-0 right-0 z-50 origin-left bg-foreground', fixed ? 'fixed' : 'absolute', position === 'top' ? 'top-0' : 'bottom-0')" />
  <svg v-else aria-hidden="true" focusable="false" role="presentation" :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="text-foreground">
    <circle :cx="size / 2" :cy="size / 2" :r="radius" fill="none" :stroke-width="thickness" class="stroke-current opacity-15" />
    <motion.circle :cx="size / 2" :cy="size / 2" :r="radius" fill="none" :stroke-width="thickness" stroke-linecap="round"
      class="stroke-current" :stroke-dasharray="circumference" :style="{ strokeDashoffset: dashOffset }" :transform="`rotate(-90 ${size / 2} ${size / 2})`" />
  </svg>
</template>
