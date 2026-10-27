<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate } from "motion-v";
import { EASE_OUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { useNumberViewGate } from "./view-gate";
import type { AnimatedNumberProps } from "./types";
const props = withDefaults(defineProps<AnimatedNumberProps>(), { duration: 1.2, startOnView: true });
const element = ref<HTMLElement | null>(null), display = ref(0), mounted = ref(false);
const ready = useNumberViewGate(element, () => props.startOnView);
const reduced = useReducedMotion();
let animation: ReturnType<typeof animate> | undefined;
watch([() => props.value, () => props.duration, ready, reduced, mounted], () => {
  animation?.stop();
  if (!mounted.value || !ready.value) return;
  if (reduced.value) { display.value = props.value; return; }
  animation = animate(display.value, props.value, { duration: props.duration, ease: EASE_OUT, onUpdate(value) { display.value = value; } });
});
onMounted(() => { mounted.value = true; });
onBeforeUnmount(() => { mounted.value = false; animation?.stop(); });
</script>
<template><span ref="element" :class="['tabular-nums', className]">{{ format ? format(display) : Math.round(display).toLocaleString() }}</span></template>
