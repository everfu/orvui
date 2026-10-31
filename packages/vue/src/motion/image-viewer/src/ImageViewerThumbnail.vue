<script setup lang="ts">
import { forgetViewerSource, rememberViewerSource, viewerPresentation } from "./opening-motion";
import { computed, onBeforeUnmount, watch } from "vue";
import { motion } from "motion-v";
import { SPRING_PRESS } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { useViewer } from "./context";
import { resolveElement } from "../../../lib/composables";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ imageId: string; imageClassName?: string; disabled?: boolean }>();
const emit = defineEmits<{ click: [event: MouseEvent] }>();
const viewer = useViewer();
const presentation = viewerPresentation(viewer);
const image = computed(() => viewer.images.value.find(image => image.id === props.imageId));
watch(image, value => { if (!value) throw Error(`ImageViewerThumbnail: unknown image id "${props.imageId}".`); }, { immediate: true });
let clickedSource: HTMLElement | null = null;
function click(event: MouseEvent) {
  emit("click", event);
  if (event.defaultPrevented || props.disabled) return;
  clickedSource = resolveElement<HTMLElement>(event.currentTarget);
  if (clickedSource) rememberViewerSource(viewer, clickedSource);
  viewer.select(props.imageId);
}
onBeforeUnmount(() => { if (clickedSource) forgetViewerSource(viewer, clickedSource); });
</script>
<template><motion.button :data-orvui-viewer-id="viewer.id" :data-orvui-image-id="imageId" v-if="image" v-bind="$attrs" type="button" :disabled="disabled" :aria-label="String($attrs['aria-label'] ?? `Open ${image.alt}`)" aria-haspopup="dialog" :aria-expanded="image.id === viewer.value.value" :while-press="viewer.reduce.value ? undefined : { scale: .98 }" :transition="SPRING_PRESS" :class="cn('relative overflow-hidden rounded-2xl bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', $attrs.class as string)" @click="click"><img :style="{ opacity: presentation?.imageId === image.id ? 0 : undefined }" :src="image.src" :alt="image.alt" :width="image.width" :height="image.height" loading="lazy" :draggable="false" :class="cn('block h-auto w-full', imageClassName)" /><slot :image="image" /></motion.button></template>
