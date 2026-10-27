<script setup lang="ts">
import { computed, type VNodeChild } from "vue";
import { motion, AnimatePresence } from "motion-v";
import {
  Bell,
  Info,
  LoaderCircle,
  Check,
  AlertCircle,
  X,
} from "lucide-vue-next";
import { EASE_OUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { cn } from "../../../lib/utils";
import RenderContent from "../../../lib/RenderContent";
import type {
  AnimatedToast,
  ToastClassNames,
  ToastStatus,
} from "./useAnimatedToastStack";
const props = defineProps<{
  toast: AnimatedToast;
  index: number;
  classNames?: ToastClassNames;
  icons?: Partial<Record<ToastStatus, any>>;
  canDismiss: boolean;
  renderToast?: (toast: AnimatedToast) => VNodeChild;
}>();
const emit = defineEmits<{ dismiss: [id: string] }>(),
  reduce = useReducedMotion();
const status = computed(() => props.toast.status ?? "neutral"),
  details = computed(() => !!(props.toast.description || props.toast.action));
const icons = {
  neutral: Bell,
  info: Info,
  loading: LoaderCircle,
  success: Check,
  error: AlertCircle,
};
const colors = {
  neutral: "text-muted-foreground bg-muted/60",
  info: "text-primary bg-muted",
  loading: "text-primary bg-muted",
  success: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400",
  error: "text-destructive bg-destructive/10",
};
const contentTransition = { duration: 0.28, ease: EASE_OUT },
  spring = { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.75 };
const iconHidden = computed(() =>
    reduce.value
      ? { opacity: 0 }
      : { opacity: 0, y: 8, scale: 0.8, filter: "blur(6px)" },
  ),
  iconShown = computed(() =>
    reduce.value
      ? { opacity: 1 }
      : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  ),
  iconExit = computed(() =>
    reduce.value
      ? { opacity: 0 }
      : { opacity: 0, y: -8, scale: 0.9, filter: "blur(6px)" },
  );
const bodyHidden = computed(() =>
    reduce.value ? { opacity: 0 } : { opacity: 0, y: 8, filter: "blur(6px)" },
  ),
  bodyShown = computed(() =>
    reduce.value ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" },
  ),
  bodyExit = computed(() =>
    reduce.value ? { opacity: 0 } : { opacity: 0, y: -8, filter: "blur(6px)" },
  );
function dragEnd(
  _event: unknown,
  info: { offset: { x: number }; velocity: { x: number } },
) {
  if (
    props.canDismiss &&
    (Math.abs(info.offset.x) > 72 || Math.abs(info.velocity.x) > 520)
  )
    emit("dismiss", props.toast.id);
}
</script>
<template>
  <motion.li
    layout
    :initial="
      reduce
        ? { opacity: 0 }
        : { opacity: 0, y: 22, scale: 0.96, filter: 'blur(10px)' }
    "
    :animate="
      reduce
        ? { opacity: 1 }
        : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
    "
    :exit="
      reduce
        ? { opacity: 0 }
        : {
            opacity: 0,
            x: 32,
            scale: 0.96,
            filter: 'blur(8px)',
            transition: { duration: 0.18, ease: EASE_OUT },
          }
    "
    :transition="spring"
    :drag="canDismiss && !reduce ? 'x' : false"
    :drag-constraints="{ left: 0, right: 0 }"
    :drag-elastic="0.18"
    :class="
      cn('pointer-events-auto relative will-change-transform', classNames?.item)
    "
    :style="{ zIndex: 20 - index }"
    @drag-end="dragEnd"
    ><div
      :class="
        cn(
          'relative overflow-hidden rounded-2xl border border-border bg-card/95 p-3 shadow-2xl backdrop-blur-xl',
          classNames?.surface,
        )
      "
    >
      <slot v-if="$slots.default" /><RenderContent
        v-else-if="renderToast"
        :node="renderToast(toast)"
      />
      <div
        v-else
        :class="['flex gap-3', details ? 'items-start' : 'items-center']"
      >
        <motion.span
          layout
          :class="
            cn(
              'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
              details && 'mt-0.5',
              colors[status],
              classNames?.iconWrap,
            )
          "
          ><AnimatePresence mode="popLayout" :initial="false"
            ><motion.span
              :key="status"
              :initial="iconHidden"
              :animate="iconShown"
              :exit="iconExit"
              :transition="contentTransition"
              :class="[
                'inline-flex',
                status === 'loading' && !reduce && 'animate-spin',
              ]"
              ><RenderContent
                v-if="props.icons?.[status] || toast.icon"
                :node="props.icons?.[status] ?? toast.icon" /><component
                v-else
                :is="icons[status]"
                class="h-3.5 w-3.5" /></motion.span></AnimatePresence
        ></motion.span>
        <div :class="cn('min-w-0 flex-1', classNames?.content)">
          <AnimatePresence mode="popLayout" :initial="false"
            ><motion.div
              :key="`${toast.id}-${status}-${String(toast.title)}`"
              :initial="bodyHidden"
              :animate="bodyShown"
              :exit="bodyExit"
              :transition="contentTransition"
              ><p
                :class="
                  cn(
                    'truncate text-sm font-medium leading-5 text-foreground',
                    classNames?.title,
                  )
                "
              >
                <RenderContent :node="toast.title" />
              </p>
              <p
                v-if="toast.description"
                :class="
                  cn(
                    'mt-0.5 line-clamp-2 text-xs leading-4 text-muted-foreground',
                    classNames?.description,
                  )
                "
              >
                <RenderContent
                  :node="toast.description"
                /></p></motion.div></AnimatePresence
          ><button
            v-if="toast.action"
            type="button"
            :class="
              cn(
                'mt-2 inline-flex h-7 items-center rounded-full bg-muted/80 px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                classNames?.action,
              )
            "
            @click="toast.action.onClick(toast)"
          >
            <RenderContent :node="toast.action.label" />
          </button>
        </div>
        <button
          v-if="canDismiss"
          type="button"
          aria-label="Dismiss toast"
          :class="
            cn(
              'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
              classNames?.close,
            )
          "
          @click="emit('dismiss', toast.id)"
        >
          <X class="h-3.5 w-3.5" />
        </button>
      </div></div
  ></motion.li>
</template>
