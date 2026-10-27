<script setup lang="ts">
import { provide } from "vue";
import {
  createCandlestickModel,
  candlestickContext,
  type CandlestickChartProps,
} from "./context";
import CandlestickChartPlot from "./CandlestickChartPlot.vue";
import CandlestickChartLegend from "./CandlestickChartLegend.vue";
const props = defineProps<CandlestickChartProps>();
const emit = defineEmits(["update:activeId", "activeIdChange"]);
const chart = createCandlestickModel(props, emit);
provide(candlestickContext.key, chart);
</script>
<template>
  <section :aria-label="chart.label" :class="['w-full', props.className]">
    <slot
      ><div class="grid gap-3">
        <CandlestickChartLegend /><CandlestickChartPlot /></div
    ></slot>
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
            <th>Period</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="candle in chart.candles" :key="candle.id">
            <th>{{ candle.label }}</th>
            <td>{{ chart.formatPrice(candle.open) }}</td>
            <td>{{ chart.formatPrice(candle.high) }}</td>
            <td>{{ chart.formatPrice(candle.low) }}</td>
            <td>{{ chart.formatPrice(candle.close) }}</td>
            <td>{{ chart.formatVolume(candle.volume) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
