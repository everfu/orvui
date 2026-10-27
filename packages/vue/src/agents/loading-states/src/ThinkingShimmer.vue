<script setup lang="ts">
import { TextShimmer } from "../../../motion/text-animation";
const props = withDefaults(defineProps<{ duration?: number }>(), {
  duration: 1.8,
});
</script>
<template>
  <TextShimmer as="span" class="font-medium" :duration="props.duration"
    ><slot>Thinking…</slot></TextShimmer
  >
</template>
<style>
.orvui-agent-text-shimmer {
  color: transparent;
  background-clip: text;
  background-size: 200% 100%;
  background-image: linear-gradient(
    110deg,
    var(--muted-foreground) 30%,
    var(--foreground) 50%,
    var(--muted-foreground) 70%
  );
}
@keyframes orvui-agent-text-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .orvui-agent-text-shimmer {
    animation: none !important;
  }
}
</style>
