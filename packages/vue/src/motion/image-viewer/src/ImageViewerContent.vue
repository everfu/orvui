<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import { AnimatePresence } from "motion-v";
import { useViewer, useViewerModal } from "./context";
import ImageViewerSurface from "./ImageViewerSurface.vue";
defineOptions({ inheritAttrs: false });
const viewer = useViewer();
const mounted = ref(false);
const portal = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const open = computed(() => mounted.value && !!viewer.image.value);
useViewerModal(open, portal, panel, () => viewer.select(null));
const renderedImage = shallowRef(viewer.image.value);
const renderedIndex = ref(viewer.index.value);
watch(() => [viewer.image.value, viewer.index.value] as const, ([image, index]) => {
  if (image) { renderedImage.value = image; renderedIndex.value = index; }
}, { immediate: true, flush: 'sync' });
const session = ref(0);
let exitCleanup: ReturnType<typeof setTimeout> | undefined;
watch(open, (next, previous) => {
  if (exitCleanup !== undefined) { clearTimeout(exitCleanup); exitCleanup = undefined; }
  if (!mounted.value) return;
  if (next && !previous) { ++session.value; panel.value = null; }
  if (!next && previous) exitCleanup = setTimeout(() => {
    exitCleanup = undefined;
    if (!open.value) { renderedImage.value = undefined; ++session.value; panel.value = null; }
  }, viewer.reduce.value ? 120 : 540);
}, { flush: "sync" });
let revision = 0;
watch(() => viewer.image.value?.id, async (next, previous) => { const version = ++revision; if (!mounted.value || !next || !previous) return; await nextTick(); if (!mounted.value || version !== revision) return; const focused = panel.value?.ownerDocument.activeElement; if (!panel.value?.contains(focused ?? null) || focused instanceof HTMLButtonElement && focused.disabled) (panel.value?.querySelector<HTMLButtonElement>("button:not(:disabled)") ?? panel.value)?.focus({ preventScroll: true }); });
onMounted(() => mounted.value = true);
onBeforeUnmount(() => { mounted.value = false; ++revision; if (exitCleanup !== undefined) { clearTimeout(exitCleanup); exitCleanup = undefined; } });
function panelRefFor(ownerSession: number) { return (node: HTMLElement | null) => { if (ownerSession === session.value) panel.value = node; }; }
</script>
<template><Teleport v-if="mounted" to="body"><div ref="portal" data-image-viewer-portal="" :inert="!open"><div :key="session" class="contents"><AnimatePresence><ImageViewerSurface v-if="renderedImage" v-bind="$attrs" :image="renderedImage" :index="renderedIndex" :set-panel="panelRefFor(session)"><template v-if="$slots.header" #header><slot name="header" /></template><template v-if="$slots.default" #default><slot /></template></ImageViewerSurface></AnimatePresence></div></div></Teleport></template>
