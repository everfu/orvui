<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { motion } from "motion-v";
import { EASE_OUT } from "../../../lib/ease";
import { NumberTicker } from "../../../motion/number";
import { moveFocus } from "../../shared";
import ChartTooltip from "../../ChartTooltip.vue";
import { useLiquidityHeatmap, heatColor } from "./context";
import { pricePosition } from "./model";
const heatmap = useLiquidityHeatmap();
const active = ref<string | null>(null),
  cursor = ref<string | null>(null),
  anchor = ref<HTMLElement | null>(null);
const tooltipId = useId();
const rows = computed(() =>
  heatmap.prices.map((price, row) => ({
    price,
    cells: heatmap.columns.map((column, index) => ({
      key: JSON.stringify([column.id, price]),
      column,
      price,
      index: row * heatmap.columns.length + index,
      size: column.levels.get(price),
      color: heatColor(column.levels.get(price) ?? 0, heatmap.ceiling),
    })),
  })),
);
const cells = computed(() => rows.value.flatMap((row) => row.cells));
const byKey = computed(
  () => new Map(cells.value.map((cell) => [cell.key, cell])),
);
const focusedKey = computed(() =>
  cursor.value !== null && byKey.value.has(cursor.value)
    ? cursor.value
    : cells.value[0]?.key,
);
const selected = computed(() =>
  active.value === null ? null : (byKey.value.get(active.value) ?? null),
);
const trace = computed(() => {
  let continuation = false;
  const commands = heatmap.columns.map((column, index) => {
    const y =
      column.price === undefined
        ? null
        : pricePosition(column.price, heatmap.prices);
    if (y === null) {
      continuation = false;
      return "";
    }
    const command = `${continuation ? "L" : "M"}${index + 0.5},${y}`;
    continuation = true;
    return command;
  });
  return commands.join(" ");
});
const topology = computed(() =>
  heatmap.columns
    .map(
      (column) =>
        `${column.id}:${column.price !== undefined && pricePosition(column.price, heatmap.prices) !== null}`,
    )
    .join("|"),
);
const labels = computed(() =>
  heatmap.columns.filter(
    (_, index) =>
      index % Math.max(1, Math.ceil(heatmap.columns.length / 5)) === 0 ||
      index === heatmap.columns.length - 1,
  ),
);
function activate(event: Event, key: string) {
  anchor.value = event.currentTarget as HTMLElement;
  active.value = key;
}
function focus(event: Event, key: string) {
  cursor.value = key;
  activate(event, key);
}
</script>
<template>
  <p
    v-if="!heatmap.prices.length || !heatmap.columns.length"
    class="py-16 text-center text-sm text-muted-foreground"
  >
    No liquidity data
  </p>
  <div v-else class="overflow-x-auto">
    <div
      class="relative"
      :style="{
        minWidth: Math.max(480, heatmap.columns.length * 24) + 'px',
        paddingRight: '72px',
      }"
    >
      <div class="relative">
        <table
          aria-label="Liquidity by price and time"
          class="w-full table-fixed border-separate border-spacing-[2px]"
          data-chart-keyboard
        >
          <thead class="sr-only">
            <tr>
              <th
                v-for="column in heatmap.columns"
                :key="column.id"
                scope="col"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.price">
              <td v-for="cell in row.cells" :key="cell.column.id" class="p-0">
                <button
                  type="button"
                  data-chart-item
                  :data-cell="cell.index"
                  :tabindex="cell.key === focusedKey ? 0 : -1"
                  :aria-label="`${cell.column.label}, ${heatmap.formatPrice(cell.price)}: ${cell.size === undefined ? 'No data' : heatmap.formatSize(cell.size) + ' ' + heatmap.unit}`"
                  :aria-describedby="
                    active === cell.key ? tooltipId : undefined
                  "
                  class="relative block h-6 w-full rounded-[2px] bg-muted/30 outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-foreground"
                  @pointerenter="
                    $event.pointerType !== 'touch' && activate($event, cell.key)
                  "
                  @pointerleave="active = null"
                  @focus="focus($event, cell.key)"
                  @blur="active = null"
                  @click="activate($event, cell.key)"
                  @keydown="
                    moveFocus(
                      $event,
                      cell.index,
                      cells.length,
                      heatmap.columns.length,
                    )
                  "
                  @keydown.esc="active = null"
                >
                  <motion.span
                    aria-hidden="true"
                    class="pointer-events-none absolute inset-0 rounded-[2px]"
                    :initial="false"
                    :animate="{
                      opacity: cell.size !== undefined ? 1 : 0,
                      backgroundColor: cell.color,
                    }"
                    :transition="{
                      duration: heatmap.reduce ? 0 : 0.28,
                      ease: EASE_OUT,
                    }"
                  />
                  <span
                    v-if="active === cell.key"
                    aria-hidden="true"
                    class="pointer-events-none absolute inset-0 rounded-[2px] ring-1 ring-inset ring-white"
                  /></button
                ><span class="sr-only">{{ cell.size ?? "No data" }}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div
          aria-hidden="true"
          class="absolute -right-[72px] top-0 bottom-0 flex w-16 flex-col justify-around text-right font-mono text-[10px] text-muted-foreground tabular-nums"
        >
          <span v-for="price in heatmap.prices" :key="price">{{
            heatmap.formatPrice(price)
          }}</span>
        </div>
        <svg
          :key="topology"
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 size-full overflow-visible"
          :viewBox="`0 0 ${heatmap.columns.length} ${heatmap.prices.length}`"
          preserveAspectRatio="none"
        >
          <motion.path
            :initial="false"
            :animate="{ d: trace }"
            :transition="{
              duration: heatmap.reduce ? 0 : 0.28,
              ease: EASE_OUT,
            }"
            fill="none"
            stroke="black"
            stroke-opacity=".35"
            stroke-width="4"
            vector-effect="non-scaling-stroke"
          />
          <motion.path
            :initial="false"
            :animate="{ d: trace }"
            :transition="{
              duration: heatmap.reduce ? 0 : 0.28,
              ease: EASE_OUT,
            }"
            fill="none"
            stroke="white"
            stroke-opacity=".9"
            stroke-width="1.5"
            vector-effect="non-scaling-stroke"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div
        aria-hidden="true"
        class="mt-3 flex justify-between font-mono text-[10px] text-muted-foreground"
      >
        <span v-for="column in labels" :key="column.id">{{
          column.label
        }}</span>
      </div>
    </div>
    <ChartTooltip
      :key="active ?? 'closed'"
      :id="tooltipId"
      :open="selected !== null"
      :anchor="anchor"
      @update:open="!$event && (active = null)"
    >
      <span v-if="selected" class="flex flex-col gap-1 font-mono text-xs"
        ><span class="text-muted-foreground"
          >{{ selected.column.label }} ·
          {{ heatmap.formatPrice(selected.price) }}</span
        >
        <span class="inline-flex items-center tabular-nums"
          ><template v-if="selected.size === undefined">No data</template
          ><NumberTicker
            v-else
            :value="selected.size"
            :format="() => heatmap.formatSize(selected!.size!)"
            :suffix="' ' + heatmap.unit"
            :duration="0.35"
            :start-on-view="false"
        /></span>
        <span
          v-if="
            selected.column.price !== undefined &&
            Number.isFinite(selected.column.price)
          "
          class="text-muted-foreground"
          >Market {{ heatmap.formatPrice(selected.column.price) }}</span
        >
      </span>
    </ChartTooltip>
  </div>
</template>
