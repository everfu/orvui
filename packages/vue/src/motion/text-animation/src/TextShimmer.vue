<script setup lang="ts">
import { computed } from "vue";
import { useReducedMotion } from "../../../lib/composables";
const props = withDefaults(defineProps<{ as?: string; duration?: number; spread?: number }>(), { as: "span", duration: 2, spread: 2 });
const reduced = useReducedMotion();
const style = computed(() => ({ animationDuration: `${props.duration}s`, animation: reduced.value ? "none" : `orvui-shimmer ${props.duration}s linear infinite` }));
</script>
<template><component :is="as" class="orvui-text-shimmer" :style="style"><slot /></component></template>
<style scoped>
.orvui-text-shimmer { background-image: linear-gradient(110deg, var(--muted-foreground) 30%, var(--foreground) 50%, var(--muted-foreground) 70%); background-size: 200% 100%; background-clip: text; color: transparent; animation: orvui-shimmer 2s linear infinite; }
@keyframes orvui-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
@media (prefers-reduced-motion: reduce) { .orvui-text-shimmer { animation: none !important; } }
</style>
