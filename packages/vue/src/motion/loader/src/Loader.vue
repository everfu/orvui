<script setup lang="ts">
import { useId } from "vue";
import { useReducedMotion } from "../../../lib/composables";
import { useLoaderClock } from "./clock";
import { renderLoader } from "./visuals";
export type LoaderVariant = "spinner" | "dots" | "bars" | "dot-matrix" | "dither" | "ascii" | "ascii-line" | "ascii-braille" | "ascii-blocks" | "ascii-bounce" | "morph" | "comet" | "scramble" | "metaballs" | "newton" | "helix" | "percent";
const props = withDefaults(defineProps<{ variant?: LoaderVariant; size?: number; speed?: number; label?: string }>(), { variant: "spinner", size: 32, speed: 1, label: "Loading" });
const reduced = useReducedMotion(), clock = useLoaderClock(props, reduced);
const filterId = `loader-${useId().replaceAll(":", "")}`;
const Visual = () => renderLoader(props, reduced.value, { frame: clock.frame.value, text: clock.text.value, percent: clock.percent.value, id: filterId });
</script>
<template><span role="status" :aria-label="label" class="inline-flex items-center justify-center text-foreground"><Visual /><span class="sr-only">{{ label }}</span></span></template>
