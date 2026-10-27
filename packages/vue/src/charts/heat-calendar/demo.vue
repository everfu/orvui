<script setup lang="ts">
import { HeatCalendar } from "./index";
const values = Array.from({ length: 16 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => {
    const noise = Math.sin(week * 12.9898 + day * 78.233) * 43758.5453;
    const intensity = noise - Math.floor(noise);
    return day >= 5 ? Math.max(0, intensity - 0.55) * 1.4 : intensity;
  }),
);
const end = new Date("2026-10-25T00:00:00Z");
</script>
<template>
  <HeatCalendar
    unit="commits"
    :weeks="16"
    :max-count="14"
    :values="values"
    :end-date="end"
  />
</template>
