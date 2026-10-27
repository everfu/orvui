<script setup lang="ts">
import { CompositionChart } from "./index";
const dates = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const periods = Array.from({ length: 36 }, (_, index) =>
  dates.format(new Date(Date.UTC(2026, 7, index + 1))),
);
const channels = [
  {
    id: "organic",
    name: "Organic search",
    color: "#2563eb",
    base: 46,
    trend: -0.45,
  },
  { id: "direct", name: "Direct", color: "#38bdf8", base: 24, trend: 0.12 },
  {
    id: "referral",
    name: "Referrals",
    color: "#0d9488",
    base: 10,
    trend: 0.32,
  },
  { id: "social", name: "Social", color: "#fbbf24", base: 12, trend: 0.06 },
  { id: "email", name: "Email", color: "#a78bfa", base: 5, trend: 0.09 },
  { id: "other", name: "Other", color: "#a1a1aa", base: 3, trend: 0.02 },
];
const series = channels.map(({ base, trend, ...channel }, index) => ({
  ...channel,
  values: periods.map((_, day) =>
    Math.round(
      (base +
        day * trend +
        Math.sin(day * 1.7 + index * 2) * Math.min(base / 3, 5)) *
        120,
    ),
  ),
}));
const formatVisits = (value: number) => `${value.toLocaleString("en")} visits`;
</script>
<template>
  <div class="w-full space-y-10">
    <CompositionChart
      view="bar"
      :series="series"
      :periods="periods"
      label="Illustrative acquisition channel shares"
      :format-value="formatVisits"
    />
    <div class="border-t border-border pt-10">
      <CompositionChart
        view="area"
        :series="series"
        :periods="periods"
        label="Illustrative acquisition channel shares"
        :format-value="formatVisits"
      />
    </div>
  </div>
</template>
