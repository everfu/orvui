<script setup lang="ts">
import { computed, ref } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { EASE_IN_OUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import Button from "./Button.vue";
const props = withDefaults(defineProps<{ size?: "sm" | "md" | "lg" | "icon"; paused?: boolean; disabled?: boolean }>(), { size: "md", paused: false });
const reduced = useReducedMotion(), hovered = ref(false);
const animated = computed(() => !props.paused && !reduced.value);
</script>
<template>
  <Button variant="ghost" :size="size" :disabled="disabled" @hover-start="hovered = true" @hover-end="hovered = false"
    :class="cn('group relative isolate overflow-hidden border-0 bg-transparent text-foreground hover:bg-transparent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-[0_8px_22px_rgba(0,0,0,0.16)]', size === 'icon' && 'rounded-full', $attrs.class)">
    <motion.span aria-hidden="true" class="pointer-events-none absolute inset-y-0 left-[-18%] z-0 w-[136%] rounded-[inherit] bg-[linear-gradient(105deg,#111_0%,#737373_14%,#fafafa_26%,#525252_38%,#0a0a0a_50%,#a3a3a3_64%,#fff_75%,#404040_87%,#111_100%)]"
      :animate="animated ? { x: ['0%', '13%', '0%'] } : undefined" :transition="animated ? { duration: 8, ease: EASE_IN_OUT, repeat: Infinity } : undefined" />
    <motion.span aria-hidden="true" class="pointer-events-none absolute inset-y-0 left-[-58%] z-[1] w-[52%] -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5)_48%,transparent)] opacity-50 blur-[3px] mix-blend-screen"
      :animate="animated ? { x: hovered ? '310%' : '0%' } : undefined" :transition="animated ? { duration: 2.4, ease: EASE_IN_OUT } : undefined" />
    <span aria-hidden="true" class="pointer-events-none absolute inset-[2px] z-[2] rounded-[inherit] bg-background transition-colors group-hover:bg-muted/40" />
    <span aria-hidden="true" class="pointer-events-none absolute inset-[2px] z-[3] rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(0,0,0,0.16)]" />
    <span class="relative z-10 inline-flex items-center justify-center gap-2"><slot /></span>
  </Button>
</template>
