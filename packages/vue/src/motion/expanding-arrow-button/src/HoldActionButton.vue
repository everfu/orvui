<script setup lang="ts">
import { computed, onBeforeUnmount, ref, Text, useSlots, watch, type Component, type VNodeChild } from "vue";
import { motion } from "motion-v";
import RenderContent from "../../../lib/RenderContent";
import { useReducedMotion } from "../../../lib/composables";
import { EASE_OUT, SPRING_PRESS } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
const props = withDefaults(defineProps<{ type?: "vertical" | "horizontal"; holdingLabel?: VNodeChild | Component; completeLabel?: VNodeChild | Component; holdDuration?: number; disabled?: boolean; fillClassName?: string; labelClassName?: string }>(), { type: "vertical", holdingLabel: "Keep holding", completeLabel: "Done", holdDuration: 1600 });
const emit = defineEmits(["holdComplete"]);
const slots = useSlots();
const reduce = useReducedMotion();
const phase = ref<"idle" | "holding" | "complete">("idle");
const filling = computed(() => phase.value !== "idle");
let capture: { element: HTMLElement; pointer: number } | undefined;
function accessibleLabel() { const nodes = slots.default?.() ?? []; return nodes.length === 1 && nodes[0].type === Text ? String(nodes[0].children) : undefined; }
function release() { const held = capture; capture = undefined; if (!held) return; try { if (held.element.hasPointerCapture(held.pointer)) held.element.releasePointerCapture(held.pointer); } catch {} }
function reset() { phase.value = "idle"; release(); }
function begin() { if (props.disabled || phase.value === "holding") return false; phase.value = "holding"; return true; }
function finish() { if (phase.value !== "holding" || props.disabled) return; phase.value = "complete"; emit("holdComplete"); }
function pointerDown(event: PointerEvent) { if (event.defaultPrevented || event.button !== 0 || capture || !begin()) return; const element = event.currentTarget as HTMLElement; capture = { element, pointer: event.pointerId }; try { element.setPointerCapture(event.pointerId); } catch {} }
function pointerMove(event: PointerEvent) { if (!capture || capture.pointer !== event.pointerId) return; const b = capture.element.getBoundingClientRect(); if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) reset(); }
function pointerUp(event: PointerEvent) { if (!capture || capture.pointer === event.pointerId) reset(); }
function key(event: KeyboardEvent, down: boolean) { if (event.key !== " " && event.key !== "Enter") return; event.preventDefault(); if (down) { if (!event.repeat) begin(); } else reset(); }
const fillPose = computed(() => reduce.value ? { opacity: filling.value ? 1 : 0, transform: "none" } : { opacity: 1, transform: props.type === "horizontal" ? `translateX(${filling.value ? 0 : -100}%)` : `translateY(${filling.value ? 0 : 115}%)` });
const fillTiming = computed(() => filling.value ? { duration: props.holdDuration / 1000, ease: "linear" as const } : { duration: reduce.value ? .15 : .24, ease: EASE_OUT });
const wave = computed(() => props.type === "horizontal" ? { viewBox: "0 0 24 240", path: "M0 0h12C2 20 2 40 12 60s10 40 0 60-10 40 0 60 10 40 0 60H0Z", class: "absolute -right-5 top-0 h-[200%] w-6 text-sky-400", transform: phase.value === "holding" ? "translateY(-50%)" : "translateY(0%)" } : { viewBox: "0 0 240 24", path: "M0 12C20 2 40 2 60 12s40 10 60 0 40-10 60 0 40 10 60 0v12H0Z", class: "absolute -top-5 left-0 h-6 w-[200%] text-sky-400", transform: phase.value === "holding" ? "translateX(-50%)" : "translateX(0%)" });
watch(() => props.disabled, value => { if (value) reset(); });
onBeforeUnmount(reset);
</script>
<template>
  <motion.button type="button" :disabled="disabled" :aria-label="($attrs['aria-label'] as string) ?? accessibleLabel()" @pointerdown="pointerDown" @pointermove="pointerMove" @pointerup="pointerUp" @pointercancel="pointerUp" @pointerleave="$event.pointerType !== 'touch' && reset()" @keydown="key($event, true)" @keyup="key($event, false)" @blur="reset" @contextmenu.prevent :while-press="reduce || disabled ? undefined : { scale: .98 }" :transition="SPRING_PRESS" class="relative inline-grid h-16 min-w-72 touch-none select-none [-webkit-touch-callout:none] place-items-center overflow-hidden rounded-[var(--hold-radius)] bg-primary px-8 text-primary-foreground [--hold-radius:22px] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50">
    <span aria-hidden="true" class="pointer-events-none absolute inset-0 [clip-path:inset(0_round_var(--hold-radius))]">
      <motion.span :initial="false" :animate="fillPose" :transition="fillTiming" @animation-complete="finish" :class="cn('absolute inset-0 bg-sky-400 will-change-[opacity,transform]', fillClassName)">
        <motion.svg v-if="!reduce" :viewBox="wave.viewBox" preserveAspectRatio="none" :class="wave.class" :animate="{ transform: wave.transform }" :transition="{ duration: 1.1, ease: 'linear', repeat: phase === 'holding' ? Infinity : 0 }"><path :d="wave.path" fill="currentColor" /></motion.svg>
      </motion.span>
    </span>
    <span :class="cn('relative z-10 grid place-items-center text-base font-medium tracking-[-.01em]', labelClassName)">
      <motion.span class="col-start-1 row-start-1" :animate="{ opacity: filling ? 0 : 1 }" :transition="{ duration: reduce ? 0 : .12, ease: EASE_OUT }"><slot /></motion.span>
      <motion.span class="col-start-1 row-start-1" :aria-hidden="phase !== 'holding'" :animate="{ opacity: phase === 'holding' ? 1 : 0 }" :transition="{ duration: reduce ? 0 : .12, ease: EASE_OUT }"><slot name="holdingLabel"><RenderContent :node="holdingLabel" /></slot></motion.span>
      <motion.span class="col-start-1 row-start-1" :aria-hidden="phase !== 'complete'" :animate="{ opacity: phase === 'complete' ? 1 : 0 }" :transition="{ duration: reduce ? 0 : .12, ease: EASE_OUT }"><slot name="completeLabel"><RenderContent :node="completeLabel" /></slot></motion.span>
    </span>
  </motion.button>
</template>
