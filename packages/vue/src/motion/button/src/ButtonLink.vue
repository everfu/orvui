<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { SPRING_PRESS } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
const props = withDefaults(defineProps<{ href?: string; variant?: "primary" | "secondary" | "ghost" | "outline"; size?: "sm" | "md" | "lg" | "icon"; pressScale?: number }>(), { variant: "primary", size: "md", pressScale: 0.93 });
const reduced = useReducedMotion();
const color = computed(() => ({ primary: "bg-primary text-primary-foreground hover:bg-primary/90", secondary: "border border-border bg-card text-foreground hover:border-border", ghost: "text-muted-foreground hover:text-foreground hover:bg-muted/60", outline: "border border-border bg-transparent text-foreground hover:bg-muted/60" })[props.variant]);
const geometry = computed(() => ({ sm: "h-8 px-3 text-xs gap-1.5 rounded-full", md: "h-10 px-5 text-sm gap-2 rounded-full", lg: "h-12 px-6 text-base gap-2 rounded-full", icon: "h-8 w-8 rounded-lg" })[props.size]);
</script>
<template>
  <motion.a :href="href" :while-press="reduced ? undefined : { scale: pressScale }" :while-hover="reduced ? undefined : { scale: 1.02 }"
    :transition="SPRING_PRESS" :class="cn('inline-flex items-center justify-center font-medium select-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', color, geometry, $attrs.class)"><slot /></motion.a>
</template>
