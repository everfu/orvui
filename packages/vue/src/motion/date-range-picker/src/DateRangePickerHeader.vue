<script setup lang="ts">
import { inject } from "vue";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import type { createDateRangePicker } from "./controller";
const state =
  inject<ReturnType<typeof createDateRangePicker>>("orvui-date-range")!;
const monthTrigger = state.monthTrigger,
  yearTrigger = state.yearTrigger;
const directions = [
  { step: -1, icon: ChevronLeft, label: "Previous" },
  { step: 1, icon: ChevronRight, label: "Next" },
];
</script>
<template>
  <div class="mb-2 flex items-center justify-between gap-1">
    <div class="flex min-w-0 items-center gap-0.5">
      <button
        ref="monthTrigger"
        type="button"
        aria-label="Choose month"
        :aria-expanded="state.view.value === 'months'"
        :aria-controls="
          state.view.value === 'months' ? state.choicesId : undefined
        "
        :disabled="state.props.disabled"
        :class="
          cn(
            'inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40',
            state.view.value === 'years' && 'hidden',
          )
        "
        @click="state.openChoices('months')"
      >
        {{ state.format(state.month.value, { month: "long" })
        }}<ChevronDown
          :size="12"
          :class="
            cn(
              'text-muted-foreground',
              state.view.value === 'months' && 'rotate-180',
            )
          "
        /></button
      ><button
        ref="yearTrigger"
        type="button"
        aria-label="Choose year"
        :aria-expanded="state.view.value === 'years'"
        :aria-controls="
          state.view.value === 'years' ? state.choicesId : undefined
        "
        :disabled="state.props.disabled"
        class="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-medium tabular-nums text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
        @click="state.openChoices('years')"
      >
        {{
          state.view.value === "years"
            ? `${state.yearPage.value}–${state.yearPageEnd.value}`
            : state.year.value
        }}<ChevronDown
          :size="12"
          :class="state.view.value === 'years' ? 'rotate-180' : undefined"
        />
      </button>
    </div>
    <div class="flex shrink-0 gap-0.5">
      <button
        v-for="direction in directions"
        :key="direction.step"
        type="button"
        :aria-label="`${direction.label} ${state.view.value === 'years' ? 'years' : state.view.value === 'months' ? 'year' : 'month'}`"
        :disabled="
          direction.step < 0
            ? state.previousDisabled.value
            : state.nextDisabled.value
        "
        :hidden="
          direction.step > 0 &&
          state.view.value === 'years' &&
          state.nextDisabled.value
        "
        class="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30"
        @click="state.page(direction.step)"
      >
        <component :is="direction.icon" :size="16" />
      </button>
    </div>
  </div>
</template>
