<script setup lang="ts">
import { computed } from "vue";
import { motion, useMotionValue, useTransform } from "motion-v";
import { cn } from "../../../lib/utils";
import { useReducedMotion, resolveElement } from "../../../lib/composables";
import { useSlider, type SliderOptions } from "./useSlider";
import { useSliderMotion, observeSliderGeometry } from "./visual-state";
const props = withDefaults(defineProps<SliderOptions & { showTicks?: boolean; name?: string }>(), { showTicks: true });
const emit = defineEmits(["update:modelValue", "change", "valueCommit"]);
const slider = useSlider(props, emit);
const reduced = useReducedMotion();
const { position } = useSliderMotion(slider.percent, reduced);
const width = useMotionValue(292);
const thumbX = useTransform(() => 8 + Math.max(0, width.get() - 20) * position.get() / 100);
const fillX = useTransform(position, value => value >= 100 ? "0%" : `calc(${value - 100}% + ${14 - .16 * value}px)`);
const ticks = computed(() => { const intervals = Math.floor(Number(((slider.max.value - slider.min.value) / slider.step.value).toFixed(6))); return props.showTicks && intervals > 0 && intervals <= 50 ? Array.from({ length: intervals + 1 }, (_, index) => Number((slider.min.value + index * slider.step.value).toFixed(6))) : []; });
observeSliderGeometry(() => [slider.trackRef.value], () => { const measured = slider.trackRef.value?.getBoundingClientRect().width; if (measured && measured > 0) width.set(measured); });
</script>
<template><div :ref="element => slider.trackRef.value = resolveElement<HTMLElement>(element)" v-bind="slider.trackProps" :class="cn('relative flex h-10 w-full touch-none items-center overflow-hidden rounded-lg bg-muted select-none [-webkit-touch-callout:none]', disabled ? 'pointer-events-none opacity-50' : 'cursor-grab active:cursor-grabbing')"><div aria-hidden="true" class="pointer-events-none absolute inset-x-[2px] inset-y-0 overflow-hidden rounded-lg"><motion.div class="absolute inset-0 rounded-lg bg-foreground/15" :style="{ x: fillX }" /></div><div class="pointer-events-none absolute inset-x-[10px] inset-y-0"><span v-for="tick in ticks" :key="tick" class="absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/35" :style="{ left: `${(tick - slider.min.value) / (slider.max.value - slider.min.value) * 100}%` }" /></div><motion.div :ref="element => slider.sliderRef.value = resolveElement<HTMLElement>(element)" v-bind="slider.sliderProps.value" :animate="reduced ? undefined : { scaleY: slider.dragging.value ? 1.35 : 1 }" :transition="{ type: 'spring', stiffness: 500, damping: 14, mass: .7 }" class="absolute left-0 top-1/2 h-6 w-1 rounded-full bg-foreground outline-none ring-inset ring-foreground/30 focus-visible:ring-4" :style="{ x: thumbX, y: '-50%' }" /><input v-if="name" type="hidden" :name="name" :value="slider.current.value" :disabled="disabled" /></div></template>
