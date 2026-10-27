<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { EASE_OUT, SPRING_LAYOUT } from "../../../lib/ease";
import { useVolumeProfile } from "./context";
defineOptions({ inheritAttrs: false });
withDefaults(defineProps<{ barClassName?: string; showAxes?: boolean }>(), {
  showAxes: true,
});
const profile = useVolumeProfile();
const pointer = ref(false),
  anchor = ref<HTMLElement | null>(null);
const ticks = computed(() =>
  [1, 0.75, 0.5, 0.25, 0].map((fraction) => ({
    fraction,
    label: profile.formatPrice(
      profile.priceLow + (profile.priceHigh - profile.priceLow) * fraction,
    ),
  })),
);
const valueText = computed(() =>
  profile.active
    ? `${profile.formatPrice(profile.active.priceLow)} to ${profile.formatPrice(profile.active.priceHigh)}, ${profile.formatVolume(profile.active.volume)} ${profile.unit}`
    : undefined,
);
onMounted(() => {
  profile.plotRef = anchor.value;
});
watch(
  anchor,
  (element) => {
    profile.plotRef = element;
  },
  { flush: "post" },
);
onBeforeUnmount(() => {
  if (profile.plotRef === anchor.value) profile.plotRef = null;
});
function inspect(event: PointerEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  if (!rect.height || !profile.rows.length) return;
  const fraction = Math.max(
    0,
    Math.min(1, (event.clientY - rect.top) / rect.height),
  );
  let selected = profile.rows.find(
    (row) => fraction >= row.top && fraction <= row.top + row.height,
  );
  if (!selected) {
    selected = profile.rows[0];
    for (const row of profile.rows)
      if (
        Math.abs(row.center - fraction) < Math.abs(selected.center - fraction)
      )
        selected = row;
  }
  profile.setActive(selected.id);
  profile.tooltipOpen = true;
}
function focus() {
  profile.setActive(profile.rows[Math.max(0, profile.activeIndex)].id);
  profile.tooltipOpen = true;
}
function input(event: Event) {
  if (pointer.value) return;
  const row = profile.rows[Number((event.target as HTMLInputElement).value)];
  if (row) {
    profile.setActive(row.id);
    profile.tooltipOpen = true;
  }
}
function keydown(event: KeyboardEvent) {
  pointer.value = false;
  profile.tooltipOpen = event.key !== "Escape";
}
</script>
<template>
  <p
    v-if="!profile.rows.length"
    class="py-12 text-center text-sm text-muted-foreground"
  >
    No volume data
  </p>
  <div
    v-else
    data-slot="volume-profile-plot"
    class="min-w-0"
    :class="showAxes ? 'pb-6' : ''"
  >
    <div
      v-bind="$attrs"
      :class="cn('flex h-80 min-w-0 gap-3', $attrs.class as string)"
    >
      <div
        v-if="showAxes"
        aria-hidden="true"
        class="relative shrink-0 text-right font-mono text-[10px] text-muted-foreground sm:text-xs"
      >
        <span v-for="tick in ticks" :key="tick.fraction"
          ><span class="invisible block">{{ tick.label }}</span
          ><span
            class="absolute right-0 -translate-y-1/2"
            :style="{ top: (1 - tick.fraction) * 100 + '%' }"
            >{{ tick.label }}</span
          ></span
        >
      </div>
      <div
        ref="anchor"
        class="relative min-w-0 flex-1 rounded-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-ring"
      >
        <div aria-hidden="true" class="pointer-events-none absolute inset-0">
          <span
            v-for="fraction in [0, 0.25, 0.5, 0.75, 1]"
            :key="fraction"
            class="absolute inset-y-0 border-l border-border/60"
            :style="{ left: fraction * 100 + '%' }"
          />
          <div
            v-for="(row, index) in profile.rows"
            :key="row.id"
            :data-volume-bin="row.id"
            :data-poc="row.isPoc || undefined"
            :data-value-area="row.inValueArea || undefined"
            class="absolute inset-x-0 overflow-hidden py-px"
            :style="{
              top: row.top * 100 + '%',
              height: row.height * 100 + '%',
            }"
          >
            <motion.div
              :class="['h-full w-full origin-left rounded-r-sm', barClassName]"
              :style="{
                backgroundColor: row.isPoc ? profile.pocColor : profile.color,
              }"
              :initial="{ opacity: 0, scaleX: row.proportion }"
              :animate="{
                opacity:
                  row.isPoc || row.inValueArea || !profile.valueArea
                    ? 0.9
                    : 0.3,
                scaleX: row.proportion,
              }"
              :transition="{
                scaleX: profile.reduce ? { duration: 0 } : SPRING_LAYOUT,
                opacity: { duration: 0.18, ease: EASE_OUT },
              }"
            />
            <motion.div
              class="absolute inset-0 bg-foreground/5"
              :initial="false"
              :animate="{
                opacity:
                  profile.tooltipOpen && profile.activeIndex === index ? 1 : 0,
              }"
              :transition="{ duration: 0.1, ease: EASE_OUT }"
            />
            <span
              v-if="row.isPoc"
              class="absolute inset-x-0 top-1/2 border-t border-dashed"
              :style="{ borderColor: profile.pocColor }"
              ><span
                class="absolute right-0 -translate-y-1/2 rounded bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-foreground"
                >POC</span
              ></span
            >
          </div>
        </div>
        <input
          type="range"
          min="0"
          :max="profile.rows.length - 1"
          step="1"
          :value="Math.max(0, profile.activeIndex)"
          :aria-label="profile.label + ': inspect price level'"
          aria-orientation="vertical"
          :aria-valuetext="valueText"
          :aria-describedby="
            profile.tooltipOpen && profile.active
              ? profile.tooltipId
              : undefined
          "
          class="absolute inset-0 m-0 size-full cursor-crosshair opacity-0"
          :style="{
            writingMode: 'vertical-lr',
            direction: 'rtl',
            touchAction: 'pan-x',
          }"
          @focus="focus"
          @blur="
            profile.tooltipOpen = false;
            pointer = false;
          "
          @pointerenter="profile.canHover && inspect($event)"
          @pointermove="
            (profile.canHover || $event.buttons === 1) && inspect($event)
          "
          @pointerleave="profile.tooltipOpen = false"
          @pointerdown="
            pointer = true;
            inspect($event);
          "
          @pointercancel="
            pointer = false;
            profile.tooltipOpen = false;
          "
          @click="pointer = false"
          @keydown="keydown"
          @input="input"
        />
        <div
          v-if="showAxes"
          aria-hidden="true"
          class="absolute inset-x-0 top-full mt-2 flex justify-between font-mono text-[10px] text-muted-foreground sm:text-xs"
        >
          <span>0</span
          ><span>{{ profile.formatVolume(profile.maxVolume / 2) }}</span
          ><span>{{ profile.formatVolume(profile.maxVolume) }}</span>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>
