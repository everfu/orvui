<script setup lang="ts">
import { computed } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { AlertCircle, MessageSquare, X } from "lucide-vue-next";
import { Button, StatefulButton } from "../../../motion/button";
import { EASE_OUT } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { RenderNode, type Content } from "../../shared";
import { useFeedback } from "./use-feedback";
export interface FeedbackData {
  message: string;
}
const props = withDefaults(
  defineProps<{
    position?: "bottom-right" | "bottom-left";
    title?: string;
    placeholder?: string;
    icon?: Content;
    onSubmit?: (data: FeedbackData) => void | Promise<void>;
  }>(),
  {
    icon: undefined,
    position: "bottom-right",
    title: "Help us improve",
    placeholder: "Share an idea or report a bug",
  },
);
const emit = defineEmits<{
  success: [data: FeedbackData];
  error: [error: unknown];
}>();
const {
  reduce,
  root,
  textarea,
  titleId,
  status,
  message,
  open,
  busy,
  left,
  offset,
  start,
  close,
  submit,
} = useFeedback(
  props,
  (data) => emit("success", data),
  (error) => emit("error", error),
);
const enterEase = [0.34, 1.25, 0.64, 1] as const,
  exitEase = [0.22, 1, 0.36, 1] as const;
const surface = computed(() =>
  reduce.value
    ? { duration: 0 }
    : {
        layout: {
          duration: open.value ? 0.4 : 0.28,
          ease: open.value ? enterEase : exitEase,
        },
        borderRadius: {
          duration: open.value ? 0.4 : 0.28,
          ease: open.value ? enterEase : exitEase,
        },
      },
);
const content = computed(() =>
  reduce.value
    ? { duration: 0 }
    : Object.fromEntries(
        ["opacity", "x", "scale", "filter", "rotate"].map((property) => [
          property,
          {
            duration:
              property === "opacity" || property === "filter" ? 0.22 : 0.4,
            ease: exitEase,
          },
        ]),
      ),
);
const viewInitial = computed(() =>
  reduce.value ? { opacity: 0 } : { opacity: 0, y: 8, filter: "blur(4px)" },
);
const viewAnimate = computed(() =>
  reduce.value
    ? { opacity: 1, transition: { duration: 0.18, ease: EASE_OUT } }
    : {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.24, ease: EASE_OUT },
      },
);
const viewExit = computed(() =>
  reduce.value
    ? { opacity: 0, transition: { duration: 0.14, ease: EASE_OUT } }
    : {
        opacity: 0,
        y: -8,
        filter: "blur(4px)",
        transition: { duration: 0.16, ease: EASE_OUT },
      },
);
const sprinkles = Array.from({ length: 8 }, (_, index) => ({
  x: 26 * Math.cos((index * Math.PI) / 4),
  y: 26 * Math.sin((index * Math.PI) / 4),
  color: index % 2 ? "var(--accent)" : "var(--color-success)",
}));
</script>
<template>
  <div
    ref="root"
    :class="
      cn(
        'pointer-events-none absolute bottom-4 z-30',
        left ? 'left-4' : 'right-4',
      )
    "
  >
    <motion.div
      layout
      :animate="{ borderRadius: open ? 20 : 40 }"
      :transition="surface"
      :style="{ transformOrigin: left ? 'bottom left' : 'bottom right' }"
      :class="
        cn(
          'pointer-events-auto absolute bottom-0 overflow-hidden border border-border bg-background text-foreground shadow-lg',
          open ? 'w-[min(86vw,320px)] p-2' : 'h-12 w-12 p-0',
          left ? 'left-0' : 'right-0',
        )
      "
      ><AnimatePresence
        :initial="false"
        mode="popLayout"
        as="div"
        class="contents"
      >
        <motion.div
          v-if="open"
          key="panel"
          role="dialog"
          :aria-label="title"
          :initial="
            reduce
              ? { opacity: 0 }
              : { opacity: 0, x: offset, scale: 0.97, filter: 'blur(2px)' }
          "
          :animate="{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }"
          :exit="
            reduce
              ? { opacity: 0 }
              : { opacity: 0, x: offset, scale: 0.97, filter: 'blur(2px)' }
          "
          :transition="content"
          ><motion.div layout="position"
            ><AnimatePresence
              :initial="false"
              mode="popLayout"
              as="div"
              class="contents"
            >
              <motion.div
                v-if="status === 'sent'"
                key="sent"
                :initial="viewInitial"
                :animate="viewAnimate"
                :exit="viewExit"
                ><div
                  class="flex flex-col items-center justify-center gap-1.5 rounded-[20px] bg-border/60 px-4 py-6 text-center"
                >
                  <div
                    class="relative mb-1 flex h-12 w-12 items-center justify-center"
                  >
                    <template v-if="!reduce"
                      ><motion.span
                        v-for="(sprinkle, index) in sprinkles"
                        :key="index"
                        :initial="{ opacity: 0, scale: 0.4, x: 0, y: 0 }"
                        :animate="{
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0.4],
                          x: sprinkle.x,
                          y: sprinkle.y,
                        }"
                        :transition="{
                          duration: 0.6,
                          delay: 0.18 + index * 0.02,
                          ease: 'easeOut',
                        }"
                        :style="{ backgroundColor: sprinkle.color }"
                        class="absolute h-1.5 w-1.5 rounded-full" /></template
                    ><motion.div
                      :initial="{ scale: reduce ? 1 : 0 }"
                      :animate="{ scale: 1 }"
                      :transition="{
                        type: 'spring',
                        stiffness: 500,
                        damping: 22,
                        delay: 0.04,
                      }"
                      class="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-success)"
                      ><motion.svg
                        viewBox="0 0 24 24"
                        fill="none"
                        class="h-5 w-5 text-white"
                        ><motion.path
                          d="M5 12.5l4.5 4.5L19 7.5"
                          stroke="currentColor"
                          :stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          :initial="{ pathLength: reduce ? 1 : 0 }"
                          :animate="{ pathLength: 1 }"
                          :transition="{
                            duration: 0.35,
                            ease: 'easeOut',
                            delay: 0.15,
                          }" /></motion.svg
                    ></motion.div>
                  </div>
                  <h3 class="text-sm font-semibold text-foreground">Thanks!</h3>
                  <p class="text-xs leading-relaxed text-muted-foreground">
                    Your feedback helps us build something better.
                  </p>
                </div></motion.div
              >
              <motion.div
                v-else-if="status === 'error'"
                key="error"
                :initial="viewInitial"
                :animate="viewAnimate"
                :exit="viewExit"
                ><div
                  role="alert"
                  class="rounded-[20px] bg-border/60 px-4 py-5 text-center"
                >
                  <div
                    class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive"
                  >
                    <AlertCircle class="h-5 w-5" />
                  </div>
                  <h3 class="mt-3 text-sm font-semibold text-foreground">
                    Something went wrong
                  </h3>
                  <p class="mt-1 text-xs leading-relaxed text-muted-foreground">
                    We couldn't send your feedback. Please try again.
                  </p>
                  <Button size="sm" class="mt-4" @click="submit"
                    >Try again</Button
                  >
                </div></motion.div
              >
              <motion.div
                v-else
                key="form"
                :initial="viewInitial"
                :animate="viewAnimate"
                :exit="viewExit"
                ><div
                  class="min-h-[150px] rounded-[20px] bg-border/60 px-4 py-3.5"
                >
                  <div class="flex items-start justify-between gap-3">
                    <h3
                      :id="titleId"
                      class="text-sm font-semibold text-foreground"
                    >
                      {{ title }}
                    </h3>
                    <button
                      type="button"
                      aria-label="Close"
                      class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground/[0.07] text-muted-foreground transition-colors hover:text-foreground"
                      @click="close"
                    >
                      <X class="h-3 w-3" />
                    </button>
                  </div>
                  <textarea
                    ref="textarea"
                    v-model="message"
                    :aria-labelledby="titleId"
                    :placeholder="placeholder"
                    :disabled="busy"
                    :rows="3"
                    class="mt-2 w-full resize-none bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/70 md:text-sm"
                  />
                </div>
                <div class="flex items-center gap-2 px-1 pb-1 pt-2">
                  <Button
                    variant="secondary"
                    size="md"
                    :disabled="busy"
                    class="flex-1 bg-border text-muted-foreground hover:text-foreground"
                    @click="close"
                    >Cancel</Button
                  ><StatefulButton
                    :state="busy ? 'loading' : 'idle'"
                    loading-text="Sending"
                    size="md"
                    :disabled="busy || !message.trim()"
                    class="flex-1 bg-foreground text-background hover:bg-foreground/90"
                    @click="submit"
                    >Submit</StatefulButton
                  >
                </div></motion.div
              >
            </AnimatePresence></motion.div
          ></motion.div
        >
        <motion.button
          v-else
          key="trigger"
          type="button"
          :initial="
            reduce
              ? { opacity: 0 }
              : { opacity: 0, x: -offset, filter: 'blur(2px)' }
          "
          :animate="{ opacity: 1, x: 0, filter: 'blur(0px)' }"
          :exit="
            reduce
              ? { opacity: 0 }
              : { opacity: 0, x: -offset, filter: 'blur(2px)' }
          "
          :transition="content"
          :aria-label="title"
          aria-haspopup="dialog"
          :while-press="reduce ? undefined : { scale: 0.92 }"
          :class="
            cn(
              'absolute bottom-0 flex h-12 w-12 items-center justify-center bg-transparent text-foreground',
              left ? 'left-0' : 'right-0',
            )
          "
          @click="start"
          ><motion.span
            :initial="reduce ? false : { rotate: 45, scale: 0.97 }"
            :animate="{ rotate: 0, scale: 1 }"
            :exit="{ rotate: 45, scale: 0.97 }"
            :transition="content"
            class="grid h-5 w-5 shrink-0 place-items-center [&>svg]:h-full [&>svg]:w-full"
            ><RenderNode :node="icon ?? MessageSquare" /></motion.span
        ></motion.button> </AnimatePresence
    ></motion.div>
  </div>
</template>
