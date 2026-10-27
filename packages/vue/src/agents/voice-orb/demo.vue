<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { VoiceOrb } from "./index";
const activity = ref(0);
let animation: number | undefined, preference: MediaQueryList | undefined;
let alive = false;
function paint(time: number) {
  if (!alive) return;
  const seconds = time / 1000;
  const phrase = Math.max(0, Math.sin(seconds * 0.85));
  const syllable = Math.max(
    0,
    Math.sin(seconds * 9.3 + Math.sin(seconds * 2.1)),
  );
  activity.value = preference?.matches
    ? 0
    : phrase * (0.12 + syllable * syllable * 0.72);
  animation = requestAnimationFrame(paint);
}
onMounted(() => {
  alive = true;
  preference = matchMedia("(prefers-reduced-motion: reduce)");
  animation = requestAnimationFrame(paint);
});
onBeforeUnmount(() => {
  alive = false;
  if (animation !== undefined) cancelAnimationFrame(animation);
});
</script>
<template>
  <VoiceOrb
    :activity="activity"
    aria-label="Voice visualization"
    class="w-64 sm:w-72"
  />
</template>
