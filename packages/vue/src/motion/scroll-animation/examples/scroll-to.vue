<script setup lang="ts">
import { useId } from "vue";
import { ScrollTo, SmoothScroll } from "../index";
const instanceId = useId();
const sections = ["Intro", "Features", "Pricing", "FAQ"].map(label => ({ label, id: `${instanceId}-${label.toLowerCase()}` }));
</script>
<template>
  <SmoothScroll :root="false" class="relative h-80 w-full max-w-lg overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <nav class="sticky top-0 z-10 flex gap-1.5 border-b border-border bg-background/80 p-2 backdrop-blur">
      <ScrollTo v-for="section in sections" :key="section.id" :to="`#${section.id}`" :offset="-48" class="rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{{ section.label }}</ScrollTo>
    </nav>
    <section v-for="section in sections" :id="section.id" :key="section.id" class="flex h-64 items-center justify-center text-lg font-medium text-foreground">{{ section.label }}</section>
  </SmoothScroll>
</template>
