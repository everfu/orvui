<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { cn } from "../../../lib/utils";
import { usePopover, usePortalPosition, hoverGesture } from "./context";
import {
  buildGeo,
  clipForProgress,
  positionPopover,
  triggerCutout,
} from "./geometry";
defineProps<{ className?: string }>();
const state = usePopover();
const mounted = ref(false);
const viewport = ref({ width: 0, height: 0 });
const resize = () => {
  viewport.value = { width: window.innerWidth, height: window.innerHeight };
};
const measure = state.content;
const layout = usePortalPosition(state.anchor, measure, mounted);
const blob = ref<HTMLElement | null>(null);
const clip = ref<HTMLElement | null>(null);
const bridge = ref<HTMLElement | null>(null);
const blur = ref<SVGFEGaussianBlurElement | null>(null);
const chrome = ref<HTMLElement | null>(null);
const surface = ref<HTMLElement | null>(null);
const resting = ref(!state.open.value && state.progress.get() === 0);
const shape = ref(false);
const contentHover = hoverGesture();
const corridorHover = hoverGesture();
const placement = computed(() => {
  const size = layout.value;
  const options = {
    side: state.p.side ?? "bottom",
    align: state.p.align ?? "center",
    gap: state.p.sideOffset ?? 14,
    radius: state.p.panelRadius ?? 16,
  };
  if (!size)
    return {
      side: options.side,
      availableHeight: 0,
      geometry: buildGeo(
        0,
        0,
        0,
        0,
        options.side,
        options.align,
        options.gap,
        options.radius,
      ),
    };
  const placed = positionPopover(
    size.trigger,
    size.content,
    viewport.value,
    options,
  );
  const anchor = state.anchor.value;
  if (anchor) {
    const radius = getComputedStyle(anchor).borderTopLeftRadius;
    const value = parseFloat(radius);
    if (Number.isFinite(value))
      placed.geometry.trigger.r = Math.min(
        radius.endsWith("%") ? (value * size.trigger.height) / 100 : value,
        size.trigger.width / 2,
        size.trigger.height / 2,
      );
  }
  return placed;
});
const geometry = computed(() => placement.value.geometry);
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
function settledProgress(progress: number) {
  const value = Math.max(0, Math.min(1, (progress - 0.55) / 0.45));
  return value * value * (3 - 2 * value);
}
function surfaceFilter() {
  const shadow = "drop-shadow(0 10px 22px rgb(0 0 0 / 0.12))";
  return state.reduce.value || settledProgress(state.progress.get()) >= 0.999
    ? shadow
    : `url(#${state.gooId}) ${shadow}`;
}
function paint() {
  if (!geometry.value.layerW) return;
  const progress = state.progress.get();
  const settled = settledProgress(progress);
  if (surface.value) surface.value.style.filter = surfaceFilter();
  if (bridge.value) bridge.value.style.opacity = String(1 - settled);
  if (blur.value)
    blur.value.setAttribute(
      "stdDeviation",
      String(
        state.reduce.value ? 0 : (state.p.gooStrength ?? 8) * (1 - settled),
      ),
    );
  if (chrome.value) chrome.value.style.opacity = String(settled);
  const path = clipForProgress(geometry.value, progress, shape.value);
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
watch(
  [geometry, blob, clip, blur, bridge, chrome, surface, state.reduce],
  paint,
  {
    flush: "post",
  },
);
onMounted(() => {
  resize();
  window.addEventListener("resize", resize);
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
  window.removeEventListener("resize", resize);
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
              ref="blur"
              in="SourceGraphic"
              :stdDeviation="
                state.reduce.value
                  ? 0
                  : (state.p.gooStrength ?? 8) *
                    (1 - settledProgress(state.progress.get()))
              "
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
        ref="surface"
        aria-hidden="true"
        class="pointer-events-none absolute z-[-1]"
        :style="{
          ...bounds,
          filter: surfaceFilter(),
          clipPath: triggerCutout(geometry, 48),
        }"
      >
        <div ref="bridge" class="absolute bg-popover" :style="triggerRect" />
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
            ref="chrome"
            aria-hidden="true"
            data-popover-chrome=""
            class="pointer-events-none absolute z-20"
            :style="{
              left: geometry.panel.x + 'px',
              top: geometry.panel.y + 'px',
              width: geometry.panel.w + 'px',
              height: geometry.panel.h + 'px',
              borderRadius: geometry.panel.r + 'px',
              boxShadow: 'inset 0 0 0 1px var(--color-border)',
              opacity: settledProgress(state.progress.get()),
            }"
          />
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
              transformOrigin: `${state.p.align === 'start' ? 'left' : state.p.align === 'end' ? 'right' : 'center'} ${placement.side === 'top' ? 'bottom' : 'top'}`,
              maxHeight: layout ? placement.availableHeight + 'px' : undefined,
              overflowY: 'auto',
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
