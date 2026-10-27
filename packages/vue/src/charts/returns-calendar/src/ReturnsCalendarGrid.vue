<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { EASE_OUT, SPRING_PRESS } from "../../../lib/ease";
import { useReturnsCalendar } from "./context";
import {
  COLS,
  DOWN,
  ink,
  MONTHS,
  RING,
  same,
  signed,
  tint,
  UP,
  YEAR,
} from "./utils";
import { moveFocus } from "../../shared";
const calendar = useReturnsCalendar();
function endpoint(y: number, month: number) {
  const span = month === YEAR ? calendar.yearSpan : calendar.span,
    index = month === YEAR ? y : y * 12 + month;
  return span
    ? index === span.lo || index === span.hi
    : same(calendar.pinned, y, month);
}
const rows = computed(() =>
  calendar.years.map((year, y) => {
    const months = COLS.map((column) => {
      const month = column.m,
        index = y * 12 + month,
        value = calendar.valueAt(y, month),
        hot = same(calendar.hot, y, month),
        edge = endpoint(y, month);
      const dim = calendar.span
        ? index < calendar.span.lo || index > calendar.span.hi
        : calendar.yearSpan
          ? y < calendar.yearSpan.lo || y > calendar.yearSpan.hi
          : !!calendar.hot &&
            !hot &&
            calendar.hot.y !== y &&
            calendar.hot.m !== month;
      return {
        month,
        value,
        hot,
        edge,
        dim,
        style: {
          background: tint(value, calendar.range, hot),
          color: `color-mix(in srgb,var(--foreground) ${Math.round(85 + Math.min(Math.abs(value) / calendar.range, 1) * 15)}%,transparent)`,
          boxShadow: edge
            ? RING
            : hot
              ? `inset 0 0 0 1.5px ${value >= 0 ? UP : DOWN}`
              : "none",
          transition: "background 150ms,box-shadow 150ms",
        },
      };
    });
    const yearHot = same(calendar.hot, y, YEAR),
      yearDim = calendar.span
        ? y < Math.floor(calendar.span.lo / 12) ||
          y > Math.floor(calendar.span.hi / 12)
        : calendar.yearSpan
          ? y < calendar.yearSpan.lo || y > calendar.yearSpan.hi
          : calendar.hot && calendar.hot.y !== y;
    return {
      year,
      y,
      months,
      yearDim,
      yearHot,
      yearEdge: endpoint(y, YEAR),
      total: calendar.totals[y],
    };
  }),
);
</script>
<template>
  <div
    class="relative grid gap-1"
    data-chart-keyboard
    :style="{ gridTemplateColumns: '32px repeat(12,1fr) 52px' }"
    @pointerleave="calendar.setHover(null)"
  >
    <span /><span
      v-for="column in COLS"
      :key="column.name"
      class="pb-1 text-center text-[10px] transition-colors duration-200"
      :class="
        calendar.hot?.m === column.m
          ? 'text-foreground'
          : 'text-muted-foreground'
      "
      >{{ column.initial }}</span
    ><span class="pb-1 text-center text-[10px] text-muted-foreground"
      >Year</span
    >
    <template v-for="row in rows" :key="row.year"
      ><span
        class="flex items-center justify-end pr-1.5 font-mono text-[10px] tabular-nums"
        :class="
          calendar.hot?.y === row.y
            ? 'text-foreground'
            : 'text-muted-foreground'
        "
        >’{{ String(row.year).slice(2) }}</span
      >
      <span
        v-for="cell in row.months"
        :key="cell.month"
        class="relative block aspect-square w-full transition-opacity duration-200"
        :style="{ opacity: cell.dim ? 0.35 : 1 }"
        ><motion.button
          type="button"
          data-chart-item
          :data-return-cell="`${row.y}-${cell.month}`"
          :aria-describedby="cell.hot ? calendar.tooltipId : undefined"
          :aria-label="`${MONTHS[cell.month]} ${row.year} ${signed(cell.value, 1)}%`"
          :aria-pressed="cell.edge"
          class="absolute -inset-0.5 block rounded-[5px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
          :while-press="
            calendar.reduce
              ? undefined
              : { scale: 0.92, transition: SPRING_PRESS }
          "
          @pointerenter="calendar.setHover({ y: row.y, m: cell.month })"
          @focus="calendar.setHover({ y: row.y, m: cell.month })"
          @blur="calendar.setHover(null)"
          @click="calendar.select({ y: row.y, m: cell.month })"
          @keydown.esc="calendar.clear()"
          @keydown="
            moveFocus(
              $event,
              row.y * 13 + cell.month,
              calendar.years.length * 13,
              13,
            )
          "
          ><motion.span
            class="pointer-events-none absolute inset-0.5 grid place-items-center rounded-[4px] font-mono text-[9px] font-medium tabular-nums"
            :style="cell.style"
            :initial="calendar.reduce ? false : { opacity: 0, scale: 0.6 }"
            :animate="
              calendar.sweepRow === row.y && !calendar.reduce
                ? { opacity: 1, scale: [1, 1.1, 1] }
                : {
                    opacity: 1,
                    scale:
                      cell.hot && calendar.canHover && !calendar.reduce
                        ? 1.15
                        : 1,
                  }
            "
            :transition="
              calendar.reduce
                ? { duration: 0 }
                : calendar.sweepRow === row.y
                  ? {
                      duration: 0.36,
                      ease: EASE_OUT,
                      delay: cell.month * 0.035,
                    }
                  : {
                      ...SPRING_PRESS,
                      delay: calendar.hot ? 0 : (row.y + cell.month) * 0.02,
                    }
            "
            >{{
              Math.abs(cell.value) >= 4 ? Math.round(cell.value) : ""
            }}</motion.span
          ></motion.button
        ></span
      >
      <span
        class="relative block transition-opacity duration-200"
        :style="{ opacity: row.yearDim ? 0.35 : 1 }"
        ><motion.button
          type="button"
          data-chart-item
          :data-return-cell="`${row.y}-${YEAR}`"
          :aria-describedby="row.yearHot ? calendar.tooltipId : undefined"
          :aria-label="`${row.year} ${signed(row.total, 1)}% for the year`"
          :aria-pressed="row.yearEdge"
          class="absolute -inset-0.5 block rounded-[5px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
          :while-press="
            calendar.reduce
              ? undefined
              : { scale: 0.96, transition: SPRING_PRESS }
          "
          @pointerenter="calendar.setHover({ y: row.y, m: YEAR })"
          @focus="calendar.setHover({ y: row.y, m: YEAR })"
          @blur="calendar.setHover(null)"
          @click="calendar.select({ y: row.y, m: YEAR })"
          @keydown.esc="calendar.clear()"
          @keydown="
            moveFocus($event, row.y * 13 + 12, calendar.years.length * 13, 13)
          "
          ><motion.span
            class="pointer-events-none absolute inset-0.5 grid place-items-center rounded-[4px] font-mono text-[11px] font-medium tabular-nums"
            :style="{
              background: row.yearHot
                ? 'var(--background)'
                : 'color-mix(in srgb,var(--foreground) 6%,transparent)',
              color: ink(row.total >= 0 ? UP : DOWN),
              boxShadow: row.yearEdge
                ? RING
                : row.yearHot
                  ? 'inset 0 0 0 1px var(--border-strong)'
                  : 'none',
            }"
            :initial="calendar.reduce ? false : { opacity: 0 }"
            :animate="{ opacity: 1 }"
            :transition="{
              duration: calendar.reduce ? 0 : 0.4,
              delay: calendar.reduce ? 0 : 0.02 * (row.y + 13),
              ease: EASE_OUT,
            }"
            >{{ signed(row.total, 0) }}%</motion.span
          ></motion.button
        ></span
      > </template
    ><slot />
  </div>
</template>
