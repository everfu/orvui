<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { motion } from "motion-v";
import { EASE_OUT, SPRING_LAYOUT } from "../../../lib/ease";
import { useSankeyChart, emphasis } from "./context";
import type { PlacedNode } from "./model";
const props = withDefaults(defineProps<{ showValues?: boolean }>(), {
  showValues: true,
});
const chart = useSankeyChart(),
  element = ref<HTMLElement | null>(null);
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
  () => chart.nodes.map((node) => node.id),
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
        element.value?.querySelector<HTMLElement>("[data-node]") ??
        element.value
      )?.focus();
  },
);
const lit = computed(() => emphasis(chart.active));
const links = computed(() =>
  chart.links.map((link, index) => ({
    link,
    gradient: `${chart.gradientId}-${index}`,
    opacity: chart.active ? (lit.value.link(link) ? 0.6 : 0.08) : 0.32,
  })),
);
const nodes = computed(() => {
  const room =
    chart.columns > 1
      ? chart.step -
        (chart.nodes[0] ? chart.nodes[0].x1 - chart.nodes[0].x0 : 12) -
        16
      : chart.size.width;
  const characters = Math.floor(room / 6.6);
  const connected = new Set<string>();
  if (chart.active?.type === "node")
    for (const link of chart.links) {
      if (link.source.id === chart.activeId) connected.add(link.target.id);
      if (link.target.id === chart.activeId) connected.add(link.source.id);
    }
  return chart.nodes.map((node) => {
    const last = chart.columns > 1 && node.depth === chart.columns - 1;
    const height = node.y1 - node.y0;
    return {
      node,
      label:
        characters >= node.label.length
          ? node.label
          : characters < 4
            ? ""
            : node.label.slice(0, characters - 1).trimEnd() + "…",
      twoLines:
        props.showValues &&
        height >= 12 * 2.4 &&
        chart.formatValue(node.value).length * 6.6 <= room,
      labelX: last ? node.x0 - 8 : node.x1 + 8,
      align: last ? "end" : "start",
      lit: lit.value.node(node) || connected.has(node.id),
      bounds: {
        left: ((node.x0 - 4) / chart.size.width) * 100 + "%",
        top:
          (((node.y0 + node.y1) / 2 - Math.max(24, height) / 2) /
            chart.size.height) *
            100 +
          "%",
        width: ((node.x1 - node.x0 + 8) / chart.size.width) * 100 + "%",
        height: (Math.max(24, height) / chart.size.height) * 100 + "%",
      },
    };
  });
});
function activate(id: string) {
  chart.setActive(id);
  chart.tooltipOpen = true;
}
function remember(event: FocusEvent) {
  focused = (event.target as HTMLElement).dataset.node ?? null;
}
function leave() {
  chart.tooltipOpen = false;
  chart.setActive(null);
}
function destination(current: PlacedNode, key: string) {
  if (key === "Home") return chart.nodes[0];
  if (key === "End") return chart.nodes.at(-1);
  if (key === "ArrowUp" || key === "ArrowDown") {
    const column = chart.nodes.filter((node) => node.depth === current.depth);
    return column[column.indexOf(current) + (key === "ArrowUp" ? -1 : 1)];
  }
  const direction = key === "ArrowLeft" ? -1 : 1;
  const center = (current.y0 + current.y1) / 2;
  for (
    let depth = current.depth + direction;
    depth >= 0 && depth < chart.columns;
    depth += direction
  ) {
    const candidates = chart.nodes.filter((node) => node.depth === depth);
    if (candidates.length)
      return candidates.sort(
        (a, b) =>
          Math.abs((a.y0 + a.y1) / 2 - center) -
          Math.abs((b.y0 + b.y1) / 2 - center),
      )[0];
  }
}
function keydown(event: KeyboardEvent, node: PlacedNode) {
  if (event.key === "Escape") {
    chart.tooltipOpen = false;
    return;
  }
  if (
    ![
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
    ].includes(event.key)
  )
    return;
  event.preventDefault();
  const next = destination(node, event.key) ?? node;
  Array.from(element.value?.querySelectorAll<HTMLElement>("[data-node]") ?? [])
    .find((item) => item.dataset.node === next.id)
    ?.focus();
}
</script>
<template>
  <div class="-m-2 overflow-x-auto overflow-y-hidden p-2">
    <div
      ref="element"
      role="group"
      :aria-label="chart.label"
      tabindex="-1"
      class="relative h-80 w-full min-w-[32rem] outline-none"
      data-slot="sankey-chart-plot"
      @focusin="remember"
      @focusout="!element?.contains($event.relatedTarget as Node) && leave()"
      @pointerleave="$event.pointerType !== 'touch' && leave()"
    >
      <p
        v-if="chart.empty"
        class="flex h-full items-center justify-center text-sm text-muted-foreground"
      >
        {{ chart.empty }}
      </p>
      <template v-else>
        <svg
          :viewBox="`0 0 ${chart.size.width} ${chart.size.height}`"
          class="size-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              v-for="entry in links"
              :id="entry.gradient"
              :key="entry.link.id"
              gradientUnits="userSpaceOnUse"
              :x1="entry.link.x0"
              :x2="entry.link.x1"
            >
              <stop offset="0" :stop-color="entry.link.source.color" />
              <stop offset="1" :stop-color="entry.link.target.color" />
            </linearGradient>
          </defs>
          <g v-for="{ link, gradient, opacity } in links" :key="link.id">
            <motion.path
              :d="link.path"
              :stroke-width="link.width"
              :stroke="`url(#${gradient})`"
              fill="none"
              :initial="
                chart.reduce
                  ? { d: link.path, strokeWidth: link.width, opacity }
                  : {
                      d: link.path,
                      strokeWidth: link.width,
                      pathLength: 0,
                      opacity: 0,
                    }
              "
              :while-in-view="{
                d: link.path,
                strokeWidth: link.width,
                pathLength: 1,
                opacity,
              }"
              :animate="{ d: link.path, strokeWidth: link.width, opacity }"
              :in-view-options="{ once: true }"
              :transition="
                chart.reduce
                  ? { duration: 0 }
                  : {
                      d: SPRING_LAYOUT,
                      strokeWidth: SPRING_LAYOUT,
                      pathLength: {
                        duration: 0.7,
                        delay: link.source.depth * 0.12,
                        ease: EASE_OUT,
                      },
                      opacity: { duration: 0.18 },
                    }
              "
            />
            <path
              :d="link.path"
              fill="none"
              stroke="transparent"
              :stroke-width="Math.max(8, link.width)"
              @pointerenter="chart.canHover && activate(link.id)"
              @click="activate(link.id)"
            />
          </g>
          <motion.g
            v-for="entry in nodes"
            :key="entry.node.id"
            :animate="{ opacity: entry.lit ? 1 : 0.3 }"
            :transition="{ duration: chart.reduce ? 0 : 0.18 }"
          >
            <motion.rect
              :fill="entry.node.color"
              rx="2"
              :initial="false"
              :animate="{
                x: entry.node.x0,
                y: entry.node.y0,
                width: entry.node.x1 - entry.node.x0,
                height: entry.node.y1 - entry.node.y0,
              }"
              :transition="chart.reduce ? { duration: 0 } : SPRING_LAYOUT"
            />
            <motion.text
              v-if="entry.node.y1 - entry.node.y0 >= 12 && entry.label"
              :x="entry.labelX"
              :text-anchor="entry.align"
              dominant-baseline="middle"
              class="fill-foreground stroke-background text-xs [paint-order:stroke]"
              stroke-width="3"
              stroke-linejoin="round"
              :initial="
                chart.reduce
                  ? false
                  : { y: (entry.node.y0 + entry.node.y1) / 2, opacity: 0 }
              "
              :animate="{ y: (entry.node.y0 + entry.node.y1) / 2, opacity: 1 }"
              :transition="
                chart.reduce
                  ? { duration: 0 }
                  : {
                      y: SPRING_LAYOUT,
                      opacity: { duration: 0.2, ease: EASE_OUT },
                    }
              "
            >
              <tspan
                :x="entry.labelX"
                :dy="entry.twoLines ? '-0.6em' : 0"
                class="font-medium"
              >
                {{ entry.label }}
              </tspan>
              <tspan
                v-if="entry.twoLines"
                :x="entry.labelX"
                dy="1.2em"
                class="fill-muted-foreground tabular-nums"
              >
                {{ chart.formatValue(entry.node.value) }}
              </tspan>
            </motion.text>
          </motion.g>
        </svg>
        <button
          v-for="{ node, bounds } in nodes"
          :key="node.id"
          type="button"
          :data-node="node.id"
          :tabindex="
            node.id ===
            (chart.active?.type === 'node'
              ? chart.activeId
              : chart.nodes[0]?.id)
              ? 0
              : -1
          "
          :aria-label="`${node.label}. ${chart.formatValue(node.value)}`"
          :aria-describedby="
            chart.tooltipOpen && chart.activeId === node.id
              ? chart.tooltipId
              : undefined
          "
          class="absolute rounded outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          :style="bounds"
          @focus="activate(node.id)"
          @click="activate(node.id)"
          @pointerenter="chart.canHover && activate(node.id)"
          @keydown="keydown($event, node)"
        />
      </template>
    </div>
  </div>
</template>
