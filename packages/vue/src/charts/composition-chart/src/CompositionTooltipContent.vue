<script setup lang="ts">
import { useCompositionChart } from "./context";
const chart = useCompositionChart();
</script>
<template>
  <div class="min-w-40">
    <p class="mb-2 text-muted-foreground">{{ chart.column?.id }}</p>
    <template v-if="chart.column?.valid"
      ><div
        v-for="segment in chart.column.segments"
        :key="segment.id"
        class="flex items-center justify-between gap-6 py-1"
      >
        <span class="flex items-center gap-2"
          ><span
            class="size-2 rounded-full"
            :style="{ backgroundColor: segment.color }"
          />{{ segment.name }}</span
        ><span class="font-mono"
          >{{ chart.formatValue(segment.value ?? 0) }} ·
          {{ segment.share.toFixed(1) }}%</span
        >
      </div></template
    >
    <p v-else>No data</p>
  </div>
</template>
