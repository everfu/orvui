<script setup lang="ts">
import { computed, useSlots } from "vue";
import AgentCode, { type AgentCodeLanguage } from "../../code-block/src/AgentCode.vue";
const props = withDefaults(
  defineProps<{ code?: string; language?: AgentCodeLanguage }>(),
  { language: "bash" },
);
const slots = useSlots();
const value = computed(
  () =>
    props.code ??
    (slots.default?.() ?? []).reduce(
      (text, node) =>
        text + (typeof node.children === "string" ? node.children : ""),
      "",
    ),
);
</script>
<template>
  <AgentCode
    :code="value"
    :language="language"
    class="whitespace-pre-wrap break-words text-foreground/80"
  />
</template>
