<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../../lib/utils";
import AgentCodeLine from "./AgentCodeLine.vue";
import { useAgentCodeTokens } from "./tokens";
export type AgentCodeLanguage =
  | "bash"
  | "diff"
  | "json"
  | "text"
  | "tsx"
  | "typescript"
  | "javascript"
  | "vue"
  | "css"
  | "html";
const props = withDefaults(
  defineProps<{
    code: string;
    language?: AgentCodeLanguage;
    showLineNumbers?: boolean;
    highlightLines?: number[];
    wrap?: boolean;
  }>(),
  {
    language: "bash",
    showLineNumbers: false,
    highlightLines: () => [],
    wrap: false,
  },
);
const content = computed(() => props.code.split("\n"));
const tokens = useAgentCodeTokens(
  () => props.code,
  () => props.language,
);
</script>
<template>
  <pre
    :class="
      cn(
        'm-0 overflow-x-auto whitespace-pre font-mono text-xs leading-5 text-foreground/85',
        wrap && 'whitespace-pre-wrap break-words',
      )
    "
  ><code><template v-for="(line, index) in content" :key="index"><span v-if="showLineNumbers" aria-hidden="true" class="inline-block w-11 select-none pr-3 text-right tabular-nums text-muted-foreground/55">{{ index + 1 }}</span><AgentCodeLine :code="line" :tokens="tokens?.[index]" :class="highlightLines.includes(index + 1) ? 'bg-blue-500/[0.07]' : undefined" />{{ index + 1 < content.length ? '\n' : '' }}</template></code></pre>
</template>
