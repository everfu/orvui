<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { UploadCloud } from "lucide-vue-next";
import { useReducedMotion } from "../../../lib/composables";
import { EASE_OUT } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import type { FileUploadItem, FileUploadVariant } from "./types";
import type { FileUploadClassNames } from "./source-types";
import { useFileQueue } from "./use-file-queue";
import FileUploadRow from "./FileUploadRow.vue";
const props = withDefaults(
  defineProps<{
    modelValue?: FileUploadItem[];
    value?: FileUploadItem[];
    defaultValue?: FileUploadItem[];
    accept?: string;
    multiple?: boolean;
    maxFiles?: number;
    disabled?: boolean;
    variant?: FileUploadVariant;
    title?: string;
    description?: string;
    browseLabel?: string;
    className?: string;
    classNames?: FileUploadClassNames;
  }>(),
  {
    defaultValue: () => [],
    multiple: true,
    disabled: false,
    variant: "default",
    title: "Drop files here",
    description: "Add files to the upload queue",
    browseLabel: "Browse",
  },
);
const emit = defineEmits<{
  "update:modelValue": [items: FileUploadItem[]];
  valueChange: [items: FileUploadItem[]];
  filesAdded: [items: FileUploadItem[], files: File[]];
  remove: [item: FileUploadItem];
  retry: [item: FileUploadItem];
  reject: [files: File[]];
}>();
const input = ref<HTMLInputElement>(),
  reduce = useReducedMotion(),
  id = useId();
const { items, maxReached, add, remove, retry, dragging, drag } = useFileQueue(
  props,
  emit,
);
const centered = computed(() => props.variant === "centered");
function changed(event: Event) {
  const field = event.target as HTMLInputElement;
  add(Array.from(field.files ?? []));
  field.value = "";
}
</script>
<template>
  <div :class="cn('w-full space-y-3', className, classNames?.root)">
    <input
      ref="input"
      :id="id"
      type="file"
      aria-label="Upload files"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled || maxReached"
      :tabindex="-1"
      class="sr-only"
      @change="changed"
    /><button
      type="button"
      :disabled="disabled || maxReached"
      :data-dragging="dragging"
      @click="input?.click()"
      @dragenter="drag($event, 'enter')"
      @dragover="drag($event, 'over')"
      @dragleave="drag($event, 'leave')"
      @drop="drag($event, 'drop')"
      :class="
        cn(
          'group relative flex w-full overflow-hidden rounded-3xl border border-dashed border-border bg-background outline-none',
          'transition-[border-color,transform] duration-200 active:scale-[0.99]',
          'hover:border-foreground/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'data-[dragging=true]:border-foreground',
          'disabled:pointer-events-none disabled:opacity-55',
          centered
            ? 'min-h-56 flex-col items-center justify-center gap-3 p-7 text-center'
            : 'items-center gap-4 p-5 text-left',
          classNames?.dropzone,
        )
      "
    >
      <motion.span
        aria-hidden="true"
        :class="
          cn(
            'grid shrink-0 place-items-center bg-muted text-foreground',
            centered
              ? 'h-16 w-16 rounded-[1.35rem] border border-border'
              : 'h-14 w-14 rounded-[1.25rem]',
          )
        "
        :animate="
          reduce
            ? undefined
            : { transform: dragging ? 'translateY(-2px)' : 'translateY(0px)' }
        "
        :transition="{ duration: 0.16, ease: EASE_OUT }"
        ><UploadCloud :class="centered ? 'h-7 w-7' : 'h-6 w-6'" /></motion.span
      ><span :class="cn('min-w-0', centered ? 'max-w-xs' : 'flex-1')"
        ><span
          :class="
            cn(
              'block font-semibold text-foreground',
              centered ? 'text-base' : 'text-sm',
            )
          "
          >{{ maxReached ? "Upload limit reached" : title }}</span
        ><span
          :class="
            cn(
              'block text-xs text-muted-foreground',
              centered ? 'mt-1 leading-5' : 'mt-0.5',
            )
          "
          >{{
            maxReached
              ? items.length + " of " + maxFiles + " files added"
              : description
          }}</span
        ></span
      ><span
        :class="
          cn(
            'shrink-0 rounded-full border border-border text-xs font-medium text-foreground transition-colors duration-150 group-hover:bg-muted',
            centered ? 'mt-1 px-4 py-2' : 'px-3.5 py-2',
          )
        "
        >{{ browseLabel }}</span
      >
    </button>
    <ul :class="cn('space-y-2', classNames?.queue)">
      <AnimatePresence :initial="false"
        ><FileUploadRow
          v-for="item in items"
          :key="item.id"
          :item="item"
          :class-names="classNames"
          @remove="remove"
          @retry="retry"
      /></AnimatePresence>
    </ul>
  </div>
</template>
