<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useReducedMotion } from "../../../lib/composables";
const props = withDefaults(defineProps<{ text: string; duration?: number; glyphs?: string; trigger?: string | number }>(), { glyphs: "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$?/" });
const display = ref(props.text);
const reduced = useReducedMotion();
let frame = 0;
let mounted = false;
let revision = 0;
function cancel() { ++revision; cancelAnimationFrame(frame); frame = 0; }
function scramble() {
  cancel();
  const target = props.text;
  if (!mounted || reduced.value || !props.glyphs.length) { display.value = target; return; }
  const run = revision;
  const duration = props.duration ?? Math.min(760, Math.max(420, target.length * 32));
  const started = performance.now();
  let painted = 0;
  function tick(now: number) {
    if (!mounted || run !== revision) return;
    if (now - started >= duration) { display.value = target; frame = 0; return; }
    if (now - painted >= 40) { painted = now; const locked = Math.floor((now - started) / duration * target.length); let text = ""; for (let index = 0; index < target.length; index++) text += index < locked || target[index] === " " ? target[index] : props.glyphs[Math.floor(Math.random() * props.glyphs.length)]; display.value = text; }
    frame = requestAnimationFrame(tick);
  }
  frame = requestAnimationFrame(tick);
}
watch([() => props.text, () => props.duration, () => props.glyphs, () => props.trigger, reduced], scramble);
onMounted(() => { mounted = true; });
onBeforeUnmount(() => { mounted = false; cancel(); });
</script>
<template><span class="inline-block whitespace-pre"><span class="sr-only">{{ text }}</span><span aria-hidden="true">{{ reduced ? text : display }}</span></span></template>
