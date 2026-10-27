<script setup lang="ts">
import { motion, AnimatePresence } from "motion-v";
import { X } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { RenderNode, type Content } from "../../shared";
import { SPRING_LAYOUT, SPRING_PRESS } from "../../../lib/ease";
import { useProjectFolder } from "./use-project-folder";
export interface ProjectFolderPreview {
  id: string;
  content: Content;
}
const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    previews?: ProjectFolderPreview[];
    count?: number;
    itemLabel?: string;
    open?: boolean;
    defaultOpen?: boolean;
    expanded?: boolean;
    defaultExpanded?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
  }>(),
  {
    open: undefined,
    expanded: undefined,
    description: "Updated recently",
    previews: () => [],
    itemLabel: "file",
    defaultOpen: false,
    defaultExpanded: false,
  },
);
defineOptions({ inheritAttrs: false });
const emit = defineEmits<{
  "update:open": [open: boolean];
  openChange: [open: boolean];
  "update:expanded": [expanded: boolean];
  expandedChange: [expanded: boolean];
  click: [];
}>();
const {
  expanded,
  reduce,
  root,
  folder,
  closeButton,
  closing,
  id,
  isOpen,
  previews,
  countText,
  expand,
  close,
  finishClose,
  enter,
  leave,
  focus,
  blur,
  transform,
} = useProjectFolder(props, {
  open(value) {
    emit("update:open", value);
    emit("openChange", value);
  },
  expanded(value) {
    emit("update:expanded", value);
    emit("expandedChange", value);
  },
  click() {
    emit("click");
  },
});
</script>
<template>
  <motion.button
    ref="folder"
    v-bind="$attrs"
    type="button"
    :disabled="disabled"
    :aria-label="ariaLabel"
    aria-haspopup="dialog"
    :aria-expanded="expanded"
    :data-open="isOpen"
    :data-expanded="expanded"
    :tabindex="expanded ? -1 : undefined"
    class="relative block h-56 w-72 select-none rounded-2xl text-left outline-none [perspective:1200px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
    :while-press="reduce || disabled ? undefined : { scale: 0.98 }"
    :transition="reduce ? { duration: 0 } : SPRING_PRESS"
    @pointerenter="enter"
    @pointerleave="leave"
    @focus="focus"
    @blur="blur"
    @click="expand"
  >
    <motion.span
      aria-hidden="true"
      class="absolute inset-0 rounded-2xl border border-foreground/10 bg-background/25 backdrop-blur-xl [transform-origin:center_bottom]"
      :animate="{ rotateX: isOpen && !reduce ? 15 : 0 }"
      :transition="reduce ? { duration: 0 } : SPRING_LAYOUT"
    />
    <span aria-hidden="true" class="pointer-events-none absolute inset-0"
      ><span class="absolute left-1/2 top-0 block h-0 w-0"
        ><AnimatePresence :initial="false" as="span" class="contents"
          ><template v-if="!expanded"
            ><motion.span
              v-for="(preview, index) in previews"
              :key="preview.id"
              :layout-id="id + '-file-' + preview.id"
              :initial="false"
              :animate="transform(index)"
              :transition="reduce ? { duration: 0 } : SPRING_LAYOUT"
              :style="{
                zIndex: 10 - Math.abs(index - (previews.length - 1) / 2),
              }"
              class="absolute left-0 top-0 -ml-12 block h-40 w-24 overflow-hidden rounded-lg border border-foreground/10 bg-background/45 backdrop-blur-lg"
              @layout-animation-complete="
                closing && index === 0 && finishClose()
              "
              ><slot name="preview" :preview="preview"
                ><RenderNode
                  :node="
                    preview.content
                  " /></slot></motion.span></template></AnimatePresence></span
    ></span>
    <motion.span
      :initial="false"
      :animate="{ rotateX: isOpen && !reduce ? -25 : 0 }"
      :transition="reduce ? { duration: 0 } : SPRING_LAYOUT"
      class="absolute inset-x-0 bottom-0 z-20 overflow-hidden rounded-2xl border border-foreground/10 bg-background/60 backdrop-blur-2xl [backface-visibility:hidden] [transform-origin:center_bottom]"
      ><span class="flex h-16 items-center px-4"
        ><span
          class="line-clamp-2 text-xl font-medium leading-tight text-foreground"
          >{{ title }}</span
        ></span
      ><span
        class="flex h-12 items-center justify-between gap-3 border-t border-foreground/10 px-4"
        ><span class="shrink-0 text-sm font-medium text-foreground/80">{{
          countText
        }}</span
        ><span class="truncate text-sm text-muted-foreground">{{
          description
        }}</span></span
      ></motion.span
    >
  </motion.button>
  <Teleport to="body" :disabled="!expanded && !closing"
    ><div class="contents">
      <AnimatePresence :initial="false" as="div" class="contents"
        ><motion.button
          v-if="expanded"
          key="backdrop"
          type="button"
          tabindex="-1"
          aria-label="Close file overlay"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="reduce ? { duration: 0 } : { duration: 0.18 }"
          class="fixed inset-0 z-50 cursor-default bg-background/80 backdrop-blur-xl"
          @click="close"
      /></AnimatePresence>
      <div
        v-if="expanded || closing"
        ref="root"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="id + '-title'"
        :aria-hidden="expanded ? undefined : true"
        :inert="!expanded"
        class="pointer-events-none fixed inset-x-6 inset-y-8 z-50 flex items-start justify-center overflow-y-auto sm:items-center"
      >
        <div
          :class="
            cn(
              'pointer-events-auto relative z-10 w-full max-w-[61rem]',
              closing && 'pointer-events-none',
            )
          "
        >
          <AnimatePresence :initial="false" as="div" class="contents"
            ><motion.div
              v-if="expanded"
              key="header"
              :initial="{ opacity: 0, y: reduce ? 0 : 8 }"
              :animate="{ opacity: 1, y: 0 }"
              :exit="{ opacity: 0, y: reduce ? 0 : -8 }"
              :transition="reduce ? { duration: 0 } : { duration: 0.18 }"
              class="mb-6 flex items-center justify-between gap-4"
              ><div>
                <h2
                  :id="id + '-title'"
                  class="text-xl font-medium text-foreground"
                >
                  {{ title }}
                </h2>
                <p class="mt-1 text-sm text-muted-foreground">
                  {{ countText }}
                </p>
              </div>
              <button
                ref="closeButton"
                type="button"
                :aria-label="'Close ' + title"
                class="flex size-10 items-center justify-center rounded-full border border-foreground/10 bg-background/50 text-muted-foreground backdrop-blur-xl transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                @click="close"
              >
                <X class="size-4" aria-hidden="true" /></button></motion.div
          ></AnimatePresence>
          <div
            class="grid grid-cols-2 place-items-center gap-3 sm:grid-cols-3 lg:grid-cols-5"
          >
            <template v-if="expanded"
              ><motion.div
                v-for="preview in previews"
                :key="preview.id"
                :layout-id="id + '-file-' + preview.id"
                :transition="reduce ? { duration: 0 } : SPRING_LAYOUT"
                class="aspect-[3/4] w-full max-w-40 overflow-hidden rounded-xl border border-foreground/10 bg-background/50 backdrop-blur-xl"
                ><slot name="preview" :preview="preview"
                  ><RenderNode :node="preview.content" /></slot></motion.div
            ></template>
          </div>
        </div>
      </div></div
  ></Teleport>
</template>
