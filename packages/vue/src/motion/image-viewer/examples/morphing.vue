<script setup lang="ts">
import { ImageViewer, ImageViewerGallery, ImageViewerThumbnail, ImageViewerContent, ImageViewerCounter, ImageViewerClose, ImageViewerPrevious, ImageViewerCaption, ImageViewerNext } from "../index";
const subjects = [
  ["architecture", "1511818966892-d7d671e672a2", "Sculptural architecture", "01 / Form and light"],
  ["landscape", "1500530855697-b586d89ba3ee", "Open landscape", "02 / A little room to breathe"],
  ["workspace", "1497366754035-f200968a6e72", "Light-filled workspace", "03 / Places to make things"],
];
const photos = subjects.map(([id, photo, alt, caption]) => ({ id, src: `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=1600&h=2000&q=85`, alt, caption, width: 1600, height: 2000 }));
</script>
<template><div class="w-full max-w-xl"><div class="mb-5 flex items-end justify-between gap-3"><div><p class="mb-1 text-[10px] font-medium uppercase tracking-[.18em] text-muted-foreground">Collected moments</p><h3 class="text-lg font-medium tracking-tight">Look a little closer.</h3></div><span class="text-xs text-muted-foreground">3 photographs</span></div><ImageViewer :images="photos" label="Collected photographs"><ImageViewerGallery class="grid-cols-3 gap-2 sm:gap-3"><ImageViewerThumbnail v-for="photo in photos" :key="photo.id" :image-id="photo.id" /></ImageViewerGallery><ImageViewerContent><template #header><ImageViewerCounter /><ImageViewerClose /></template><ImageViewerPrevious /><ImageViewerCaption /><ImageViewerNext /></ImageViewerContent></ImageViewer><p class="mt-4 text-xs text-muted-foreground">Open a photograph. Swipe or use the arrows to explore.</p></div></template>
