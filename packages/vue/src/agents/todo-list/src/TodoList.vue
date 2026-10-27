<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { ChevronDown } from "lucide-vue-next";
import { ActionSwapRollText } from "../../../motion/action-swap";
import { EASE_OUT, SPRING_LAYOUT, SPRING_SWAP } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { useReducedMotion } from "../../../lib/composables";
import { RenderNode, useControllable, type Content } from "../../shared";
import { useStreamFollow } from "../../stream-follow";
import AgentDisclosure from "../../AgentDisclosure.vue";
import TodoHeaderIcon from "./TodoHeaderIcon.vue";
import TodoStatusIcon from "./TodoStatusIcon.vue";
export type TodoItemStatus =
  "pending" | "in-progress" | "completed" | "cancelled";
export interface TodoItem {
  id: string;
  title: Content;
  status?: TodoItemStatus;
  progress?: number;
  detail?: Content;
}
const props = withDefaults(
  defineProps<{
    items: TodoItem[];
    title?: Content;
    open?: boolean;
    defaultOpen?: boolean;
    collapseOnComplete?: boolean;
    maxHeight?: number;
  }>(),
  {
    open: undefined,
    title: "To-dos",
    defaultOpen: true,
    collapseOnComplete: true,
    maxHeight: 248,
  },
);
const emit = defineEmits<{
  "update:open": [open: boolean];
  openChange: [open: boolean];
}>();
const expanded = useControllable(
  () => props.open,
  props.defaultOpen,
  (value) => {
    emit("update:open", value);
    emit("openChange", value);
  },
);
const reduced = useReducedMotion();
const identity = useId();
const viewport = ref<HTMLElement>();
const completed = computed(() =>
  props.items.reduce(
    (count, item) => count + Number(item.status === "completed"),
    0,
  ),
);
const finished = computed(
  () => props.items.length > 0 && completed.value === props.items.length,
);
watch(finished, (value, previous) => {
  if (previous && !value) expanded.value = true;
  if (value && !previous && props.collapseOnComplete) expanded.value = false;
});
useStreamFollow(viewport, () => props.items.length > 0, reduced, [
  () => props.items.length,
]);
const descriptions: Record<TodoItemStatus, string> = {
  pending: "Pending",
  "in-progress": "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};
const tones: Record<TodoItemStatus, string> = {
  pending: "text-muted-foreground/65",
  "in-progress": "text-foreground",
  completed: "text-muted-foreground/60",
  cancelled: "text-muted-foreground/55",
};
</script>
<template>
  <section
    aria-label="Agent task list"
    class="w-full overflow-hidden rounded-2xl border border-border/70"
  >
    <button
      :id="`${identity}-trigger`"
      type="button"
      :aria-expanded="expanded"
      :aria-controls="`${identity}-content`"
      @click="expanded = !expanded"
      class="group flex h-11 w-full items-center gap-2.5 rounded-2xl px-3.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <TodoHeaderIcon :complete="finished" />
      <h3
        class="min-w-0 flex-1 truncate text-sm font-medium text-foreground/90"
      >
        <RenderNode :node="title" />
      </h3>
      <span
        :class="
          cn(
            'shrink-0 text-xs font-medium tabular-nums text-muted-foreground',
            finished && 'text-emerald-600 dark:text-emerald-400',
          )
        "
        ><span class="sr-only"
          >{{ completed }} of {{ items.length }} tasks completed</span
        ><span aria-hidden="true" class="inline-flex"
          ><ActionSwapRollText :value="String(completed)">{{
            completed
          }}</ActionSwapRollText
          ><span>/</span><span>{{ items.length }}</span></span
        ></span
      >
      <motion.span
        aria-hidden="true"
        class="text-muted-foreground/70 transition-colors group-hover:text-muted-foreground"
        :animate="{ rotate: expanded ? 180 : 0 }"
        :transition="reduced ? { duration: 0 } : SPRING_SWAP"
        ><ChevronDown class="size-3.5"
      /></motion.span>
    </button>
    <AgentDisclosure
      :id="`${identity}-content`"
      role="region"
      :aria-labelledby="`${identity}-trigger`"
      :open="expanded"
    >
      <div
        ref="viewport"
        class="scrollbar-hide overflow-y-auto px-2 pb-2"
        :style="{ maxHeight: `${maxHeight}px` }"
      >
        <ol v-if="items.length" aria-live="polite" class="space-y-0">
          <AnimatePresence :initial="false" mode="popLayout">
            <motion.li
              v-for="item in items"
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
              class="flex min-h-9 items-center gap-2.5 rounded-xl px-1.5 py-1"
            >
              <TodoStatusIcon
                :status="item.status ?? 'pending'"
                :progress="item.progress"
              /><span class="sr-only"
                >{{ descriptions[item.status ?? "pending"] }}:
              </span>
              <span
                :class="
                  cn(
                    'min-w-0 flex-1 truncate text-sm leading-5',
                    tones[item.status ?? 'pending'],
                  )
                "
                ><span class="relative inline-block max-w-full"
                  ><RenderNode :node="item.title" /><motion.span
                    aria-hidden="true"
                    :initial="false"
                    :animate="{
                      scaleX: item.status === 'completed' ? 1 : 0,
                      opacity: item.status === 'completed' ? 1 : 0,
                    }"
                    :transition="
                      reduced
                        ? { duration: 0 }
                        : { duration: 0.28, ease: EASE_OUT, delay: 0.06 }
                    "
                    class="absolute inset-x-0 top-1/2 h-px origin-left bg-current" /></span
              ></span>
              <span
                v-if="item.detail"
                class="shrink-0 text-sm text-muted-foreground/55"
                ><RenderNode :node="item.detail"
              /></span>
            </motion.li>
          </AnimatePresence>
        </ol>
        <p v-else class="px-1.5 py-2 text-sm text-muted-foreground">
          No tasks yet
        </p>
      </div>
    </AgentDisclosure>
  </section>
</template>
