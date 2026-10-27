<script setup lang="ts">
import { ref } from "vue";
import { ScrollReveal } from "../index";
const viewport = ref<HTMLElement | null>(null);
const samples = ["Spring slide", "Blur in", "Staggered by delay", "Reveal once"];
</script>
<template>
  <div ref="viewport" class="h-80 w-full max-w-lg overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <div class="flex flex-col gap-16 p-6"><div class="text-center text-sm text-muted-foreground">Scroll ↓</div>
      <ScrollReveal v-for="(label, index) in samples" :key="label" :root="viewport" :once="false" :delay="index * 0.05"
        class="rounded-xl border border-border bg-muted/50 px-4 py-16 text-center text-base font-medium text-foreground">{{ label }}</ScrollReveal>
      <div class="text-center text-sm text-muted-foreground">End</div>
    </div>
  </div>
</template>
