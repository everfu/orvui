<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import NumberTickerDigit from "./NumberTickerDigit.vue";
import { useNumberViewGate } from "./view-gate";
import type { NumberTickerProps } from "./types";
const props = withDefaults(defineProps<NumberTickerProps>(), { duration: 0.9, stagger: 0.04, startOnView: true, blur: false, locale: false });
const element = ref<HTMLElement | null>(null), entered = ref(false), mounted = ref(false);
const ready = useNumberViewGate(element, () => props.startOnView);
const text = computed(() => {
  const places = Math.max(0, Math.floor(props.decimals ?? props.decimalPlaces ?? 0));
  const rounded = Math.round(props.value * 10 ** places) / 10 ** places;
  const formatted = props.format ? props.format(rounded) : props.locale
    ? rounded.toLocaleString(undefined, { minimumFractionDigits: places, maximumFractionDigits: places })
    : rounded.toFixed(places);
  return props.pad ? formatted.padStart(props.pad, "0") : formatted;
});
const glyphs = computed(() => Array.from(text.value, (character, index) => ({ character, id: `g-${text.value.length - index - 1}` })));
let timer: ReturnType<typeof setTimeout> | undefined;
watch([ready, mounted, () => props.duration, () => props.stagger, () => glyphs.value.length], () => {
  clearTimeout(timer);
  if (!mounted.value || !ready.value || entered.value) return;
  timer = setTimeout(() => { entered.value = true; }, 1000 * (props.duration + glyphs.value.length * props.stagger));
});
onMounted(() => { mounted.value = true; });
onBeforeUnmount(() => { mounted.value = false; clearTimeout(timer); });
</script>
<template>
  <span ref="element" :class="['inline-flex items-baseline tabular-nums', className]">
    <span class="sr-only">{{ (prefix ?? '') + text + (suffix ?? '') }}</span>
    <span aria-hidden="true" class="inline-flex items-baseline">
      <span v-if="prefix">{{ prefix }}</span>
      <template v-for="(glyph, index) in glyphs" :key="glyph.id">
        <NumberTickerDigit v-if="/\d/.test(glyph.character)" :digit="ready ? Number(glyph.character) : 0"
          :delay="entered ? 0 : index * stagger" :duration="duration" :blur="blur" :class-name="digitClassName" />
        <span v-else class="inline-block">{{ glyph.character }}</span>
      </template>
      <span v-if="suffix">{{ suffix }}</span>
    </span>
  </span>
</template>
