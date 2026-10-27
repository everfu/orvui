<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { cn } from "../../../lib/utils";
import { usePopover, usePortalPosition, hoverGesture } from "./context";
import { buildGeo, clipForProgress, triggerCutout } from "./geometry";
defineProps<{ className?: string }>();
const state = usePopover();
const mounted = ref(false);
const measure = state.content;
const layout = usePortalPosition(state.anchor, measure, mounted);
const blob = ref<HTMLElement | null>(null);
const clip = ref<HTMLElement | null>(null);
const resting = ref(!state.open.value && state.progress.get() === 0);
const shape = ref(false);
const contentHover = hoverGesture();
const corridorHover = hoverGesture();
const geometry = computed(() => {
  const size = layout.value;
  return buildGeo(
    size?.trigger.width ?? 0,
    size?.trigger.height ?? 0,
    size?.content.width ?? 0,
    size?.content.height ?? 0,
    state.p.side ?? "bottom",
    state.p.align ?? "center",
    state.p.sideOffset ?? 14,
    state.p.panelRadius ?? 16,
  );
});
const bounds = computed(() => ({
  left: geometry.value.left + "px",
  top: geometry.value.top + "px",
  width: geometry.value.layerW + "px",
  height: geometry.value.layerH + "px",
}));
const triggerRect = computed(() => {
  const box = geometry.value.trigger;
  return {
    left: box.x + "px",
    top: box.y + "px",
    width: box.w + "px",
    height: box.h + "px",
    borderRadius: box.r + "px",
  };
});
let stopChange: (() => void) | undefined;
let stopComplete: (() => void) | undefined;
function paint() {
  if (!geometry.value.layerW) return;
  const path = clipForProgress(
    geometry.value,
    state.progress.get(),
    shape.value,
  );
  for (const element of [blob.value, clip.value])
    if (element) element.style.clipPath = path;
}
function enter(event: PointerEvent, surface: "content" | "clip") {
  if (
    state.p.trigger !== "hover" ||
    !(surface === "content" ? contentHover : corridorHover).enter(event)
  )
    return;
  surface === "content" ? state.openHover() : state.cancelClose();
}
function leave(event: PointerEvent, surface: "content" | "clip") {
  if (
    state.p.trigger === "hover" &&
    (surface === "content" ? contentHover : corridorHover).leave(event)
  )
    state.scheduleClose();
}
watch(state.open, (open) => {
  if (open) resting.value = false;
});
watch([geometry, blob, clip], paint, { flush: "post" });
onMounted(() => {
  mounted.value = true;
  shape.value =
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    CSS.supports("clip-path", "shape(from 0px 0px, line to 1px 1px, close)");
  stopChange = state.progress.on("change", paint);
  stopComplete = state.progress.on("animationComplete", () => {
    if (!state.open.value && state.progress.get() === 0) resting.value = true;
  });
});
onBeforeUnmount(() => {
  stopChange?.();
  stopComplete?.();
  measure.value = null;
});
</script>
<template>
  <Teleport v-if="mounted" to="body"
    ><div
      data-popover-portal=""
      class="pointer-events-none fixed top-0 left-0 z-[9999] isolate size-0"
      :style="{
        visibility: layout && !resting ? 'visible' : 'hidden',
        transform: `translate3d(${layout?.trigger.left ?? 0}px,${layout?.trigger.top ?? 0}px,0)`,
      }"
    >
      <svg aria-hidden="true" width="0" height="0" class="absolute">
        <title>Popover visual effects</title>
        <defs>
          <filter
            :id="state.gooId"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              in="SourceGraphic"
              :stdDeviation="state.p.gooStrength ?? 8"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div
        aria-hidden="true"
        class="pointer-events-none absolute z-[-1]"
        :style="{
          ...bounds,
          filter: state.reduce.value ? undefined : `url(#${state.gooId})`,
          clipPath: triggerCutout(geometry),
        }"
      >
        <div class="absolute bg-popover" :style="triggerRect" />
        <div
          ref="blob"
          class="absolute inset-0 bg-popover"
          :style="{
            clipPath: clipForProgress(geometry, state.progress.get(), false),
          }"
        />
      </div>
      <div class="pointer-events-none absolute z-10" :style="bounds">
        <div
          ref="clip"
          :inert="!state.open.value"
          data-popover-interactive-clip=""
          @pointerenter="enter($event, 'clip')"
          @pointerleave="leave($event, 'clip')"
          class="absolute inset-0"
          :style="{
            clipPath: clipForProgress(geometry, state.progress.get(), false),
            pointerEvents: state.open.value ? 'auto' : 'none',
          }"
        >
          <div
            ref="measure"
            v-bind="$attrs"
            :id="state.contentId"
            role="dialog"
            :aria-labelledby="state.triggerId"
            :aria-hidden="!state.open.value"
            @pointerenter="enter($event, 'content')"
            @pointerleave="leave($event, 'content')"
            :style="{
              position: 'absolute',
              left: geometry.panel.x + 'px',
              top: geometry.panel.y + 'px',
              transformOrigin: `${state.p.align === 'start' ? 'left' : state.p.align === 'end' ? 'right' : 'center'} ${state.p.side === 'top' ? 'bottom' : 'top'}`,
            }"
            :class="
              cn(
                'w-max max-w-[min(92vw,20rem)] p-4 text-popover-foreground outline-none',
                $attrs.class as string,
                className,
              )
            "
          >
            <slot />
          </div>
        </div>
      </div></div
  ></Teleport>
</template>
