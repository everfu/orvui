<script setup lang="ts">
import { computed } from "vue";
import RenderContent from "../../../lib/RenderContent";
import { useViewer } from "./context";
const viewer = useViewer();
const content = computed(() => { const image = viewer.image.value; return image ? viewer.renderCaption ? viewer.renderCaption(image) : image.caption ?? image.alt : null; });
</script>
<template><div aria-live="polite" data-lightbox-content="" class="min-w-0 text-center text-sm"><slot :image="viewer.image.value"><RenderContent :node="content" /></slot></div></template>
