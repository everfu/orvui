<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { EASE_OUT, SPRING_LAYOUT } from "../../../lib/ease";
import { useTreemap } from "./context";
import type { TreemapTile } from "./model";
const props = defineProps<{ tile: TreemapTile }>();
const chart = useTreemap();
const bounds = computed(() => ({
  left: (props.tile.x / chart.size.width) * 100 + "%",
  top: (props.tile.y / chart.size.height) * 100 + "%",
  width: (props.tile.width / chart.size.width) * 100 + "%",
  height: (props.tile.height / chart.size.height) * 100 + "%",
  backgroundColor: props.tile.color,
  color: props.tile.textColor,
  borderRadius: "8px",
}));
const accessibleName = computed(() =>
  [
    props.tile.path.join(" / "),
    chart.formatValue(props.tile.value),
    (props.tile.share * 100).toFixed(1) + "% of total",
    props.tile.description,
  ]
    .filter(Boolean)
    .join(". "),
);
const tabIndex = computed(() =>
  chart.tiles.findIndex((tile) => tile.id === props.tile.id) ===
  Math.max(
    0,
    chart.tiles.findIndex((tile) => tile.id === chart.activeId),
  )
    ? 0
    : -1,
);
function activate() {
  chart.setActive(props.tile.id);
  chart.tooltipOpen = true;
}
</script>
<template>
  <motion.button
    type="button"
    :data-tile="tile.id"
    :layout="!chart.reduce"
    :tabindex="tabIndex"
    :aria-label="accessibleName"
    :aria-describedby="
      chart.tooltipOpen && chart.activeId === tile.id
        ? chart.tooltipId
        : undefined
    "
    class="absolute overflow-hidden border-2 border-background text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
    :style="bounds"
    :initial="{ opacity: 0 }"
    :animate="{ opacity: 1 }"
    :exit="{ opacity: 0 }"
    :transition="{
      layout: chart.reduce ? { duration: 0 } : SPRING_LAYOUT,
      opacity: { duration: 0.18, ease: EASE_OUT },
    }"
    @pointerenter="chart.canHover && activate()"
    @pointerdown="activate"
    @click="activate"
    @focus="activate"
    ><motion.span
      aria-hidden="true"
      :layout="chart.reduce ? false : 'position'"
      :transition="chart.reduce ? { duration: 0 } : SPRING_LAYOUT"
      class="absolute inset-x-2 top-2 min-w-0 sm:inset-x-3 sm:top-3"
      ><slot :tile="tile"
        ><template v-if="tile.width >= 52 && tile.height >= 32"
          ><span class="block truncate text-xs font-semibold sm:text-sm">{{
            tile.label
          }}</span
          ><span
            v-if="tile.width >= 70 && tile.height >= 56"
            class="mt-1 block truncate font-mono text-[10px] tabular-nums opacity-80 sm:text-xs"
            >{{ chart.formatValue(tile.value) }}</span
          ></template
        ></slot
      ></motion.span
    ><motion.span
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-white/10"
      :initial="false"
      :animate="{
        opacity: chart.tooltipOpen && chart.activeId === tile.id ? 1 : 0,
      }"
      :transition="{ duration: 0.1, ease: EASE_OUT }"
  /></motion.button>
</template>
