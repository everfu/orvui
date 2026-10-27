<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  onUpdated,
  ref,
  useId,
  watch,
} from "vue";
import { motion } from "motion-v";
import {
  Ban,
  Braces,
  Check,
  ChevronDown,
  CircleCheck,
  CircleX,
  Copy,
  LoaderCircle,
  RotateCcw,
  SquareTerminal,
  Wrench,
} from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { SPRING_PRESS, SPRING_SWAP } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { ActionSwapRollText } from "../../../motion/action-swap";
import {
  RenderNode,
  useClipboard,
  useControllable,
  type Content,
} from "../../shared";
import { useStreamFollow } from "../../stream-follow";
import AgentDisclosure from "../../AgentDisclosure.vue";
export type ToolResultStatus = "running" | "success" | "error" | "cancelled";
export type ToolResultKind = "terminal" | "request" | "custom";
const props = withDefaults(
  defineProps<{
    tool: Content;
    title: Content;
    status?: ToolResultStatus;
    kind?: ToolResultKind;
    meta?: Content;
    icon?: Content;
    open?: boolean;
    defaultOpen?: boolean;
    collapseOnComplete?: boolean;
    maxHeight?: number;
    copyText?: string;
    onCopy?: () => void | Promise<void>;
    contentClassName?: string;
  }>(),
  {
    open: undefined,
    status: "running",
    kind: "custom",
    defaultOpen: true,
    collapseOnComplete: true,
    maxHeight: 220,
  },
);
const emit = defineEmits<{
  "update:open": [open: boolean];
  openChange: [open: boolean];
  retry: [];
}>();
const expanded = useControllable(
  () => props.open,
  props.defaultOpen,
  (value) => {
    emit("update:open", value);
    emit("openChange", value);
  },
);
const { copy, copied } = useClipboard(
  () => props.copyText ?? "",
  () =>
    props.onCopy
      ? props.onCopy()
      : navigator.clipboard.writeText(props.copyText ?? ""),
);
const reduced = useReducedMotion();
const identity = useId();
const instance = getCurrentInstance();
const viewport = ref<HTMLElement>();
const hasRetry = () => !!instance?.vnode.props?.onRetry;
const state = computed(
  () =>
    ({
      running: {
        label: "Running",
        classes: "text-blue-600 dark:text-blue-400",
        icon: LoaderCircle,
      },
      success: {
        label: "Completed",
        classes: "text-emerald-600 dark:text-emerald-400",
        icon: CircleCheck,
      },
      error: {
        label: "Failed",
        classes: "text-rose-600 dark:text-rose-400",
        icon: CircleX,
      },
      cancelled: {
        label: "Cancelled",
        classes: "text-muted-foreground",
        icon: Ban,
      },
    })[props.status],
);
const kindIcon = computed(
  () =>
    ({ terminal: SquareTerminal, request: Braces, custom: Wrench })[props.kind],
);
const valueKey = (value: Content, suffix: string) =>
  typeof value === "string" || typeof value === "number"
    ? String(value)
    : props.status + suffix;
watch(
  () => props.status,
  (value, previous) => {
    if (value === "running" && previous !== value) expanded.value = true;
    else if (previous === "running" && props.collapseOnComplete)
      expanded.value = false;
  },
);
const follow = useStreamFollow(
  viewport,
  () => expanded.value && props.status === "running",
  reduced,
  [expanded, () => props.status],
);
onUpdated(follow);
</script>
<template>
  <div
    :data-state="status"
    :aria-busy="status === 'running'"
    class="w-full text-sm"
  >
    <button
      :id="`${identity}-trigger`"
      type="button"
      :aria-expanded="expanded"
      :aria-controls="`${identity}-content`"
      @click="expanded = !expanded"
      class="group flex min-h-9 w-full items-center gap-2 rounded-md py-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span
        aria-hidden="true"
        class="grid size-4 shrink-0 place-items-center text-muted-foreground"
        ><RenderNode v-if="icon" :node="icon" /><component
          v-else
          :is="kindIcon"
          class="size-4"
      /></span>
      <span class="flex min-w-0 flex-1 items-baseline gap-2"
        ><span class="min-w-0 truncate font-medium text-foreground/90"
          ><ActionSwapRollText :value="valueKey(title, '')"
            ><RenderNode :node="title" /></ActionSwapRollText></span
        ><span v-if="meta" class="shrink-0 text-xs text-muted-foreground/60"
          ><ActionSwapRollText :value="valueKey(meta, '-meta')"
            ><RenderNode :node="meta" /></ActionSwapRollText></span
        ><span
          class="min-w-0 truncate font-mono text-[11px] text-muted-foreground/55"
          ><ActionSwapRollText :value="valueKey(tool, '-tool')"
            ><RenderNode :node="tool" /></ActionSwapRollText></span
      ></span>
      <span
        :class="
          cn(
            'inline-flex shrink-0 items-center gap-1 text-[11px] font-medium',
            state.classes,
          )
        "
        ><component
          :is="state.icon"
          :class="
            cn('size-3', status === 'running' && !reduced && 'animate-spin')
          "
        /><ActionSwapRollText :value="status">{{
          state.label
        }}</ActionSwapRollText></span
      >
      <motion.span
        aria-hidden="true"
        class="shrink-0 text-muted-foreground/70 transition-colors group-hover:text-muted-foreground"
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
      ><div class="pl-6 pt-1.5">
        <div class="overflow-hidden rounded-xl bg-muted/80">
          <div
            ref="viewport"
            role="log"
            aria-live="polite"
            class="scrollbar-hide overflow-y-auto"
            :style="{ maxHeight: `${maxHeight}px` }"
          >
            <div :class="cn('p-3', contentClassName)"><slot /></div>
          </div>
          <div
            v-if="copyText || onCopy || hasRetry()"
            class="flex items-center gap-0.5 px-2 pb-1.5"
          >
            <motion.button
              v-if="copyText || onCopy"
              type="button"
              :aria-label="copied ? 'Copied' : 'Copy result'"
              :title="copied ? 'Copied' : 'Copy result'"
              @click="copy"
              :while-press="reduced ? undefined : { scale: 0.9 }"
              :transition="SPRING_PRESS"
              class="grid size-7 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              ><Check v-if="copied" class="size-3.5" /><Copy
                v-else
                class="size-3.5"
            /></motion.button>
            <motion.button
              v-if="hasRetry()"
              type="button"
              aria-label="Run again"
              title="Run again"
              @click="emit('retry')"
              :while-press="reduced ? undefined : { scale: 0.9 }"
              :transition="SPRING_PRESS"
              class="grid size-7 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              ><RotateCcw class="size-3.5"
            /></motion.button>
            <span class="ml-auto text-[11px] text-muted-foreground/55"
              ><ActionSwapRollText :value="status">{{
                state.label
              }}</ActionSwapRollText></span
            >
          </div>
        </div>
      </div></AgentDisclosure
    >
  </div>
</template>
