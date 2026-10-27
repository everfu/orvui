<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { autoUpdate, computePosition, flip, offset, shift, type Placement } from "@floating-ui/dom";
import { resolveElement, useFloatingLayer, useReducedMotion } from "../../lib/composables";

const props = withDefaults(defineProps<{
  open: boolean;
  anchor: HTMLElement | null;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  role?: string;
}>(), { side: "bottom", align: "center", sideOffset: 8, role: "dialog" });
const emit = defineEmits(["close"]);
const portal = ref(false);
const panel = ref<HTMLElement | null>(null);
const coordinates = ref({ left: "0px", top: "0px" });
const reduced = useReducedMotion();
const layer = useFloatingLayer(computed(() => props.open), panel);
let disposePosition: (() => void) | undefined;
let revision = 0;
let alive = true;

function stopPositioning() {
  revision += 1;
  disposePosition?.();
  disposePosition = undefined;
}
async function restartPositioning() {
  stopPositioning();
  const version = revision;
  await nextTick();
  const anchor = props.anchor;
  const target = panel.value;
  if (!alive || version !== revision || !props.open || !portal.value || !anchor || !target) return;
  const placement = `${props.side}${props.align === "center" ? "" : `-${props.align}`}` as Placement;
  const update = async () => {
    const point = await computePosition(anchor, target, {
      strategy: "fixed", placement,
      middleware: [offset(props.sideOffset), flip(), shift({ padding: 8 })],
    });
    if (alive && version === revision && props.open)
      coordinates.value = { left: `${point.x}px`, top: `${point.y}px` };
  };
  disposePosition = autoUpdate(anchor, target, update);
}
function outside(event: PointerEvent) {
  if (!props.open || layer.containsHigher(event.target)) return;
  const target = event.target as Node | null;
  if (target && !panel.value?.contains(target) && !props.anchor?.contains(target)) emit("close");
}
function escape(event: KeyboardEvent) {
  if (!layer.claimEscape(event)) return;
  emit("close");
  props.anchor?.focus();
}
watch(() => [props.open, props.anchor, props.side, props.align, props.sideOffset, portal.value], restartPositioning, { flush: "post" });
onMounted(() => {
  portal.value = true;
  document.addEventListener("pointerdown", outside);
  document.addEventListener("keydown", escape);
});
onBeforeUnmount(() => {
  alive = false;
  stopPositioning();
  document.removeEventListener("pointerdown", outside);
  document.removeEventListener("keydown", escape);
});
</script>

<template>
  <Teleport to="body" :disabled="!portal">
    <AnimatePresence>
      <motion.div v-if="open"
        :ref="el => panel = resolveElement<HTMLElement>(el)"
        :role="role" :style="coordinates"
        class="fixed z-[110] max-w-[calc(100vw-16px)] rounded-2xl border bg-background p-4 text-foreground shadow-xl outline-none"
        :initial="{ opacity: 0, scale: reduced ? 1 : 0.9, filter: reduced ? 'none' : 'blur(4px)' }"
        :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
        :exit="{ opacity: 0, scale: reduced ? 1 : 0.94, filter: reduced ? 'none' : 'blur(4px)' }"
        :transition="{ type: 'spring', visualDuration: 0.2, bounce: 0.12 }"
        @keydown="escape"
      ><slot /></motion.div>
    </AnimatePresence>
  </Teleport>
</template>
