<script setup lang="ts">
import { computed, getCurrentInstance, useId, watch } from "vue";
import { AnimatePresence, motion } from "motion-v";
import {
  Check,
  ChevronDown,
  CircleAlert,
  LoaderCircle,
  ShieldCheck,
  X,
} from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { EASE_OUT, SPRING_PRESS, SPRING_SWAP } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { RenderNode, useControllable, type Content } from "../../shared";
import AgentDisclosure from "../../AgentDisclosure.vue";
export type ToolApprovalStatus =
  | "pending"
  | "approving"
  | "approved"
  | "denied"
  | "running"
  | "complete"
  | "error";
export interface ToolApprovalParameter {
  id: string;
  label: Content;
  value: Content;
}
const props = withDefaults(
  defineProps<{
    tool: Content;
    title?: Content;
    description?: Content;
    parameters?: ToolApprovalParameter[];
    status?: ToolApprovalStatus;
    open?: boolean;
    defaultOpen?: boolean;
  }>(),
  {
    open: undefined,
    title: "Allow this tool to run?",
    parameters: () => [],
    status: "pending",
    defaultOpen: false,
  },
);
const emit = defineEmits<{
  "update:open": [open: boolean];
  openChange: [open: boolean];
  approve: [];
  alwaysAllow: [];
  deny: [];
}>();
const expanded = useControllable(
  () => props.open,
  props.defaultOpen,
  (value) => {
    emit("update:open", value);
    emit("openChange", value);
  },
);
const identity = useId();
const instance = getCurrentInstance();
const reduced = useReducedMotion();
const busy = computed(() => ["approving", "running"].includes(props.status));
const successful = computed(() =>
  ["approved", "complete"].includes(props.status),
);
const label = computed(
  () =>
    ({
      pending: "Approval required",
      approving: "Approving",
      approved: "Approved",
      denied: "Denied",
      running: "Running",
      complete: "Completed",
      error: "Failed",
    })[props.status],
);
const tone = computed(() =>
  props.status === "pending"
    ? "amber"
    : busy.value
      ? "blue"
      : successful.value
        ? "emerald"
        : "rose",
);
const badgeClasses = {
  amber:
    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  blue: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  emerald:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rose: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
};
const hasAlways = () => !!instance?.vnode.props?.onAlwaysAllow;
watch(
  () => props.status,
  (value, previous) => {
    if (previous === "pending" && value !== previous) expanded.value = false;
  },
);
</script>
<template>
  <div
    :data-state="status"
    :aria-busy="busy"
    class="w-full overflow-hidden rounded-2xl border border-border/80 bg-muted/20 text-sm"
  >
    <div class="flex items-start gap-3 p-4">
      <span
        aria-hidden="true"
        :class="
          cn(
            'mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl border border-border/60 bg-background text-muted-foreground',
            status === 'error' && 'text-destructive',
          )
        "
      >
        <LoaderCircle
          v-if="busy"
          :class="cn('size-4', !reduced && 'animate-spin')"
        /><CircleAlert v-else-if="status === 'error'" class="size-4" /><X
          v-else-if="status === 'denied'"
          class="size-4"
        /><Check v-else-if="successful" class="size-4" /><ShieldCheck
          v-else
          class="size-4"
        />
      </span>
      <div class="min-w-0 flex-1">
        <div class="flex min-w-0 items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="font-medium text-foreground">
              <RenderNode :node="title" />
            </div>
            <div
              class="mt-0.5 truncate font-mono text-xs text-muted-foreground"
            >
              <RenderNode :node="tool" />
            </div>
          </div>
          <span
            :class="
              cn(
                'shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors',
                badgeClasses[tone],
              )
            "
            >{{ label }}</span
          >
        </div>
        <p v-if="description" class="mt-2 leading-5 text-muted-foreground">
          <RenderNode :node="description" />
        </p>
        <button
          v-if="parameters.length"
          type="button"
          :aria-expanded="expanded"
          :aria-controls="`${identity}-details`"
          @click="expanded = !expanded"
          class="mt-2 inline-flex items-center gap-1 rounded-md text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          View details<motion.span
            aria-hidden="true"
            :animate="{ rotate: expanded ? 180 : 0 }"
            :transition="reduced ? { duration: 0 } : SPRING_SWAP"
            ><ChevronDown class="size-3.5"
          /></motion.span>
        </button>
      </div>
    </div>
    <AgentDisclosure :id="`${identity}-details`" :open="expanded"
      ><dl
        class="mx-4 mb-4 grid gap-2 rounded-xl border border-border/50 bg-background/70 p-3"
      >
        <div
          v-for="parameter in parameters"
          :key="parameter.id"
          class="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-center gap-3 text-xs"
        >
          <dt class="text-muted-foreground">
            <RenderNode :node="parameter.label" />
          </dt>
          <dd class="min-w-0 break-words font-mono text-foreground/85">
            <RenderNode :node="parameter.value" />
          </dd>
        </div>
      </dl>
      <slot
    /></AgentDisclosure>
    <AnimatePresence :initial="false"
      ><motion.div
        v-if="status === 'pending'"
        :initial="reduced ? { opacity: 0 } : { opacity: 0, y: 4 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: reduced ? 0.12 : 0.22, ease: EASE_OUT }"
        class="flex flex-wrap items-center gap-2 border-t border-border/60 px-4 py-3"
      >
        <motion.button
          type="button"
          @click="emit('approve')"
          :while-press="reduced ? undefined : { scale: 0.97 }"
          :transition="SPRING_PRESS"
          class="rounded-xl bg-foreground px-3 py-1.5 text-xs font-medium text-background outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >Allow once</motion.button
        >
        <motion.button
          v-if="hasAlways()"
          type="button"
          @click="emit('alwaysAllow')"
          :while-press="reduced ? undefined : { scale: 0.97 }"
          :transition="SPRING_PRESS"
          class="rounded-xl border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >Always allow</motion.button
        >
        <button
          type="button"
          @click="emit('deny')"
          class="rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          Deny
        </button>
      </motion.div></AnimatePresence
    >
  </div>
</template>
