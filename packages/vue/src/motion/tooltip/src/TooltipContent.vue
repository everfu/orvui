<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { useSlots } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { useTooltip, type TooltipContentProps } from "./context";
import { createTooltipPosition } from "./position";
import { EASE_OUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { cn } from "../../../lib/utils";
const props = withDefaults(defineProps<TooltipContentProps>(), {
  side: "top",
  align: "center",
  arrow: false,
});
const state = useTooltip();
const slots = useSlots();
const reduced = useReducedMotion();
const { mounted, ready, positioner, arrow, arrowPath, arrowStyle } =
  createTooltipPosition(state, props, () => !!slots.default);
</script>
<template>
  <Teleport v-if="mounted" to="body"
    ><span
      v-if="state.props.asLabel && !state.empty.value"
      :id="state.labelId"
      hidden
      ><slot /></span
    ><AnimatePresence
      ><span
        v-if="state.open.value && !state.empty.value"
        ref="positioner"
        class="pointer-events-none fixed left-0 top-0 z-[9999] w-max"
        :style="{ visibility: 'hidden', maxWidth: 'calc(100vw - 16px)' }"
        ><motion.span
          v-bind="$attrs"
          :id="state.props.asLabel ? undefined : state.id"
          role="tooltip"
          :aria-hidden="state.props.asLabel || undefined"
          :initial="{ opacity: 0, scale: reduced ? 1 : 0.94 }"
          :animate="{
            opacity: ready ? 1 : 0,
            scale: ready || reduced ? 1 : 0.94,
          }"
          :exit="{
            opacity: 0,
            scale: reduced ? 1 : 0.94,
            transition: { duration: 0.12, ease: EASE_OUT },
          }"
          :transition="{ duration: 0.18, ease: EASE_OUT }"
          :style="{
            transformOrigin: 'var(--tooltip-origin,center)',
            pointerEvents: state.props.followCursor ? 'none' : 'auto',
          }"
          :class="
            cn(
              'relative block max-w-[min(20rem,calc(100vw-16px))] whitespace-normal break-words rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground shadow-md',
              $attrs.class,
            )
          "
          @pointerenter="state.enterContent"
          @pointerleave="state.leaveContent"
          ><slot /><svg
            v-if="props.arrow"
            ref="arrow"
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            class="pointer-events-none absolute overflow-visible"
            :style="arrowStyle"
          >
            <path
              :d="arrowPath + 'Z'"
              style="fill: var(--tooltip-arrow-fill, transparent)"
            />
            <path
              :d="arrowPath"
              fill="none"
              stroke-width="1"
              style="stroke: var(--tooltip-arrow-stroke, transparent)"
            /></svg></motion.span></span></AnimatePresence
  ></Teleport>
</template>
