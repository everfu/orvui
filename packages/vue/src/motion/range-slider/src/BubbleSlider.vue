<script setup lang="ts">
import { AnimatePresence, motion, useSpring, useTransform, useVelocity } from "motion-v";
import { useReducedMotion } from "../../../lib/composables";
import { SPRING_PRESS, SPRING_PANEL } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { useSlider, type SliderOptions } from "./useSlider";
import { useSliderMotion } from "./visual-state";
const props = defineProps<SliderOptions & { format?: (v: number) => string }>();
const emit = defineEmits(["update:modelValue", "change", "valueCommit"]);
const { current, percent, dragging, trackRef, sliderRef, trackProps, sliderProps } = useSlider(props, emit);
const reduced = useReducedMotion();
const { spring, position } = useSliderMotion(percent, reduced);
const left = useTransform(position, value => `${value}%`);
const speed = useVelocity(spring);
const lean = useSpring(useTransform(speed, [-320, 0, 320], [1, 0, -1], { clamp: true }), { stiffness: 260, damping: 22, mass: .4 });
const rotate = useTransform(lean, value => value * 16);
const scaleX = useTransform(lean, value => 1 + Math.abs(value) * .18);
const scaleY = useTransform(lean, value => 1 - Math.abs(value) * .12);
</script>
<template><div :class="cn('relative flex h-20 w-full items-end px-5 pb-5', disabled && 'pointer-events-none opacity-50')"><div ref="trackRef" v-bind="trackProps" class="relative h-2 w-full touch-none rounded-full bg-muted cursor-grab active:cursor-grabbing"><motion.div class="absolute inset-y-0 left-0 rounded-full bg-foreground" :style="{ width: left }" /><motion.div class="absolute top-1/2 size-5 rounded-full border-2 border-foreground bg-background shadow-sm" :style="{ left, x: '-50%', y: '-50%' }" :animate="reduced ? undefined : { scale: dragging ? 1.25 : 1 }" :transition="SPRING_PRESS" /><motion.div class="pointer-events-none absolute bottom-6" :style="{ left, x: '-50%' }"><AnimatePresence><motion.div v-if="dragging" :initial="reduced ? { opacity: 0 } : { opacity: 0, scale: .4, y: 10 }" :animate="{ opacity: 1, scale: 1, y: 0 }" :exit="reduced ? { opacity: 0 } : { opacity: 0, scale: .5, y: 8 }" :transition="reduced ? { duration: .12 } : SPRING_PANEL" :style="reduced ? undefined : { rotate, scaleX, scaleY, originY: 1 }" class="relative rounded-xl bg-foreground px-2.5 py-1 text-sm font-medium tabular-nums text-background shadow-md">{{ format ? format(current) : current }}<span class="absolute -bottom-1 left-1/2 size-2.5 -translate-x-1/2 rotate-45 rounded-[3px] bg-foreground" /></motion.div></AnimatePresence></motion.div><button ref="sliderRef" type="button" v-bind="sliderProps" class="absolute -inset-y-5 inset-x-0 touch-none rounded-full outline-none ring-foreground/30 focus-visible:ring-4" /></div></div></template>
