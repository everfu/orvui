<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { useReducedMotion } from "../../../lib/composables";
import { cn } from "../../../lib/utils";
import { useSlider, type SliderOptions } from "./useSlider";
const props = withDefaults(defineProps<SliderOptions & { bars?: number }>(), { bars: 32 });
const emit = defineEmits(["update:modelValue", "change", "valueCommit"]);
const { percent, dragging, trackRef, sliderRef, trackProps, sliderProps } = useSlider(props, emit);
const reduced = useReducedMotion();
const lanes = computed(() => { const center = percent.value / 100 * (props.bars - 1); return Array.from({ length: props.bars }, (_, index) => { const distance = Math.abs(index - center); return { index, distance, height: Math.exp(-.5 * (distance / 2.6) ** 2), filled: index <= Math.round(center) }; }); });
</script>
<template><div ref="trackRef" v-bind="trackProps" :class="cn('relative flex h-20 w-full touch-none items-center justify-between gap-1 select-none', disabled ? 'pointer-events-none opacity-50' : 'cursor-grab active:cursor-grabbing')"><motion.span v-for="lane in lanes" :key="lane.index" :class="cn('h-14 flex-1 origin-center rounded-full', lane.filled ? 'bg-foreground' : 'bg-foreground/45')" :animate="{ scaleY: reduced ? .4 : .22 + lane.height * (dragging ? .78 : .6) }" :transition="reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 20, mass: .5, delay: Math.min(lane.distance * .012, .12) }" /><button ref="sliderRef" type="button" v-bind="sliderProps" class="absolute inset-0 touch-none rounded-xl outline-none ring-foreground/30 focus-visible:ring-4" /></div></template>
