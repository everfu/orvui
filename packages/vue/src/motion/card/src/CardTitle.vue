<script setup lang="ts">
import { computed } from "vue";
const props = withDefaults(defineProps<{ as?: "div" | "h2" | "h3" | "h4" }>(), { as: "div" });
const tag = computed(() => props.as);
</script>
<template><component :is="tag" data-slot="card-title" class="text-[15px] leading-snug font-semibold text-foreground"><slot /></component></template>
