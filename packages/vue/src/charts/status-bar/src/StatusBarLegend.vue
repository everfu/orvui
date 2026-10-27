<script setup lang="ts">
import { computed } from "vue";
import { useStatusBar } from "./context";
withDefaults(defineProps<{ showCounts?: boolean }>(), { showCounts: false });
const history = useStatusBar();
const counts = computed(() => {
  const totals = new Map<string, number>();
  for (const { status } of history.rows)
    totals.set(status.id, (totals.get(status.id) ?? 0) + 1);
  return totals;
});
</script>

<template>
  <ul
    aria-label="Status legend"
    data-slot="status-bar-legend"
    class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground"
  >
    <slot>
      <li
        v-for="status in history.statuses"
        :key="status.id"
        class="flex items-center gap-1.5"
      >
        <span
          aria-hidden="true"
          class="h-3 w-1.5 rounded-full"
          :style="{ backgroundColor: status.color }"
        />
        <span>{{ status.label }}</span
        ><span v-if="showCounts" class="tabular-nums"
          >({{ counts.get(status.id) ?? 0 }})</span
        >
      </li>
    </slot>
  </ul>
</template>
