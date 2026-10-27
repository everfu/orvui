<script setup lang="ts">
import { getCurrentInstance } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { Eye, EyeOff, EllipsisVertical } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { DigitSwap } from "../../../motion/number";
import { RenderNode, type Content } from "../../shared";
import { SPRING_LAYOUT, SPRING_PRESS, EASE_OUT } from "../../../lib/ease";
import { useCardFolder } from "./use-card-folder";
import { purseOutline, purseSeam } from "./purse-shape";
const props = withDefaults(
  defineProps<{
    title: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    card?: Content;
    open?: boolean;
    defaultOpen?: boolean;
    detailsVisible?: boolean;
    defaultDetailsVisible?: boolean;
    actionLabel?: string;
    ariaLabel?: string;
    disabled?: boolean;
    cardClassName?: string;
  }>(),
  {
    open: undefined,
    detailsVisible: undefined,
    defaultOpen: false,
    defaultDetailsVisible: false,
  },
);
const emit = defineEmits<{
    "update:open": [open: boolean];
    openChange: [open: boolean];
    "update:detailsVisible": [visible: boolean];
    detailsVisibleChange: [visible: boolean];
    click: [];
    action: [];
  }>(),
  instance = getCurrentInstance(),
  hasAction = () => !!instance?.vnode.props?.onAction;
