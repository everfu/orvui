<script setup lang="ts">
import { useTreemap } from "./context";
withDefaults(defineProps<{ showValues?: boolean }>(), { showValues: false });
const chart = useTreemap();
</script>
<template>
  <ul
    v-if="chart.nodes.length"
    aria-label="Treemap legend"
    class="flex flex-wrap gap-x-5 gap-y-2 text-xs"
  >
    <li
      v-for="node in chart.nodes"
      :key="node.id"
      class="inline-flex items-center gap-1.5"
    >
      <span
        aria-hidden="true"
        class="size-1.5 shrink-0 rounded-full"
        :style="{ backgroundColor: node.color }"
      /><span class="text-muted-foreground">{{ node.label }}</span
      ><span v-if="showValues" class="font-mono tabular-nums">{{
        chart.formatValue(node.value)
      }}</span>
    </li>
  </ul>
</template>
