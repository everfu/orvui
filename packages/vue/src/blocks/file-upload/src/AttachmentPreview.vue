<script setup lang="ts">
import { computed, ref } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { X } from "lucide-vue-next";
import { useOverlay } from "../../../lib/composables";
import { EASE_OUT, SPRING_LAYOUT, SPRING_PRESS } from "../../../lib/ease";
import type { AttachmentUploadItem } from "./attachment-types";
const props = defineProps<{
  item: AttachmentUploadItem | null;
  layoutId?: string;
  reduce: boolean;
}>();
const emit = defineEmits<{ close: [] }>();
const panel = ref<HTMLElement | null>(null),
  open = computed(() => props.item !== null),
  source = computed(() => props.item?.previewUrl ?? props.item?.href);
useOverlay(open, panel, () => emit("close"));
</script>
<template>
  <Teleport to="body" :disabled="!item"
    ><div class="contents" :inert="!item || undefined">
      <AnimatePresence as="div" class="contents"
        ><div
          v-if="item && source"
          key="preview"
          class="pointer-events-none fixed left-0 top-0 z-[10000] size-0"
        >
          <motion.button
            type="button"
            aria-label="Close image preview"
            :tabindex="-1"
            class="pointer-events-auto fixed inset-0 size-full cursor-default bg-black/45 backdrop-blur-xl"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="reduce ? undefined : { opacity: 0 }"
            :transition="{ duration: reduce ? 0.1 : 0.2, ease: EASE_OUT }"
            @click="emit('close')"
          />
          <div
            class="fixed inset-4 flex items-center justify-center sm:inset-8"
          >
            <motion.div
              ref="panel"
              role="dialog"
              aria-modal="true"
              :aria-label="'Preview of ' + item.name"
              :initial="{ opacity: 0 }"
              :animate="{ opacity: 1 }"
              :exit="reduce ? undefined : { opacity: 0 }"
              :transition="{ duration: 0.2, ease: EASE_OUT }"
              class="pointer-events-auto relative"
              ><motion.img
                :layout-id="reduce ? undefined : layoutId"
                :src="source"
                :alt="item.name"
                class="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
                :transition="{ layout: SPRING_LAYOUT }" /><motion.button
                type="button"
                aria-label="Close image preview"
                @click="emit('close')"
                :initial="reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }"
                :animate="{ opacity: 1, scale: 1 }"
                :exit="reduce ? undefined : { opacity: 0, scale: 0.8 }"
                :while-press="reduce ? undefined : { scale: 0.92 }"
                :transition="SPRING_PRESS"
                class="absolute -right-3 -top-3 grid size-9 place-items-center rounded-full bg-background text-foreground shadow-xl outline-none ring-1 ring-border/70 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                ><X class="size-4" /></motion.button
            ></motion.div>
          </div></div
      ></AnimatePresence></div
  ></Teleport>
</template>
