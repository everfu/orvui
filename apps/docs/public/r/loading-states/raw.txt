<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { EASE_IN_OUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
const props = withDefaults(
  defineProps<{
    label?: string;
    elapsedSeconds?: number;
    initialSeconds?: number;
    running?: boolean;
  }>(),
  { label: "Churning", initialSeconds: 0, running: true },
);
const reduced = useReducedMotion();
const internal = ref(props.initialSeconds);
const elapsed = computed(() =>
  Math.max(0, props.elapsedSeconds ?? internal.value),
);
const readout = computed(() => {
  const seconds = elapsed.value;
  const remainder = (seconds % 60).toFixed(1);
  return seconds < 60
    ? `${seconds.toFixed(1)}s`
    : `${Math.floor(seconds / 60)}m ${remainder}s`;
});
let clock: ReturnType<typeof setInterval> | undefined;
let mounted = false;
function synchronize() {
  if (clock !== undefined) clearInterval(clock);
  clock = undefined;
  if (!mounted || !props.running || props.elapsedSeconds !== undefined) return;
  const origin = performance.now();
  const start = props.initialSeconds;
  clock = setInterval(() => {
    internal.value = start + (performance.now() - origin) / 1000;
  }, 100);
}
watch(
  [() => props.running, () => props.elapsedSeconds, () => props.initialSeconds],
  synchronize,
);
onMounted(() => {
  mounted = true;
  synchronize();
});
onBeforeUnmount(() => {
  mounted = false;
  if (clock !== undefined) clearInterval(clock);
});
</script>
<template>
  <span
    role="status"
    :aria-label="`${label}, in progress`"
    :class="
      cn(
        'inline-flex items-center gap-3 font-mono text-sm text-muted-foreground',
        $attrs.class,
      )
    "
  >
    <span aria-hidden="true" class="grid size-5 shrink-0 grid-cols-3 gap-[2px]">
      <motion.span
        v-for="cell in 9"
        :key="cell"
        class="rounded-[1px] bg-current"
        :animate="
          reduced
            ? { opacity: 0.55 }
            : { opacity: [0.28, 1, 0.28], scale: [0.72, 1, 0.72] }
        "
        :transition="
          reduced
            ? { duration: 0 }
            : {
                duration: 1.55,
                ease: EASE_IN_OUT,
                repeat: Infinity,
                delay: (cell - 1) * 0.14,
              }
        "
      />
    </span>
    <span class="font-sans font-medium">{{ label }}</span
    ><span aria-hidden="true" class="tabular-nums text-muted-foreground/70">{{
      readout
    }}</span>
  </span>
</template>
