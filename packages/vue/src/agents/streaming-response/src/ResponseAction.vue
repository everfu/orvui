<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { SPRING_PRESS } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
const props = withDefaults(defineProps<{ label: string; active?: boolean }>(), {
  active: false,
});
const reduced = useReducedMotion();
const pressed = computed(() =>
  ["Helpful", "Not helpful"].includes(props.label) ? props.active : undefined,
);
</script>
<template>
  <motion.button
    type="button"
    :aria-label="label"
    :title="label"
    :aria-pressed="pressed"
    :while-press="reduced ? undefined : { scale: 0.9 }"
    :transition="SPRING_PRESS"
    :class="
      cn(
        'grid size-7 place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
        active && 'bg-muted text-foreground',
      )
    "
    ><slot
  /></motion.button>
</template>
