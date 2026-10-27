<script setup lang="ts">
import { computed } from "vue";
import { AnimatePresence, motion } from "motion-v";
import {
  Check,
  Circle,
  FileText,
  Globe2,
  ImageIcon,
  MessageSquare,
  PencilLine,
  Search,
  Sparkles,
  SquareTerminal,
  Wrench,
} from "lucide-vue-next";
import { EASE_OUT, SPRING_LAYOUT } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { useReducedMotion } from "../../../lib/composables";
import { RenderNode } from "../../shared";
import type { AgentActivityItem } from "./types";
const props = defineProps<{ item: AgentActivityItem }>();
const reduced = useReducedMotion();
const transition = computed(() =>
  reduced.value
    ? { duration: 0 }
    : {
        opacity: { duration: 0.18, ease: EASE_OUT },
        y: SPRING_LAYOUT,
        layout: SPRING_LAYOUT,
      },
);
const toolIcons = {
  read: FileText,
  edit: PencilLine,
  write: PencilLine,
  run: SquareTerminal,
};
const traceIcons = {
  thinking: Sparkles,
  message: MessageSquare,
  write: PencilLine,
  run: SquareTerminal,
  read: ImageIcon,
};
const icon = computed(() =>
  props.item.type === "tool"
    ? (toolIcons[props.item.action as keyof typeof toolIcons] ?? Wrench)
    : props.item.type === "trace"
      ? (traceIcons[props.item.kind as keyof typeof traceIcons] ?? Wrench)
      : Wrench,
);
</script>
<template>
  <div
    v-if="item.type === 'step'"
    class="flex min-h-7 items-start gap-2.5 rounded-md px-1.5 py-1"
  >
    <span
      aria-hidden="true"
      class="mt-0.5 grid size-4 shrink-0 place-items-center text-muted-foreground/70"
      ><Check
        v-if="!item.status || item.status === 'complete'"
        class="size-4"
        :stroke-width="1.8" /><span
        v-else-if="item.status === 'active'"
        class="relative grid size-3 place-items-center"
        ><motion.span
          class="absolute inset-0 rounded-full bg-foreground/10"
          :animate="
            reduced ? { opacity: 0.55 } : { opacity: [0.35, 0.8, 0.35] }
          "
          :transition="
            reduced ? { duration: 0 } : { duration: 1.5, repeat: Infinity }
          " /><span class="size-1.5 rounded-full bg-foreground/60" /></span
      ><Circle v-else class="size-3" :stroke-width="1.5" /></span
    ><span
      :class="
        cn(
          'min-w-0 flex-1 leading-5',
          item.status === 'pending'
            ? 'text-muted-foreground/55'
            : 'text-foreground/90',
        )
      "
      ><RenderNode :node="item.label" /></span
    ><span v-if="item.meta" class="shrink-0 leading-5 text-muted-foreground/55"
      ><RenderNode :node="item.meta"
    /></span>
  </div>
  <div
    v-else-if="item.type === 'text'"
    class="rounded-md px-1.5 py-1 leading-5 text-muted-foreground"
  >
    <RenderNode :node="item.content" />
  </div>
  <div v-else-if="item.type === 'search'" class="space-y-0.5">
    <div
      class="flex min-h-7 items-center gap-2.5 rounded-md px-1.5 py-1 text-muted-foreground"
    >
      <Search
        aria-hidden="true"
        class="size-4 shrink-0"
        :stroke-width="1.7"
      /><span class="min-w-0 truncate"><RenderNode :node="item.query" /></span>
    </div>
    <div v-if="item.results?.length" class="space-y-0.5 pl-4">
      <AnimatePresence mode="popLayout"
        ><motion.div
          v-for="result in item.results"
          :key="result.id"
          layout="position"
          :initial="reduced ? { opacity: 1 } : { opacity: 0, y: 6 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="reduced ? { opacity: 0 } : { opacity: 0, y: -3 }"
          :transition="transition"
        >
          <component
            :is="result.url ? 'a' : 'div'"
            :href="result.url"
            :class="
              cn(
                'flex min-h-7 items-center gap-2 rounded-md px-1.5 py-1 text-left outline-none transition-colors',
                result.url && 'focus-visible:ring-2 focus-visible:ring-ring',
              )
            "
            ><span
              aria-hidden="true"
              class="grid size-5 shrink-0 place-items-center text-muted-foreground"
              ><RenderNode v-if="result.icon" :node="result.icon" /><Globe2
                v-else
                class="size-3"
                :stroke-width="2" /></span
            ><span class="min-w-0 truncate font-medium text-foreground/90"
              ><RenderNode :node="result.title" /></span
            ><span
              v-if="result.domain"
              class="min-w-0 truncate text-muted-foreground/55"
              ><RenderNode :node="result.domain" /></span
          ></component> </motion.div
      ></AnimatePresence>
    </div>
    <AnimatePresence as="div" class="contents"
      ><motion.div
        v-if="item.moreCount"
        key="more-results"
        class="px-1.5 py-1 pl-8 text-muted-foreground/55"
        :initial="reduced ? { opacity: 1 } : { opacity: 0, y: 6 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="reduced ? { opacity: 0 } : { opacity: 0, y: -3 }"
        :transition="transition"
        >+{{ item.moreCount }} more</motion.div
      ></AnimatePresence
    >
  </div>
  <div
    v-else-if="item.type === 'tool'"
    class="flex min-h-8 min-w-0 items-center gap-2.5 rounded-md px-1.5 py-0.5 leading-5"
  >
    <span
      aria-hidden="true"
      class="grid size-4 shrink-0 place-items-center text-muted-foreground/70"
      ><component :is="icon" class="size-4" /></span
    ><span class="shrink-0 font-medium text-foreground/90">{{
      item.action[0].toUpperCase() + item.action.slice(1)
    }}</span
    ><span
      class="min-w-0 flex-1 truncate rounded-lg bg-muted/80 px-2.5 py-1 font-mono text-xs text-muted-foreground/70"
      ><RenderNode :node="item.target" /></span
    ><span
      v-if="
        typeof item.additions === 'number' || typeof item.deletions === 'number'
      "
      class="flex shrink-0 items-center gap-2 font-mono tabular-nums"
      ><span v-if="typeof item.additions === 'number'" class="text-emerald-500"
        >+{{ item.additions }}</span
      ><span v-if="typeof item.deletions === 'number'" class="text-rose-500"
        >−{{ item.deletions }}</span
      ></span
    >
  </div>
  <div
    v-else
    class="grid min-h-8 grid-cols-[1rem_auto_minmax(0,1fr)] items-center gap-2.5 rounded-md px-1.5 py-0.5"
  >
    <span
      aria-hidden="true"
      class="grid size-4 place-items-center text-muted-foreground/70"
      ><RenderNode v-if="item.icon" :node="item.icon" /><component
        v-else
        :is="icon"
        class="size-4" /></span
    ><span class="font-medium text-foreground/90"
      ><RenderNode :node="item.label" /></span
    ><span
      v-if="item.detail"
      class="min-w-0 truncate rounded-lg bg-muted/80 px-2.5 py-1 font-mono text-xs text-muted-foreground/70"
      ><RenderNode :node="item.detail" /></span
    ><span v-else />
  </div>
</template>
