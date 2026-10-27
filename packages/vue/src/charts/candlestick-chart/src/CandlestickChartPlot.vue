<script setup lang="ts">
import { computed, ref } from "vue";
import { motion } from "motion-v";
import { EASE_OUT, SPRING_LAYOUT } from "../../../lib/ease";
import { usePlotSize } from "../../shared";
import { useCandlestickChart } from "./context";
import { candleGeometry } from "./geometry";
const props = withDefaults(defineProps<{ height?: number }>(), { height: 320 });
const chart = useCandlestickChart(),
  element = ref<HTMLElement | null>(null),
  pointerY = ref<number | null>(null);
const size = usePlotSize(element, { width: 640, height: props.height });
const geometry = computed(() =>
  candleGeometry(chart.candles, chart.scale, size.value.width, props.height),
);
const focused = computed(() =>
  chart.active === null ? chart.candles.at(-1) : chart.candles[chart.active],
);
const valueText = computed(() =>
  focused.value
    ? `${focused.value.label}: open ${chart.formatPrice(focused.value.open)}, high ${chart.formatPrice(focused.value.high)}, low ${chart.formatPrice(focused.value.low)}, close ${chart.formatPrice(focused.value.close)}`
    : undefined,
);
function move(event: PointerEvent) {
  const rect = element.value?.getBoundingClientRect();
  if (!rect || !geometry.value.pitch) return;
  const x = event.clientX - rect.left,
    y = event.clientY - rect.top;
  if (x > geometry.value.plotWidth) return;
  chart.setActive(
    Math.min(
      chart.candles.length - 1,
      Math.max(0, Math.floor(x / geometry.value.pitch)),
    ),
  );
  pointerY.value = y <= geometry.value.priceHeight ? y : null;
}
function keydown(event: KeyboardEvent) {
  let next = chart.active ?? chart.candles.length - 1;
  if (event.key === "ArrowLeft") next = Math.max(0, next - 1);
  else if (event.key === "ArrowRight")
    next = Math.min(chart.candles.length - 1, next + 1);
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = chart.candles.length - 1;
  else if (event.key === "Escape") {
    chart.setActive(null);
    return;
  } else return;
  event.preventDefault();
  pointerY.value = null;
  chart.setActive(next);
}
function leave() {
  chart.setActive(null);
  pointerY.value = null;
}
</script>
<template>
  <div
    ref="element"
    role="slider"
    tabindex="0"
    :aria-label="chart.label"
    :aria-valuemin="0"
    :aria-valuemax="Math.max(0, chart.candles.length - 1)"
    :aria-valuenow="chart.active ?? Math.max(0, chart.candles.length - 1)"
    :aria-valuetext="valueText"
    class="relative w-full cursor-crosshair touch-pan-y select-none rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
    :style="{ height: props.height + 'px' }"
    @pointermove="move"
    @pointerleave="leave"
    @keydown="keydown"
    @blur="chart.setActive(null)"
  >
    <svg
      :width="size.width"
      :height="props.height"
      aria-hidden="true"
      class="absolute inset-0 overflow-visible"
    >
      <line
        v-for="tick in geometry.ticks"
        :key="tick"
        x1="0"
        :x2="geometry.plotWidth"
        :y1="geometry.y(tick)"
        :y2="geometry.y(tick)"
        stroke="var(--border)"
        stroke-dasharray="2 6"
      />
      <motion.g
        v-for="bar in geometry.bars"
        :key="bar.candle.id"
        :class="
          bar.candle.close >= bar.candle.open
            ? 'fill-emerald-500 stroke-emerald-500'
            : 'fill-rose-500 stroke-rose-500'
        "
        :initial="chart.reduce ? false : { opacity: 0 }"
        :animate="{
          opacity:
            chart.active !== null && chart.active !== bar.index ? 0.45 : 1,
        }"
        :transition="{
          duration: 0.3,
          ease: EASE_OUT,
          delay: chart.reduce ? 0 : Math.min(bar.index * 0.012, 0.6),
        }"
      >
        <motion.line
          :x1="bar.center"
          :x2="bar.center"
          y1="0"
          y2="1"
          vector-effect="non-scaling-stroke"
          stroke-width="1"
          :style="{ originX: 0, originY: 0 }"
          :initial="false"
          :animate="{ y: bar.wickTop, scaleY: bar.wickHeight }"
          :transition="chart.reduce ? { duration: 0 } : SPRING_LAYOUT"
        />
        <motion.rect
          :x="bar.left"
          y="0"
          :width="geometry.bodyWidth"
          height="1"
          stroke-width="0"
          :style="{ originX: 0, originY: 0 }"
          :initial="false"
          :animate="{ y: bar.bodyTop, scaleY: bar.bodyHeight }"
          :transition="chart.reduce ? { duration: 0 } : SPRING_LAYOUT"
        />
        <motion.rect
          :x="bar.left"
          y="0"
          :width="geometry.bodyWidth"
          height="1"
          stroke-width="0"
          opacity=".28"
          :style="{ originX: 0, originY: 0 }"
          :initial="false"
          :animate="{ y: bar.volumeTop, scaleY: bar.volumeHeight }"
          :transition="chart.reduce ? { duration: 0 } : SPRING_LAYOUT"
        />
      </motion.g>
      <motion.line
        v-if="chart.lastPrice !== undefined"
        x1="0"
        :x2="geometry.plotWidth"
        y1="0"
        y2="0"
        :initial="false"
        :animate="{ y: geometry.y(chart.lastPrice) }"
        :transition="chart.reduce ? { duration: 0 } : SPRING_LAYOUT"
        stroke="var(--foreground)"
        stroke-opacity=".45"
        stroke-dasharray="3 4"
      />
      <line
        v-if="chart.active !== null"
        :x1="chart.active * geometry.pitch + geometry.pitch / 2"
        :x2="chart.active * geometry.pitch + geometry.pitch / 2"
        y1="0"
        :y2="props.height"
        stroke="var(--foreground)"
        stroke-opacity=".3"
      />
      <line
        v-if="pointerY !== null"
        x1="0"
        :x2="geometry.plotWidth"
        :y1="pointerY"
        :y2="pointerY"
        stroke="var(--foreground)"
        stroke-opacity=".3"
      />
    </svg>
    <span
      v-for="tick in geometry.ticks"
      :key="tick"
      class="pointer-events-none absolute right-0 -translate-y-1/2 pr-1 font-mono text-xs text-muted-foreground tabular-nums"
      :style="{ top: geometry.y(tick) + 'px' }"
      >{{ chart.formatPrice(tick) }}</span
    >
    <motion.div
      v-if="chart.lastPrice !== undefined"
      class="pointer-events-none absolute top-0 right-0"
      :initial="false"
      :animate="{ y: geometry.y(chart.lastPrice) }"
      :transition="chart.reduce ? { duration: 0 } : SPRING_LAYOUT"
      ><span
        class="block -translate-y-1/2 rounded-md bg-foreground px-1.5 py-0.5 font-mono text-xs text-background tabular-nums"
        >{{ chart.formatPrice(chart.lastPrice) }}</span
      ></motion.div
    >
    <span
      v-if="pointerY !== null"
      class="pointer-events-none absolute right-0 -translate-y-1/2 rounded bg-muted px-1.5 py-0.5 font-mono text-xs"
      :style="{ top: pointerY + 'px' }"
      >{{
        chart.formatPrice(
          chart.scale.max -
            (pointerY / geometry.priceHeight) *
              (chart.scale.max - chart.scale.min),
        )
      }}</span
    >
  </div>
</template>
