<script setup lang="ts">
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-vue-next";
import { Tooltip, type TooltipSide } from "./index";
const positions = [
  ["top", "Top", ArrowUp, "col-start-2 row-start-1"],
  ["left", "Left", ArrowLeft, "col-start-1 row-start-2"],
  ["right", "Right", ArrowRight, "col-start-3 row-start-2"],
  ["bottom", "Bottom", ArrowDown, "col-start-2 row-start-3"],
].map(([side, label, icon, position]) => ({
  side: side as TooltipSide,
  label: label as string,
  icon,
  position: position as string,
}));
</script>
<template>
  <div class="flex w-full flex-col items-center gap-8 py-6">
    <div class="grid grid-cols-3 gap-x-3 gap-y-5">
      <Tooltip
        v-for="placement in positions"
        :key="placement.side"
        content="More context"
        :side="placement.side"
        arrow
        ><button
          type="button"
          :class="[
            placement.position,
            'inline-flex h-10 w-20 items-center justify-center gap-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
          ]"
        >
          <component
            :is="placement.icon"
            aria-hidden="true"
            class="size-3.5 text-muted-foreground"
          />{{ placement.label }}
        </button></Tooltip
      >
    </div>
    <p class="text-center text-xs text-muted-foreground">
      Hover or focus. Press Esc to dismiss.
    </p>
  </div>
</template>
