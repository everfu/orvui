<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed, onMounted, ref } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { EASE_OUT, SPRING_PANEL } from "../../../lib/ease";
import { resolveElement, useOverlay, useReducedMotion } from "../../../lib/composables";
import { useExitInteractivity } from "../../_overlay/interactivity";
const props = withDefaults(defineProps<{ open: boolean; side?: "left" | "right"; ariaLabel?: string; dismissable?: boolean; backdropClassName?: string }>(), { side: "right", dismissable: true });
const emit = defineEmits<{ "update:open": [open: boolean] }>();
const active = computed(() => props.open), mounted = ref(false), reduced = useReducedMotion();
const panel = ref<HTMLElement | null>(null), backdrop = ref<HTMLElement | null>(null);
const hidden = computed(() => reduced.value ? { opacity: 0 } : { x: props.side === "right" ? "100%" : "-100%" });
function dismiss() { if (props.dismissable) emit("update:open", false); }
useOverlay(active, panel, dismiss);
useExitInteractivity(active, [panel, backdrop], [panel]);
onMounted(() => { mounted.value = true; });
</script>
<template><Teleport v-if="mounted" to="body"><AnimatePresence>
  <motion.button v-if="open" :ref="node => backdrop = resolveElement<HTMLElement>(node)" key="backdrop" type="button" aria-label="Close" :tabindex="-1" @click="dismiss"
    :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }" :transition="{ duration: 0.25, ease: EASE_OUT }" :class="cn('fixed inset-0 z-50 h-full w-full cursor-default bg-black/40 backdrop-blur-sm', backdropClassName)" />
  <motion.div v-if="open" :ref="node => panel = resolveElement<HTMLElement>(node)" key="panel" :tabindex="-1" role="dialog" aria-modal="true" :aria-label="ariaLabel"
    :initial="hidden" :animate="reduced ? { opacity: 1 } : { x: 0 }" :exit="hidden" :transition="reduced ? { duration: 0.2, ease: EASE_OUT } : SPRING_PANEL" v-bind="$attrs"
    :class="cn('fixed inset-y-0 z-50 flex w-80 max-w-[85vw] flex-col bg-background shadow-xl outline-none', side === 'right' ? 'right-0 border-l border-border' : 'left-0 border-r border-border', $attrs.class as string)"><slot /></motion.div>
</AnimatePresence></Teleport></template>
