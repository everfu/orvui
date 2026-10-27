<script setup lang="ts">
import { ReturnsCalendar } from "./index";
const years = [2021, 2022, 2023, 2024, 2025];
let seed = 2021;
function sample() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}
const returns = years.map((_, index) =>
  Array.from(
    { length: 12 },
    () =>
      Math.round(((index === 1 ? -1.6 : 0.9) + (sample() - 0.5) * 12) * 10) /
      10,
  ),
);
</script>
<template><ReturnsCalendar :years="years" :returns="returns" /></template>
