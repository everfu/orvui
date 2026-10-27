<script setup lang="ts">
import { useId } from "vue";
import { motion } from "motion-v";
import { BookOpenText, ChevronDown } from "lucide-vue-next";
import { SPRING_SWAP } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { RenderNode, useControllable, type Content } from "../../shared";
import AgentDisclosure from "../../AgentDisclosure.vue";
import CitationList from "./CitationList.vue";
import type { CitationItem } from "./types";
const props = withDefaults(
  defineProps<{
    citations: CitationItem[];
    title?: Content;
    open?: boolean;
    defaultOpen?: boolean;
    idPrefix?: string;
  }>(),
  { title: "Sources", open: undefined, defaultOpen: false },
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
const identity = useId();
const reduced = useReducedMotion();
</script>
<template>
  <div data-citations class="w-full text-sm">
    <button
      type="button"
      :aria-expanded="disclosure"
      :aria-controls="`${identity}-content`"
      @click="disclosure = !disclosure"
      class="group -ml-1 flex min-h-8 items-center gap-2 rounded-lg px-1 text-left text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <BookOpenText class="size-4" /><span class="font-medium"
        ><RenderNode :node="title"
      /></span>
      <span
        class="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums"
        >{{ citations.length }}</span
      >
      <motion.span
        aria-hidden="true"
        class="text-muted-foreground/60"
        :animate="{ rotate: disclosure ? 180 : 0 }"
        :transition="reduced ? { duration: 0 } : SPRING_SWAP"
        ><ChevronDown class="size-3.5"
      /></motion.span>
    </button>
    <AgentDisclosure :id="`${identity}-content`" :open="disclosure"
      ><CitationList
        class="mt-1"
        :citations="citations"
        :id-prefix="idPrefix ?? `citation-${identity.replace(/:/g, '')}`"
    /></AgentDisclosure>
  </div>
</template>
