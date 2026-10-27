<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Ref,
} from "vue";
import { animate, motion, motionValue, useTransform } from "motion-v";
import { EASE_OUT } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { resolveElement } from "../../../lib/composables";
import { usePopover, usePortalPosition } from "./context";
import { createMorphFocus } from "./morph-focus";
const props = withDefaults(
  defineProps<{
    side?: "top" | "bottom";
    align?: "start" | "end";
    sideOffset?: number;
    radius?: number;
    shadow?: boolean;
    initialFocus?: HTMLElement | Ref<HTMLElement | null> | null;
    onOpenAutoFocus?: (content: HTMLDivElement) => void;
    className?: string;
  }>(),
  { side: "bottom", align: "end", sideOffset: 8, radius: 16, shadow: true },
);
const state = usePopover();
const mounted = ref(false);
const present = ref(state.open.value);
const panel = ref<unknown>(null);
const measured = computed({
  get: () => resolveElement<HTMLElement>(panel.value),
  set: (value) => {
    panel.value = value;
  },
});
const layout = usePortalPosition(
  state.anchor,
  measured,
  computed(() => mounted.value && state.open.value),
);
const progress = motionValue(0);
const fade = motionValue(state.reduce.value ? 0 : 1);
const focus = createMorphFocus(
  props,
  () => state.open.value && !!layout.value,
  state.takeFocusOnOpen,
);
watch(
  panel,
  (value) => {
    state.content.value = resolveElement<HTMLElement>(value);
  },
  { flush: "post" },
);
const placement = computed(() => {
  const box = layout.value;
  if (!box) return { left: 0, top: 0, side: props.side, available: 0 };
  const gutter = 12;
  const free = {
    bottom: Math.max(
      0,
      window.innerHeight -
        box.trigger.top -
        box.trigger.height -
        props.sideOffset -
        gutter,
    ),
    top: Math.max(0, box.trigger.top - props.sideOffset - gutter),
  };
  const alternative = props.side === "top" ? "bottom" : "top";
  const side =
    box.content.height > free[props.side] &&
    free[alternative] > free[props.side]
      ? alternative
      : props.side;
  const preferred =
    box.trigger.left +
    (props.align === "end" ? box.trigger.width - box.content.width : 0);
  return {
    left: Math.max(
      gutter,
      Math.min(preferred, window.innerWidth - box.content.width - gutter),
    ),
    top:
      side === "bottom"
        ? box.trigger.top + box.trigger.height + props.sideOffset
        : Math.max(
            gutter,
            box.trigger.top - box.content.height - props.sideOffset,
          ),
    side,
    available: free[side],
  };
});
const clipPath = useTransform(() => {
  const inset = 92 * (1 - progress.get());
  return `inset(${placement.value.side === "top" ? inset : 0}% ${props.align === "start" ? inset : 0}% ${placement.value.side === "bottom" ? inset : 0}% ${props.align === "end" ? inset : 0}% round ${props.radius}px)`;
});
const opacity = useTransform(progress, [0, 0.15], [0, 1]);
let animation: ReturnType<typeof animate> | undefined;
let revision = 0;
let disposed = false;
function run() {
  animation?.stop();
  if (!mounted.value || !layout.value || disposed) return;
  const version = ++revision;
  const opened = state.open.value;
  const done = () => {
    if (!disposed && version === revision && !opened && !state.open.value)
      present.value = false;
  };
  if (state.reduce.value) {
    progress.jump(1);
    animation = animate(fade, opened ? 1 : 0, {
      duration: 0.12,
      onComplete: done,
    });
  } else
    animation = animate(progress, opened ? 1 : 0, {
      ...(opened
        ? { type: "spring", duration: 0.26, bounce: 0 }
        : { duration: 0.2, ease: EASE_OUT }),
      onComplete: done,
    });
  void focus.focus(state.content.value);
}
watch(
  state.open,
  async (opened) => {
    focus.reset();
    ++revision;
    if (opened) {
      layout.value = null;
      progress.jump(0);
      fade.jump(state.reduce.value ? 0 : 1);
      present.value = true;
      await nextTick();
    }
    run();
  },
  { flush: "post" },
);
watch(
  () => !!layout.value,
  (ready) => {
    if (ready) run();
  },
  { flush: "post" },
);
onMounted(() => {
  mounted.value = true;
  present.value = state.open.value;
});
onBeforeUnmount(() => {
  disposed = true;
  ++revision;
  animation?.stop();
  progress.destroy();
  fade.destroy();
  state.content.value = null;
});
</script>
<template>
  <Teleport v-if="mounted" to="body"
    ><motion.div
      v-if="present"
      data-morph-popover-portal=""
      :inert="!state.open.value"
      :style="{
        left: placement.left + 'px',
        top: placement.top + 'px',
        opacity: state.reduce.value ? fade : opacity,
        pointerEvents: state.open.value ? 'auto' : 'none',
        visibility: layout ? 'visible' : 'hidden',
      }"
      :class="[
        'fixed z-[9999]',
        shadow
          ? '[filter:drop-shadow(0_10px_18px_rgba(0,0,0,0.14))]'
          : undefined,
      ]"
      ><motion.div
        ref="panel"
        v-bind="$attrs"
        :id="state.contentId"
        role="dialog"
        :aria-labelledby="state.triggerId"
        tabindex="-1"
        :style="{
          clipPath: state.reduce.value ? undefined : clipPath,
          borderRadius: props.radius + 'px',
          maxHeight: layout ? placement.available + 'px' : undefined,
          overflowX: 'hidden',
          overflowY: 'auto',
        }"
        :class="
          cn(
            'overflow-hidden border border-border bg-background outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
            $attrs.class as string,
            className,
          )
        "
        ><slot /></motion.div></motion.div
  ></Teleport>
</template>
