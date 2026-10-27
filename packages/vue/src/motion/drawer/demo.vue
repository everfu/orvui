<script setup lang="ts">
import { ref } from "vue";
import { Drawer } from "./index";
const open = ref(false), side = ref<"left" | "right">("right");
function reveal(edge: "left" | "right") { side.value = edge; open.value = true; }
</script>
<template><div class="flex items-center gap-3">
  <button type="button" @click="reveal('left')" class="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-card/70">Open left</button>
  <button type="button" @click="reveal('right')" class="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Open right</button>
  <Drawer v-model:open="open" :side="side" aria-label="Demo drawer" class="gap-4 p-6"><h2 class="text-sm font-semibold text-foreground">Drawer</h2><p class="text-sm text-muted-foreground">Enter from the {{ side }} edge. Use Escape or the backdrop to dismiss.</p><button type="button" @click="open = false" class="mt-auto inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-card/70">Close</button></Drawer>
</div></template>
