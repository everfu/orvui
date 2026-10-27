<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ImageGeneration, type ImageGenerationStatus } from "./index";
import { useReducedMotion } from "../../lib/composables";
const status = ref<ImageGenerationStatus>("queued"),
  identity = useId(),
  reduced = useReducedMotion();
// orvui-owned illustration: seeded midpoint displacement creates new terrain contours.
// The canvas, color bands and animation are compatibility inputs; ridge silhouettes differ.
function terrain(
  seed: number,
  baseline: number,
  peak: number,
  roughness: number,
  smooth = false,
) {
  let state = seed >>> 0;
  const random = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4_294_967_296;
  };
  const heights = Array<number>(33).fill(0);
  heights[0] = (random() - 0.5) * roughness;
  heights[32] = (random() - 0.5) * roughness;
  for (
    let stride = 32, displacement = roughness;
    stride > 1;
    stride /= 2, displacement *= 0.57
  ) {
    for (let left = 0; left < 32; left += stride) {
      const right = left + stride;
      heights[left + stride / 2] =
        (heights[left]! + heights[right]!) / 2 +
        (random() - 0.5) * displacement;
    }
  }
  const points = heights.map((height, index) => {
    const x = index * 25;
    const summit = Math.max(0, 1 - Math.abs(x - 350) / 250);
    return { x, y: Number((baseline + height - peak * summit).toFixed(2)) };
  });
  let outline = `M${points[0]!.x} ${points[0]!.y}`;
  if (smooth) {
    for (let index = 1; index < points.length - 1; index++) {
      const current = points[index]!,
        next = points[index + 1]!;
      outline += `Q${current.x} ${current.y} ${(current.x + next.x) / 2} ${(current.y + next.y) / 2}`;
    }
    const last = points.at(-1)!;
    outline += `T${last.x} ${last.y}`;
  } else
    for (const point of points.slice(1)) outline += `L${point.x} ${point.y}`;
  return outline + "L800 600H0Z";
}
const landscape = {
  distant: terrain(0x49554931, 386, 145, 120),
  middle: terrain(0x49554932, 431, 74, 95),
  foreground: terrain(0x49554933, 509, 8, 54, true),
};
let epoch = 0;
const scheduledTasks = new Set<ReturnType<typeof setTimeout>>();
function cancel() {
  epoch++;
  scheduledTasks.forEach(clearTimeout);
  scheduledTasks.clear();
}
function later(milliseconds: number, task: () => void) {
  const version = epoch;
  const handle = setTimeout(() => {
    scheduledTasks.delete(handle);
    if (version === epoch) task();
  }, milliseconds);
  scheduledTasks.add(handle);
}
onBeforeUnmount(cancel);
function replay() {
  cancel();
  status.value = reduced.value ? "complete" : "queued";
  if (reduced.value) return;
  const stages = [
    { after: 500, status: "generating" },
    { after: 3000, status: "refining" },
    { after: 5200, status: "complete" },
  ] as const;
  stages.forEach((stage) =>
    later(stage.after, () => {
      status.value = stage.status;
    }),
  );
}
watch(reduced, replay);
onMounted(replay);
</script>
<template>
  <div class="w-full max-w-xl">
    <div class="flex w-full flex-col items-center">
      <ImageGeneration
        label="A quiet mountain landscape at sunset"
        prompt="a quiet mountain landscape at sunset"
        resolution="1024 × 1024"
        :status="status"
        @retry="replay"
        ><svg
          viewBox="0 0 800 600"
          aria-hidden="true"
          class="size-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient :id="`${identity}-sky`" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#191b33" />
              <stop offset="0.48" stop-color="#60538d" />
              <stop offset="1" stop-color="#e59b7b" />
            </linearGradient>
            <linearGradient
              :id="`${identity}-ground`"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0" stop-color="#314946" />
              <stop offset="1" stop-color="#101817" />
            </linearGradient>
            <radialGradient :id="`${identity}-glow`">
              <stop offset="0" stop-color="#ffe6b2" stop-opacity="0.95" />
              <stop offset="1" stop-color="#efb47e" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="800" height="600" :fill="`url(#${identity}-sky)`" />
          <circle cx="570" cy="210" r="150" :fill="`url(#${identity}-glow)`" />
          <circle cx="570" cy="210" r="54" fill="#ffe5ad" />
          <path :d="landscape.distant" fill="#283d43" opacity="0.9" />
          <path :d="landscape.middle" :fill="`url(#${identity}-ground)`" />
          <path :d="landscape.foreground" fill="#13201f" />
          <g fill="#c9d7c3" opacity="0.65">
            <circle cx="108" cy="142" r="2" />
            <circle cx="168" cy="102" r="1.5" />
            <circle cx="248" cy="154" r="2" />
            <circle cx="332" cy="84" r="1.5" />
            <circle cx="414" cy="138" r="2" />
          </g></svg></ImageGeneration
      ><button
        type="button"
        class="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        @click="replay"
      >
        <RotateCcw class="size-4" />Replay
      </button>
    </div>
  </div>
</template>
