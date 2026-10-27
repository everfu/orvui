<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { motion, AnimatePresence, LayoutGroup } from "motion-v";
import { Upload } from "lucide-vue-next";
import { useReducedMotion } from "../../../lib/composables";
import { SPRING_PRESS, EASE_OUT } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import type {
  AttachmentUploadItem,
  AttachmentRejectReason,
} from "./attachment-types";
import type { AttachmentUploadClassNames } from "./source-types";
import { useAttachmentQueue } from "./use-attachment-queue";
import AttachmentRow from "./AttachmentRow.vue";
import AttachmentPreview from "./AttachmentPreview.vue";
const props = withDefaults(
  defineProps<{
    modelValue?: AttachmentUploadItem[];
    value?: AttachmentUploadItem[];
    defaultValue?: AttachmentUploadItem[];
    playingId?: string;
    accept?: string;
    multiple?: boolean;
    maxFiles?: number;
    maxFileSize?: number;
    disabled?: boolean;
    title?: string;
    description?: string;
    attachmentsLabel?: string;
    className?: string;
    classNames?: AttachmentUploadClassNames;
    onRetry?: (item: AttachmentUploadItem) => void;
  }>(),
  {
    defaultValue: () => [],
    multiple: true,
    maxFiles: 12,
    maxFileSize: 500 * 1024 * 1024,
    disabled: false,
    title: "Drag and drop or browse files",
    attachmentsLabel: "Attachments",
  },
);
const emit = defineEmits<{
  "update:modelValue": [items: AttachmentUploadItem[]];
  valueChange: [items: AttachmentUploadItem[]];
  filesAdded: [items: AttachmentUploadItem[], files: File[]];
  filesRejected: [files: File[], reason: AttachmentRejectReason];
  remove: [item: AttachmentUploadItem];
  retry: [item: AttachmentUploadItem];
  audioToggle: [item: AttachmentUploadItem];
}>();
const input = ref<HTMLInputElement>(),
  reduce = useReducedMotion(),
  id = useId();
const {
  items,
  preview,
  uploading,
  complete,
  removing,
  maxReached,
  uploadOrder,
  add,
  remove,
  dragging,
  drag,
} = useAttachmentQueue(props, () => reduce.value, emit);
const maxSize = computed(() => {
  const size = props.maxFileSize / 1024 ** 2;
  return (Number.isInteger(size) ? size : size.toFixed(1)) + " MB";
});
function changed(event: Event) {
  const field = event.target as HTMLInputElement;
  add(Array.from(field.files ?? []));
  field.value = "";
}
</script>
<template>
  <LayoutGroup :id="id"
    ><div :class="cn('w-full', className)">
      <input
        ref="input"
        :id="id"
        type="file"
        aria-label="Upload attachments"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled || maxReached"
        :tabindex="-1"
        class="sr-only"
        @change="changed"
      /><motion.button
        type="button"
        :disabled="disabled || maxReached"
        :data-dragging="dragging"
        :animate="reduce ? undefined : { scale: dragging ? 1.006 : 1 }"
        :while-press="reduce ? undefined : { scale: 0.995 }"
        :transition="SPRING_PRESS"
        @click="input?.click()"
        @dragenter="drag($event, 'enter')"
        @dragover="drag($event, 'over')"
        @dragleave="drag($event, 'leave')"
        @drop="drag($event, 'drop')"
        :class="
          cn(
            'group relative isolate flex min-h-52 w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-muted/65 p-2 text-center outline-none',
            'transition-colors duration-200 hover:bg-muted/85',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'data-[dragging=true]:bg-muted',
            'disabled:pointer-events-none disabled:opacity-55',
            classNames?.dropzone,
          )
        "
        ><span
          aria-hidden="true"
          class="absolute inset-2 -z-10 rounded-[1.5rem] border border-dashed border-muted-foreground/25 bg-background transition-[border-color,background-color] duration-200 group-hover:border-muted-foreground/45 group-data-[dragging=true]:border-foreground/65 group-data-[dragging=true]:bg-muted/20"
        /><motion.span
          aria-hidden="true"
          :animate="
            reduce
              ? undefined
              : { y: dragging ? -4 : 0, scale: dragging ? 1.08 : 1 }
          "
          :transition="{ duration: 0.2, ease: EASE_OUT }"
          class="mb-3 grid size-11 place-items-center rounded-2xl bg-muted text-foreground transition-colors duration-200 group-hover:bg-muted/80 group-data-[dragging=true]:bg-foreground group-data-[dragging=true]:text-background"
          ><Upload class="size-[18px]" /></motion.span
        ><span
          class="text-sm font-semibold tracking-[-0.01em] text-foreground"
          >{{ maxReached ? "Attachment limit reached" : title }}</span
        ><span class="mt-1 text-xs leading-5 text-muted-foreground">{{
          maxReached
            ? items.length + " of " + maxFiles + " attachments added"
            : (description ?? "Maximum " + maxSize + " file size")
        }}</span></motion.button
      >
      <section
        v-if="items.length"
        class="mt-8"
        :aria-labelledby="id + '-attachments'"
      >
        <h3
          :id="id + '-attachments'"
          class="text-sm font-semibold text-foreground"
        >
          {{ attachmentsLabel }}
        </h3>
        <ul :class="cn('mt-3 space-y-2', classNames?.list)">
          <AnimatePresence :initial="uploadOrder.length > 0"
            ><AttachmentRow
              v-for="item in items"
              :key="item.id"
              :item="item"
              :playing="playingId === item.id"
              :uploading="uploading.has(item.id) || item.status === 'uploading'"
              :upload-complete="
                complete.has(item.id) || item.status === 'complete'
              "
              :failed="item.status === 'failed'"
              :removing="removing.has(item.id)"
              :arrival-index="uploadOrder.indexOf(item.id)"
              :image-layout-id="reduce ? undefined : id + '-image-' + item.id"
              :retryable="!!onRetry"
              :reduce="reduce"
              :class-name="classNames?.row"
              @audio-toggle="emit('audioToggle', $event)"
              @preview="preview = $event"
              @remove="remove"
              @retry="emit('retry', $event)"
          /></AnimatePresence>
        </ul>
      </section>
      <AttachmentPreview
        :item="preview"
        :layout-id="
          reduce || !preview ? undefined : id + '-image-' + preview.id
        "
        :reduce="reduce"
        @close="preview = null"
      /></div
  ></LayoutGroup>
</template>
