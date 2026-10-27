<script setup lang="ts">
import { PriceTargetFan, type PriceTarget } from "./index";
const prices = [
  158.4, 164.2, 160.8, 173.1, 170.6, 181.3, 175.8, 183.7, 178.2, 184.1, 180.5,
  177.3, 178.52,
];
const history = prices.map((price, index) => ({
  date: new Date(Date.UTC(2025, 8 + index, 14)).toISOString().slice(0, 10),
  price,
}));
const targets: [PriceTarget, PriceTarget, PriceTarget] = [
  { key: "High", price: 232, analysts: 9 },
  { key: "Mean", price: 205, analysts: 34 },
  { key: "Low", price: 168, analysts: 6 },
];
</script>
<template>
  <PriceTargetFan
    :current="178.52"
    :history="history"
    :targets="targets"
    :dates="{ horizon: 'Sep 2027' }"
  />
</template>
