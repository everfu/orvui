<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { resolveElement, useReducedMotion } from "../../../lib/composables";
import { useMotionState } from "../../state";
import { useTimelineTrack } from "./track";
export type TimelineEvent = {
  id: string;
  date: string | Date;
  title: string;
  media?: any;
  meta?: any;
  [key: string]: any;
};
const props = withDefaults(
  defineProps<{
    events: TimelineEvent[];
    modelValue?: string;
    defaultValue?: string;
    itemWidth?: number;
    height?: number;
    years?: boolean;
    ruler?: boolean;
    cables?: boolean;
    formatDate?: (date: Date) => string;
    formatYear?: (date: Date) => string;
    ariaLabel?: string;
  }>(),
  {
    itemWidth: 340,
    height: 600,
    years: true,
    ruler: true,
    cables: true,
    ariaLabel: "Timeline",
  },
);
const emit = defineEmits(["update:modelValue", "change"]);
const value = useMotionState(
  props,
  emit,
  "modelValue",
  props.defaultValue ?? props.events[0]?.id ?? "",
);
const root = ref<HTMLElement | null>(null);
const hintId = useId();
const reduced = useReducedMotion();
const {
  active,
  width,
  scroll,
  cardWidth,
  gap,
  step,
  buttons,
  cardStyle,
  cable,
  gapX,
  down,
  move,
  up,
  cancel,
  clickCapture,
  select,
} = useTimelineTrack(root, props, value, reduced);
const yearMarks = computed(() => {
  const marks: { key: string; label: string; position: number }[] = [];
  let prior: number | undefined;
  props.events.forEach((event, index) => {
    const date = new Date(event.date);
    const year = date.getUTCFullYear();
    if (year !== prior)
      marks.push({
        key: `${year}-${index}`,
        label: props.formatYear?.(date) ?? `’${String(year).slice(-2)}`,
        position: index ? index - 0.5 : 0,
      });
    prior = year;
  });
  return marks;
});
const month = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});
function dateLabel(event: TimelineEvent) {
  const date = new Date(event.date);
  return (
    props.formatDate?.(date) ??
    `${month.format(date)} ${date.getUTCDate()} ’${String(date.getUTCFullYear()).slice(-2)}`
  );
}
function register(id: string, node: unknown) {
  const element = resolveElement<HTMLButtonElement>(node);
  if (element) buttons.set(id, element);
  else buttons.delete(id);
}
</script>
<template>
  <section
    ref="root"
    :aria-label="ariaLabel"
    :aria-describedby="hintId"
    class="relative w-full cursor-grab touch-pan-y overscroll-x-contain select-none [-webkit-touch-callout:none] [clip-path:inset(0)] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] active:cursor-grabbing"
    :style="{ height: `${height}px` }"
    @pointerdown="down"
    @pointermove="move"
    @pointerup="up"
    @pointercancel="cancel"
    @lostpointercapture="cancel"
    @click.capture="clickCapture"
  >
    <p :id="hintId" class="sr-only">
      Use the left and right arrow keys to move between events.
    </p>
    <div
      v-for="mark in years ? yearMarks : []"
      :key="mark.key"
      aria-hidden="true"
      class="absolute left-1/2"
      :style="{
        transform: `translateX(${(mark.position - scroll) * step * 0.5}px)`,
        top: `${height * 0.2 * 0.33}px`,
      }"
    >
      <span
        class="block -translate-x-1/2 font-medium leading-none tracking-tighter tabular-nums text-foreground/[0.06]"
        :style="{ fontSize: `${height * 0.2}px` }"
        >{{ mark.label }}</span
      >
    </div>
    <svg
      v-if="cables"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 size-full stroke-foreground/[0.14] [mask-image:linear-gradient(to_bottom,transparent,black_6%,black_94%,transparent)]"
      fill="none"
      stroke-width="1"
    >
      <g
        v-for="(event, index) in events"
        :key="event.id"
        :opacity="cable(index).opacity"
      >
        <template v-for="edge in ['left', 'right'] as const" :key="edge">
          <line
            v-for="start in [0, height]"
            :key="start"
            :x1="width / 2"
            :y1="start"
            :x2="cable(index)[edge]"
            :y2="height * 0.5"
          />
        </template>
      </g>
    </svg>
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 text-foreground/80"
      style="
        background-image: linear-gradient(
          to bottom,
          transparent,
          currentColor 6%,
          currentColor 94%,
          transparent
        );
      "
    />
    <template v-if="ruler"
      ><div
        v-for="(event, index) in events.slice(0, -1)"
        :key="event.id"
        aria-hidden="true"
        class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center"
        :style="{
          transform: `translateX(${gapX(index)}px)`,
          gap: `${(gap * 0.7) / 4 - 1}px`,
        }"
      >
        <span
          v-for="tick in 5"
          :key="tick"
          :class="[
            'block w-px rounded-full',
            tick === 3 ? 'bg-foreground/45' : 'bg-foreground/25',
          ]"
          :style="{ height: `${cardWidth * (tick === 3 ? 0.2 : 0.13)}px` }"
        /></div
    ></template>
    <ul class="absolute inset-0">
      <li
        v-for="(event, index) in events"
        :key="event.id"
        data-slot="timeline-event"
        :data-active="index === active || undefined"
        class="absolute left-1/2"
        :style="cardStyle(index)"
      >
        <div class="relative -translate-y-1/2">
          <div
            class="timeline-card relative overflow-hidden rounded-3xl border border-border bg-card"
          >
            <div class="px-3.5 pb-2 pt-3">
              <p
                :id="`${hintId}-${index}-date`"
                class="text-xs tabular-nums text-muted-foreground"
              >
                {{ dateLabel(event) }}
              </p>
              <h3
                :id="`${hintId}-${index}-title`"
                class="truncate text-base font-medium tracking-tight text-foreground"
              >
                {{ event.title }}
              </h3>
            </div>
            <div class="px-2">
              <div
                class="aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-background"
              >
                <slot name="media" :event="event" :active="index === active"
                  ><img
                    v-if="typeof event.media === 'string'"
                    :src="event.media"
                    alt=""
                    class="size-full object-cover" /><component
                    v-else-if="event.media"
                    :is="event.media"
                /></slot>
              </div>
            </div>
            <div
              v-if="event.meta || $slots.meta"
              class="flex items-center gap-1.5 px-3.5 py-2.5 text-sm tabular-nums text-muted-foreground"
            >
              <slot name="meta" :event="event">{{ event.meta }}</slot>
            </div>
            <div v-else class="h-2" />
            <div
              aria-hidden="true"
              class="pointer-events-none absolute inset-0 bg-background"
              :style="{ opacity: 0.45 * Math.min(Math.abs(index - scroll), 1) }"
            />
          </div>
          <button
            :ref="(node) => register(event.id, node)"
            type="button"
            :tabindex="index === active ? 0 : -1"
            :aria-current="index === active ? 'step' : undefined"
            :aria-labelledby="`${hintId}-${index}-date ${hintId}-${index}-title`"
            @click="select(index)"
            @keydown.right.prevent="select(index + 1, true)"
            @keydown.left.prevent="select(index - 1, true)"
            @keydown.home.prevent="select(0, true)"
            @keydown.end.prevent="select(events.length - 1, true)"
            class="absolute inset-0 cursor-pointer rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-foreground"
          />
        </div>
      </li>
    </ul>
  </section>
</template>
<style scoped>
[data-slot="timeline-event"][data-active] > div > .timeline-card {
  border-color: color-mix(in oklab, var(--primary) 42%, var(--border));
  background-color: color-mix(in oklab, var(--primary) 4%, var(--card));
}
</style>
