<script setup lang="ts">
import { AgentCode, type AgentCodeLanguage } from "../../code-block";
const props = withDefaults(
  defineProps<{ code: string; language?: AgentCodeLanguage }>(),
  { language: "bash" },
);
</script>
<template>
  <AgentCode
    :code="props.code"
    :language="props.language"
    class="whitespace-pre-wrap break-words rounded-lg border border-border/50 bg-muted/30 px-2.5 py-2"
  />
</template>
