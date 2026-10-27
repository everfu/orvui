<script setup lang="ts">
import { computed, provide, toRef, useSlots } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { useReducedMotion } from "../../../lib/composables";
import { RenderNode, type Content } from "../../shared";
import { islandKey } from "./context";
import { useIslandSize } from "./use-island-size";
import IslandSlot from "./IslandSlot.vue";
const props = defineProps<{ view: string | null; compact?: Content }>(),
  slots = useSlots();
const view = toRef(props, "view");
provide(islandKey, view);
const reduce = useReducedMotion(),
  { sizer, target } = useIslandSize(view);
const hasCompact = computed(
  () => props.view === null && (props.compact || slots.compact),
);
</script>
<template>
  <motion.div
    role="status"
    aria-live="polite"
    :initial="view === null ? { width: '126px', height: '37px' } : false"
    :animate="target"
    :transition="
      reduce ? { duration: 0 } : { type: 'spring', duration: 0.8, bounce: 0.2 }
    "
    :style="{ borderRadius: '32px' }"
    class="relative inline-flex items-start justify-center overflow-hidden bg-foreground text-background shadow-2xl"
    ><div ref="sizer" class="w-max">
      <AnimatePresence
        :initial="false"
        mode="popLayout"
        as="div"
        class="contents"
        ><IslandSlot
          v-if="hasCompact"
          key="compact"
          class="min-h-[37px] min-w-[126px] gap-2 px-4 py-1.5 text-xs font-medium"
          ><slot name="compact"
            ><RenderNode :node="compact" /></slot></IslandSlot></AnimatePresence
      ><slot /></div
  ></motion.div>
</template>
