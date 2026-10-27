<script setup lang="ts">
import { computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import {
  AlertCircle,
  CheckCircle2,
  FileIcon,
  Loader2,
  RotateCcw,
  X,
} from "lucide-vue-next";
import { useReducedMotion } from "../../../lib/composables";
import { EASE_OUT } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import type { FileUploadItem } from "./types";
import type { FileUploadClassNames } from "./source-types";
import {
  clampProgress,
  fileKind,
  getFileIcon,
  formatBytes,
  STATUS_LABEL,
  STATUS_TONE,
} from "./file-utils";
const props = defineProps<{
  item: FileUploadItem;
  classNames?: FileUploadClassNames;
}>();
const emit = defineEmits<{
  remove: [item: FileUploadItem];
  retry: [item: FileUploadItem];
}>();
const reduce = useReducedMotion(),
  status = computed(() => props.item.status ?? "queued"),
  progress = computed(() => clampProgress(props.item.progress, status.value));
const statusIcon = computed(
  () =>
    ({
      success: CheckCircle2,
      error: AlertCircle,
      uploading: Loader2,
      queued: FileIcon,
    })[status.value],
);
const actionClass =
  "grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95";
</script>
<template>
  <motion.li
    :layout="!reduce"
    :initial="
      reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(8px)' }
    "
    :animate="{ opacity: 1, transform: 'translateY(0px)' }"
    :exit="
      reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-6px)' }
    "
    :transition="{ duration: 0.22, ease: EASE_OUT }"
    :class="
      cn(
        'relative overflow-hidden rounded-2xl border border-border bg-background p-3',
        classNames?.item,
      )
    "
    ><div class="flex items-center gap-3">
      <div
        :class="
          cn(
            'grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground',
            classNames?.leading,
          )
        "
      >
        <component :is="getFileIcon(item)" class="h-5 w-5" />
      </div>
      <div :class="cn('min-w-0 flex-1', classNames?.content)">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p
              :class="
                cn(
                  'truncate text-sm font-medium text-foreground',
                  classNames?.name,
                )
              "
            >
              {{ item.name }}
            </p>
            <p
              :class="
                cn('mt-0.5 text-xs text-muted-foreground', classNames?.meta)
              "
            >
              {{ fileKind(item) }} · {{ formatBytes(item.size)
              }}{{ status === "error" && item.error ? " · " + item.error : "" }}
            </p>
          </div>
          <div class="flex shrink-0 items-center gap-1">
            <AnimatePresence mode="wait" :initial="false"
              ><motion.span
                :key="status"
                :initial="
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, transform: 'translateY(4px)' }
                "
                :animate="{ opacity: 1, transform: 'translateY(0px)' }"
                :exit="
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, transform: 'translateY(-4px)' }
                "
                :transition="{ duration: 0.16, ease: EASE_OUT }"
                :class="
                  cn('grid h-6 w-6 place-items-center', STATUS_TONE[status])
                "
                ><component
                  :is="statusIcon"
                  :class="
                    cn(
                      'h-4 w-4',
                      status === 'uploading' && 'animate-spin',
                      status === 'uploading' && reduce && 'animate-none',
                    )
                  "
                /><span class="sr-only">{{
                  STATUS_LABEL[status]
                }}</span></motion.span
              ></AnimatePresence
            ><button
              v-if="status === 'error'"
              type="button"
              @click="emit('retry', item)"
              :aria-label="'Retry ' + item.name"
              :class="cn(actionClass, classNames?.action)"
            >
              <RotateCcw class="h-3.5 w-3.5" /></button
            ><button
              type="button"
              @click="emit('remove', item)"
              :aria-label="'Remove ' + item.name"
              :class="cn(actionClass, classNames?.action)"
            >
              <X class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div
          v-if="status === 'uploading' || status === 'success'"
          role="progressbar"
          :aria-valuemin="0"
          :aria-valuemax="100"
          :aria-valuenow="Math.round(progress)"
          :aria-label="item.name + ' upload progress'"
          :class="
            cn(
              'mt-3 h-1.5 overflow-hidden rounded-full bg-muted',
              classNames?.progress,
            )
          "
        >
          <motion.div
            :class="
              cn(
                'h-full rounded-full',
                status === 'success' ? 'bg-emerald-500' : 'bg-foreground',
              )
            "
            :style="{
              transformOrigin: 'left',
              transform: reduce ? `scaleX(${progress / 100})` : undefined,
            }"
            :initial="false"
            :animate="
              reduce ? undefined : { transform: `scaleX(${progress / 100})` }
            "
            :transition="{ duration: 0.28, ease: EASE_OUT }"
          />
        </div>
      </div></div
  ></motion.li>
</template>
