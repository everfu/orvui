<script setup lang="ts">
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { Tooltip } from "../../../motion/tooltip";
import { SIZE, CENTER, OUTER_R, pct, matchLabel } from "./wheel-model";
import { useWheel } from "./use-wheel";
import WheelMark from "./WheelMark.vue";
import type { Round } from "./types";
const props = withDefaults(
  defineProps<{ rounds: Round[]; initialRound?: number }>(),
  { initialRound: 0 },
);
const {
  reduce,
  uid,
  stage,
  svg,
  inView,
  canHover,
  hovered,
  focused,
  visible,
  model,
  lit,
  captions,
  tabStop,
  tapped,
  key,
  down,
  cancel,
  click,
} = useWheel(props);
</script>
<template>
  <div class="w-full max-w-full overflow-x-auto overscroll-x-contain">
    <div
      ref="stage"
      class="relative mx-auto w-full min-w-[32rem] max-w-[34rem]"
    >
      <svg
        ref="svg"
        :viewBox="`0 0 ${SIZE} ${SIZE}`"
        role="img"
        :aria-label="`Tournament wheel${model.champion ? ', won by ' + model.champion.name : ''}`"
        class="h-auto w-full touch-manipulation"
      >
        <defs>
          <radialGradient :id="uid + '-glow'">
            <stop
              offset="0%"
              stop-color="var(--color-warning)"
              stop-opacity=".14"
            />
            <stop
              offset="45%"
              stop-color="var(--color-warning)"
              stop-opacity=".04"
            />
            <stop
              offset="100%"
              stop-color="var(--color-warning)"
              stop-opacity="0"
            />
          </radialGradient>
        </defs>
        <circle
          v-if="model.champion"
          :cx="CENTER"
          :cy="CENTER"
          :r="OUTER_R * 0.62"
          :fill="`url(#${uid}-glow)`"
        />
        <g>
          <motion.path
            v-for="link in model.links"
            :key="link.id"
            :d="link.d"
            fill="none"
            :initial="reduce ? false : { opacity: 0 }"
            :animate="{ opacity: 1 }"
            :transition="{ duration: 0.3, delay: link.depth * 0.06 }"
            class="stroke-border-strong"
          />
        </g>
        <WheelMark
          v-for="node in model.nodes"
          :key="node.id"
          :node="node"
          :lit="lit.has(node.id)"
          :dimmed="lit.size > 0 && !lit.has(node.id)"
          :load-flag="inView"
          :reduce="reduce"
          :show-trophy="node.depth === 0 && !!model.champion"
          :clip-id="uid + '-clip-' + node.id"
        />
      </svg>
      <div
        v-for="node in model.nodes"
        :key="node.id"
        class="absolute"
        :style="{
          left: pct(node.x - node.r),
          top: pct(node.y - node.r),
          width: pct(node.r * 2),
          height: pct(node.r * 2),
        }"
      >
        <Tooltip
          :content="captions.get(node.id) ?? ''"
          side="top"
          :disabled="!canHover"
          class="max-w-[20rem] whitespace-normal text-balance break-words text-center"
          ><button
            :id="uid + '-' + node.id"
            type="button"
            :tabindex="node.id === tabStop ? 0 : -1"
            :aria-label="captions.get(node.id)"
            class="block h-full w-full rounded-full outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            @keydown="key($event, node)"
            @focus.capture="focused = node.id"
            @blur.capture="focused = null"
            @pointerenter="
              (event) => {
                if (event.pointerType !== 'touch') hovered = node.id;
              }
            "
            @pointerleave="
              (event) => {
                if (event.pointerType !== 'touch') hovered = null;
              }
            "
            @pointerdown="down($event, node)"
            @pointercancel="cancel"
            @click="click($event, node)"
        /></Tooltip>
      </div>
      <motion.p
        v-if="tapped"
        :initial="reduce ? false : { opacity: 0, scale: 0.94 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ duration: reduce ? 0 : 0.18 }"
        :style="{
          left: pct(tapped.x),
          top: pct(tapped.y + (tapped.y > CENTER ? -tapped.r : tapped.r)),
        }"
        :class="
          cn(
            'pointer-events-none absolute z-10 w-max max-w-[min(18rem,80vw)] -translate-x-1/2 text-balance break-words rounded-lg border border-border bg-background px-2.5 py-1 text-center text-xs font-medium shadow-lg',
            tapped.y > CENTER
              ? '-translate-y-[calc(100%+8px)]'
              : 'translate-y-2',
          )
        "
        >{{ captions.get(tapped.id) }}</motion.p
      >
    </div>
    <div class="sr-only">
      <ul
        v-for="round in [...visible].reverse()"
        :key="round.name"
        :aria-label="round.name"
      >
        <li v-for="match in round.matches" :key="match.id">
          {{ matchLabel(match) }}
        </li>
      </ul>
    </div>
  </div>
</template>
