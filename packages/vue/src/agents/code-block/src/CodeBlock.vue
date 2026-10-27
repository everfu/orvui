<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { Check, Copy, FileCode2, LoaderCircle } from "lucide-vue-next";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { SPRING_PRESS } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { RenderNode, useClipboard, type Content } from "../../shared";
import AgentCodeLine from "./AgentCodeLine.vue";
import type { AgentCodeLanguage } from "./AgentCode.vue";
import { useAgentCodeTokens } from "./tokens";
const props = withDefaults(
  defineProps<{
    code: string;
    language?: AgentCodeLanguage;
    filename?: Content;
    status?: "streaming" | "complete";
    showLineNumbers?: boolean;
    highlightLines?: number[];
    maxHeight?: number;
    wrap?: boolean;
    copyable?: boolean;
    onCopy?: () => void | Promise<void>;
  }>(),
  {
    language: "typescript",
    status: "complete",
    showLineNumbers: true,
    highlightLines: () => [],
    maxHeight: 280,
    wrap: false,
    copyable: true,
  },
);
const reduced = useReducedMotion();
const { copy, copied } = useClipboard(
  () => props.code,
  () =>
    props.onCopy ? props.onCopy() : navigator.clipboard.writeText(props.code),
);
const viewport = ref<HTMLElement>();
const working = computed(() => props.status === "streaming");
const rows = computed(() => props.code.split("\n"));
const tokens = useAgentCodeTokens(
  () => props.code,
  () => props.language,
);
let mounted = false,
  queued: number | undefined,
  version = 0;
async function follow() {
  const request = ++version;
  if (queued !== undefined) cancelAnimationFrame(queued);
  if (!mounted || !working.value) return;
  await nextTick();
  if (!mounted || request !== version) return;
  queued = requestAnimationFrame(() => {
    queued = undefined;
    const element = viewport.value;
    if (
      !element ||
      !working.value ||
      element.scrollHeight <= element.clientHeight
    )
      return;
    if (typeof element.scrollTo === "function")
      element.scrollTo({
        top: element.scrollHeight,
        behavior: reduced.value ? "auto" : "smooth",
      });
    else element.scrollTop = element.scrollHeight;
  });
}
watch([() => props.code, working], follow, { flush: "post" });
onMounted(() => {
  mounted = true;
  follow();
});
onBeforeUnmount(() => {
  mounted = false;
  version++;
  if (queued !== undefined) cancelAnimationFrame(queued);
});
</script>
<template>
  <div
    :data-state="status"
    :aria-busy="working"
    class="w-full overflow-hidden rounded-2xl bg-muted/80 text-sm"
  >
    <div class="flex h-10 items-center gap-2.5 px-3">
      <FileCode2
        aria-hidden="true"
        class="size-3.5 shrink-0 text-muted-foreground/70"
      />
      <span
        v-if="filename"
        class="min-w-0 truncate font-mono text-xs text-foreground/80"
        ><RenderNode :node="filename"
      /></span>
      <span
        class="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/55"
        >{{ language }}</span
      >
      <span
        :class="
          cn(
            'ml-auto inline-flex shrink-0 items-center gap-1 text-[10px] font-medium',
            working
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-emerald-600 dark:text-emerald-400',
          )
        "
      >
        <LoaderCircle
          v-if="working"
          :class="cn('size-3', !reduced && 'animate-spin')"
        /><Check v-else class="size-3" />{{ working ? "Writing" : "Ready" }}
      </span>
      <motion.button
        v-if="copyable || onCopy"
        type="button"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        :title="copied ? 'Copied' : 'Copy code'"
        @click="copy"
        :while-press="reduced ? undefined : { scale: 0.9 }"
        :transition="SPRING_PRESS"
        class="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-background/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Check v-if="copied" class="size-3.5" /><Copy v-else class="size-3.5" />
      </motion.button>
    </div>
    <div
      ref="viewport"
      :role="working ? 'log' : undefined"
      :aria-live="working ? 'polite' : undefined"
      class="scrollbar-hide overflow-auto border-t border-foreground/[0.06] py-2"
      :style="{ maxHeight: `${maxHeight}px` }"
    >
      <pre
        class="m-0 min-w-max font-mono text-xs leading-5 text-foreground/85"
      ><code><span v-for="(line, index) in rows" :key="index" :class="cn('grid min-h-5', showLineNumbers ? 'grid-cols-[2.75rem_minmax(0,1fr)]' : 'grid-cols-1', highlightLines.includes(index + 1) && 'bg-blue-500/[0.07]')"><span v-if="showLineNumbers" class="select-none pr-3 text-right tabular-nums text-muted-foreground/55">{{ index + 1 }}</span><AgentCodeLine :code="line" :tokens="tokens?.[index]" :class="cn('pr-4', showLineNumbers ? 'pl-1' : 'pl-4', wrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre')" /></span></code></pre>
    </div>
  </div>
</template>
