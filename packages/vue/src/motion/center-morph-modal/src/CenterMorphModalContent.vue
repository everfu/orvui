<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { inject, onMounted, ref } from "vue";
import { motion } from "motion-v";
import { X } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { resolveElement, useOverlay, useReducedMotion } from "../../../lib/composables";
import { useExitInteractivity } from "../../_overlay/interactivity";
import type { CenterModalContext } from "./context";
import { useCenterSurface } from "./use-center-surface";
const props = withDefaults(defineProps<{
  ariaLabel: string; ariaDescribedBy?: string; dismissible?: boolean; showCloseButton?: boolean; closeButtonLabel?: string; backdropClassName?: string;
}>(), { dismissible: true, showCloseButton: true, closeButtonLabel: "Close modal" });
const state = inject<CenterModalContext>("orvui-center-modal");
if (!state) throw new Error("CenterMorphModalContent must be inside CenterMorphModal");
const mounted = ref(false), reduced = useReducedMotion();
const panel = ref<HTMLElement | null>(null), backdrop = ref<HTMLElement | null>(null), layer = ref<HTMLElement | null>(null);
const { present, clipPath, opacity, backdropOpacity, closeOpacity, closeScale } = useCenterSurface(state.open, reduced);
function dismiss() { if (props.dismissible) state!.open.value = false; }
useOverlay(state.open, panel, dismiss);
useExitInteractivity(state.open, [panel, backdrop], [layer]);
onMounted(() => { mounted.value = true; });
</script>
<template><Teleport v-if="mounted" to="body">
  <motion.button v-if="present" :ref="node => backdrop = resolveElement<HTMLElement>(node)" type="button" aria-label="Dismiss modal" :tabindex="-1" :disabled="!dismissible"
    :style="{ opacity: backdropOpacity }" @click="dismiss"
    :class="cn('pointer-events-auto fixed inset-0 z-[100] h-full w-full cursor-default bg-background/10 backdrop-blur-sm', backdropClassName)" />
  <div v-if="present" ref="layer" class="pointer-events-none fixed inset-4 z-[100] flex items-center justify-center overflow-y-auto drop-shadow-2xl"><div class="flex w-full flex-col items-center py-8">
    <motion.div :ref="node => panel = resolveElement<HTMLElement>(node)" :id="state.contentId" role="dialog" aria-modal="true" :aria-label="ariaLabel" :aria-describedby="ariaDescribedBy" :tabindex="-1"
      :style="{ opacity, clipPath }" v-bind="$attrs"
      :class="cn('pointer-events-auto relative w-full max-w-[26rem] origin-center overflow-hidden rounded-[30px] border border-border bg-background will-change-[clip-path]', $attrs.class as string)">
      <slot /><motion.button v-if="showCloseButton" type="button" :aria-label="closeButtonLabel" @click="state.open.value = false"
        :style="{ opacity: closeOpacity, scale: closeScale }"
        class="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground/[0.05] text-muted-foreground transition-colors hover:bg-foreground/[0.08] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"><X class="h-4 w-4" aria-hidden="true" /></motion.button>
    </motion.div>
  </div></div>
</Teleport></template>
