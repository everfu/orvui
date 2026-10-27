<script setup lang="ts">
import { computed, watch } from "vue";
import { motion, type MotionValue } from "motion-v";
import { EASE_OUT, EASE_DRAWER, SPRING_LAYOUT } from "../../../lib/ease";
import { useViewer } from "./context";
import { imageSwipe } from "./geometry";
import type { LightboxImage } from "./types";
const props = defineProps<{ image: LightboxImage; zoom: boolean; present: boolean; direction: number; x: MotionValue<number>; y: MotionValue<number>; pan: { x: number; y: number } }>();
const emit = defineEmits<{ swipe: [direction: 1 | -1]; failed: [] }>();
const viewer = useViewer();
const active = computed(() => props.present && viewer.image.value?.id === props.image.id && viewer.image.value.src === props.image.src);
let origin: { x: number; y: number } | undefined;
watch(active, present => { if (!present) origin = undefined; });
function pose(custom: unknown, phase: "enter" | "visible" | "exit") { const state = custom as { direction: number; reduce: boolean }; const transition = state.reduce ? { duration: .1, ease: EASE_OUT } : { type: "tween" as const, duration: .28, ease: EASE_DRAWER }; const opacity = state.reduce && phase !== "visible" ? 0 : 1; const offset = state.reduce || phase === "visible" ? 0 : state.direction * (phase === "exit" ? -100 : 100); return { opacity, x: `${offset}%`, ...(phase === "enter" ? {} : { transition }) }; }
const variants = { enter: (custom: unknown) => pose(custom, "enter"), visible: (custom: unknown) => pose(custom, "visible"), exit: (custom: unknown) => pose(custom, "exit") };
function down(event: PointerEvent) { event.preventDefault(); if (!props.zoom && event.isPrimary && active.value) origin = { x: event.clientX, y: event.clientY }; }
function up(event: PointerEvent) { const start = origin; origin = undefined; if (!start || props.zoom || !active.value) return; const direction = imageSwipe(start, { x: event.clientX, y: event.clientY }); if (direction !== null) emit("swipe", direction); }
function cancel() { origin = undefined; }
</script>
<template><motion.div :inert="!active" :aria-hidden="!active || undefined" :style="{ pointerEvents: active ? 'auto' : 'none' }" :custom="{ direction, reduce: viewer.reduce.value }" :variants="variants" initial="enter" animate="visible" exit="exit" class="absolute inset-0"><motion.img :src="image.src" :alt="image.alt" :width="image.width" :height="image.height" :draggable="false" :drag="true" :drag-listener="zoom" :drag-constraints="{ left: -pan.x, right: pan.x, top: -pan.y, bottom: pan.y }" :drag-elastic=".08" :drag-momentum="false" :animate="{ scale: zoom && present ? 2 : 1, ...(!present ? { x: 0, y: 0 } : {}) }" :transition="viewer.reduce.value ? { duration: 0 } : SPRING_LAYOUT" class="block h-full w-full select-none object-contain" :style="{ x, y, touchAction: zoom ? 'none' : 'pan-y', cursor: zoom ? 'grab' : undefined }" @error="active && emit('failed')" @pointerdown="down" @pointerup="up" @pointercancel="cancel" /></motion.div></template>
