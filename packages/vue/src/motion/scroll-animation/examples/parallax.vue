<script setup lang="ts">
import { ref } from "vue";
import { Parallax } from "../index";
const viewport = ref<HTMLElement | null>(null);
const layers = [
  { speed: -0.6, wrapper: "absolute inset-x-0 -top-1/4 h-[150%]", src: "https://picsum.photos/id/528/800/600", image: "size-full object-cover" },
  { speed: 0.5, wrapper: "absolute inset-0 grid place-items-center" },
  { speed: 0.9, wrapper: "absolute bottom-4 right-4", src: "https://picsum.photos/id/621/120/120", image: "size-12 rounded-full border-2 border-background object-cover shadow-lg" },
];
</script>
<template>
  <div ref="viewport" class="relative h-[600px] w-full max-w-2xl overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <div class="flex h-80 items-center justify-center text-sm text-muted-foreground">Scroll down ↓</div>
    <div class="relative h-96 overflow-hidden">
      <Parallax v-for="(layer, index) in layers" :key="index" :container="viewport" :speed="layer.speed" :class="layer.wrapper">
        <img v-if="layer.src" :src="layer.src" alt="" :class="layer.image" />
        <span v-else class="rounded-full bg-background/85 px-5 py-2 text-base font-medium text-foreground backdrop-blur">Parallax</span>
      </Parallax>
    </div>
    <div class="flex h-80 items-center justify-center text-sm text-muted-foreground">↑ Scroll up</div>
  </div>
</template>
