<script setup lang="ts">
import { motion, useTransform } from "motion-v";
import { useReducedMotion } from "../../../lib/composables";
import { SPRING_PRESS } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { useSlider, type SliderOptions } from "./useSlider";
import { useSliderMotion } from "./visual-state";
const props = withDefaults(defineProps<SliderOptions & { label?: string; format?: (v: number) => string }>(), { format: (v: number) => `${v}%` });
const emit = defineEmits(["update:modelValue", "change", "valueCommit"]);
const { current, percent, dragging, trackRef, sliderRef, trackProps, sliderProps } = useSlider(props, emit);
const reduced = useReducedMotion();
const { position } = useSliderMotion(percent, reduced);
const clip = useTransform(position, value => `inset(0 ${100 - value}% 0 0 round 9999px)`);
</script>
<template><div ref="trackRef" v-bind="trackProps" :class="cn('relative flex h-12 w-full touch-none overflow-hidden rounded-full bg-muted select-none', disabled ? 'pointer-events-none opacity-50' : 'cursor-grab active:cursor-grabbing')"><motion.div :animate="reduced ? undefined : { scale: dragging ? 1.03 : 1 }" :transition="SPRING_PRESS" class="absolute inset-0"><div class="pointer-events-none absolute inset-0 flex items-center justify-between px-5 text-sm font-medium text-foreground"><span class="truncate">{{ label }}</span><span class="tabular-nums">{{ format(current) }}</span></div><motion.div class="absolute inset-0" :style="{ clipPath: clip }"><div class="absolute inset-0 bg-foreground" /><div class="pointer-events-none absolute inset-0 flex items-center justify-between px-5 text-sm font-medium text-background"><span class="truncate">{{ label }}</span><span class="tabular-nums">{{ format(current) }}</span></div></motion.div></motion.div><button ref="sliderRef" type="button" v-bind="sliderProps" class="absolute inset-0 touch-none rounded-full outline-none ring-inset ring-foreground/40 focus-visible:ring-4" /></div></template>
