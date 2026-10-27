<script setup lang="ts">
import { ref } from "vue";
import { Shuffle } from "lucide-vue-next";
import { Button } from "../../motion/button";
import { BumpChart } from "./index";
const periods = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const series = ref([
  { id: "studio", name: "Studio", ranks: [4, 3, 2, 3, 2, 1], color: "#8b5cf6" },
  { id: "canvas", name: "Canvas", ranks: [1, 1, 3, 2, 1, 2], color: "#0d9488" },
  { id: "layers", name: "Layers", ranks: [3, 2, 1, 1, 3, 3], color: "#f59e0b" },
  { id: "orbit", name: "Orbit", ranks: [2, 4, 5, 4, 5, 4], color: "#3b82f6" },
  { id: "frame", name: "Frame", ranks: [5, 5, 4, 5, 4, 5], color: "#f43f5e" },
]);
function shuffle() {
  const columns = periods.map(() => {
    const order = series.value.map((_, index) => index + 1);
    for (let remaining = order.length; remaining > 1; remaining--) {
      const index = Math.floor(Math.random() * remaining);
      [order[index], order[remaining - 1]] = [
        order[remaining - 1],
        order[index],
      ];
    }
    return order;
  });
  series.value = series.value.map((row, index) => ({
    ...row,
    ranks: columns.map((column) => column[index]),
  }));
}
</script>
<template>
  <div class="w-full space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 px-2">
      <div>
        <h3 class="text-sm font-medium text-foreground">The leaderboard</h3>
        <p class="mt-1 text-xs text-muted-foreground">
          Five products. Six months. Every move.
        </p>
      </div>
      <Button variant="ghost" size="sm" class="shrink-0 gap-2" @click="shuffle"
        ><Shuffle class="size-3.5" aria-hidden="true" />Shuffle rankings</Button
      >
    </div>
    <BumpChart
      :series="series"
      :periods="periods"
      label="Illustrative product rankings, April to September"
    />
    <p class="text-center text-[11px] text-muted-foreground">
      Inspect a dot for details · Select to pin a product
    </p>
  </div>
</template>
