<script setup lang="ts">
import { ThemeToggle, type ThemeVariant } from "./index";
const variants: [ThemeVariant, string][] = [["rectangle", "Rectangle"], ["circle", "Circle"], ["circle-blur", "Circle blur"], ["blinds", "Blinds"]];
</script>
<template>
  <div class="flex h-full w-full items-center justify-center gap-5">
    <div v-for="[variant, label] in variants" :key="variant" class="flex flex-col items-center gap-2">
      <ThemeToggle :variant="variant" start="bottom-up" class="rounded-xl border border-border bg-background p-2.5" icon-class-name="h-5 w-5" />
      <span class="text-[11px] text-muted-foreground">{{ label }}</span>
    </div>
  </div>
</template>
