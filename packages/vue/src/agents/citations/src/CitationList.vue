<script setup lang="ts">
import { useId } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { ExternalLink } from "lucide-vue-next";
import { EASE_OUT, SPRING_LAYOUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { RenderNode } from "../../shared";
import CitationFavicon from "./CitationFavicon.vue";
import type { CitationItem } from "./types";
const props = defineProps<{ citations: CitationItem[]; idPrefix?: string }>();
const instanceId = useId();
const reduced = useReducedMotion();
const rowId = (id: string) =>
  `${props.idPrefix ?? `citation-list-${instanceId.replace(/:/g, "")}`}-${id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
</script>
<template>
  <div class="grid gap-0.5">
    <AnimatePresence mode="popLayout" as="div" class="contents">
      <motion.div
        v-for="(item, index) in citations"
        :key="item.id"
        layout="position"
        :initial="reduced ? { opacity: 1 } : { opacity: 0, y: 6 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="reduced ? { opacity: 0 } : { opacity: 0, y: -3 }"
        :transition="
          reduced
            ? { duration: 0 }
            : {
                opacity: { duration: 0.18, ease: EASE_OUT },
                y: SPRING_LAYOUT,
                layout: SPRING_LAYOUT,
              }
        "
      >
        <component
          :is="item.url ? 'a' : 'div'"
          :id="rowId(item.id)"
          :href="item.url"
          :target="item.url ? '_blank' : undefined"
          :rel="item.url ? 'noreferrer noopener' : undefined"
          :tabindex="item.url ? undefined : -1"
          class="group/citation flex items-center gap-2 rounded-md px-1.5 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CitationFavicon :url="item.url" :icon="item.icon" />
          <span
            class="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5"
          >
            <span
              class="truncate text-sm font-medium text-foreground/80 transition-colors group-hover/citation:text-foreground"
              ><RenderNode :node="item.title"
            /></span>
            <span
              v-if="item.domain"
              class="min-w-0 truncate text-xs text-muted-foreground/60"
              ><RenderNode :node="item.domain"
            /></span>
          </span>
          <span class="flex shrink-0 items-center gap-1.5"
            ><span
              class="grid size-5 place-items-center rounded-md bg-foreground/[0.05] text-[10px] font-semibold tabular-nums text-muted-foreground"
              >{{ index + 1 }}</span
            >
            <ExternalLink
              v-if="item.url"
              class="size-3.5 text-muted-foreground/65 transition-colors group-hover/citation:text-muted-foreground group-focus-visible/citation:text-muted-foreground"
            />
          </span>
        </component>
      </motion.div>
    </AnimatePresence>
  </div>
</template>
