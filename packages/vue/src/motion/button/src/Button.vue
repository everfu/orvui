<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { EASE_OUT, SPRING_PRESS } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  pressScale?: number;
  ripple?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}
const props = withDefaults(defineProps<ButtonProps>(), { variant: "primary", size: "md", pressScale: 0.93, type: "button" });
const reduced = useReducedMotion();
const waves = ref<{ key: number; left: number; top: number; diameter: number }[]>([]);
let sequence = 0;
const appearance = computed(() => ({
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "border border-border bg-card text-foreground",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-muted/60",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted/60",
})[props.variant]);
const geometry = computed(() => ({
  sm: "h-8 px-3 text-xs gap-1.5 rounded-full", md: "h-10 px-5 text-sm gap-2 rounded-full",
  lg: "h-12 px-6 text-base gap-2 rounded-full", icon: "h-8 w-8 rounded-lg",
})[props.size]);
function startWave(event: PointerEvent) {
  if (!props.ripple || props.disabled || reduced.value) return;
  const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
  waves.value = [...waves.value, {
    key: sequence++, left: event.clientX - bounds.left, top: event.clientY - bounds.top,
    diameter: 2 * Math.max(bounds.width, bounds.height),
  }];
}
function finishWave(key: number) { waves.value = waves.value.filter(wave => wave.key !== key); }
onBeforeUnmount(() => { waves.value = []; });
</script>

<template>
  <motion.button :type="type" :disabled="disabled" :transition="SPRING_PRESS" @pointerdown="startWave"
    :while-press="reduced || disabled ? undefined : { scale: pressScale }"
    :while-hover="reduced || disabled ? undefined : { scale: 1.02 }"
    :class="cn('relative inline-flex items-center justify-center font-medium select-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', ripple && 'overflow-hidden', appearance, geometry, $attrs.class)">
    <span v-if="ripple" class="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <motion.span v-for="wave in waves" :key="wave.key" class="absolute rounded-full bg-current"
        :style="{ left: `${wave.left}px`, top: `${wave.top}px`, width: `${wave.diameter}px`, height: `${wave.diameter}px`, x: '-50%', y: '-50%' }"
        :initial="{ scale: 0.05, opacity: 0.3 }" :animate="{ scale: 1, opacity: 0 }"
        :transition="{ duration: 1.6, ease: EASE_OUT }" @animation-complete="finishWave(wave.key)" />
    </span>
    <slot />
  </motion.button>
</template>
