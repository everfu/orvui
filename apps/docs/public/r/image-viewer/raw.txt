<script setup lang="ts">
import { computed, provide, useId, type VNodeChild } from "vue";
import { LayoutGroup } from "motion-v";
import { cn } from "../../../lib/utils";
import { useReducedMotion } from "../../../lib/composables";
import { viewerKey, type ImageViewerContext } from "./context";
import { useViewerSelection } from "./viewer-state";
import type { LightboxImage } from "./types";
import ImageViewerGallery from "./ImageViewerGallery.vue";
import ImageViewerThumbnail from "./ImageViewerThumbnail.vue";
import ImageViewerContent from "./ImageViewerContent.vue";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<{ images: LightboxImage[]; modelValue?: string | null; value?: string | null; defaultValue?: string | null; label?: string; thumbnailClassName?: string; className?: string; renderCaption?: (image: LightboxImage) => VNodeChild }>(), { defaultValue: null, label: "Image gallery" });
const emit = defineEmits(["update:modelValue", "valueChange", "change"]);
const selection = useViewerSelection(props, emit);
const { select } = selection;
const id = useId();
const reduce = useReducedMotion();
provide<ImageViewerContext>(viewerKey, { ...selection, images: computed(() => props.images), id, label: computed(() => props.label), reduce, get renderCaption() { return props.renderCaption; } });
</script>
<template><LayoutGroup :id="id"><slot :images="images" :select="select"><ImageViewerGallery v-bind="$attrs" :class="cn(className, $attrs.class as string)"><ImageViewerThumbnail v-for="image in images" :key="image.id" :image-id="image.id" :class="thumbnailClassName" /></ImageViewerGallery><ImageViewerContent /></slot></LayoutGroup></template>
