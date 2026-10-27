<script setup lang="ts">
import { computed, ref } from "vue";
import {
  StatusBar,
  StatusBarPlot,
  StatusBarTooltip,
  StatusBarLegend,
  STATUS_BAR_STATUSES,
  type StatusBarDatum,
} from "./index";
import { Button } from "../../motion/button";
const dateLabel = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const history: readonly StatusBarDatum[] = Array.from(
  { length: 48 },
  (_, index) => {
    const date = new Date(Date.UTC(2026, 7, 21 + index));
    const degraded = index === 8;
    return {
      id: date.toISOString().slice(0, 10),
      label: dateLabel.format(date),
      status: degraded ? "degraded" : "operational",
      description: degraded
        ? "Elevated response times for 12 minutes."
        : "All checks passed.",
    };
  },
);
const website = history.map((period) => ({
  ...period,
  status: "operational",
  description: "All checks passed.",
}));
const statuses = STATUS_BAR_STATUSES.slice(0, 3);
const incident = ref(false);
const replay = ref(0);
const api = computed(() =>
  history.map((period, index) => {
    if (!incident.value || index < 45) return period;
    return {
      ...period,
      status: index === 46 ? "outage" : "degraded",
      description:
        index === 46
          ? "Requests failed for 4 minutes."
          : "Elevated response times.",
    };
  }),
);
</script>

<template>
  <div class="w-full max-w-2xl space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <span class="text-sm text-muted-foreground">48 days of status</span>
      <div class="flex gap-1">
        <Button variant="ghost" size="sm" tabindex="0" @click="replay++"
          >Replay</Button
        ><Button
          variant="ghost"
          size="sm"
          tabindex="0"
          @click="incident = !incident"
          >{{ incident ? "Resolve incident" : "Simulate incident" }}</Button
        >
      </div>
    </div>
    <StatusBar
      :key="'api-' + replay"
      :data="api"
      :statuses="statuses"
      label="API status"
    >
      <div class="flex items-center justify-between text-sm">
        <span class="font-medium">API</span
        ><span class="text-muted-foreground">{{
          incident ? "Degraded" : "Operational"
        }}</span>
      </div>
      <StatusBarPlot /><StatusBarTooltip />
    </StatusBar>
    <StatusBar
      :key="'website-' + replay"
      class="border-t border-border pt-6"
      :data="website"
      :statuses="statuses"
      label="Website status"
    >
      <div class="flex items-center justify-between text-sm">
        <span class="font-medium">Website</span
        ><span class="text-muted-foreground">Operational</span>
      </div>
      <StatusBarPlot /><StatusBarLegend class="pt-2" /><StatusBarTooltip />
    </StatusBar>
  </div>
</template>
