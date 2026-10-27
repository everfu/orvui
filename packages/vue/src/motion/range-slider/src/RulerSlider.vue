<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from "vue";
import { animate, motion, useMotionValue } from "motion-v";
import { useReducedMotion } from "../../../lib/composables";
import { cn } from "../../../lib/utils";
import { snapSliderValue, useSlider, type SliderOptions } from "./useSlider";
const props = withDefaults(defineProps<SliderOptions & { gap?: number; majorEvery?: number; unit?: string }>(), { gap: 14, majorEvery: 5 });
const emit = defineEmits(["update:modelValue", "change", "valueCommit"]);
const decimals = computed(() => String(props.step ?? 1).split(".")[1]?.length ?? 0);
const options = new Proxy(props, { get(target, key) { if (key !== "formatValueText") return Reflect.get(target, key); return props.formatValueText ?? (props.unit ? (value: number) => `${value.toFixed(decimals.value)} ${props.unit}` : undefined); } });
const { current, min, max, step, commit, sliderRef, sliderProps } = useSlider(options, emit);
const reduced = useReducedMotion();
const intervals = computed(() => Number(((max.value - min.value) / step.value).toFixed(6)));
const maxOffset = computed(() => intervals.value * props.gap);
const ticks = computed(() => { const full = Math.floor(intervals.value); const rows = Array.from({ length: Math.min(full + 1, 10000) }, (_, index) => ({ value: Number((min.value + index * step.value).toFixed(6)), major: index % props.majorEvery === 0, offset: index * props.gap })); if (intervals.value > full) rows.push({ value: max.value, major: true, offset: maxOffset.value }); return rows; });
const x = useMotionValue(-(current.value - min.value) / step.value * props.gap);
let moving = false;
let held = false;
let revision = 0;
let animation: ReturnType<typeof animate> | undefined;
const unsubscribe = x.on("change", offset => { if (moving) commit(min.value - offset / props.gap * step.value); });
watch([current, min, step, () => props.gap], ([value, minimum, increment, gap]) => { if (!moving) x.set(-(value - minimum) / increment * gap); });
function snap() { const value = snapSliderValue(min.value - x.get() / props.gap * step.value, min.value, max.value, step.value); const offset = -(value - min.value) / step.value * props.gap; animation?.stop(); const version = ++revision; if (reduced.value) { x.set(offset); moving = false; } else animation = animate(x, offset, { type: "spring", stiffness: 500, damping: 40, mass: .6, onComplete: () => { if (version === revision) moving = false; } }); }
function start() { ++revision; moving = true; held = true; animation?.stop(); }
function end() { held = false; if (reduced.value) snap(); }
function momentumEnd() { if (!held) snap(); }
function key(event: KeyboardEvent) { x.stop(); ++revision; moving = false; held = false; sliderProps.value.onKeydown(event); }
onBeforeUnmount(() => { ++revision; unsubscribe(); animation?.stop(); });
</script>
<template><div ref="sliderRef" v-bind="sliderProps" @keydown="key" :class="cn('relative w-full touch-none select-none overflow-hidden rounded-2xl outline-none ring-foreground/30 focus-visible:ring-4', disabled ? 'pointer-events-none opacity-50' : 'cursor-grab active:cursor-grabbing')"><div class="pointer-events-none flex items-baseline justify-center gap-1 pb-3 pt-1"><span class="text-3xl font-semibold tabular-nums text-foreground">{{ current.toFixed(decimals) }}</span><span v-if="unit" class="text-sm text-muted-foreground">{{ unit }}</span></div><div class="relative h-12 [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)]"><motion.div :drag="disabled ? false : 'x'" :drag-constraints="{ left: -maxOffset, right: 0 }" :drag-elastic=".03" :drag-momentum="!reduced" :drag-transition="{ power: .22, timeConstant: 320 }" @drag-start="start" @drag-end="end" @drag-transition-end="momentumEnd" :style="{ x, marginLeft: `${-gap / 2}px`, width: `${maxOffset + gap}px` }" class="absolute inset-y-0 left-1/2"><span v-for="tick in ticks" :key="tick.value" class="absolute bottom-0 flex -translate-x-1/2 flex-col items-center pb-[18px]" :style="{ left: `${tick.offset + gap / 2}px` }"><span :class="cn('w-px rounded-full', tick.major ? 'h-7 bg-foreground/70' : 'h-3.5 bg-foreground/45')" /><span v-if="tick.major" class="absolute bottom-0 whitespace-nowrap text-[10px] tabular-nums text-muted-foreground">{{ tick.value }}</span></span></motion.div><div class="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2"><span class="block h-9 w-[3px] rounded-full bg-foreground" /></div></div></div></template>
