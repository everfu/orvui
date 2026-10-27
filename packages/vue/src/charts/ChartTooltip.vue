<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { AnimatePresence, motion } from "motion-v";
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  type VirtualElement,
} from "@floating-ui/dom";
import { SPRING_PANEL } from "../lib/ease";
import { resolveElement, useReducedMotion } from "../lib/composables";
const props = withDefaults(
  defineProps<{
    open: boolean;
    anchor: HTMLElement | null;
    id: string;
    point?: { x: number; y: number };
    side?: "top" | "right" | "bottom" | "left";
    followCursor?: boolean;
  }>(),
  { side: "top", point: () => ({ x: 0.5, y: 0.5 }), followCursor: false },
);
const emit = defineEmits(["update:open"]);
const popup = ref<HTMLElement | null>(null);
const position = ref({ x: 0, y: 0 });
const ready = ref(false);
const reduce = useReducedMotion();
const mounted = ref(false);
let generation = 0;
let pointer: { x: number; y: number } | undefined;
let disposeLayout: (() => void) | undefined;

function element() {
  return resolveElement<HTMLElement>(popup.value);
}
function reference(anchor: HTMLElement): VirtualElement {
  return {
    contextElement: anchor,
    getBoundingClientRect() {
      const box = anchor.getBoundingClientRect();
      const x =
        props.followCursor && pointer
          ? pointer.x
          : box.left + box.width * props.point.x;
      const y =
        props.followCursor && pointer
          ? pointer.y
          : box.top + box.height * props.point.y;
      return {
        x,
        y,
        left: x,
        right: x,
        top: y,
        bottom: y,
        width: 0,
        height: 0,
        toJSON: () => ({}),
      };
    },
  };
}
async function place() {
  const tooltip = element();
  const anchor = props.anchor;
  const current = generation;
  if (!mounted.value || !props.open || !tooltip || !anchor) return;
  const result = await computePosition(reference(anchor), tooltip, {
    placement: props.side,
    strategy: "fixed",
    middleware: [offset(10), flip(), shift({ padding: 8 })],
  });
  if (
    current !== generation ||
    !mounted.value ||
    !props.open ||
    element() !== tooltip
  )
    return;
  position.value = { x: result.x, y: result.y };
  ready.value = true;
}
watch(
  [mounted, () => props.open, () => props.anchor, popup],
  async (_, __, cleanup) => {
    const current = ++generation;
    disposeLayout?.();
    disposeLayout = undefined;
    ready.value = false;
    cleanup(() => {
      generation++;
      disposeLayout?.();
      disposeLayout = undefined;
    });
    if (!mounted.value || !props.open || !props.anchor) return;
    await nextTick();
    const tooltip = element();
    if (current !== generation || !tooltip || !props.anchor) return;
    disposeLayout = autoUpdate(props.anchor, tooltip, () => {
      void place();
    });
  },
  { flush: "post" },
);
watch(
  () => [props.point.x, props.point.y, props.side, props.followCursor],
  () => {
    void place();
  },
);
watch(
  [mounted, () => props.anchor],
  ([isMounted, anchor], _, cleanup) => {
    pointer = undefined;
    if (!isMounted || !anchor) return;
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointer = { x: event.clientX, y: event.clientY };
      if (props.open) void place();
    };
    const leave = () => {
      pointer = undefined;
    };
    anchor.addEventListener("pointermove", move);
    anchor.addEventListener("pointerleave", leave);
    cleanup(() => {
      anchor.removeEventListener("pointermove", move);
      anchor.removeEventListener("pointerleave", leave);
    });
  },
  { flush: "post" },
);
function dismiss(event: PointerEvent) {
  if (!props.open || !(event.target instanceof Node)) return;
  if (
    !props.anchor?.contains(event.target) &&
    !element()?.contains(event.target)
  )
    emit("update:open", false);
}
function escape(event: KeyboardEvent) {
  if (props.open && event.key === "Escape") emit("update:open", false);
}
onMounted(() => {
  mounted.value = true;
  document.addEventListener("pointerdown", dismiss);
  document.addEventListener("keydown", escape);
});
onBeforeUnmount(() => {
  mounted.value = false;
  generation++;
  disposeLayout?.();
  document.removeEventListener("pointerdown", dismiss);
  document.removeEventListener("keydown", escape);
});
</script>

<template>
  <AnimatePresence>
    <motion.div
      v-if="open"
      :id="id"
      ref="popup"
      role="tooltip"
      class="pointer-events-none fixed top-0 left-0 z-50 max-w-64 rounded-xl border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg"
      :initial="{ opacity: 0, scale: 0.96 }"
      :animate="{
        opacity: ready ? 1 : 0,
        scale: 1,
        x: position.x,
        y: position.y,
      }"
      :exit="{ opacity: 0, scale: 0.96 }"
      :transition="
        reduce
          ? { duration: 0 }
          : { ...SPRING_PANEL, opacity: { duration: 0.12 } }
      "
      ><slot
    /></motion.div>
  </AnimatePresence>
</template>
