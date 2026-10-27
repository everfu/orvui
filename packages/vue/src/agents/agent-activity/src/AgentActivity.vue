<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  watch,
  type VNodeChild,
} from "vue";
import { AnimatePresence, motion } from "motion-v";
import { ChevronDown } from "lucide-vue-next";
import { resolveElement, useReducedMotion } from "../../../lib/composables";
import { EASE_OUT, SPRING_LAYOUT, SPRING_SWAP } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { RenderNode, useControllable, type Content } from "../../shared";
import { ThinkingShimmer } from "../../loading-states";
import AgentDisclosure from "../../AgentDisclosure.vue";
import ActivityRow from "./ActivityRow.vue";
import { activityKind, activitySummary } from "./summary";
import type {
  AgentActivityContentType,
  AgentActivityItem,
  AgentActivityStatus,
} from "./types";
defineSlots<{
  "working-status"?: (context: {
    label: Content;
    duration: number;
  }) => VNodeChild;
  "completed-status"?: (context: {
    summary: Content;
    duration: number;
  }) => VNodeChild;
}>();
const props = withDefaults(
  defineProps<{
    items: AgentActivityItem[];
    contentType?: AgentActivityContentType;
    status?: AgentActivityStatus;
    duration?: number;
    open?: boolean;
    defaultOpen?: boolean;
    collapseOnComplete?: boolean;
    activeLabel?: Content;
    summary?: Content;
    maxHeight?: number;
    contentClassName?: string;
  }>(),
  {
    open: undefined,
    activeLabel: undefined,
    summary: undefined,
    status: "working",
    duration: 0,
    defaultOpen: false,
    collapseOnComplete: true,
    maxHeight: 208,
  },
);
const emit = defineEmits<{
  "update:open": [open: boolean];
  openChange: [open: boolean];
}>();
const disclosure = useControllable(
  () => props.open,
  props.defaultOpen,
  (value) => {
    emit("update:open", value);
    emit("openChange", value);
  },
);
const working = computed(() => props.status === "working");
const expanded = computed(() => working.value || disclosure.value);
const kind = computed(() => activityKind(props.items, props.contentType));
const label = computed(
  () =>
    props.activeLabel ??
    {
      search: "Searching the web…",
      tool: "Running tools…",
      trace: "Working through the run…",
      mixed: "Working through it…",
      step: "Thinking…",
      text: "Thinking…",
    }[kind.value],
);
const summary = computed(
  () =>
    props.summary ?? activitySummary(props.items, kind.value, props.duration),
);
const reduced = useReducedMotion();
const identity = useId();
const content = ref<unknown>();
const viewport = ref<HTMLElement>();
const measuredHeight = ref(0);
const height = computed(() =>
  working.value
    ? Math.max(0, props.maxHeight)
    : Math.min(Math.max(0, props.maxHeight), measuredHeight.value),
);
const capped = computed(() => measuredHeight.value > props.maxHeight);
const offset = computed(() =>
  working.value ? Math.min(0, height.value - measuredHeight.value) : 0,
);
const mask = computed(() =>
  !capped.value
    ? undefined
    : working.value
      ? "linear-gradient(to bottom, transparent, black 12px)"
      : "linear-gradient(to bottom, transparent, black 12px, black calc(100% - 12px), transparent)",
);
let observer: ResizeObserver | undefined;
let queued: number | undefined;
watch(
  () => props.status,
  (status, previous) => {
    if (previous === "working" && status === "complete")
      disclosure.value = !props.collapseOnComplete;
  },
);
function toggle() {
  disclosure.value = !disclosure.value;
  if (queued !== undefined) cancelAnimationFrame(queued);
  if (disclosure.value)
    queued = requestAnimationFrame(() => {
      queued = undefined;
      viewport.value?.scrollTo?.({ top: 0 });
    });
}
onMounted(() => {
  const element = resolveElement<HTMLElement>(content.value);
  if (!element) return;
  const measure = () => {
    measuredHeight.value = element.offsetHeight;
  };
  measure();
  if (typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(measure);
    observer.observe(element);
  }
});
onBeforeUnmount(() => {
  observer?.disconnect();
  if (queued !== undefined) cancelAnimationFrame(queued);
});
</script>
<template>
  <div
    :data-state="working ? 'working' : expanded ? 'open' : 'closed'"
    :data-content="kind"
    :aria-busy="working"
    class="w-full text-sm"
  >
    <div
      v-if="working"
      :id="`${identity}-trigger`"
      role="status"
      class="flex h-7 min-w-0 items-center text-muted-foreground"
    >
      <slot name="working-status" :label="label" :duration="duration"
        ><ThinkingShimmer><RenderNode :node="label" /></ThinkingShimmer
      ></slot>
    </div>
    <button
      v-else
      :id="`${identity}-trigger`"
      type="button"
      :aria-expanded="expanded"
      :aria-controls="`${identity}-content`"
      @click="toggle"
      class="group flex h-7 min-w-0 items-center gap-1.5 rounded-md text-left font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span class="truncate"
        ><slot name="completed-status" :summary="summary" :duration="duration"
          ><RenderNode :node="summary" /></slot></span
      ><motion.span
        aria-hidden="true"
        class="inline-flex shrink-0 text-muted-foreground/70 group-hover:text-foreground"
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
      :open-height="height"
      ><div
        ref="viewport"
        :class="
          cn(
            'scrollbar-hide pr-1',
            capped && expanded && !working
              ? 'overflow-y-auto'
              : 'overflow-y-hidden',
          )
        "
        :style="{
          height: `${height}px`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }"
      >
        <motion.div
          ref="content"
          role="list"
          :initial="false"
          :animate="{ y: offset }"
          :transition="reduced ? { duration: 0 } : SPRING_LAYOUT"
          :class="cn('space-y-0.5 py-2', contentClassName)"
          ><AnimatePresence mode="popLayout" as="div" class="contents">
            <motion.div
              v-for="item in items"
              :key="item.id"
              layout="position"
              role="listitem"
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
              ><ActivityRow :item="item"
            /></motion.div> </AnimatePresence
        ></motion.div></div
    ></AgentDisclosure>
  </div>
</template>
