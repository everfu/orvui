<script setup lang="ts">
import { TiltCard } from "./index";
</script>
<template>
  <div class="flex items-center justify-center p-6">
    <TiltCard class="w-[280px] border border-border bg-card p-8">
      <div class="text-xs uppercase tracking-wider text-muted-foreground">Interactive</div>
      <h3 class="mt-2 text-2xl font-semibold text-foreground">A new angle</h3>
      <p class="mt-3 text-sm text-muted-foreground">Move across the surface to follow its depth and reflected light.</p>
    </TiltCard>
  </div>
</template>
