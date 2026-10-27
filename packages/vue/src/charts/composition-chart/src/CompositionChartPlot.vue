<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { motion } from "motion-v";
import { SPRING_LAYOUT } from "../../../lib/ease";
import { compositionArea } from "./model";
import { useCompositionChart } from "./context";
import CompositionTooltipContent from "./CompositionTooltipContent.vue";
const chart = useCompositionChart();
const open = ref(false),
  tooltipId = useId();
const areas = computed(() =>
  chart.rows.map((row, index) => ({
    ...row,
    path: compositionArea(chart.columns, index),
  })),
);
const bars = computed(() =>
  chart.columns.flatMap((column, index) =>
    column.valid
      ? column.segments.map((segment) => ({
          ...segment,
          key: JSON.stringify([column.id, segment.id]),
          x: (index / chart.columns.length) * 100 + 10 / chart.columns.length,
        }))
      : [],
  ),
);
const inspectX = computed(
  () => ((chart.index + 0.5) / chart.columns.length) * 100,
);
const tooltipLeft = computed(
  () => `${Math.min(65, (chart.index / chart.columns.length) * 100)}%`,
);
function inspect(event: PointerEvent) {
  const box = (event.currentTarget as HTMLElement).getBoundingClientRect();
  if (!box.width || !chart.columns.length) return;
  const fraction = Math.max(
    0,
    Math.min(1, (event.clientX - box.left) / box.width),
  );
  const index = Math.min(
    chart.columns.length - 1,
    Math.floor(fraction * chart.columns.length),
  );
  chart.select(chart.columns[index].id);
  open.value = true;
}
function input(event: Event) {
  const column =
    chart.columns[Number((event.target as HTMLInputElement).value)];
  if (column) {
    chart.select(column.id);
    open.value = true;
  }
}
function opacity(id: string) {
  return chart.highlight && chart.highlight !== id ? 0.18 : 0.9;
}
</script>
<template>
  <p
    v-if="!chart.columns.length || !chart.rows.length"
    class="flex min-h-64 items-center justify-center text-sm text-muted-foreground"
  >
    No composition data
  </p>
  <div v-else class="min-w-0 space-y-3">
    <div class="flex justify-between text-[11px] text-muted-foreground">
      <span
        >{{ chart.column?.id
        }}{{ chart.column?.valid ? "" : " · No data" }}</span
      ><span class="font-mono">100%</span>
    </div>
    <div
      class="relative h-64 rounded-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-ring sm:h-80"
      @pointerleave="open = false"
      @pointerdown="inspect"
      @pointermove="(chart.canHover || $event.buttons === 1) && inspect($event)"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        class="size-full overflow-visible"
      >
        <line
          v-for="y in [0, 25, 50, 75, 100]"
          :key="y"
          x1="0"
          x2="100"
          :y1="y"
          :y2="y"
          stroke="var(--border)"
          stroke-width="1"
          vector-effect="non-scaling-stroke"
        />
        <template v-if="chart.view === 'area'">
          <motion.path
            v-for="area in areas"
            :key="area.id"
            :d="area.path"
            :fill="area.color"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: opacity(area.id) }"
            :transition="{ duration: 0.18 }"
          />
        </template>
        <template v-else>
          <motion.rect
            v-for="bar in bars"
            :key="bar.key"
            :x="bar.x"
            y="0"
            :width="80 / chart.columns.length"
            height="1"
            :fill="bar.color"
            :initial="false"
            :animate="{
              y: 100 - bar.offset - bar.share,
              scaleY: bar.share,
              opacity: opacity(bar.id),
            }"
            :style="{ originY: '0px', originX: '0px' }"
            :transition="chart.reduce ? { duration: 0 } : SPRING_LAYOUT"
          />
        </template>
        <motion.line
          :initial="false"
          :animate="{ x: inspectX }"
          :transition="chart.reduce ? { duration: 0 } : SPRING_LAYOUT"
          x1="0"
          x2="0"
          y1="0"
          y2="100"
          stroke="var(--foreground)"
          stroke-width="1"
          vector-effect="non-scaling-stroke"
          stroke-dasharray="3 3"
        />
      </svg>
      <input
        type="range"
        aria-label="Inspect period"
        min="0"
        :max="chart.columns.length - 1"
        step="1"
        :value="chart.index"
        :aria-valuetext="chart.column?.id"
        :aria-describedby="open ? tooltipId : undefined"
        @focus="open = true"
        @blur="open = false"
        @keydown.esc="open = false"
        @input="input"
        class="absolute inset-0 size-full cursor-crosshair opacity-0"
      />
      <div
        v-if="open"
        :id="tooltipId"
        role="tooltip"
        class="pointer-events-none absolute top-4 z-10 rounded-xl border border-border bg-popover p-3 text-xs shadow-lg"
        :style="{ left: tooltipLeft }"
      >
        <CompositionTooltipContent />
      </div>
    </div>
    <div class="flex justify-between text-[11px] text-muted-foreground">
      <span>{{ chart.columns[0]?.id }}</span
      ><span>{{ chart.columns.at(-1)?.id }}</span>
    </div>
    <div class="sr-only">
      <table>
        <caption>
          {{
            chart.label
          }}
          data
        </caption>
        <thead>
          <tr>
            <th>Series</th>
            <th v-for="column in chart.columns" :key="column.id">
              {{ column.id }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in chart.rows" :key="row.id">
            <th>{{ row.name }}</th>
            <td v-for="column in chart.columns" :key="column.id">
              {{
                column.valid
                  ? chart.formatValue(column.segments[index]?.value ?? 0)
                  : "No data"
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
