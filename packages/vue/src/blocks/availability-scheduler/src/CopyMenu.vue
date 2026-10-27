<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { Copy, Check } from "lucide-vue-next";
import { Checkbox } from "../../../motion/checkbox";
import {
  MorphPopover,
  MorphPopoverTrigger,
  MorphPopoverContent,
} from "../../../motion/popover";
import { Tooltip } from "../../../motion/tooltip";
import { SPRING_PRESS } from "../../../lib/ease";
import { WEEKDAYS, type DayKey } from "./types";
const props = defineProps<{
    fromLabel: string;
    reduce: boolean;
    disabled?: boolean;
  }>(),
  emit = defineEmits<{ apply: [targets: DayKey[]] }>();
const open = ref(false),
  copied = ref(false),
  picked = ref(new Set<DayKey>()),
  others = computed(() =>
    WEEKDAYS.filter((day) => day.label !== props.fromLabel),
  );
let reset: ReturnType<typeof setTimeout> | undefined;
function toggle(id: DayKey) {
  const selection = new Set(picked.value);
  if (selection.has(id)) selection.delete(id);
  else selection.add(id);
  picked.value = selection;
}
function apply(targets: DayKey[]) {
  if (!targets.length) return;
  emit("apply", targets);
  open.value = false;
  picked.value = new Set();
  copied.value = true;
  clearTimeout(reset);
  reset = setTimeout(() => {
    copied.value = false;
  }, 1200);
}
onBeforeUnmount(() => clearTimeout(reset));
</script>
<template>
  <MorphPopover v-model:open="open"
    ><Tooltip content="Copy times"
      ><MorphPopoverTrigger
        ><motion.button
          type="button"
          :disabled="disabled"
          :aria-label="`Copy ${fromLabel} hours to other days`"
          class="flex size-8 items-center justify-center rounded-lg text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
          :while-press="reduce ? undefined : { scale: 0.92 }"
          :transition="SPRING_PRESS"
          ><AnimatePresence mode="popLayout" :initial="false"
            ><motion.span
              :key="copied ? 'done' : 'copy'"
              :initial="reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5 }"
              :animate="{ opacity: 1, scale: 1 }"
              :exit="reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5 }"
              :transition="SPRING_PRESS"
              ><component
                :is="copied ? Check : Copy"
                class="size-4" /></motion.span></AnimatePresence></motion.button></MorphPopoverTrigger></Tooltip
    ><MorphPopoverContent align="end" class="w-52 p-2"
      ><p class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
        Copy times to
      </p>
      <div class="flex flex-col">
        <Checkbox
          v-for="day in others"
          :key="day.key"
          :model-value="picked.has(day.key)"
          :label="day.label"
          :aria-label="day.label"
          class="w-full flex-row-reverse justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-muted [&_button]:size-4 [&_button]:rounded-[5px] [&_button]:border"
          @update:model-value="toggle(day.key)"
        />
      </div>
      <div
        class="mt-1 flex items-center gap-2 border-t border-border px-1 pt-2"
      >
        <button
          type="button"
          class="flex-1 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          @click="apply(others.map((day) => day.key))"
        >
          Every day</button
        ><button
          type="button"
          :disabled="!picked.size"
          class="flex-1 rounded-lg bg-primary px-2 py-1.5 text-xs font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
          @click="apply([...picked])"
        >
          Apply
        </button>
      </div></MorphPopoverContent
    ></MorphPopover
  >
</template>
