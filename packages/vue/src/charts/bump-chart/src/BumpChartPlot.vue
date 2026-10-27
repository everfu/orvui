<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../../lib/utils";
import { useBumpChart } from "./context";
import { PLOT } from "./model";
import { useBumpGeometry, pointKey } from "./use-geometry";
import BumpChartSeriesPath from "./BumpChartSeriesPath.vue";
import BumpChartPoint from "./BumpChartPoint.vue";
defineProps<{ className?: string }>();
const chart = useBumpChart();
const targets = computed(() =>
  chart.rows.flatMap((row) =>
    row.ranks.flatMap((rank, index) =>
      rank === null
        ? []
        : [
            {
              key: pointKey(row.id, chart.periods[index]),
              x: chart.x(index),
              y: chart.y(rank),
            },
          ],
    ),
  ),
);
const positions = useBumpGeometry(targets, () => chart.reduce);
const rows = computed(() =>
  chart.rows.map((row, index) => ({
    row,
    index,
    positions: chart.periods.map(
      (period) => positions.value.get(pointKey(row.id, period)) ?? null,
    ),
  })),
);
const points = computed(() =>
  chart.rows.flatMap((row, seriesIndex) =>
    row.ranks.flatMap((rank, index) => {
      const position = positions.value.get(
        pointKey(row.id, chart.periods[index]),
      );
      return rank === null || !position
        ? []
        : [
            {
              key: pointKey(row.id, chart.periods[index]),
              seriesId: row.id,
              period: chart.periods[index],
              seriesIndex,
              position,
            },
          ];
    }),
  ),
);
const shape = computed(
  () =>
    chart.periods.join("|") +
    "-" +
    chart.rows
      .map((row) =>
        row.ranks.map((rank) => (rank === null ? "0" : "1")).join(""),
      )
      .join("|"),
);
</script>
<template>
  <div
    v-if="!chart.periods.length || !chart.ranks.length"
    :class="cn('py-16 text-center text-sm text-muted-foreground', className)"
  >
    No rankings yet
  </div>
  <section
    v-else
    tabindex="0"
    :aria-label="`${chart.label} plot, scroll horizontally for more periods`"
    :class="
      cn(
        'overflow-x-auto rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        className,
      )
    "
  >
    <div
      class="relative"
      :style="{
        minWidth: Math.max(PLOT.width, chart.periods.length * 64) + 'px',
      }"
    >
      <svg
        :viewBox="`0 0 ${PLOT.width} ${chart.height}`"
        role="img"
        :aria-label="chart.label"
        class="block w-full overflow-visible"
      >
        <title>{{ chart.label }}</title>
        <desc>
          Ranks run from best at the top to lowest at the bottom. Use the legend
          to highlight or pin a series. Exact values follow in a table.
        </desc>
        <line
          v-for="rank in chart.ranks"
          :key="rank"
          :x1="PLOT.left"
          :x2="PLOT.width - PLOT.right"
          :y1="chart.y(rank)"
          :y2="chart.y(rank)"
          class="stroke-border"
          stroke-dasharray="2 5"
        />
        <text
          v-for="(period, index) in chart.periods"
          :key="period"
          :x="chart.x(index)"
          :y="chart.height - 8"
          text-anchor="middle"
          class="fill-muted-foreground font-mono text-[10px]"
        >
          {{ period }}
        </text>
        <BumpChartSeriesPath
          v-for="entry in rows"
          :key="entry.row.id + shape"
          :row="entry.row"
          :index="entry.index"
          :positions="entry.positions"
        />
      </svg>
      <div class="pointer-events-none absolute inset-0 overflow-clip">
        <BumpChartPoint
          v-for="point in points"
          :key="point.key"
          :series-id="point.seriesId"
          :period="point.period"
          :series-index="point.seriesIndex"
          :position="point.position"
        />
      </div>
    </div>
    <div class="sr-only">
      <table>
        <caption>
          {{
            chart.label
          }}
          — exact ranks
        </caption>
        <thead>
          <tr>
            <th scope="col">Series</th>
            <th v-for="period in chart.periods" :key="period" scope="col">
              {{ period }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in chart.rows" :key="row.id">
            <th scope="row">{{ row.name }}</th>
            <td v-for="(rank, index) in row.ranks" :key="index">
              {{ rank ?? "No data" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
