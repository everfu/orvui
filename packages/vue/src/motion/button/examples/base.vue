<script setup lang="ts">
import { ArrowRight, Download, Trash2 } from "lucide-vue-next";
import { Button } from "../index";
const variants = ["outline", "ghost"] as const;
</script>
<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex flex-wrap items-center justify-center gap-3"><Button>Continue<ArrowRight class="h-4 w-4" /></Button><Button variant="secondary"><Download class="h-4 w-4" />Download</Button><Button v-for="variant in variants" :key="variant" :variant="variant">{{ variant === 'outline' ? 'Outline' : 'Ghost' }}</Button></div>
    <div class="flex flex-wrap items-center justify-center gap-3"><Button size="sm">Small</Button><Button>Medium</Button><Button size="lg">Large</Button><Button variant="secondary" size="icon" aria-label="Delete"><Trash2 class="h-4 w-4" /></Button></div>
    <div class="flex flex-wrap items-center justify-center gap-3"><Button ripple>Ripple</Button><Button variant="outline" ripple>Tap me</Button></div>
  </div>
</template>
