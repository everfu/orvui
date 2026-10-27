<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { LayoutGroup, AnimatePresence } from "motion-v";
import { cn } from "../../../lib/utils";
import { useTreemap } from "./context";
import type { TreemapTile } from "./model";
import TreemapCell from "./TreemapCell.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ tileClassName?: string }>();
const chart = useTreemap();
const element = ref<HTMLElement | null>(null);
let focused: string | null = null,
  live = false;
onMounted(() => {
  live = true;
  chart.plotRef = element.value;
});
onBeforeUnmount(() => {
  live = false;
  if (chart.plotRef === element.value) chart.plotRef = null;
});
watch(
  () => chart.tiles.map((tile) => tile.id),
  async (ids) => {
    if (!focused || ids.includes(focused)) return;
    focused = null;
    await nextTick();
    if (
      live &&
      (document.activeElement === document.body ||
        !element.value?.contains(document.activeElement))
    )
      (
        element.value?.querySelector<HTMLElement>("[data-tile]") ??
        element.value
      )?.focus();
  },
);
function remember(event: FocusEvent) {
  focused = (event.target as HTMLElement).dataset.tile ?? null;
}
function destination(current: TreemapTile, key: string) {
  if (key === "Home") return chart.tiles[0];
  if (key === "End") return chart.tiles.at(-1);
  const horizontal = key === "ArrowLeft" || key === "ArrowRight";
  const sign = key === "ArrowLeft" || key === "ArrowUp" ? -1 : 1;
  const cx = current.x + current.width / 2,
    cy = current.y + current.height / 2;
  let best = Infinity,
    selected = current;
  for (const tile of chart.tiles) {
    const dx = tile.x + tile.width / 2 - cx,
      dy = tile.y + tile.height / 2 - cy;
    const forward = (horizontal ? dx : dy) * sign;
    const score = forward + Math.abs(horizontal ? dy : dx) * 2;
    if (forward > 0.01 && score < best) {
      best = score;
      selected = tile;
    }
  }
  return selected;
}
function keydown(event: KeyboardEvent) {
  const current = chart.tiles.find(
    (tile) => tile.id === (event.target as HTMLElement).dataset.tile,
  );
  if (!current) return;
  if (event.key === "Escape") {
    chart.tooltipOpen = false;
    return;
  }
  if (
    ![
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ].includes(event.key)
  )
    return;
  event.preventDefault();
  const next = destination(current, event.key);
  Array.from(element.value?.querySelectorAll<HTMLElement>("[data-tile]") ?? [])
    .find((node) => node.dataset.tile === next?.id)
    ?.focus();
}
</script>
<template>
  <LayoutGroup
    ><div
      ref="element"
      v-bind="$attrs"
      role="group"
      aria-label="Treemap tiles"
      tabindex="-1"
      data-slot="treemap-plot"
      :class="
        cn(
          'relative h-80 w-full min-w-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring',
          $attrs.class as string,
        )
      "
      @focusin="remember"
      @keydown="keydown"
      @pointerleave="chart.tooltipOpen = false"
      @focusout="
        !element?.contains($event.relatedTarget as Node) &&
        (chart.tooltipOpen = false)
      "
    >
      <AnimatePresence :initial="false"
        ><TreemapCell
          v-for="tile in chart.tiles"
          :key="tile.id"
          :tile="tile"
          :class="props.tileClassName"
          ><template v-if="$slots.tile" #default="scope"
            ><slot name="tile" v-bind="scope" /></template></TreemapCell
      ></AnimatePresence>
      <p
        v-if="!chart.tiles.length"
        class="flex h-full items-center justify-center text-sm text-muted-foreground"
      >
        {{ chart.items.length ? "No positive values" : "No treemap data" }}
      </p>
    </div></LayoutGroup
  >
</template>