const {
  open,
  details,
  reduce,
  cardTransform,
  backTransform,
  frontTransform,
  purseOpacity,
  lastFour,
  revealed,
  ariaLabel,
  toggle,
} = useCardFolder(props, {
  open(value) {
    emit("update:open", value);
    emit("openChange", value);
  },
  details(value) {
    emit("update:detailsVisible", value);
    emit("detailsVisibleChange", value);
  },
  click() {
    emit("click");
  },
});
</script>
<template>
  <div
    :data-open="open"
    :data-details-visible="details"
    class="relative aspect-[1029/592] w-96 max-w-full select-none [perspective:1200px]"
  >
    <motion.button
      type="button"
      :disabled="disabled"
      :aria-label="ariaLabel"
      :aria-expanded="open"
      class="absolute inset-0 block rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
      :while-press="reduce || disabled ? undefined : { scale: 0.96 }"
      :transition="reduce ? { duration: 0 } : SPRING_PRESS"
      @click="toggle"
      ><motion.span
        data-slot="card-folder-back"
        aria-hidden="true"
        :initial="false"
        :animate="reduce ? { opacity: open ? 0 : 1 } : undefined"
        :transition="{ duration: 0.16, ease: EASE_OUT }"
        :style="
          reduce
            ? undefined
            : { opacity: purseOpacity, transform: backTransform }
        "
        class="absolute inset-x-0 bottom-0 top-[10%] rounded-2xl border border-foreground/10 bg-background [transform-origin:center_bottom]" /><motion.span
        aria-hidden="true"
        :initial="false"
        :animate="reduce ? { transform: 'translateY(0%) scale(1)' } : undefined"
        :style="reduce ? undefined : { transform: cardTransform }"
        :class="
          cn(
            'absolute left-[4.7%] right-[4.7%] top-0 z-10 aspect-[1.586/1] overflow-hidden rounded-xl border border-foreground/10 bg-background [transform-origin:center_bottom] will-change-transform',
            cardClassName,
          )
        "
        ><slot name="card"><RenderNode :node="card" /></slot></motion.span
    ></motion.button>
    <motion.span
      :aria-hidden="open"
      :inert="open || undefined"
      :initial="false"
      :animate="reduce ? { opacity: open ? 0 : 1 } : undefined"
      :transition="{ duration: 0.16, ease: EASE_OUT }"
      :style="
        reduce
          ? undefined
          : { opacity: purseOpacity, transform: frontTransform }
      "
      class="pointer-events-none absolute inset-x-0 bottom-0 top-1/2 z-20 [backface-visibility:hidden] [transform-origin:center_bottom]"
      ><svg
        aria-hidden="true"
        viewBox="0 0 384 110"
        preserveAspectRatio="none"
        class="absolute inset-0 size-full overflow-visible"
      >
        <path
          :d="purseOutline"
          fill="var(--background)"
          stroke="var(--foreground)"
          stroke-opacity=".12"
          vector-effect="non-scaling-stroke"
        />
        <path
          :d="purseSeam"
          fill="none"
          stroke="var(--foreground)"
          stroke-dasharray="5 5"
          stroke-linecap="round"
          stroke-opacity=".22"
          vector-effect="non-scaling-stroke"
        /></svg
      ><span
        class="absolute inset-x-[5%] inset-y-0 z-10 flex min-w-0 flex-col justify-between py-4"
        ><span class="flex items-start justify-between pr-2"
          ><motion.button
            type="button"
            :disabled="disabled"
            :tabindex="open ? -1 : undefined"
            :aria-label="details ? 'Hide card details' : 'Show card details'"
            :aria-pressed="details"
            :class="
              cn(
                'z-30 flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:opacity-50',
                open ? 'pointer-events-none' : 'pointer-events-auto',
              )
            "
            :while-press="reduce || disabled ? undefined : { scale: 0.96 }"
            :transition="SPRING_PRESS"
            @click="!disabled && (details = !details)"
            ><AnimatePresence :initial="false" mode="popLayout"
              ><motion.span
                :key="details ? 'hide' : 'show'"
                :initial="
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.25, filter: 'blur(4px)' }
                "
                :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)' }"
                :exit="
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.25, filter: 'blur(4px)' }
                "
                :transition="
                  reduce
                    ? { duration: 0.12 }
                    : { type: 'spring', duration: 0.3, bounce: 0 }
                "
                ><component
                  :is="details ? EyeOff : Eye"
                  class="size-4" /></motion.span></AnimatePresence></motion.button
          ><span class="flex shrink-0 items-end gap-3.5 pt-2"
            ><span class="flex flex-col gap-0.5"
              ><span
                class="text-[9px] font-medium uppercase tracking-[.12em] text-muted-foreground/75"
                >Expiry</span
              ><span class="text-xs font-medium tabular-nums">{{
                expiry
              }}</span></span
            ><span class="flex flex-col gap-0.5"
              ><span
                class="text-[9px] font-medium uppercase tracking-[.12em] text-muted-foreground/75"
                >CVV</span
              ><DigitSwap
                :value="details ? cvv : '•'.repeat(Math.max(3, cvv.length))"
                :animation-key="details ? 'revealed' : 'masked'"
                :direction="details ? 'up' : 'down'"
                class="text-xs font-medium tabular-nums" /></span></span></span
        ><span class="flex min-w-0 items-baseline justify-between gap-4"
          ><span class="truncate text-lg font-medium leading-tight">{{
            title
          }}</span
          ><DigitSwap
            :value="details ? revealed : '•••• •••• •••• ' + lastFour"
            :animation-key="details ? 'revealed' : 'masked'"
            :direction="details ? 'up' : 'down'"
            :suffix-length="4"
            :glyph-class-name="
              details ? 'text-foreground' : 'text-muted-foreground'
            "
            suffix-class-name="text-foreground"
            class="truncate font-mono text-xs tracking-[.08em] tabular-nums" /></span></span
    ></motion.span>
    <motion.button
      v-if="hasAction()"
      type="button"
      :disabled="disabled"
      :aria-label="actionLabel || 'Open actions for ' + title"
      :animate="{ y: open && !reduce ? -14 : 0 }"
      :while-press="reduce || disabled ? undefined : { scale: 0.96 }"
      :transition="reduce ? { duration: 0 } : SPRING_LAYOUT"
      class="absolute right-[2.6%] top-[10%] z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-white/65 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50"
      @click="emit('action')"
      ><EllipsisVertical class="size-4"
    /></motion.button>
  </div>
</template>
