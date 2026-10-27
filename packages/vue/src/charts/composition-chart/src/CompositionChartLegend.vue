<script setup lang="ts">
import { useCompositionChart } from "./context";
const chart = useCompositionChart();
function clear() {
  chart.setPinned(null);
  chart.setHovered(null);
  chart.setFocused(null);
}
</script>
<template>
  <div
    v-if="chart.column"
    class="grid min-w-0 grid-cols-2 gap-x-4 gap-y-1 @min-[480px]:grid-cols-3 @min-[900px]:grid-cols-6"
  >
    <button
      v-for="segment in chart.column.segments"
      :key="segment.id"
      type="button"
      :aria-label="`Highlight ${segment.name}`"
      :aria-pressed="chart.pinned === segment.id"
      :class="[
        'flex min-h-12 min-w-0 items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-xs transition-opacity duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        chart.pinned === segment.id ? 'bg-muted/60' : undefined,
        chart.highlight && chart.highlight !== segment.id
          ? 'opacity-40'
          : undefined,
      ]"
      @click="chart.setPinned(chart.pinned === segment.id ? null : segment.id)"
      @pointerenter="chart.canHover && chart.setHovered(segment.id)"
      @pointerleave="chart.setHovered(null)"
      @focus="chart.setFocused(segment.id)"
      @blur="chart.setFocused(null)"
      @keydown.esc="clear"
    >
      <span
        aria-hidden="true"
        class="h-6 w-1 shrink-0 rounded-full"
        :style="{ backgroundColor: segment.color }"
      />
      <span class="grid min-w-0 gap-0.5"
        ><span class="truncate text-muted-foreground">{{ segment.name }}</span
        ><span
          :title="
            segment.value === null
              ? 'Missing value'
              : chart.formatValue(segment.value)
          "
          class="shrink-0 font-mono tabular-nums"
          >{{ chart.column.valid ? segment.share.toFixed(1) + "%" : "—" }}</span
        ></span
      >
    </button>
  </div>
</template>
