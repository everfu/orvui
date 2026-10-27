<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useMotionValue } from "motion-v";
import { ScrollProgress } from "../index";
const fraction = useMotionValue(0);
function track(event: Event) {
  const viewport = event.currentTarget as HTMLElement;
  fraction.set(viewport.scrollTop / Math.max(1, viewport.scrollHeight - viewport.clientHeight));
}
onBeforeUnmount(() => fraction.destroy());
</script>
<template>
  <div class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card">
    <ScrollProgress :progress="fraction" :fixed="false" :height="3" />
    <div class="absolute right-3 top-3 z-10 rounded-full bg-background/70 p-1 backdrop-blur"><ScrollProgress variant="circle" :progress="fraction" :size="36" /></div>
    <div class="h-64 overflow-y-auto scrollbar-hide" @scroll="track"><div class="space-y-3 p-4">
      <div v-for="section in 18" :key="section" class="rounded-lg bg-muted/60 px-3 py-4 text-sm text-muted-foreground">Section {{ section }}</div>
    </div></div>
  </div>
</template>
