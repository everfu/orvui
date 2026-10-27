<script setup lang="ts">
import { computed, getCurrentInstance, useSlots } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { Check, CircleAlert, RotateCcw } from "lucide-vue-next";
import { EASE_IN_OUT, EASE_OUT, SPRING_PRESS } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { useReduced } from "../../shared";
import DitherField from "./DitherField.vue";
export type ImageGenerationStatus =
  "queued" | "generating" | "refining" | "complete" | "error";
const props = withDefaults(
  defineProps<{
    status?: ImageGenerationStatus;
    label?: string;
    prompt?: string;
    resolution?: string;
    aspectRatio?: string | number;
    size?: "compact" | "fluid";
    interactive?: boolean;
    statusText?: string;
    showStatus?: boolean;
    mediaClassName?: string;
    statusClassName?: string;
  }>(),
  {
    status: "generating",
    resolution: "1024 × 1024",
    aspectRatio: "1 / 1",
    size: "compact",
    interactive: true,
    showStatus: true,
  },
);
const emit = defineEmits<{ retry: [] }>();
const instance = getCurrentInstance();
const slots = useSlots();
const reduce = useReduced();
const pending = computed(() => !["complete", "error"].includes(props.status));
const message = computed(
  () =>
    props.statusText ??
    {
      queued: "Waiting to generate",
      generating: "Generating image",
      refining: "Refining details",
      complete: "Image ready",
      error: "Generation failed",
    }[props.status],
);
const description = computed(
  () =>
    props.label ??
    (props.prompt ? `${message.value}: ${props.prompt}` : message.value),
);
const image = computed(() => {
  const values =
    props.status === "complete"
      ? [0, 1, 1, 1]
      : props.status === "refining"
        ? [1.5, 0.95, 0.62, 1.005]
        : props.status === "error"
          ? [2, 0.5, 0.28, 1]
          : props.status === "queued"
            ? [4, 0.75, 0, 1.02]
            : [3, 0.85, 0, 1.015];
  return {
    filter: `blur(${values[0]}px) saturate(${values[1]})`,
    opacity: values[2],
    scale: values[3],
  };
});
const retryable = () => typeof instance?.vnode.props?.onRetry === "function";
</script>
<template>
  <div
    data-slot="image-generation"
    :data-state="status"
    :aria-busy="pending"
    class="w-full"
  >
    <div :class="cn('w-full', size === 'compact' && 'mx-auto max-w-52')">
      <div
        role="img"
        :aria-label="description"
        :style="{ aspectRatio }"
        class="relative isolate w-full overflow-hidden rounded-xl bg-muted"
      >
        <motion.div
          :aria-hidden="slots.default ? undefined : true"
          :initial="false"
          :animate="reduce ? { opacity: image.opacity } : image"
          :transition="{ duration: reduce ? 0 : 0.4, ease: EASE_OUT }"
          :class="
            cn(
              'absolute inset-0 [&>*]:size-full [&>*]:object-cover [&_img]:size-full [&_img]:object-cover',
              mediaClassName,
            )
          "
          ><slot
        /></motion.div>
        <AnimatePresence :initial="false"
          ><motion.div
            v-if="pending"
            key="dither-field"
            class="absolute inset-0"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="{ duration: reduce ? 0 : 0.25, ease: EASE_OUT }"
          >
            <DitherField
              :status="status"
              :interactive="interactive"
              :reduce="reduce"
            /> </motion.div
        ></AnimatePresence>
        <span
          v-if="resolution"
          class="absolute right-2 top-2 z-10 rounded-full bg-background/75 px-2 py-0.5 font-mono text-[10px] tabular-nums text-foreground/80"
          >{{ resolution }}</span
        >
      </div>
      <div v-if="showStatus || prompt" class="mt-3 text-left">
        <div
          v-if="showStatus"
          aria-live="polite"
          :class="
            cn(
              'flex min-h-5 items-center gap-2 text-sm font-medium text-foreground',
              status === 'error' && 'text-destructive',
              statusClassName,
            )
          "
        >
          <Check
            v-if="status === 'complete'"
            aria-hidden="true"
            class="size-3.5"
          />
          <CircleAlert
            v-else-if="status === 'error'"
            aria-hidden="true"
            class="size-3.5"
          />
          <motion.span
            v-else
            aria-hidden="true"
            class="grid size-3.5 grid-cols-2 place-items-center gap-0.5"
            :animate="reduce ? undefined : { rotate: 360 }"
            :transition="{ duration: 2.4, ease: EASE_IN_OUT, repeat: Infinity }"
          >
            <span
              v-for="index in 4"
              :key="index"
              :class="
                cn(
                  'size-1 rounded-[1px] bg-current',
                  [2, 3].includes(index) && 'opacity-55',
                )
              "
            />
          </motion.span>
          <AnimatePresence :initial="false" mode="popLayout"
            ><motion.span
              :key="message"
              :initial="reduce ? false : { opacity: 0, y: 4 }"
              :animate="{ opacity: 1, y: 0 }"
              :exit="reduce ? undefined : { opacity: 0, y: -4 }"
              :transition="{ duration: reduce ? 0 : 0.15, ease: EASE_OUT }"
              >{{ message }}</motion.span
            ></AnimatePresence
          >
        </div>
        <p v-if="prompt" class="mt-0.5 truncate text-xs text-muted-foreground">
          “{{ prompt }}”
        </p>
      </div>
      <motion.button
        v-if="status === 'error' && retryable()"
        type="button"
        @click="emit('retry')"
        :while-press="reduce ? undefined : { scale: 0.96 }"
        :transition="SPRING_PRESS"
        class="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
      >
        <RotateCcw class="size-4" />Try again
      </motion.button>
    </div>
  </div>
</template>
