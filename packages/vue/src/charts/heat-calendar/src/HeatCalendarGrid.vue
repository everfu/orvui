<script setup lang="ts">
import { computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { EASE_OUT, SPRING_PRESS } from "../../../lib/ease";
import { useHeatCalendar } from "./context";
import { DAYS, fmtDay, GAP, LIFT, MONTH_ROW, PITCH } from "./utils";
const calendar = useHeatCalendar();
const cells = computed(() =>
  calendar.cols.flatMap((column) =>
    DAYS.filter((day) => !calendar.future(column.w, day.d)).map((day) => {
      const w = column.w,
        d = day.d,
        ordinal = w * 7 + d;
      const distance = calendar.hot
        ? Math.max(Math.abs(calendar.hot.w - w), Math.abs(calendar.hot.d - d))
        : 9;
      const scale =
        calendar.reduce || !calendar.canHover ? 1 : (LIFT[distance] ?? 1);
      const endpoint = calendar.span
        ? ordinal === calendar.span.lo || ordinal === calendar.span.hi
        : calendar.pinned?.w === w && calendar.pinned?.d === d;
      const dim =
        (calendar.step !== null &&
          calendar.step !== calendar.bucket(calendar.level(w, d))) ||
        (calendar.span !== null &&
          (ordinal < calendar.span.lo || ordinal > calendar.span.hi));
      return {
        key: `${w}-${d}`,
        w,
        d,
        distance,
        scale,
        endpoint,
        dim,
        hot: calendar.hot?.w === w && calendar.hot?.d === d,
        date: calendar.dateOf(w, d),
        count: calendar.count(calendar.level(w, d)),
        fill: calendar.fill(calendar.bucket(calendar.level(w, d))),
      };
    }),
  ),
);
function keydown(event: KeyboardEvent, w: number, d: number) {
  let week = w,
    day = d;
  switch (event.key) {
    case "ArrowRight":
      week++;
      break;
    case "ArrowLeft":
      week--;
      break;
    case "ArrowDown":
      day++;
      break;
    case "ArrowUp":
      day--;
      break;
    case "Home":
      week = 0;
      day = 0;
      break;
    case "End":
      week = calendar.weeks - 1;
      day = 6;
      while (day > 0 && calendar.future(week, day)) day--;
      break;
    default:
      return;
  }
  event.preventDefault();
  week = Math.max(0, Math.min(calendar.weeks - 1, week));
  day = Math.max(0, Math.min(6, day));
  if (calendar.future(week, day)) return;
  (event.currentTarget as HTMLElement)
    .closest("[data-chart-keyboard]")
    ?.querySelector<HTMLElement>(`[data-heat-cell="${week}-${day}"]`)
    ?.focus();
}
</script>
<template>
  <div
    class="relative grid"
    data-chart-keyboard
    :style="{
      width: calendar.weeks * PITCH - GAP + 'px',
      maxWidth: '100%',
      gridTemplateColumns: `repeat(${calendar.weeks},minmax(0,1fr))`,
      gridTemplateRows: `${MONTH_ROW}px repeat(7,auto)`,
      gap: GAP + 'px',
    }"
    @pointerleave="calendar.setHover(null)"
  >
    <template v-for="column in calendar.cols" :key="column.id"
      ><span
        v-if="column.label"
        class="whitespace-nowrap text-[10px] leading-none transition-colors duration-200"
        :class="
          calendar.hotMonth === column.m
            ? 'text-foreground'
            : 'text-muted-foreground'
        "
        :style="{ gridColumn: column.w + 1, gridRow: 1 }"
        >{{ column.label }}</span
      ></template
    >
    <span
      v-for="cell in cells"
      :key="cell.key"
      class="relative block aspect-square w-full transition-opacity duration-200"
      :style="{
        gridColumn: cell.w + 1,
        gridRow: cell.d + 2,
        opacity: cell.dim ? 0.25 : 1,
        zIndex: cell.scale > 1 ? LIFT.length - cell.distance : 0,
      }"
    >
      <motion.button
        type="button"
        data-chart-item
        :data-heat-cell="cell.key"
        :aria-label="`${cell.count} ${calendar.unit}${cell.date ? ' on ' + fmtDay.format(cell.date) : ''}`"
        :aria-pressed="cell.endpoint"
        :aria-describedby="cell.hot ? calendar.tooltipId : undefined"
        class="absolute -inset-0.5 block rounded-[5px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
        :while-press="
          calendar.reduce ? undefined : { scale: 0.9, transition: SPRING_PRESS }
        "
        @pointerenter="calendar.setHover({ w: cell.w, d: cell.d })"
        @focus="calendar.setHover({ w: cell.w, d: cell.d })"
        @blur="calendar.setHover(null)"
        @click="calendar.select({ w: cell.w, d: cell.d })"
        @keydown.esc="calendar.clear()"
        @keydown="keydown($event, cell.w, cell.d)"
      >
        <motion.span
          class="pointer-events-none absolute inset-0.5 block rounded-[4px]"
          :style="{
            background: cell.fill,
            boxShadow: cell.endpoint
              ? '0 0 0 2px var(--background),0 0 0 3.5px var(--foreground)'
              : 'none',
            transition: 'box-shadow 150ms',
          }"
          :initial="calendar.reduce ? false : { opacity: 0, scale: 0.4 }"
          :animate="{ opacity: 1, scale: cell.scale }"
          :transition="
            calendar.reduce
              ? { duration: 0 }
              : {
                  ...SPRING_PRESS,
                  delay: calendar.hot
                    ? Math.min(cell.distance, 3) * 0.03
                    : (cell.w + cell.d) * 0.018,
                }
          "
          ><AnimatePresence
            ><motion.span
              v-if="cell.hot && !cell.endpoint"
              class="pointer-events-none absolute inset-0 block border-[1.5px]"
              :style="{
                borderRadius: 'inherit',
                borderColor:
                  'color-mix(in srgb,var(--foreground) 55%,transparent)',
              }"
              :initial="calendar.reduce ? false : { opacity: 0 }"
              :animate="{ opacity: 1 }"
              :exit="{ opacity: 0 }"
              :transition="{
                duration: 0.12,
                ease: EASE_OUT,
              }" /></AnimatePresence
        ></motion.span>
      </motion.button>
    </span>
    <slot />
  </div>
</template>
