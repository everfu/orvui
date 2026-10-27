<script setup lang="ts">
import { computed } from "vue";
import { useViewer } from "./context";
const viewer = useViewer();
const counter = computed(() => `${viewer.index.value + 1} / ${viewer.images.value.length}`);
</script>
<template><span aria-live="polite" class="text-xs tabular-nums">{{ counter }}</span></template>
