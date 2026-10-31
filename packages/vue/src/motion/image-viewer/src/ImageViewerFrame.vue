<script setup lang="ts">
import { VIEWER_OPEN_MOTION, viewerPresentation, viewerSource } from "./opening-motion";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { AnimatePresence, motion, motionValue } from "motion-v";
import { Minus, Plus } from "lucide-vue-next";

import { resolveElement } from "../../../lib/composables";
import { useViewer } from "./context";
import { clampImagePan, imagePanBounds } from "./geometry";
import type { LightboxImage } from "./types";
import ImageViewerSlide from "./ImageViewerSlide.vue";
const props = defineProps<{ image: LightboxImage; index: number; present: boolean }>();
const viewer = useViewer();
const presentation = viewerPresentation(viewer), owner = Symbol("viewer-frame");
function syncPresentation() {
  if (props.present && !viewer.reduce.value) presentation.value = { owner, imageId: props.image.id };
  else if (presentation.value?.owner === owner) presentation.value = undefined;
}
watch(() => [props.present, props.image.id, viewer.reduce.value], syncPresentation, { flush: "post" });
const zoom = ref(false);
const failed = ref(false);
const bounds = ref<HTMLElement | null>(null);
const imageBox = ref<unknown>(null);
const pan = ref({ x: 0, y: 0 });
const x = motionValue(0);
const y = motionValue(0);
const session = computed(() => `${props.image.id}-${props.image.src}`);
const direction = ref(1);
const help = useId();
let previousIndex = props.index;
let observer: ResizeObserver | undefined;
let disposed = false;
function resetPan() { x.jump(0); y.jump(0); }
let closingAnimation: Animation | undefined;
let openingAnimation: Animation | undefined;
watch(session, () => { openingAnimation?.cancel(); openingAnimation = undefined; direction.value = props.index < previousIndex ? -1 : 1; previousIndex = props.index; zoom.value = false; failed.value = false; resetPan(); }, { flush: "pre" });
function thumbnail() {
  const matches = (node: HTMLElement) => node.isConnected && node.dataset.orvuiViewerId === viewer.id && node.dataset.orvuiImageId === props.image.id;
  const source = viewerSource(viewer);
  return source && matches(source) ? source : Array.from(imageBoxElement()?.ownerDocument.querySelectorAll<HTMLElement>('[data-orvui-viewer-id]') ?? []).find(matches);
}
function imageBoxElement() { return resolveElement<HTMLElement>(imageBox.value); }
function thumbnailRect(source: HTMLElement) {
  const image = source.querySelector("img") ?? source;
  const transform = image.style.transform;
  image.style.transform = "none";
  const rect = image.getBoundingClientRect();
  image.style.transform = transform;
  return rect;
}
function animateFrame(element: HTMLElement, frames: Keyframe[], options: KeyframeAnimationOptions) {
  if (typeof element.animate !== "function") return;
  try {
    const animation = element.animate(frames, options);
    void animation.finished?.catch(() => undefined);
    return animation;
  } catch {
    // Unsupported animation implementations still close without retaining the image.
    return;
  }
}
watch(() => props.present, present => {
  if (present) return;
  const element = resolveElement<HTMLElement>(imageBox.value);
  if (!element) return;
  const current = element.getBoundingClientRect();
  openingAnimation?.cancel();
  openingAnimation = undefined;
  closingAnimation?.cancel();
  closingAnimation = undefined;
  const fade = (duration: number) => {
    closingAnimation = animateFrame(element, [{ opacity: 1 }, { opacity: 0 }], { duration, fill: "forwards" });
    if (!closingAnimation) element.style.opacity = "0";
  };
  if (viewer.reduce.value) {
    fade(100);
    return;
  }
  const source = thumbnail();
  if (!source) { fade(160); return; }
  const oldTransform = element.style.transform;
  element.style.transform = 'none';
  const base = element.getBoundingClientRect();
  element.style.transform = oldTransform;
  const target = thumbnailRect(source);
  if (!base.width || !base.height || !target.width || !target.height) { fade(160); return; }
  const pose = (rect: DOMRect) => `translate(${rect.x - base.x}px, ${rect.y - base.y}px) scale(${rect.width / base.width}, ${rect.height / base.height})`;
  element.style.transformOrigin = '0 0';
  element.style.overflow = 'hidden';
  closingAnimation = animateFrame(element, [
    { transform: pose(current), transformOrigin: "0px 0px", borderRadius: '0px' },
    { transform: pose(target), transformOrigin: "0px 0px", borderRadius: getComputedStyle(source).borderRadius },
  ], { duration: 420, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
  if (!closingAnimation) element.style.opacity = "0";
}, { flush: 'post' });
function measure() { const image = resolveElement<HTMLElement>(imageBox.value); const frame = bounds.value; if (!image || !frame) return; pan.value = imagePanBounds(image.clientWidth, image.clientHeight, frame.clientWidth, frame.clientHeight); x.set(clampImagePan(x.get(), pan.value.x)); y.set(clampImagePan(y.get(), pan.value.y)); }
function toggle() { resetPan(); zoom.value = !zoom.value; }
function key(event: KeyboardEvent) { if (!zoom.value) return; const vectors: Record<string, [number, number]> = { ArrowLeft: [-40, 0], ArrowRight: [40, 0], ArrowUp: [0, -40], ArrowDown: [0, 40] }; const delta = vectors[event.key]; if (!delta) return; event.preventDefault(); event.stopPropagation(); x.set(clampImagePan(x.get() + delta[0], pan.value.x)); y.set(clampImagePan(y.get() + delta[1], pan.value.y)); }
function openFrame() {
  const element = imageBoxElement();
  if (!element || !props.present) return;
  if (viewer.reduce.value) {
    openingAnimation = animateFrame(element, [{ opacity: 0 }, { opacity: 1 }], { duration: 100 });
    return;
  }
  const source = thumbnail();
  if (!source) return;
  const from = thumbnailRect(source), to = element.getBoundingClientRect();
  if (!from.width || !from.height || !to.width || !to.height) return;
  element.style.transformOrigin = "0 0";
  element.style.overflow = "hidden";
  openingAnimation = animateFrame(element, [
    { transform: `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${from.width / to.width}, ${from.height / to.height})`, borderRadius: getComputedStyle(source).borderRadius },
    { transform: "none", borderRadius: "0px" },
  ], { duration: VIEWER_OPEN_MOTION.duration * 1000, easing: `cubic-bezier(${VIEWER_OPEN_MOTION.ease.join(",")})`, fill: "both" });
}
onMounted(async () => { syncPresentation(); await nextTick(); if (disposed) return; measure(); openFrame(); if (typeof ResizeObserver === "undefined") return; observer = new ResizeObserver(measure); for (const element of [bounds.value, resolveElement<HTMLElement>(imageBox.value)]) if (element) observer.observe(element); });
onBeforeUnmount(() => { if (presentation.value?.owner === owner) presentation.value = undefined; openingAnimation?.cancel(); closingAnimation?.cancel(); disposed = true; observer?.disconnect(); x.destroy(); y.destroy(); });
</script>
<template><div class="relative flex min-h-0 flex-1 items-center justify-center"><div ref="bounds" class="flex h-full w-full items-center justify-center overflow-hidden rounded-lg"><motion.div ref="imageBox" data-lightbox-content="" class="relative flex max-h-full max-w-full items-center justify-center" :style="{ aspectRatio: `${image.width} / ${image.height}`, width: `min(100%, calc((100dvh - 160px) * ${image.width / image.height}))` }"><div :class="['absolute inset-0', !zoom && 'overflow-hidden']"><AnimatePresence :initial="false" :custom="{ direction, reduce: viewer.reduce.value }"><ImageViewerSlide :key="session" :image="image" :zoom="zoom" :present="present" :direction="direction" :x="x" :y="y" :pan="pan" @failed="failed = true" @swipe="viewer.move" /></AnimatePresence></div><p v-if="failed" role="status" class="absolute inset-0 flex items-center justify-center bg-neutral-900 p-4 text-center text-sm text-white">Unable to load this image.</p></motion.div></div><motion.button :initial="{ opacity: 0 }" :animate="{ opacity: present ? 1 : 0 }" :exit="{ opacity: 0, transition: { duration: .08, delay: 0 } }" :transition="{ duration: viewer.reduce.value ? .1 : present ? .18 : .08, delay: viewer.reduce.value || !present ? 0 : .16 }" type="button" :aria-label="zoom ? 'Zoom out' : 'Zoom in'" :aria-pressed="zoom" :aria-describedby="help" class="orvui-image-viewer-zoom absolute bottom-3 right-3 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-30" @click="toggle" @keydown="key"><component :is="zoom ? Minus : Plus" :size="18" aria-hidden="true" /></motion.button><span :id="help" class="sr-only">When zoomed in, drag the image to pan, or keep this control focused and use the arrow keys.</span></div></template>

<style scoped>
.orvui-image-viewer-zoom:focus {
  opacity: 1 !important;
}
</style>
