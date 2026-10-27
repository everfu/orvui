<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { SPRING_PRESS } from "../../../lib/ease";
import { useNotFoundScene } from "./use-not-found-scene";
import { NOT_FOUND_DEFAULTS, type NotFoundProps } from "./types";
const props = withDefaults(defineProps<Pick<NotFoundProps, "homeHref" | "homeLabel" | "browseHref" | "browseLabel">>(), {
  homeHref: NOT_FOUND_DEFAULTS.homeHref, homeLabel: NOT_FOUND_DEFAULTS.homeLabel,
  browseHref: NOT_FOUND_DEFAULTS.browseHref, browseLabel: NOT_FOUND_DEFAULTS.browseLabel,
});
const { reduced, hover } = useNotFoundScene();
const actions = computed(() => [
  { id: "home", href: props.homeHref, label: props.homeLabel, appearance: "bg-primary text-primary-foreground hover:bg-primary/90" },
  { id: "browse", href: props.browseHref, label: props.browseLabel, appearance: "border border-border bg-card text-foreground hover:bg-muted/60" },
]);
</script>
<template>
  <div class="flex flex-wrap items-center justify-center gap-3">
    <motion.a v-for="action in actions" :key="action.id" :href="action.href"
      :while-press="reduced ? undefined : { scale: .96 }" :while-hover="hover ? { scale: 1.02 } : undefined"
      :transition="SPRING_PRESS" :class="['inline-flex h-11 select-none items-center justify-center rounded-full px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background', action.appearance]"
    >{{ action.label }}</motion.a>
  </div>
</template>
