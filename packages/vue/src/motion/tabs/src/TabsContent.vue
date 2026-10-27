<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from "vue";
import { motion } from "motion-v";
import { EASE_OUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { useTabs } from "./context";
const props = defineProps<{ value: string; forceMount?: boolean }>();
const state = useTabs();
const reduced = useReducedMotion();
const active = computed(() => state.value.value === props.value);
onMounted(() => state.registerPanel(props.value));
watch(() => props.value, (value, previous) => { state.unregisterPanel(previous); state.registerPanel(value); });
onBeforeUnmount(() => state.unregisterPanel(props.value));
</script>
<template><motion.div :id="state.panelId(value)" role="tabpanel" :aria-labelledby="state.tabId(value)" :hidden="!active" :tabindex="active ? 0 : undefined" :initial="false" :animate="active ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : 4 }" :transition="{ duration: .18, ease: EASE_OUT }" :class="active ? 'mt-4 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded-md' : undefined"><slot /></motion.div></template>
