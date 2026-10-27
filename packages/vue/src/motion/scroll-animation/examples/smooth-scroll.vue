<script setup lang="ts">
import { ArrowUp } from "lucide-vue-next";
import { ScrollTo, SmoothScroll } from "../index";
const sections = Array.from({ length: 16 }, (_, index) => index + 1);
</script>
<template>
  <SmoothScroll :root="false" class="h-64 w-full max-w-lg overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <div class="space-y-3 p-4"><div v-for="section in sections" :key="section" class="rounded-lg bg-muted/60 px-3 py-4 text-sm text-muted-foreground">Section {{ section }}</div></div>
    <ScrollTo :to="0" aria-label="Scroll to top" class="sticky bottom-3 left-[calc(100%-3rem)] z-10 grid size-9 place-items-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background"><ArrowUp class="size-4" /></ScrollTo>
  </SmoothScroll>
</template>
