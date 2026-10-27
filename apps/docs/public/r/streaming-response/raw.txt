<script setup lang="ts">
import { computed, getCurrentInstance, useId } from "vue";
import { AnimatePresence, motion } from "motion-v";
import {
  Check,
  ChevronDown,
  Copy,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-vue-next";
import { EASE_OUT, SPRING_SWAP } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { useReducedMotion } from "../../../lib/composables";
import { CitationList, CitationStack, type CitationItem } from "../../citations";
import { useClipboard, useControllable } from "../../shared";
import AgentDisclosure from "../../AgentDisclosure.vue";
import ResponseAction from "./ResponseAction.vue";
export type StreamingResponseStatus = "streaming" | "complete" | "error";
export type StreamingResponseFeedback = "up" | "down" | null;
const props = withDefaults(
  defineProps<{
    status?: StreamingResponseStatus;
    copyText?: string;
    onCopy?: () => void | Promise<void>;
    sources?: CitationItem[];
    sourcesOpen?: boolean;
    defaultSourcesOpen?: boolean;
    sourceIdPrefix?: string;
    feedback?: StreamingResponseFeedback;
    defaultFeedback?: StreamingResponseFeedback;
    announce?: boolean;
    showActions?: boolean;
    contentClassName?: string;
    actionsClassName?: string;
  }>(),
  {
    status: "streaming",
    sources: () => [],
    sourcesOpen: undefined,
    defaultSourcesOpen: false,
    defaultFeedback: null,
    announce: true,
    showActions: true,
  },
);
const emit = defineEmits<{
  retry: [];
  "update:sourcesOpen": [open: boolean];
  sourcesOpenChange: [open: boolean];
  "update:feedback": [feedback: StreamingResponseFeedback];
  feedbackChange: [feedback: StreamingResponseFeedback];
}>();
const feedbackValue = useControllable(
  () => props.feedback,
  props.defaultFeedback,
  (value) => {
    emit("update:feedback", value);
    emit("feedbackChange", value);
  },
);
const expanded = useControllable(
  () => props.sourcesOpen,
  props.defaultSourcesOpen,
  (value) => {
    emit("update:sourcesOpen", value);
    emit("sourcesOpenChange", value);
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
const hasRetry = () => !!instance?.vnode.props?.onRetry;
const visible = computed(
  () =>
    props.showActions &&
    props.status !== "streaming" &&
    !!(
      props.copyText ||
      props.onCopy ||
      hasRetry() ||
      props.status === "complete" ||
      props.sources.length
    ),
);
function toggleFeedback(value: "up" | "down") {
  feedbackValue.value = feedbackValue.value === value ? null : value;
}
</script>
<template>
  <div :data-state="status" :aria-busy="status === 'streaming'" class="w-full">
    <div
      :aria-live="announce ? 'polite' : 'off'"
      :class="
        cn(
          'text-sm leading-6 text-foreground/90 [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_p+p]:mt-3 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/45 [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5',
          contentClassName,
        )
      "
    >
      <slot />
    </div>
    <AnimatePresence :initial="false"
      ><motion.div
        v-if="visible"
        class="mt-3"
        :initial="reduced ? { opacity: 0 } : { opacity: 0, y: 4 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: reduced ? 0.12 : 0.22, ease: EASE_OUT }"
      >
        <div :class="cn('flex items-center gap-0.5', actionsClassName)">
          <ResponseAction
            v-if="copyText || onCopy"
            :label="copied ? 'Copied' : 'Copy response'"
            @click="copy"
            ><Check v-if="copied" class="size-3.5" /><Copy
              v-else
              class="size-3.5"
          /></ResponseAction>
          <ResponseAction
            v-if="hasRetry()"
            label="Retry response"
            @click="emit('retry')"
            ><RotateCcw class="size-3.5"
          /></ResponseAction>
          <template v-if="status === 'complete'"
            ><ResponseAction
              label="Helpful"
              :active="feedbackValue === 'up'"
              @click="toggleFeedback('up')"
              ><ThumbsUp class="size-3.5" /></ResponseAction
            ><ResponseAction
              label="Not helpful"
              :active="feedbackValue === 'down'"
              @click="toggleFeedback('down')"
              ><ThumbsDown class="size-3.5" /></ResponseAction
          ></template>
          <button
            v-if="sources.length"
            type="button"
            :aria-expanded="expanded"
            :aria-controls="`${identity}-sources`"
            @click="expanded = !expanded"
            class="group ml-1 inline-flex min-h-7 items-center gap-2 rounded-md px-1.5 text-xs text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CitationStack :citations="sources" /><span class="tabular-nums"
              >{{ sources.length }}
              {{ sources.length === 1 ? "source" : "sources" }}</span
            >
            <motion.span
              aria-hidden="true"
              class="text-muted-foreground/70 group-hover:text-muted-foreground"
              :animate="{ rotate: expanded ? 180 : 0 }"
              :transition="reduced ? { duration: 0 } : SPRING_SWAP"
              ><ChevronDown class="size-3"
            /></motion.span>
          </button>
        </div>
        <AgentDisclosure
          v-if="sources.length"
          :id="`${identity}-sources`"
          :open="expanded"
          ><CitationList
            :citations="sources"
            :id-prefix="
              sourceIdPrefix ?? `response-source-${identity.replace(/:/g, '')}`
            "
            class="mt-2 rounded-xl bg-muted p-2"
        /></AgentDisclosure> </motion.div
    ></AnimatePresence>
  </div>
</template>
