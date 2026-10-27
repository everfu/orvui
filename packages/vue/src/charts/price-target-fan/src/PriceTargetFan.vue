<script setup lang="ts">
import { provide } from "vue";
import { createPriceTargetModel, priceTargetContext } from "./context";
import type { PriceTargetFanProps } from "./types";
import PriceTargetFanHeader from "./PriceTargetFanHeader.vue";
import PriceTargetFanPlot from "./PriceTargetFanPlot.vue";
const props = defineProps<PriceTargetFanProps>();
const emit = defineEmits(["update:active", "activeChange"]);
const chart = createPriceTargetModel(props, emit);
provide(priceTargetContext.key, chart);
</script>
<template>
  <section
    :aria-label="chart.label"
    :class="[
      'w-[520px] max-w-full [--ink-l:0.5] dark:[--ink-l:1]',
      props.className,
    ]"
  >
    <slot><PriceTargetFanHeader /><PriceTargetFanPlot /></slot>
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
            <th>Observation</th>
            <th>Price</th>
            <th>Analysts</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="point in chart.history" :key="point.date">
            <th>{{ point.date }}</th>
            <td>{{ chart.fmt(point.price) }}</td>
            <td />
          </tr>
          <tr>
            <th>Current</th>
            <td>{{ chart.fmt(chart.current) }}</td>
            <td />
          </tr>
          <tr v-for="target in chart.targets" :key="target.key">
            <th>{{ target.key }} target</th>
            <td>{{ chart.fmt(target.price) }}</td>
            <td>{{ target.analysts }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
