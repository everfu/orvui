<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { EASE_OUT } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { useViewer } from "./context";
import type { LightboxImage } from "./types";
import ImageViewerFrame from "./ImageViewerFrame.vue";
import ImageViewerCounter from "./ImageViewerCounter.vue";
import ImageViewerClose from "./ImageViewerClose.vue";
import ImageViewerPrevious from "./ImageViewerPrevious.vue";
import ImageViewerNext from "./ImageViewerNext.vue";
import ImageViewerCaption from "./ImageViewerCaption.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ image: LightboxImage; index: number; setPanel: (node: HTMLElement | null) => void }>();
const viewer = useViewer();
const present = computed(() => !!viewer.image.value);
function backdrop(event: PointerEvent) { if (event.target instanceof Element && !event.target.closest("button,a,input,select,textarea,[data-lightbox-content]")) { event.preventDefault(); viewer.select(null); } }
function key(event: KeyboardEvent) { if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target instanceof Element && event.target.closest('input,textarea,select,[contenteditable="true"]')) return; if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); viewer.move(event.key === "ArrowLeft" ? -1 : 1); } }
</script>
<template><motion.div class="contents" :initial="false" :animate="{ opacity: 1 }" :exit="{ opacity: 1 }" :transition="{ duration: viewer.reduce.value ? .1 : .48 }"><motion.button type="button" tabindex="-1" aria-hidden="true" :inert="!present" :style="{ pointerEvents: present ? 'auto' : 'none' }" class="fixed inset-0 z-[100] h-full w-full cursor-default bg-black/90" :initial="{ opacity: 0, backdropFilter: 'blur(0px)' }" :animate="{ opacity: present ? 1 : 0, backdropFilter: present && !viewer.reduce.value ? 'blur(6px)' : 'blur(0px)' }" :exit="{ opacity: 0, backdropFilter: 'blur(0px)', transition: { duration: viewer.reduce.value ? .1 : .46, ease: [.4, 0, .6, 1] } }" :transition="{ duration: viewer.reduce.value ? .1 : present ? .28 : .46, ease: present ? EASE_OUT : [.4, 0, .6, 1] }" @click="viewer.select(null)" /><div :inert="!present" class="pointer-events-none fixed inset-3 z-[101] sm:inset-6"><div v-bind="$attrs" :ref="node => props.setPanel(node as HTMLElement | null)" role="dialog" aria-modal="true" :aria-label="viewer.label.value" tabindex="-1" :aria-hidden="!present || undefined" :style="{ pointerEvents: present ? 'auto' : 'none' }" :class="cn('flex h-full flex-col outline-none', $attrs.class as string)" @pointerdown.capture="backdrop" @keydown="key"><div data-lightbox-content="" :style="{ opacity: present ? 1 : 0 }" class="flex items-center justify-between gap-3 pb-3 text-white"><slot name="header"><ImageViewerCounter /><ImageViewerClose /></slot></div><ImageViewerFrame :image="image" :index="index" :present="present" /><motion.div data-lightbox-content="" class="flex items-center justify-between gap-3 pt-3 text-white" :initial="{ opacity: 0, y: viewer.reduce.value ? 0 : 6 }" :animate="{ opacity: present ? 1 : 0, y: present || viewer.reduce.value ? 0 : 4 }" :exit="{ opacity: 0, y: viewer.reduce.value ? 0 : 4, transition: { duration: .08, delay: 0 } }" :transition="{ duration: viewer.reduce.value ? .1 : present ? .18 : .08, delay: viewer.reduce.value || !present ? 0 : .12, ease: EASE_OUT }"><slot><ImageViewerPrevious /><ImageViewerCaption /><ImageViewerNext /></slot></motion.div></div></div></motion.div></template>
