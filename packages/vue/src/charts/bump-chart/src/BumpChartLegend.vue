<script setup lang="ts">
import { computed } from "vue";
import { useBumpChart } from "./context";
import { cn } from "../../../lib/utils";
defineProps<{ className?: string }>();
const chart = useBumpChart();
const entries = computed(() =>
  chart.rows.map((row) => {
    const first = row.ranks[0],
      last = row.ranks.at(-1);
    const gain = first != null && last != null ? first - last : null;
    return {
      row,
      last: last == null ? "—" : `#${last}`,
      gain:
        gain === null || gain === 0
          ? "—"
          : `${gain > 0 ? "↑" : "↓"}${Math.abs(gain)}`,
      change:
        gain === null
          ? "Change unavailable"
          : gain === 0
            ? "Unchanged"
            : `${gain > 0 ? "Up" : "Down"} ${Math.abs(gain)} places`,
    };
  }),
);
function clear() {
  chart.select(null);
  chart.setFocused(null);
  chart.setHovered(null);
}
</script>
<template>
  <div
    :class="cn('grid grid-cols-2 gap-x-5 gap-y-1 sm:grid-cols-3', className)"
  >
    <button
      v-for="{ row, last, gain, change } in entries"
      :key="row.id"
      type="button"
      :aria-label="`Highlight ${row.name}`"
      :aria-pressed="chart.pinned === row.id"
      :class="[
        'flex min-w-0 items-center gap-2 rounded-md px-2 py-2.5 text-xs text-foreground transition-opacity duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        chart.highlighted && chart.highlighted !== row.id
          ? 'opacity-35'
          : undefined,
        chart.pinned === row.id ? 'bg-muted/60' : undefined,
      ]"
      @click="chart.select(chart.pinned === row.id ? null : row.id)"
      @pointerenter="chart.canHover && chart.setHovered(row.id)"
      @pointerleave="chart.setHovered(null)"
      @focus="chart.setFocused(row.id)"
      @blur="chart.setFocused(null)"
      @keydown.esc="clear"
    >
      <span
        aria-hidden="true"
        class="size-2 shrink-0 rounded-full"
        :style="{ backgroundColor: row.color }"
      /><span class="truncate">{{ row.name }}</span
      ><span class="ml-auto font-mono tabular-nums">{{ last }}</span
      ><span
        class="min-w-5 text-right font-mono text-[10px] text-muted-foreground tabular-nums"
        :title="change"
        >{{ gain }}</span
      >
    </button>
  </div>
</template>
