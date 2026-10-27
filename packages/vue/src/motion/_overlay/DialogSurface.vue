<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { cn } from "../../lib/utils";
import { resolveElement, useOverlay, useReducedMotion } from "../../lib/composables";

const props = withDefaults(defineProps<{
  open: boolean;
  side?: "left" | "right" | "bottom" | "center";
  ariaLabel?: string;
  ariaDescribedBy?: string;
  dismissible?: boolean;
  panelClass?: string;
  backdropClass?: string;
  layoutId?: string;
}>(), { side: "center", ariaLabel: "Dialog", dismissible: true });
const emit = defineEmits(["update:open"]);
const portal = ref(false);
const panel = ref<HTMLElement | null>(null);
const reduced = useReducedMotion();
const dismiss = () => { if (props.dismissible) emit("update:open", false); };
useOverlay(computed(() => props.open), panel, dismiss);
onMounted(() => { portal.value = true; });

const panelPose = computed(() => {
  if (reduced.value) return { opacity: 0 };
  const displaced = {
    left: { x: "-100%", opacity: 1 },
    right: { x: "100%", opacity: 1 },
    bottom: { y: "100%", opacity: 1 },
    center: { y: 20, scale: 0.94, opacity: 0 },
  };
  return displaced[props.side];
});
const alignment = computed(() => ({
  center: "items-center justify-center p-4",
  bottom: "items-end justify-center",
  left: "justify-start",
  right: "justify-end",
})[props.side]);
const dimensions = computed(() => props.side === "center"
  ? "w-full max-w-lg rounded-3xl p-6"
  : props.side === "bottom" ? "w-full max-w-xl rounded-t-3xl p-6"
  : "h-full max-h-dvh w-80 p-6");
</script>

<template>
  <Teleport to="body" :disabled="!portal">
    <AnimatePresence>
      <div v-if="open" class="fixed inset-0 z-[100]" data-orvui-overlay>
        <motion.div
          :class="cn('absolute inset-0 bg-black/35 backdrop-blur-sm', backdropClass)"
          :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }"
          :transition="{ duration: 0.2 }" @pointerdown.self="dismiss"
        />
        <div :class="cn('pointer-events-none absolute inset-0 flex', alignment)">
          <motion.div
            :ref="el => panel = resolveElement<HTMLElement>(el)"
            role="dialog" aria-modal="true" :aria-label="ariaLabel"
            :aria-describedby="ariaDescribedBy" tabindex="-1" :layout-id="layoutId"
            :initial="panelPose" :animate="{ x: 0, y: 0, scale: 1, opacity: 1 }" :exit="panelPose"
            :transition="reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 420, damping: 40, mass: 0.5 }"
            :class="cn('pointer-events-auto relative max-h-[90dvh] overflow-auto border bg-background text-foreground shadow-2xl outline-none', dimensions, panelClass)"
          ><slot /></motion.div>
        </div>
      </div>
    </AnimatePresence>
  </Teleport>
</template>
