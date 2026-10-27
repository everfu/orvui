<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { EASE_OUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
defineOptions({ inheritAttrs: false });
withDefaults(defineProps<{ label?: string }>(), { label: "Responding" });
const reduced = useReducedMotion();
const phases = computed(() =>
  [0, 0.14, 0.28].map((delay) => ({
    delay,
    duration: 1.05,
    ease: EASE_OUT,
    repeat: Infinity,
  })),
);
</script>
<template>
  <span
    data-slot="message-typing"
    v-bind="$attrs"
    :class="cn('inline-flex h-5 items-center gap-1', $attrs.class)"
    ><span class="sr-only">{{ label }}</span
    ><motion.span
      v-for="(phase, index) in phases"
      :key="index"
      aria-hidden="true"
      class="size-1 rounded-full bg-current"
      :animate="
        reduced
          ? { opacity: 0.45 }
          : { opacity: [0.28, 0.85, 0.28], y: [0, -2, 0] }
      "
      :transition="reduced ? { duration: 0 } : phase"
  /></span>
</template>
