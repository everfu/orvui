<script setup lang="ts">
import { computed, provide } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { useReduced } from "../../shared";
import { messageKey, type MessageFrom } from "./context";
const props = withDefaults(
  defineProps<{ from: MessageFrom; animateIn?: boolean }>(),
  { animateIn: false },
);
const side = computed(() => props.from);
provide(messageKey, side);
const reduced = useReduced();
const initial = computed(() =>
  props.animateIn && !reduced.value ? { opacity: 0, y: 8, scale: 0.95 } : false,
);
</script>
<template>
  <motion.article
    data-slot="message"
    :data-from="from"
    :aria-label="`${from} message`"
    :class="
      cn(
        'group/message flex w-full items-start gap-2',
        from === 'user' ? 'flex-row-reverse' : 'flex-row',
      )
    "
    :style="{ transformOrigin: from === 'user' ? '100% 100%' : '0% 100%' }"
    :initial="initial"
    :animate="{ opacity: 1, y: 0, scale: 1 }"
    :exit="reduced ? { opacity: 0 } : { opacity: 0, y: -3, scale: 0.99 }"
    :transition="
      reduced
        ? { duration: 0.12 }
        : { type: 'spring', stiffness: 480, damping: 32, mass: 0.62 }
    "
    ><slot
  /></motion.article>
</template>
