<script setup lang="ts">
import { useFunnelChart, percentage } from "./context";
const funnel = useFunnelChart();
</script>

<template>
  <div
    v-if="funnel.rows.length"
    class="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs"
  >
    <span class="text-muted-foreground"
      >{{ funnel.formatValue(funnel.first) }} →
      {{ funnel.formatValue(funnel.last) }} {{ funnel.unit }}</span
    >
    <span class="flex items-center gap-2"
      ><span class="text-muted-foreground">Overall conversion</span
      ><span class="font-mono font-medium tabular-nums">{{
        percentage(funnel.conversion)
      }}</span></span
    >
  </div>
</template>
