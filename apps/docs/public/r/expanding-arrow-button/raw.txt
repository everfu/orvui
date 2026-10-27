<script setup lang="ts">
import { computed, ref } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { EASE_OUT, SPRING_LAYOUT, SPRING_PRESS } from "../../../lib/ease";
import { useReducedMotion, useMediaQuery } from "../../../lib/composables";
import DottedChevron from "./DottedChevron.vue";
const props = defineProps<{ disabled?: boolean; accentClassName?: string; labelClassName?: string }>();
const reduce = useReducedMotion();
const mouse = ref(false);
const focus = ref(false);
const hoverSupported = useMediaQuery("(hover: hover) and (pointer: fine)");
const expanded = computed(() => !props.disabled && (focus.value || mouse.value && hoverSupported.value));
const chevrons = [1, .82, .64, .46, .28];
const accentStyle = computed(() => ({ width: expanded.value ? "calc(100% - 12px)" : "52px", borderRadius: "16px" }));
function arrowPose() { return { opacity: expanded.value ? 1 : 0, transform: expanded.value && !reduce.value ? "translateX(0px)" : "translateX(-6px)" }; }
function arrowTiming(index: number) { return { duration: reduce.value ? 0 : .18, delay: expanded.value && !reduce.value ? .04 + index * .025 : 0, ease: EASE_OUT }; }
</script>
<template>
  <motion.button type="button" :disabled="disabled" @mouseenter="mouse = true" @mouseleave="mouse = false" @focus="focus = true" @blur="focus = false"
    :while-press="reduce || disabled ? undefined : { scale: .97 }" :transition="SPRING_PRESS"
    class="relative inline-flex h-16 min-w-72 items-center overflow-hidden rounded-[22px] bg-neutral-950 p-1.5 text-white select-none outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50">
    <motion.span layout="size" aria-hidden="true" :style="accentStyle" :transition="reduce ? { duration: 0 } : SPRING_LAYOUT" :class="cn('absolute inset-y-1.5 left-1.5 z-10 overflow-hidden bg-lime-300 text-neutral-950', accentClassName)">
      <motion.span class="absolute inset-0 grid place-items-center" :animate="{ opacity: expanded ? 0 : 1 }" :transition="{ duration: reduce ? 0 : .1, ease: EASE_OUT }"><DottedChevron class="h-7 w-5" /></motion.span>
      <span class="absolute inset-0 flex items-center justify-around px-3"><motion.span v-for="(alpha, index) in chevrons" :key="index" class="inline-grid place-items-center" :style="{ color: `rgb(10 10 10 / ${alpha})` }" :animate="arrowPose()" :transition="arrowTiming(index)"><DottedChevron class="h-7 w-5" /></motion.span></span>
    </motion.span>
    <motion.span :animate="{ opacity: expanded ? 0 : 1, transform: expanded && !reduce ? 'translateX(6px)' : 'translateX(0px)' }" :transition="{ duration: reduce ? 0 : .12, ease: EASE_OUT }" :class="cn('relative z-0 ml-[76px] mr-5 whitespace-nowrap text-lg font-medium tracking-[-0.02em]', labelClassName)"><slot /></motion.span>
  </motion.button>
</template>
