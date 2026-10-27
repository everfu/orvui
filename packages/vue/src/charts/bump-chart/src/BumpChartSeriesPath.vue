<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useId, watch } from "vue";
import { animate, motion, motionValue, useTransform } from "motion-v";
import { EASE_OUT } from "../../../lib/ease";
import { useBumpChart } from "./context";
import { bumpPath, PLOT } from "./model";
import type { BumpPosition } from "./use-geometry";
const props = defineProps<{
  row: ReturnType<typeof useBumpChart>["rows"][number];
  positions: (BumpPosition | null)[];
  index: number;
}>();
const chart = useBumpChart();
const clipId = useId();
const signals = props.positions.flatMap((position) =>
  position ? [position.x, position.y] : [],
);
const path = useTransform(signals, (coordinates: number[]) => {
  let index = 0;
  const points = props.positions.map((position) =>
    position ? { x: coordinates[index++], y: coordinates[index++] } : null,
  );
  return bumpPath(
    points.map((point) => point?.y ?? null),
    (period) => points[period]?.x ?? 0,
    (value) => value,
  );
});
const last = computed(() => props.positions.at(-1));
const endLabel = computed(() =>
  props.row.name.length > 12
    ? props.row.name.slice(0, 11) + "…"
    : props.row.name,
);
const glow = motionValue(0);
let running: ReturnType<typeof animate> | undefined;
let live = false;
function highlight() {
  running?.stop();
  const opacity = chart.highlighted === props.row.id ? 0.16 : 0;
  if (live)
    running = animate(glow, opacity, { duration: 0.18, ease: EASE_OUT });
  else glow.jump(opacity);
}
watch(() => chart.highlighted === props.row.id, highlight, { immediate: true });
onMounted(() => {
  live = true;
  highlight();
});
onBeforeUnmount(() => {
  live = false;
  running?.stop();
  glow.destroy();
});
</script>
<template>
  <motion.g
    :initial="chart.reduce ? false : { opacity: 0 }"
    :animate="{
      opacity:
        chart.highlighted !== null && chart.highlighted !== row.id ? 0.22 : 1,
    }"
    :transition="{ duration: 0.18, ease: EASE_OUT }"
    @pointerenter="chart.canHover && chart.setHovered(row.id)"
    @pointerleave="chart.setHovered(null)"
  >
    <defs
      ><clipPath :id="clipId"
        ><motion.rect
          x="0"
          y="0"
          :width="PLOT.width"
          :height="chart.height"
          :initial="chart.reduce ? false : { scaleX: 0 }"
          :animate="{ scaleX: 1 }"
          :style="{ originX: 0 }"
          :transition="{
            duration: chart.reduce ? 0 : 0.28,
            delay: chart.reduce ? 0 : Math.min(index, 4) * 0.025,
            ease: EASE_OUT,
          }" /></clipPath
    ></defs>
    <g :clip-path="`url(#${clipId})`">
      <motion.path :d="path" :stroke="row.color" stroke-width="2" fill="none" />
      <motion.path
        :d="path"
        :stroke="row.color"
        stroke-width="5"
        fill="none"
        :style="{ opacity: glow }"
        :transition="{ duration: 0.18, ease: EASE_OUT }"
      />
      <motion.path
        :d="path"
        stroke="transparent"
        stroke-width="16"
        fill="none"
      />
    </g>
    <motion.g v-if="last" :style="{ x: last.x, y: last.y }"
      ><text
        x="18"
        dominant-baseline="central"
        :fill="row.color"
        class="text-[10px] font-medium"
        >{{ endLabel }}<title>{{ row.name }}</title></text
      ></motion.g
    >
  </motion.g>
</template>
