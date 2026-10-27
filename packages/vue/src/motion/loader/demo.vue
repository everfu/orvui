<script setup lang="ts">
import { Loader, type LoaderVariant } from "./index";
const variants: [LoaderVariant, string][] = [
  ["spinner", "Spinner"], ["dots", "Dots"], ["bars", "Bars"], ["dot-matrix", "Dot Matrix"], ["dither", "Dither"],
  ["morph", "Morph"], ["comet", "Comet"], ["metaballs", "Metaballs"], ["newton", "Newton"], ["helix", "Helix"],
  ["scramble", "Scramble"], ["percent", "Percent"], ["ascii", "ASCII"], ["ascii-line", "ASCII Line"],
  ["ascii-braille", "ASCII Braille"], ["ascii-blocks", "ASCII Blocks"], ["ascii-bounce", "ASCII Bounce"],
];
</script>
<template><div class="flex flex-wrap items-center justify-center gap-8 p-8">
  <div v-for="[variant, label] in variants" :key="variant" class="flex flex-col items-center gap-4"><Loader :variant="variant" :size="36" /><span class="text-xs text-muted-foreground">{{ label }}</span></div>
</div></template>
