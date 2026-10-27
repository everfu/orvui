<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed, onMounted, ref, useId, watch } from "vue";
import { AnimatePresence, motion, useDragControls } from "motion-v";
import { cn } from "../../../lib/utils";
import { EASE_DRAWER } from "../../../lib/ease";
import { resolveElement, useOverlay, useReducedMotion } from "../../../lib/composables";
import { useExitInteractivity } from "../../_overlay/interactivity";
import { resolveBottomSheetSnap } from "./snap";
const props = withDefaults(defineProps<{
  open: boolean; snapPoints?: (number | "auto")[]; defaultSnap?: number; title?: string; description?: string; dismissThreshold?: number;
}>(), { snapPoints: () => [0.5, 0.92], defaultSnap: 0, dismissThreshold: 120 });
const emit = defineEmits<{ "update:open": [open: boolean] }>();
const snap = ref(props.defaultSnap), mounted = ref(false), reduced = useReducedMotion();
const panel = ref<HTMLElement | null>(null), backdrop = ref<HTMLElement | null>(null);
const dragControls = useDragControls(), id = useId(), active = computed(() => props.open);
const size = computed(() => { const point = props.snapPoints[snap.value] ?? "auto"; return point === "auto" ? { maxHeight: "92vh" } : { height: `${point * 100}vh` }; });
function onDragEnd(_event: unknown, info: { velocity: { y: number }; offset: { y: number } }) {
  const next = resolveBottomSheetSnap(snap.value, props.snapPoints.length, info.offset.y, info.velocity.y, props.dismissThreshold);
  if (next === null) emit("update:open", false); else snap.value = next;
}
function dismiss() { emit("update:open", false); }
watch([() => props.open, () => props.defaultSnap], () => { if (props.open) snap.value = props.defaultSnap; });
useOverlay(active, panel, dismiss);
useExitInteractivity(active, [panel, backdrop], [panel]);
onMounted(() => { mounted.value = true; });
defineExpose({ snap, onDragEnd });
</script>
<template><Teleport v-if="mounted" to="body"><AnimatePresence>
  <motion.button v-if="open" :ref="node => backdrop = resolveElement<HTMLElement>(node)" key="backdrop" type="button" aria-label="Close bottom sheet" :tabindex="-1"
    :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }" :transition="{ duration: 0.5, ease: EASE_DRAWER }" @click="dismiss" class="pointer-events-auto fixed inset-0 z-50 bg-background/40 backdrop-blur-sm" />
  <motion.div v-if="open" :ref="node => panel = resolveElement<HTMLElement>(node)" key="sheet" drag="y" :drag-controls="dragControls" :drag-listener="false" :drag-constraints="{ top: 0, bottom: 0 }" :drag-elastic="{ top: 0.02, bottom: 0.4 }" :drag-momentum="false" @drag-end="onDragEnd"
    :initial="reduced ? { y: 0, opacity: 0 } : { y: '100%' }" :animate="reduced ? { y: 0, opacity: 1 } : { y: 0 }" :exit="reduced ? { y: 0, opacity: 0 } : { y: '100%' }"
    :transition="{ duration: reduced ? 0.18 : 0.5, ease: EASE_DRAWER }" :style="size" v-bind="$attrs"
    :class="cn('pointer-events-auto fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-w-2xl flex-col overflow-hidden rounded-t-3xl outline-none will-change-transform border border-border bg-background shadow-xl', $attrs.class as string)"
    role="dialog" aria-modal="true" :tabindex="-1" :aria-labelledby="title ? `${id}-title` : undefined" :aria-describedby="description ? `${id}-description` : undefined" :aria-label="title ? undefined : 'Bottom sheet'">
    <div class="flex flex-col items-center px-4 pb-2 pt-3"><div @pointerdown="dragControls.start($event)" class="flex cursor-grab touch-none items-center justify-center py-1 active:cursor-grabbing [-webkit-touch-callout:none]"><div class="h-1.5 w-10 rounded-full bg-muted-foreground/60" /></div>
      <div v-if="title || description" class="mt-2 w-full"><h2 v-if="title" :id="`${id}-title`" class="text-base font-semibold text-foreground">{{ title }}</h2><p v-if="description" :id="`${id}-description`" class="mt-0.5 text-sm text-muted-foreground">{{ description }}</p></div>
    </div><div class="flex-1 overflow-y-auto overscroll-contain px-4 pb-6"><slot /></div>
  </motion.div>
</AnimatePresence></Teleport></template>
