<script setup lang="ts">
import { Marquee } from "./index";
const names = "Vercel,Linear,Stripe,Figma,GitHub,Notion,Loom,Raycast".split(",");
</script>
<template>
  <div class="w-full"><Marquee :speed="25">
    <div v-for="name in names" :key="name" class="mx-4 flex h-12 items-center justify-center rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground">{{ name }}</div>
  </Marquee></div>
</template>
