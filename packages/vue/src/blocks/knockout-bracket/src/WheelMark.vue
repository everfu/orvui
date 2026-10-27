<script setup lang="ts">
import { computed, ref } from "vue";
import { motion } from "motion-v";
import { Shield } from "lucide-vue-next";
import {
  crestSrc,
  initials,
  INITIALS_MIN,
  TROPHY_PATH,
  TROPHY_SIZE,
  CENTER,
  HUB_R,
  TROPHY_GAP,
  type WheelNode,
} from "./wheel-model";
import { SPRING_PANEL } from "../../../lib/ease";
const props = defineProps<{
  node: WheelNode;
  lit: boolean;
  dimmed: boolean;
  loadFlag: boolean;
  reduce: boolean;
  showTrophy: boolean;
  clipId: string;
}>();
const failed = ref<string | null>(null),
  src = computed(() => {
    const url = props.node.team ? crestSrc(props.node.team) : null;
    return failed.value === url ? null : url;
  });
const box = computed(() =>
  props.node.team?.logo
    ? { w: props.node.r * 1.44, h: props.node.r * 1.44, fit: "xMidYMid meet" }
    : { w: props.node.r * 2.68, h: props.node.r * 2, fit: "xMidYMid slice" },
);
const transition = computed(() => ({ duration: props.reduce ? 0 : 0.18 })),
  fade = computed(() => ({ opacity: props.dimmed ? 0.38 : 1 }));
</script>
<template>
  <motion.g
    :initial="reduce ? false : { opacity: 0, scale: 0.6 }"
    :animate="{ opacity: 1, scale: 1 }"
    :transition="
      reduce
        ? { duration: 0 }
        : {
            ...SPRING_PANEL,
            opacity: { duration: 0.24 },
            delay: node.depth * 0.06,
          }
    "
    :style="{ transformOrigin: `${node.x}px ${node.y}px` }"
    ><g
      v-if="showTrophy"
      :transform="`translate(${CENTER - TROPHY_SIZE / 2},${CENTER - HUB_R - TROPHY_GAP - TROPHY_SIZE})`"
      ><path :d="TROPHY_PATH" class="fill-warning" /></g
    ><circle :cx="node.x" :cy="node.y" :r="node.r" class="fill-card" /><template
      v-if="src && loadFlag && node.team"
      ><clipPath :id="clipId"
        ><circle :cx="node.x" :cy="node.y" :r="node.r" /></clipPath
      ><motion.image
        :href="src"
        :x="node.x - box.w / 2"
        :y="node.y - box.h / 2"
        :width="box.w"
        :height="box.h"
        :clip-path="`url(#${clipId})`"
        :preserveAspectRatio="box.fit"
        :initial="false"
        :animate="fade"
        :transition="transition"
        @error="failed = src" /></template
    ><motion.text
      v-else-if="node.team"
      :x="node.x"
      :y="node.y"
      text-anchor="middle"
      dominant-baseline="central"
      :font-size="Math.max(node.r * 0.8, INITIALS_MIN)"
      :initial="false"
      :animate="fade"
      :transition="transition"
      class="fill-muted-foreground font-semibold"
      >{{ initials(node.team.name) }}</motion.text
    ><motion.g v-else :initial="false" :animate="fade" :transition="transition"
      ><Shield
        :x="node.x - node.r * 0.7"
        :y="node.y - node.r * 0.7"
        :width="node.r * 1.4"
        :height="node.r * 1.4"
        class="fill-current text-muted-foreground/50" /></motion.g
    ><circle
      :cx="node.x"
      :cy="node.y"
      :r="node.r"
      fill="none"
      :stroke-width="lit ? 2 : 1"
      :class="lit ? 'stroke-foreground' : 'stroke-border'"
  /></motion.g>
</template>
