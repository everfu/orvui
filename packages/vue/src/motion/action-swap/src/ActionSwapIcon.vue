<script setup lang="ts">
import { computed } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { useReducedMotion } from "../../../lib/composables";
import { swapPose } from "./poses";
const props = withDefaults(defineProps<{ value: string | number; animation?: "cascade" | "blur" | "roll" }>(), { animation: "blur" });
const reduced = useReducedMotion();
const pose = computed(() => swapPose(props.animation, "icon", reduced.value));
</script>
<template><span class="relative inline-grid shrink-0 place-items-center overflow-hidden"><AnimatePresence mode="popLayout" :initial="false">
  <motion.span :key="`${animation}-${value}`" aria-hidden="true" v-bind="pose" class="col-start-1 row-start-1 inline-flex items-center justify-center will-change-[opacity,filter,transform]"><slot /></motion.span>
</AnimatePresence></span></template>
