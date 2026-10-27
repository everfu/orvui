<script setup lang="ts">
import { computed, ref } from "vue";
import { RefreshCw } from "lucide-vue-next";
import { Button } from "../../motion/button";
import { FunnelChart } from "./index";
const labels = [
  "Visitors",
  "Signed up",
  "Activated",
  "Started trial",
  "Subscribed",
];
const cohorts = [
  [24000, 15600, 10800, 7200, 4320],
  [28000, 18200, 13650, 9100, 6370],
  [22000, 13200, 7920, 4752, 2376],
];
const direction = ref<"vertical" | "horizontal">("vertical");
const cohort = ref(0);
const stages = computed(() =>
  labels.map((label, index) => ({
    id: label,
    label,
    value: cohorts[cohort.value][index],
  })),
);
const directions = ["vertical", "horizontal"] as const;
function nextCohort() {
  cohort.value = (cohort.value + 1) % cohorts.length;
}
</script>

<template>
  <div class="w-full space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 class="text-sm font-medium">From first visit to first payment</h3>
        <p class="mt-1 text-xs text-muted-foreground">
          Product conversion · Sample cohorts
        </p>
      </div>
      <Button variant="ghost" size="sm" class="gap-2" @click="nextCohort"
        ><RefreshCw class="size-3.5" aria-hidden="true" />Next cohort</Button
      >
    </div>
    <fieldset
      aria-label="Funnel direction"
      class="inline-flex gap-1 rounded-full bg-muted/50 p-1"
    >
      <Button
        v-for="orientation in directions"
        :key="orientation"
        variant="ghost"
        size="sm"
        :aria-pressed="direction === orientation"
        :class="
          direction === orientation
            ? 'bg-background shadow-sm'
            : 'text-muted-foreground'
        "
        @click="direction = orientation"
        >{{ orientation === "vertical" ? "Vertical" : "Horizontal" }}</Button
      >
    </fieldset>
    <FunnelChart :direction="direction" :stages="stages" />
    <p class="text-center text-[11px] text-muted-foreground">
      Inspect a stage to see conversion and drop-off
    </p>
  </div>
</template>
