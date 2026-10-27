<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed, inject } from "vue";
import { motion } from "motion-v";
import { CalendarDays, ChevronDown } from "lucide-vue-next";
import { SPRING_LAYOUT } from "../../../lib/ease";
import { resolveElement } from "../../../lib/composables";
import { cn } from "../../../lib/utils";
import { MorphPopoverTrigger } from "../../popover";
import type { createDateRangePicker } from "./controller";
const props = withDefaults(
  defineProps<{ placeholder?: string; disabled?: boolean }>(),
  { placeholder: "Select dates" },
);
const state =
  inject<ReturnType<typeof createDateRangePicker>>("orvui-date-range")!;
const summary = computed(() => {
  const range = state.value.value;
  if (!range) return props.placeholder;
  const sameYear = range.to && range.from.slice(0, 4) === range.to.slice(0, 4);
  return `${state.format(range.from, { month: "short", day: "numeric", ...(sameYear ? {} : { year: "numeric" }) })} – ${range.to ? state.format(range.to, { month: "short", day: "numeric", year: "numeric" }) : "Select end"}`;
});
const layout = computed(() => (state.reduce.value ? false : "position"));
</script>
<template>
  <MorphPopoverTrigger
    ><motion.button
      v-bind="$attrs"
      :ref="(node) => (state.anchor.value = resolveElement<HTMLElement>(node))"
      type="button"
      :disabled="props.disabled || state.props.disabled"
      :layout="!state.reduce.value"
      :transition="{ layout: SPRING_LAYOUT }"
      :style="{ borderRadius: '12px' }"
      :aria-label="
        String($attrs['aria-label'] ?? `${state.props.label}: ${summary}`)
      "
      :class="
        cn(
          'inline-flex h-9 w-fit max-w-full items-center gap-2 rounded-xl border border-border bg-background px-3 text-[13px] font-medium text-foreground transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40',
          $attrs.class as string,
        )
      "
      ><motion.span
        v-if="$slots.default"
        :layout="layout"
        :transition="{ layout: SPRING_LAYOUT }"
        class="inline-flex min-w-0 items-center gap-2"
        ><slot /></motion.span
      ><template v-else
        ><motion.span
          :layout="layout"
          :transition="{ layout: SPRING_LAYOUT }"
          class="shrink-0 text-muted-foreground"
          aria-hidden="true"
          ><CalendarDays :size="15" /></motion.span
        ><motion.span
          :layout="layout"
          :transition="{ layout: SPRING_LAYOUT }"
          class="min-w-0 truncate tabular-nums"
          >{{ summary }}</motion.span
        ><motion.span
          :layout="layout"
          :transition="{ layout: SPRING_LAYOUT }"
          class="shrink-0 text-muted-foreground"
          aria-hidden="true"
          ><ChevronDown
            :size="13"
            :class="
              state.open.value ? 'rotate-180' : undefined
            " /></motion.span></template></motion.button
  ></MorphPopoverTrigger>
</template>
