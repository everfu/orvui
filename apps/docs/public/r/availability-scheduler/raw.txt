<script setup lang="ts">
import { motion, AnimatePresence } from "motion-v";
import { Plus, X } from "lucide-vue-next";
import { Switch } from "../../../motion/switch";
import { Tooltip } from "../../../motion/tooltip";
import { SPRING_LAYOUT, SPRING_PRESS } from "../../../lib/ease";
import {
  WEEKDAYS,
  panelKey,
  startOptions,
  endOptions,
  type WeekAvailability,
} from "./types";
import { useSchedule } from "./use-schedule";
import TimeSelect from "./TimeSelect.vue";
import CopyMenu from "./CopyMenu.vue";
const props = withDefaults(
  defineProps<{
    modelValue?: WeekAvailability;
    defaultValue?: WeekAvailability;
    step?: number;
    disabled?: boolean;
  }>(),
  { step: 30 },
);
const emit = defineEmits<{
  "update:modelValue": [value: WeekAvailability];
  change: [value: WeekAvailability];
}>();
const {
  week,
  reduce,
  options,
  openDay,
  openPanel,
  panel,
  enabled,
  time,
  add,
  remove,
  copy,
} = useSchedule(props, (value) => {
  emit("update:modelValue", value);
  emit("change", value);
});
const edges = ["start", "end"] as const;
</script>
<template>
  <div class="w-full max-w-xl divide-y divide-border">
    <motion.div
      v-for="day in WEEKDAYS"
      :key="day.key"
      :layout="reduce ? false : 'position'"
      :transition="SPRING_LAYOUT"
      :style="{ zIndex: openDay === day.key ? 1 : undefined }"
      class="relative flex flex-wrap items-start gap-3 py-4 sm:flex-nowrap sm:gap-4"
    >
      <div
        class="order-1 flex flex-1 items-center gap-2.5 sm:w-36 sm:flex-none sm:pt-1"
      >
        <Switch
          :model-value="week[day.key].enabled"
          :disabled="disabled"
          :aria-label="`Toggle ${day.label} availability`"
          class="scale-90"
          @update:model-value="enabled(day.key, $event)"
        /><span class="text-sm font-medium">{{ day.label }}</span>
      </div>
      <div
        class="order-3 flex w-full min-w-0 flex-col gap-2 sm:order-2 sm:w-auto sm:flex-1"
      >
        <AnimatePresence :initial="false" mode="popLayout"
          ><template v-if="week[day.key].enabled"
            ><motion.div
              v-for="(range, index) in week[day.key].ranges"
              :key="range.id"
              :layout="reduce ? false : 'position'"
              :style="{
                zIndex: openPanel?.startsWith(`${day.key}:${range.id}:`)
                  ? 1
                  : undefined,
              }"
              :initial="
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, y: -6, filter: 'blur(4px)' }
              "
              :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
              :exit="
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, y: -4, filter: 'blur(4px)' }
              "
              :transition="SPRING_LAYOUT"
              class="relative flex items-center gap-2"
            >
              <template v-for="edge in edges" :key="edge"
                ><span v-if="edge === 'end'" class="text-muted-foreground"
                  >–</span
                >
                <div class="min-w-0 flex-1 sm:max-w-[132px]">
                  <TimeSelect
                    :value="range[edge]"
                    :label="`${day.label} ${edge} time ${index + 1}`"
                    :options="
                      edge === 'start'
                        ? startOptions(options, range.end, range.start)
                        : endOptions(options, range.start, range.end)
                    "
                    :open="openPanel === panelKey(day.key, range.id, edge)"
                    :disabled="disabled"
                    @change="time(day.key, index, edge, $event)"
                    @update:open="panel(day.key, range.id, edge, $event)"
                  /></div
              ></template>
              <Tooltip content="Remove"
                ><motion.button
                  type="button"
                  :disabled="disabled"
                  :aria-label="`Remove ${day.label} range ${index + 1}`"
                  class="flex size-8 items-center justify-center rounded-lg text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
                  :while-press="reduce ? undefined : { scale: 0.92 }"
                  :transition="SPRING_PRESS"
                  @click="remove(day.key, range.id)"
                  ><X
                    class="size-4" /></motion.button></Tooltip></motion.div></template
          ><motion.span
            v-else
            key="unavailable"
            :layout="reduce ? false : 'position'"
            :initial="reduce ? { opacity: 0 } : { opacity: 0, y: -4 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="reduce ? { opacity: 0 } : { opacity: 0, y: -4 }"
            :transition="SPRING_LAYOUT"
            class="py-1 text-sm text-muted-foreground sm:py-2"
            >Unavailable</motion.span
          ></AnimatePresence
        >
      </div>
      <div class="order-2 flex shrink-0 items-center gap-1 pt-0.5 sm:order-3">
        <Tooltip content="Add time"
          ><motion.button
            type="button"
            :disabled="disabled"
            :aria-label="`Add time range to ${day.label}`"
            class="flex size-8 items-center justify-center rounded-lg text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
            :while-press="reduce ? undefined : { scale: 0.92 }"
            :transition="SPRING_PRESS"
            @click="add(day.key)"
            ><Plus class="size-4" /></motion.button></Tooltip
        ><CopyMenu
          :from-label="day.label"
          :disabled="disabled"
          :reduce="reduce"
          @apply="copy(day.key, $event)"
        />
      </div>
    </motion.div>
  </div>
</template>
