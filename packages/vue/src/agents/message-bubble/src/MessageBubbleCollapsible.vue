<script setup lang="ts">
import { computed, inject, useId } from "vue";
import { motion } from "motion-v";
import { ChevronDown } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { SPRING_SWAP } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { RenderNode, useControllable, type Content } from "../../shared";
import { bubbleLayoutKey } from "./context";
const props = withDefaults(
  defineProps<{
    open?: boolean;
    defaultOpen?: boolean;
    collapsedLines?: 2 | 3 | 4 | 5 | 6;
    moreLabel?: Content;
    lessLabel?: Content;
    contentClassName?: string;
    triggerClassName?: string;
  }>(),
  {
    open: undefined,
    defaultOpen: false,
    collapsedLines: 4,
    moreLabel: "Show more",
    lessLabel: "Show less",
  },
);
const emit = defineEmits<{
  "update:open": [open: boolean];
  openChange: [open: boolean];
}>();
const invalidate = inject(bubbleLayoutKey, () => {});
const expanded = useControllable(
  () => props.open,
  props.defaultOpen,
  (value) => {
    invalidate();
    emit("update:open", value);
    emit("openChange", value);
  },
);
const identity = useId();
const reduced = useReducedMotion();
const clamp = computed(
  () =>
    ({
      2: "line-clamp-2",
      3: "line-clamp-3",
      4: "line-clamp-4",
      5: "line-clamp-5",
      6: "line-clamp-6",
    })[props.collapsedLines],
);
</script>
<template>
  <div
    data-slot="message-bubble-collapsible"
    :data-state="expanded ? 'open' : 'closed'"
    class="w-full"
  >
    <div
      :id="identity"
      :class="
        cn(
          'transition-[mask-image] duration-200',
          !expanded && clamp,
          !expanded &&
            '[mask-image:linear-gradient(to_bottom,#000_68%,transparent_100%)]',
          contentClassName,
        )
      "
    >
      <slot />
    </div>
    <button
      type="button"
      :aria-expanded="expanded"
      :aria-controls="identity"
      @click="expanded = !expanded"
      :class="
        cn(
          'mt-2 inline-flex h-7 items-center gap-1 rounded-full px-2 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          triggerClassName,
        )
      "
    >
      <span><RenderNode :node="expanded ? lessLabel : moreLabel" /></span
      ><motion.span
        aria-hidden="true"
        :animate="{ rotate: expanded ? 180 : 0 }"
        :transition="reduced ? { duration: 0 } : SPRING_SWAP"
        ><ChevronDown class="size-3.5"
      /></motion.span>
    </button>
  </div>
</template>
