<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  isMotionValue,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "motion-v";
import { SPRING_GLIDE } from "../../../lib/ease";
import { useReduced } from "../../shared";
import { createOrbRenderer } from "./renderer";
const props = withDefaults(
  defineProps<{
    activity?: number | MotionValue<number>;
    analyser?: AnalyserNode | null;
    colors?: readonly [string, string, string];
    active?: boolean;
    speed?: number;
    label?: string;
  }>(),
  {
    activity: 0,
    analyser: null,
    colors: () => ["#e8754d", "#ffe0ac", "#346b52"] as const,
    active: true,
    speed: 1,
  },
);
const emit = defineEmits<{ error: [error: Error] }>();
const canvas = ref<HTMLCanvasElement>();
const error = ref<Error | null>(null);
const reduced = useReduced();
const destination = useMotionValue(0);
const smoothed = useSpring(destination, SPRING_GLIDE);
let engine: ReturnType<typeof createOrbRenderer> | undefined;
let detachInput: (() => void) | undefined;
let detachSpring: (() => void) | undefined;
let sample: Uint8Array<ArrayBuffer> | undefined;
let sampling: AnalyserNode | undefined;
const unit = (value: number) =>
  Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
const enabled = () => props.active && !reduced.value;
function setLevel(value: number) {
  destination.set(enabled() ? unit(value) : 0);
  engine?.requestDraw();
}
watch(
  [() => props.activity, () => props.active, reduced],
  () => {
    detachInput?.();
    detachInput = undefined;
    const input = props.activity;
    if (isMotionValue(input)) {
      setLevel(input.get());
      detachInput = input.on("change", setLevel);
    } else setLevel(input as number);
  },
  { immediate: true },
);
watch([() => props.speed, () => props.colors], () => engine?.requestDraw(), {
  deep: true,
});
function fail(problem: Error) {
  error.value = problem;
  emit("error", problem);
}
onMounted(() => {
  if (!canvas.value) return;
  try {
    engine = createOrbRenderer(
      canvas.value,
      () => {
        if (enabled() && props.analyser) {
          if (
            sampling !== props.analyser ||
            sample?.length !== props.analyser.fftSize
          ) {
            sampling = props.analyser;
            sample = new Uint8Array(new ArrayBuffer(sampling.fftSize));
          }
          sampling.getByteTimeDomainData(sample!);
          const meanSquare =
            sample!.reduce(
              (sum, byte) => sum + Math.pow((byte - 128) / 128, 2),
              0,
            ) / sample!.length;
          destination.set(unit(3 * Math.sqrt(meanSquare)));
        }
        return {
          activity: enabled() ? unit(smoothed.get()) : 0,
          colors: props.colors,
          speed: Number.isFinite(props.speed) ? Math.max(0, props.speed) : 1,
          animated: enabled() && (props.speed > 0 || !!props.analyser),
        };
      },
      fail,
    );
    detachSpring = smoothed.on("change", () => engine?.requestDraw());
  } catch (problem) {
    fail(problem instanceof Error ? problem : new Error(String(problem)));
  }
});
onBeforeUnmount(() => {
  detachInput?.();
  detachSpring?.();
  engine?.dispose();
  engine = undefined;
  sample = undefined;
  sampling = undefined;
});
</script>
<template>
  <div
    data-slot="voice-orb"
    class="relative aspect-square w-64 shrink-0"
    role="img"
    :aria-label="label"
    :aria-hidden="!label || undefined"
    :data-render-state="error ? 'error' : 'ready'"
  >
    <div
      v-if="error"
      class="flex size-full items-center justify-center rounded-full border border-border bg-card p-8 text-center text-xs text-muted-foreground"
    >
      <slot name="fallback">Orb rendering unavailable</slot>
    </div>
    <canvas v-else ref="canvas" class="block size-full" />
  </div>
</template>
