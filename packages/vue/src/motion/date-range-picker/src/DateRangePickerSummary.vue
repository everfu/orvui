<script setup lang="ts">
import { computed, inject } from "vue";
import { ArrowRight } from "lucide-vue-next";
import type { createDateRangePicker } from "./controller";
const state =
  inject<ReturnType<typeof createDateRangePicker>>("orvui-date-range")!;
const fields = computed(() => [
  { title: "Start date", date: state.value.value?.from },
  { title: "End date", date: state.value.value?.to },
]);
</script>
<template>
  <div
    class="mb-2.5 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2"
  >
    <template v-for="(field, index) in fields" :key="field.title"
      ><ArrowRight
        v-if="index"
        :size="14"
        aria-hidden="true"
        class="text-muted-foreground/60"
      />
      <div class="min-w-0">
        <p
          class="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
        >
          {{ field.title }}
        </p>
        <p
          :class="[
            'text-[13px] font-medium tabular-nums',
            index && !field.date && 'text-muted-foreground',
          ]"
        >
          {{
            field.date
              ? state.format(field.date, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Select date"
          }}
        </p>
      </div></template
    >
  </div>
</template>
