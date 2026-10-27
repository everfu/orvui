<script setup lang="ts">
import { computed } from "vue";
import { usePriceTargetFan } from "./context";
import { fmtAxisDate, H, PAD } from "./utils";
const chart = usePriceTargetFan();
const labels = computed(() => {
  const dates: { x: number; text: string; anchor: string }[] = [];
  if (chart.history.length)
    dates.push({
      x: chart.geo.hx(0),
      text: chart.dates.start ?? fmtAxisDate(chart.history[0].date),
      anchor: "start",
    });
  if (chart.history.length > 2) {
    const index = Math.floor(chart.history.length / 2);
    dates.push({
      x: chart.geo.hx(index),
      text: chart.dates.mid ?? fmtAxisDate(chart.history[index].date),
      anchor: "middle",
    });
  }
  dates.push(
    { x: chart.geo.nowX, text: "Now", anchor: "middle" },
    {
      x: chart.geo.endX,
      text: chart.dates.horizon ?? "Target",
      anchor: "middle",
    },
  );
  return dates;
});
</script>
<template>
  <g
    ><g v-for="value in chart.gridVals.out" :key="value"
      ><line
        :x1="PAD.l"
        :y1="chart.y(value)"
        :x2="chart.geo.endX"
        :y2="chart.y(value)"
        stroke="var(--border)"
        stroke-dasharray="2 5"
      /><text
        :x="PAD.l - 8"
        :y="chart.y(value) + 3"
        text-anchor="end"
        font-size="9"
        fill="var(--muted-foreground)"
        class="font-mono tabular-nums"
        >{{
          chart.gridVals.step >= 1 ? Math.round(value) : value.toFixed(1)
        }}</text
      ></g
    ><text
      v-for="label in labels"
      :key="label.x"
      :x="label.x"
      :y="H - 8"
      :text-anchor="label.anchor"
      font-size="9"
      fill="var(--muted-foreground)"
      class="font-mono"
      >{{ label.text }}</text
    ><line
      :x1="chart.geo.nowX"
      :y1="PAD.t"
      :x2="chart.geo.nowX"
      :y2="H - PAD.b"
      :stroke="`url(#${chart.fadeId})`"
      stroke-width="1"
      stroke-dasharray="3 3"
  /></g>
</template>
