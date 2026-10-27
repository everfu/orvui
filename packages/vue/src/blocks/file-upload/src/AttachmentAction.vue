<script setup lang="ts">
import { motion } from "motion-v";
import {
  AlertCircle,
  Check,
  LoaderCircle,
  RotateCcw,
  X,
} from "lucide-vue-next";
import { Tooltip } from "../../../motion/tooltip";
import { EASE_OUT, SPRING_PRESS } from "../../../lib/ease";
defineProps<{
  label: string;
  state: "idle" | "uploading" | "complete" | "failed" | "removing";
  retryable: boolean;
  reduce: boolean;
}>();
const emit = defineEmits<{ action: [] }>();
</script>
<template>
  <span
    v-if="state === 'uploading'"
    aria-hidden="true"
    class="size-9 shrink-0"
  /><Tooltip
    v-else-if="state === 'complete'"
    content="Upload complete"
    side="top"
    :delay="100"
    ><motion.span
      role="status"
      :aria-label="'Upload complete for ' + label"
      :initial="reduce ? { opacity: 0 } : { opacity: 0, scale: 0.75 }"
      :animate="{ opacity: 1, scale: 1 }"
      :transition="{ duration: 0.2, ease: EASE_OUT }"
      class="grid size-9 shrink-0 place-items-center rounded-xl text-emerald-600 dark:text-emerald-400"
      ><Check class="size-4" /></motion.span></Tooltip
  ><Tooltip
    v-else-if="state === 'removing'"
    content="Removing attachment"
    side="top"
    :delay="100"
    ><span
      role="status"
      :aria-label="'Removing ' + label"
      class="grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground"
      ><motion.span
        :animate="reduce ? undefined : { rotate: 360 }"
        :transition="{ duration: 0.7, ease: 'linear', repeat: Infinity }"
        class="grid place-items-center"
        ><LoaderCircle class="size-4" /></motion.span></span></Tooltip
  ><Tooltip
    v-else-if="state === 'failed' && !retryable"
    content="Upload failed"
    side="top"
    :delay="100"
    ><span
      role="status"
      :aria-label="'Upload failed for ' + label"
      class="grid size-9 shrink-0 place-items-center rounded-xl text-destructive"
      ><AlertCircle class="size-4" /></span></Tooltip
  ><Tooltip
    v-else
    :content="state === 'failed' ? 'Retry upload' : 'Remove attachment'"
    side="top"
    :delay="100"
    ><motion.button
      type="button"
      :aria-label="(state === 'failed' ? 'Retry ' : 'Remove ') + label"
      @click="emit('action')"
      :while-press="reduce ? undefined : { scale: 0.92 }"
      :transition="SPRING_PRESS"
      :class="[
        'grid size-9 shrink-0 place-items-center rounded-xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
        state === 'failed'
          ? 'text-destructive hover:bg-destructive/10'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      ]"
      ><RotateCcw v-if="state === 'failed'" class="size-4" /><X
        v-else
        class="size-4" /></motion.button
  ></Tooltip>
</template>
