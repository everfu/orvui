<script setup lang="ts">
import { AnimatedNumber } from "../index";
const formatRevenue = (amount: number) => `$${Math.round(amount).toLocaleString()}`;
</script>
<template>
  <div class="flex flex-col items-center gap-3">
    <p class="text-xs text-muted-foreground">Monthly recurring revenue</p>
    <div class="text-4xl font-semibold tracking-tight text-foreground tabular-nums"><AnimatedNumber :value="129480" :format="formatRevenue" /></div>
    <p class="text-xs text-(--color-success)">+12.4% vs last month</p>
  </div>
</template>
