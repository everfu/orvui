<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";
import { motion } from "motion-v";
import {
  Check,
  ChevronDown,
  Copy,
  FileCode2,
  LoaderCircle,
} from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { SPRING_PRESS, SPRING_SWAP } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import {
  AgentCodeLine,
  useAgentCodeTokens,
  type AgentCodeLanguage,
} from "../../code-block";
import {
  RenderNode,
  useClipboard,
  useControllable,
  type Content,
} from "../../shared";
import { useStreamFollow } from "../../stream-follow";
import AgentDisclosure from "../../AgentDisclosure.vue";
import type { FileDiffLine, FileDiffStatus } from "./types";
const props = withDefaults(
  defineProps<{
    file: Content;
    lines: FileDiffLine[];
    status?: FileDiffStatus;
    open?: boolean;
    defaultOpen?: boolean;
    collapseOnComplete?: boolean;
    maxHeight?: number;
    language?: AgentCodeLanguage;
    copyText?: string;
    onCopy?: () => void | Promise<void>;
  }>(),
  {
    status: "streaming",
    open: undefined,
    defaultOpen: true,
    collapseOnComplete: true,
    maxHeight: 220,
    language: "typescript",
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
const identity = useId();
const reduced = useReducedMotion();
const viewport = ref<HTMLElement>();
const counts = computed(() =>
  props.lines.reduce(
    (total, line) => {
      if (line.type === "added") total.added++;
      if (line.type === "removed") total.removed++;
      return total;
    },
    { added: 0, removed: 0 },
  ),
);
const tokens = useAgentCodeTokens(
  () => props.lines.map((line) => line.content).join("\n"),
  () => props.language,
);
const { copy, copied } = useClipboard(
  () => props.copyText ?? "",
  () =>
    props.onCopy
      ? props.onCopy()
      : navigator.clipboard.writeText(props.copyText ?? ""),
);
watch(
  () => props.status,
  (status, previous) => {
    if (status === "streaming" && previous !== status) expanded.value = true;
    else if (
      previous === "streaming" &&
      status === "complete" &&
      props.collapseOnComplete
    )
      expanded.value = false;
  },
);
useStreamFollow(
  viewport,
  () => expanded.value && props.status === "streaming",
  reduced,
  [() => props.lines, () => props.status, expanded],
);
const sign = (line: FileDiffLine) =>
  line.type === "added" ? "+" : line.type === "removed" ? "−" : "";
const color = (line: FileDiffLine) =>
  line.type === "added"
    ? "text-emerald-600 dark:text-emerald-400"
    : line.type === "removed"
      ? "text-rose-600 dark:text-rose-400"
      : "";
</script>
<template>
  <div
    :data-state="status"
    :aria-busy="status === 'streaming'"
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
      <FileCode2
        aria-hidden="true"
        class="size-4 shrink-0 text-muted-foreground"
      />
      <span class="min-w-0 flex-1 truncate font-mono text-xs text-foreground/80"
        ><RenderNode :node="file"
      /></span>
      <span class="flex shrink-0 items-center gap-2"
        ><span
          v-if="counts.added"
          class="font-mono text-xs tabular-nums text-emerald-600 dark:text-emerald-400"
          >+{{ counts.added }}</span
        ><span
          v-if="counts.removed"
          class="font-mono text-xs tabular-nums text-rose-600 dark:text-rose-400"
          >−{{ counts.removed }}</span
        ></span
      >
      <span
        class="grid size-4 shrink-0 place-items-center text-muted-foreground/60"
        ><LoaderCircle
          v-if="status === 'streaming'"
          aria-label="Applying changes"
          :class="cn('size-3.5', !reduced && 'animate-spin')" /><Check
          v-else
          aria-label="Changes applied"
          class="size-3.5"
      /></span>
      <motion.span
        aria-hidden="true"
        class="shrink-0 text-muted-foreground/45 transition-colors group-hover:text-muted-foreground"
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
      <div class="pl-6 pt-1.5">
        <div class="overflow-hidden rounded-xl bg-muted/80">
          <div
            ref="viewport"
            data-slot="file-diff-viewport"
            aria-live="polite"
            class="scrollbar-hide overflow-auto"
            :style="{ maxHeight: `${maxHeight}px` }"
          >
            <div class="font-mono text-xs leading-5">
              <span class="sr-only">File changes</span>
              <div
                v-for="(line, index) in lines"
                :key="line.id"
                :class="
                  cn(
                    'grid grid-cols-[2.25rem_2.25rem_1rem_minmax(0,1fr)]',
                    line.type === 'added' && 'bg-emerald-500/[0.07]',
                    line.type === 'removed' && 'bg-rose-500/[0.07]',
                  )
                "
              >
                <span
                  class="select-none pr-2 text-right tabular-nums text-muted-foreground/55"
                  >{{ line.oldLine }}</span
                ><span
                  class="select-none pr-2 text-right tabular-nums text-muted-foreground/55"
                  >{{ line.newLine }}</span
                >
                <span
                  :class="
                    cn(
                      'select-none text-center text-muted-foreground/45',
                      color(line),
                    )
                  "
                  >{{ sign(line) }}</span
                ><AgentCodeLine
                  :code="line.content"
                  :tokens="tokens?.[index]"
                  class="min-w-0 whitespace-pre px-1.5"
                />
              </div>
            </div>
          </div>
          <div
            v-if="copyText || onCopy"
            class="flex justify-end px-2 pb-1.5 pt-1"
          >
            <motion.button
              type="button"
              :aria-label="copied ? 'Copied' : 'Copy diff'"
              :title="copied ? 'Copied' : 'Copy diff'"
              @click="copy"
              :while-press="reduced ? undefined : { scale: 0.9 }"
              :transition="SPRING_PRESS"
              class="grid size-7 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-background/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              ><Check v-if="copied" class="size-3.5" /><Copy
                v-else
                class="size-3.5"
            /></motion.button>
          </div>
        </div>
      </div>
    </AgentDisclosure>
  </div>
</template>
