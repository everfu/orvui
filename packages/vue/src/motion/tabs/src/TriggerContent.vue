<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { SPRING_SWAP } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { useTabs } from "./context";
const props = defineProps<{ active: boolean; icon?: any }>();
const state = useTabs();
const reduced = useReducedMotion();
const iconPose = computed(() => ({ width: props.active ? "auto" : "0px", marginRight: props.active ? "6px" : "0px", opacity: props.active ? 1 : 0, scale: props.active ? 1 : .6 }));
</script>
<template><template v-if="$slots.icon || icon"><span v-if="state.icons.value === 'always'" aria-hidden="true" class="mr-1.5 inline-flex shrink-0 items-center"><slot name="icon"><component :is="icon" /></slot></span><motion.span v-else aria-hidden="true" data-tabs-icon="" :initial="false" :animate="iconPose" :transition="reduced ? { duration: 0 } : SPRING_SWAP" class="inline-flex shrink-0 items-center justify-center overflow-hidden"><slot name="icon"><component :is="icon" /></slot></motion.span></template><slot /></template>
