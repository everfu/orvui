<script setup lang="ts">
import { ref } from "vue";
import { PredictionMarket, type PredictionMarketOrderValue } from "../index";
const outcomes = [
  { id: "yes", label: "Yes", price: 0.167 },
  { id: "no", label: "No", price: 0.834 },
];
const order = ref<PredictionMarketOrderValue>({
  mode: "buy",
  outcomeId: "yes",
  amount: "115",
});
</script>
<template>
  <div class="flex w-full items-center justify-center">
    <PredictionMarket
      v-model="order"
      :outcomes="outcomes"
      :balance="500"
      :positions="{ yes: 125, no: 48 }"
      :quick-amounts="[1, 5, 10, 100]"
    />
  </div>
</template>
