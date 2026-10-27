<script setup lang="ts">
import { computed, h } from "vue";
import { motion, AnimatePresence } from "motion-v";
import {
  ExternalLink,
  FileImage,
  Link,
  Mic,
  Paperclip,
  Pause,
  Play,
} from "lucide-vue-next";
import { Tooltip } from "../../../motion/tooltip";
import { EASE_OUT, SPRING_LAYOUT, SPRING_PRESS } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { formatBytes } from "./file-utils";
import { AUDIO_BARS, audioClock } from "./attachment-geometry";
import type { AttachmentUploadItem } from "./attachment-types";
import AttachmentAction from "./AttachmentAction.vue";
const props = defineProps<{
  item: AttachmentUploadItem;
  playing: boolean;
  uploading: boolean;
  uploadComplete: boolean;
  failed: boolean;
  removing: boolean;
  arrivalIndex: number;
  imageLayoutId?: string;
  retryable: boolean;
  reduce: boolean;
  className?: string;
}>();
const emit = defineEmits<{
  audioToggle: [item: AttachmentUploadItem];
  preview: [item: AttachmentUploadItem];
  remove: [item: AttachmentUploadItem];
  retry: [item: AttachmentUploadItem];
}>();
const source = computed(() =>
  props.item.kind === "image"
    ? (props.item.previewUrl ?? props.item.href)
    : undefined,
);
const progress = computed(() =>
  props.item.duration && props.item.duration > 0
    ? Math.min(
        1,
        Math.max(0, (props.item.currentTime ?? 0) / props.item.duration),
      )
    : 0,
);
const state = computed(() =>
  props.removing
    ? "removing"
    : props.uploading
      ? "uploading"
      : props.uploadComplete
        ? "complete"
        : props.failed
          ? "failed"
          : "idle",
);
const transition = computed(() => {
  const delay = Math.min(Math.max(props.arrivalIndex, 0), 5) * 0.055;
  return !props.reduce && props.arrivalIndex >= 0
    ? {
        ...SPRING_LAYOUT,
        delay,
        opacity: { duration: 0.16, ease: EASE_OUT, delay },
      }
    : { duration: 0.2, ease: EASE_OUT };
});
const thumbnail = computed(() =>
  h("span", { class: "block w-32" }, [
    h("img", {
      src: source.value,
      alt: "",
      class: "h-20 w-full rounded-lg object-cover",
    }),
    h(
      "span",
      {
        class:
          "block px-1 pb-0.5 pt-1 text-center text-[10px] font-medium text-muted-foreground",
      },
      "Click to preview",
    ),
  ]),
);
function action() {
  if (state.value === "failed") emit("retry", props.item);
  else emit("remove", props.item);
}
</script>
<template>
  <motion.li
    :layout="!reduce"
    :initial="
      reduce
        ? { opacity: 0 }
        : arrivalIndex >= 0
          ? { opacity: 0, y: -16, scale: 0.985 }
          : { opacity: 0, y: 6 }
    "
    :animate="{ opacity: 1, y: 0, scale: 1 }"
    :exit="reduce ? undefined : { opacity: 0, y: -4 }"
    :transition="transition"
    :class="
      cn(
        'flex min-h-14 items-center gap-1 rounded-2xl bg-muted/70 p-1',
        className,
      )
    "
    ><div
      class="relative isolate flex min-w-0 flex-1 items-center gap-3 self-stretch overflow-hidden rounded-xl bg-background px-2 py-1"
    >
      <span
        v-if="failed"
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 -z-10 bg-destructive/10"
      /><template v-if="item.kind === 'image'"
        ><Tooltip
          v-if="source"
          side="top"
          :delay="160"
          class="rounded-xl p-1 shadow-xl"
          :content="thumbnail"
          ><motion.button
            type="button"
            :aria-label="'Preview ' + item.name"
            @click="emit('preview', item)"
            :while-press="reduce ? undefined : { scale: 0.94 }"
            :transition="SPRING_PRESS"
            class="group/image relative size-9 shrink-0 overflow-hidden rounded-[10px] bg-muted outline-none ring-1 ring-border/70 focus-visible:ring-2 focus-visible:ring-ring"
            ><motion.img
              :layout-id="imageLayoutId"
              :src="source"
              alt=""
              class="size-full object-cover"
              :transition="{
                layout: SPRING_LAYOUT,
              }" /></motion.button></Tooltip
        ><span
          v-else
          aria-hidden="true"
          class="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground"
          ><FileImage class="size-4" /></span></template
      ><span
        v-else
        aria-hidden="true"
        class="grid size-7 shrink-0 place-items-center text-muted-foreground"
        ><Link v-if="item.kind === 'link'" class="size-4" /><Mic
          v-else-if="item.kind === 'audio'"
          class="size-4" /><Paperclip v-else class="size-4" /></span
      ><template v-if="item.kind === 'audio'"
        ><span
          class="w-9 shrink-0 text-xs tabular-nums text-muted-foreground"
          >{{ audioClock(item.currentTime) }}</span
        ><span
          aria-hidden="true"
          class="flex h-11 min-w-0 flex-1 items-center gap-[3px] overflow-hidden"
          ><motion.span
            v-for="(height, index) in AUDIO_BARS"
            :key="index"
            :class="
              cn(
                'w-[3px] shrink-0 rounded-full',
                index / AUDIO_BARS.length <= progress
                  ? 'bg-foreground'
                  : 'bg-muted-foreground/35',
              )
            "
            :style="{ height: height + 'px' }"
            :animate="
              reduce || !playing ? undefined : { scaleY: [0.72, 1, 0.78] }
            "
            :transition="{
              duration: 0.55,
              ease: EASE_OUT,
              repeat: Infinity,
              delay: index * 0.018,
            }" /></span
        ><span
          class="w-9 shrink-0 text-right text-xs tabular-nums text-muted-foreground"
          >{{ audioClock(item.duration) }}</span
        ><motion.button
          type="button"
          :aria-label="(playing ? 'Pause ' : 'Play ') + item.name"
          @click="emit('audioToggle', item)"
          :while-press="reduce ? undefined : { scale: 0.94 }"
          :transition="SPRING_PRESS"
          class="grid size-9 shrink-0 place-items-center rounded-full bg-foreground text-background outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          ><AnimatePresence mode="wait" :initial="false"
            ><motion.span
              :key="playing ? 'pause' : 'play'"
              :initial="reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }"
              :animate="{ opacity: 1, scale: 1 }"
              :exit="reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }"
              :transition="{ duration: 0.2, ease: EASE_OUT }"
              ><Pause v-if="playing" class="size-4 fill-current" /><Play
                v-else
                class="size-4 translate-x-px fill-current" /></motion.span></AnimatePresence></motion.button></template
      ><template v-else
        ><span class="min-w-0 flex-1"
          ><span class="block truncate text-sm font-medium text-foreground">{{
            item.name
          }}</span
          ><span
            v-if="failed"
            class="block truncate text-[11px] text-destructive"
            >{{ item.error ?? "Upload failed" }}</span
          ></span
        ><span class="shrink-0 text-xs text-muted-foreground">{{
          item.kind === "link"
            ? "Web"
            : item.size && item.size > 0
              ? formatBytes(item.size)
              : ""
        }}</span
        ><a
          v-if="item.kind === 'link' && item.href"
          :href="item.href"
          target="_blank"
          rel="noreferrer noopener"
          :aria-label="'Open ' + item.name"
          class="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          ><ExternalLink class="size-4" /></a></template
      ><AnimatePresence
        ><motion.span
          v-if="uploading || uploadComplete"
          role="progressbar"
          :aria-label="'Uploading ' + item.name"
          class="pointer-events-none absolute inset-0 -z-10 origin-left bg-emerald-400/25 dark:bg-emerald-500/20"
          :initial="{ opacity: 1, scaleX: 0 }"
          :animate="{ opacity: 1, scaleX: 1 }"
          :exit="reduce ? undefined : { opacity: 0 }"
          :transition="{ duration: reduce ? 0.1 : 0.9, ease: EASE_OUT }"
      /></AnimatePresence>
    </div>
    <AttachmentAction
      :label="item.name"
      :state="state"
      :retryable="retryable"
      :reduce="reduce"
      @action="action"
  /></motion.li>
</template>
