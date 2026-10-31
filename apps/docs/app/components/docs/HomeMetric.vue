<script setup lang="ts">
import { Card } from "../../../../../packages/vue/src/motion/card";
import { AnimatedNumber } from "../../../../../packages/vue/src/motion/number";
import HomeTrendChart from "./HomeTrendChart.vue";
defineProps<{
  label: string;
  value: number;
  change?: string;
  detail?: string;
  format?: (value: number) => string;
  progress?: number;
  spark?: number[];
  tone?: string;
}>();
</script>
<template>
  <Card class="home-stat" size="compact"
    ><div class="home-stat-label">
      <span>{{ label }}</span
      ><span v-if="change" class="home-stat-change">{{ change }}</span>
    </div>
    <div class="home-stat-value">
      <AnimatedNumber :value="value" :format="format" :start-on-view="false" />
    </div>
    <div
      v-if="progress !== undefined"
      class="home-stat-progress"
      role="progressbar"
      :aria-label="label"
      :aria-valuenow="progress"
      :aria-valuemin="0"
      :aria-valuemax="100"
    >
      <span
        :style="{ width: `${progress}%`, background: tone || 'var(--primary)' }"
      />
    </div>
    <small v-if="detail">{{ detail }}</small>
    <div v-if="spark" class="home-stat-spark">
      <HomeTrendChart
        :series="[
          {
            id: 'trend',
            name: label,
            color: tone || 'var(--primary)',
            values: spark,
          },
        ]"
        :periods="spark.map((_, index) => String(index))"
        :label="label"
        compact
      /></div
  ></Card>
</template>
