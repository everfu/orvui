<script setup lang="ts">
import { computed, ref } from "vue";
import { motion } from "motion-v";
import { useCompositionChart } from "../../../../packages/vue/src/charts/composition-chart";
import { SPRING_LAYOUT } from "../../../../packages/vue/src/lib/ease";
const props = defineProps<{ bars?: boolean; compact?: boolean }>();
const chart = useCompositionChart();
const inspecting = ref(false);
const inspectedRow = ref<string | null>(null);
const observations = computed(() =>
  chart.rows.flatMap((row) => row.values.map((value) => value ?? 0)),
);
const floor = computed(() => {
  const min = Math.min(...observations.value),
    max = Math.max(...observations.value);
  return !props.bars && min > max * 0.55 ? min * 0.98 : 0;
});
const peak = computed(
  () => Math.max(1, ...observations.value) * (floor.value ? 1.03 : 1.12),
);
const x = (index: number) =>
  ((index + 0.5) * 100) / Math.max(1, chart.columns.length);
const barWidth = computed(
  () => 60 / Math.max(1, chart.columns.length) / Math.max(1, chart.rows.length),
);
const barStep = computed(
  () => 72 / Math.max(1, chart.columns.length) / Math.max(1, chart.rows.length),
);
function barX(index: number, rowIndex: number) {
  const groupWidth = barWidth.value + barStep.value * (chart.rows.length - 1);
  return x(index) - groupWidth / 2 + rowIndex * barStep.value;
}
const inspectX = computed(() => {
  if (!props.bars) return x(chart.index);
  let rowIndex = chart.rows.findIndex(
    (row) =>
      row.id === inspectedRow.value && (row.values[chart.index] ?? 0) > 0,
  );
  if (rowIndex === -1)
    rowIndex = chart.rows.findIndex(
      (row) => (row.values[chart.index] ?? 0) > 0,
    );
  return barX(chart.index, Math.max(0, rowIndex)) + barWidth.value / 2;
});
const y = (value: number | null) =>
  100 - (((value ?? 0) - floor.value) / (peak.value - floor.value)) * 100;
const lines = computed(() =>
  chart.rows.map((row) => ({
    ...row,
    path: row.values
      .map((value, index) => `${index ? "L" : "M"}${x(index)},${y(value)}`)
      .join(" "),
  })),
);
function inspect(event: PointerEvent) {
  const box = event.currentTarget as HTMLElement;
  const bounds = box.getBoundingClientRect();
  if (!bounds.width || !chart.columns.length) return;
  if (event.type === "pointerdown") {
    event.preventDefault();
    box.querySelector("input")?.focus({ preventScroll: true });
  }
  const index = Math.max(
    0,
    Math.min(
      chart.columns.length - 1,
      Math.floor(
        ((event.clientX - bounds.left) / bounds.width) * chart.columns.length,
      ),
    ),
  );
  if (chart.columns[index]) chart.select(chart.columns[index].id);
  if (props.bars) {
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * 100;
    const nearest = chart.rows
      .map((row, rowIndex) => ({
        id: row.id,
        value: row.values[index] ?? 0,
        distance: Math.abs(
          barX(index, rowIndex) + barWidth.value / 2 - pointerX,
        ),
      }))
      .filter((row) => row.value > 0)
      .sort((a, b) => a.distance - b.distance)[0];
    inspectedRow.value = nearest?.id ?? null;
  }
  inspecting.value = true;
}
function input(event: Event) {
  inspectedRow.value = null;
  const index = Number((event.target as HTMLInputElement).value);
  if (chart.columns[index]) chart.select(chart.columns[index].id);
  inspecting.value = true;
}
</script>
<template>
  <div class="home-trend" :class="{ 'is-compact': compact }">
    <div v-if="!compact" class="home-trend-readout">
      <span>{{ chart.column?.id }}</span
      ><span>{{
        chart.formatValue(
          chart.column?.segments.reduce(
            (sum, item) => sum + (item.value ?? 0),
            0,
          ) ?? 0,
        )
      }}</span>
    </div>
    <div
      class="home-trend-plot"
      @pointerdown="inspect"
      @pointermove="
        !compact && (chart.canHover || $event.buttons === 1) && inspect($event)
      "
      @pointerleave="$event.pointerType !== 'touch' && (inspecting = false)"
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <template v-if="!compact">
          <line
            v-for="tick in [0, 25, 50, 75, 100]"
            :key="tick"
            x1="0"
            x2="100"
            :y1="tick"
            :y2="tick"
            stroke="var(--border)"
            vector-effect="non-scaling-stroke"
          />
        </template>
        <template v-for="(line, rowIndex) in lines" :key="line.id">
          <template v-if="bars">
            <motion.rect
              v-for="(value, index) in line.values"
              :key="index"
              :x="barX(index, rowIndex)"
              :width="barWidth"
              :fill="line.color"
              :y="y(value)"
              :height="100 - y(value)"
              rx="1"
              :initial="false"
              :animate="{
                opacity:
                  chart.highlight && chart.highlight !== line.id ? 0.2 : 1,
              }"
              :transition="chart.reduce ? { duration: 0 } : SPRING_LAYOUT"
            />
          </template>
          <template v-else>
            <path
              v-if="compact || lines.length === 1"
              :d="`${line.path} L${x(line.values.length - 1)},100 L${x(0)},100 Z`"
              :fill="line.color"
              opacity=".08"
            />
            <path
              :d="line.path"
              fill="none"
              :stroke="line.color"
              stroke-width="2"
              vector-effect="non-scaling-stroke"
              stroke-linejoin="round"
              stroke-linecap="round"
              :opacity="
                chart.highlight && chart.highlight !== line.id ? 0.15 : 1
              "
            />
          </template>
        </template>
        <line
          v-if="inspecting && !compact"
          :x1="inspectX"
          :x2="inspectX"
          y1="0"
          y2="100"
          stroke="var(--foreground)"
          stroke-opacity=".35"
          stroke-dasharray="3 3"
          vector-effect="non-scaling-stroke"
        />
      </svg>
      <input
        v-if="!compact"
        type="range"
        min="0"
        :max="Math.max(0, chart.columns.length - 1)"
        :value="chart.index"
        :aria-label="chart.label"
        :aria-valuetext="`${chart.column?.id}: ${chart.column?.segments.map((item) => `${item.name} ${chart.formatValue(item.value ?? 0)}`).join(', ')}`"
        @input="input"
        @focus="inspecting = true"
        @blur="inspecting = false"
      />
    </div>
    <div v-if="!compact" class="home-trend-axis">
      <span
        v-for="index in [
          0,
          Math.floor(chart.columns.length / 3),
          Math.floor((chart.columns.length * 2) / 3),
          chart.columns.length - 1,
        ]"
        :key="index"
        :style="{ left: `${x(index)}%` }"
        >{{ chart.columns[index]?.id }}</span
      >
    </div>
  </div>
</template>
