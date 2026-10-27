<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, Text, useSlots, watch, type Component, type VNodeChild } from "vue";
import { animate, motion, useMotionValue, useTransform } from "motion-v";
import { useReducedMotion, resolveElement } from "../../../lib/composables";
import { EASE_OUT, SPRING_LAYOUT, SPRING_PRESS } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import RenderContent from "../../../lib/RenderContent";
const props = withDefaults(defineProps<{ completeLabel?: VNodeChild | Component; threshold?: number; resetDelay?: number; thumbClassName?: string; fillClassName?: string; disabled?: boolean }>(), { completeLabel: "Complete", threshold: .82, resetDelay: 1200 });
const emit = defineEmits(["complete"]);
const reduce = useReducedMotion();
const slots = useSlots();
const track = ref<HTMLElement | null>(null);
const thumb = ref<HTMLElement | null>(null);
const extent = ref(0);
const completed = ref(false);
const x = useMotionValue(0);
const progress = useTransform(x, value => value / Math.max(1, extent.value));
const labelOpacity = useTransform(progress, [0, .35, .65], [1, .75, 0]);
const arrowPath = useTransform(progress, [0, .5, 1], ["M 8 5 L 15 12 L 8 19", "M 7 8 L 12 14 L 17 10", "M 5 12 L 10 17 L 19 7"]);
let observer: ResizeObserver | undefined;
let resetTimer: ReturnType<typeof setTimeout> | undefined;
let animation: ReturnType<typeof animate> | undefined;
function label() { const nodes = slots.default?.() ?? []; return nodes.length === 1 && nodes[0].type === Text ? String(nodes[0].children) : "Slide action"; }
function settle(position: number) { animation?.stop(); if (reduce.value) x.set(position); else animation = animate(x, position, SPRING_LAYOUT); }
function reset() { completed.value = false; settle(0); }
function complete() { if (completed.value || props.disabled || extent.value <= 0) return; completed.value = true; settle(extent.value); emit("complete"); clearTimeout(resetTimer); resetTimer = setTimeout(reset, props.resetDelay); }
function dragEnd() { if (x.get() >= extent.value * props.threshold) complete(); else settle(0); }
function key(event: KeyboardEvent) { if (event.key === " " || event.key === "Enter") { event.preventDefault(); complete(); } }
function measure() { extent.value = Math.max(0, (track.value?.clientWidth ?? 0) - (thumb.value?.clientWidth ?? 0) - 8); if (completed.value) settle(extent.value); }
watch(extent, () => progress.set(x.get() / Math.max(1, extent.value)));
watch(() => props.disabled, disabled => { if (disabled && !completed.value) settle(0); });
onMounted(() => { measure(); if (typeof ResizeObserver !== "undefined") { observer = new ResizeObserver(measure); if (track.value) observer.observe(track.value); if (thumb.value) observer.observe(thumb.value); } });
onBeforeUnmount(() => { observer?.disconnect(); clearTimeout(resetTimer); animation?.stop(); });
</script>
<template>
  <div ref="track" class="relative h-16 w-72 overflow-hidden rounded-[22px] bg-muted p-1 [-webkit-touch-callout:none] pointer-coarse:select-none ring-1 ring-primary/10">
    <motion.span aria-hidden="true" :style="{ scaleX: progress }" :class="cn('absolute inset-0 origin-left bg-primary will-change-transform', fillClassName)" />
    <motion.span aria-hidden="true" :style="{ opacity: labelOpacity }" class="pointer-events-none absolute inset-0 grid place-items-center pl-10 text-sm font-medium text-foreground"><slot /></motion.span>
    <motion.span aria-live="polite" :animate="{ opacity: completed ? 1 : 0 }" :transition="{ duration: reduce ? 0 : .15, ease: EASE_OUT }" class="pointer-events-none absolute inset-0 grid place-items-center text-sm font-medium text-primary-foreground"><template v-if="completed"><slot name="completeLabel"><RenderContent :node="completeLabel" /></slot></template></motion.span>
    <motion.button :ref="element => thumb = resolveElement<HTMLElement>(element)" type="button" :aria-label="($attrs['aria-label'] as string) ?? label()" :disabled="disabled" :drag="completed || disabled ? false : 'x'" :drag-constraints="{ left: 0, right: extent }" :drag-elastic="0" :drag-momentum="false" :style="{ x }" @drag-end="dragEnd" @keydown="key" :while-press="reduce || completed ? undefined : { scale: .94 }" :transition="SPRING_PRESS" :class="cn('relative z-10 grid size-14 touch-none select-none [-webkit-touch-callout:none] cursor-grab place-items-center rounded-[18px] bg-primary text-primary-foreground shadow-sm outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background', completed && 'cursor-default bg-background text-foreground', thumbClassName)"><motion.svg viewBox="0 0 24 24" aria-hidden="true" class="size-5"><motion.path :d="arrowPath" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></motion.svg></motion.button>
  </div>
</template>
