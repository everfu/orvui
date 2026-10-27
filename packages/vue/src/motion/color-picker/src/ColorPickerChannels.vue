<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { rgbaToHsva, hsvToHsl, hslToHsv, type Hsva, type Rgba } from "./color";
import { usePicker } from "./context";
const props = withDefaults(defineProps<{ format?: "rgb" | "hsl" }>(), {
  format: "rgb",
});
const state = usePicker();
type Channel = {
  key: string;
  short: string;
  name: string;
  max: number;
  value: number;
  set: (value: number) => Hsva;
};
const channels = computed<Channel[]>(() => {
  const hsv = state.hsva.value;
  const rgba = state.rgba.value;
  const hsl = hsvToHsl(hsv);
  const schema: Array<[string, string, number]> =
    props.format === "hsl"
      ? [
          ["h", "Hue", 360],
          ["s", "Saturation", 100],
          ["l", "Lightness", 100],
        ]
      : [
          ["r", "Red", 255],
          ["g", "Green", 255],
          ["b", "Blue", 255],
        ];
  const result = schema.map(([key, name, max]) => ({
    key,
    short: key.toUpperCase(),
    name,
    max,
    value:
      props.format === "hsl"
        ? hsl[key as keyof typeof hsl]
        : rgba[key as keyof Rgba],
    set: (value: number) =>
      props.format === "hsl"
        ? hslToHsv(
            key === "h" ? value : hsl.h,
            key === "s" ? value : hsl.s,
            key === "l" ? value : hsl.l,
            hsv,
            hsv.a,
          )
        : rgbaToHsva({ ...rgba, [key]: value }, hsv),
  }));
  if (state.alpha.value)
    result.push({
      key: "a",
      short: "A",
      name: "Opacity percent",
      max: 100,
      value: hsv.a * 100,
      set: (value) => ({ ...hsv, a: value / 100 }),
    });
  return result;
});
const drafts = ref<Record<string, string | undefined>>({});
watch(
  () => props.format,
  () => {
    drafts.value = {};
  },
);
const clamp = (channel: Channel, value: number) =>
  Math.min(channel.max, Math.max(0, value));
function input(channel: Channel, event: Event) {
  const text = (event.target as HTMLInputElement).value
    .replace(/\D/g, "")
    .slice(0, 3);
  drafts.value[channel.key] = text;
  if (text) state.update(channel.set(clamp(channel, Number(text))));
}
function settle(channel: Channel) {
  if (drafts.value[channel.key] !== undefined) state.commit();
  delete drafts.value[channel.key];
}
function key(channel: Channel, event: KeyboardEvent) {
  const delta =
    event.key === "ArrowUp" ? 1 : event.key === "ArrowDown" ? -1 : 0;
  if (delta && !state.disabled.value) {
    event.preventDefault();
    delete drafts.value[channel.key];
    state.update(
      channel.set(
        clamp(
          channel,
          Math.round(channel.value) + delta * (event.shiftKey ? 10 : 1),
        ),
      ),
    );
    state.commit();
  } else if (event.key === "Enter") settle(channel);
}
</script>
<template>
  <div class="flex min-w-0 flex-1 gap-1.5">
    <label
      v-for="channel in channels"
      :key="format + '-' + channel.key"
      class="flex min-w-0 flex-1 flex-col items-center gap-1"
      ><input
        type="text"
        inputmode="numeric"
        autocomplete="off"
        :disabled="state.disabled.value"
        :aria-label="channel.name"
        :value="drafts[channel.key] ?? String(Math.round(channel.value))"
        @input="input(channel, $event)"
        @blur="settle(channel)"
        @keydown="key(channel, $event)"
        class="h-9 w-full min-w-0 rounded-lg border border-border bg-background px-1 text-center text-xs text-foreground outline-none focus:border-foreground/40 focus:ring-2 focus:ring-ring/40 disabled:opacity-50"
      /><span
        aria-hidden="true"
        class="text-[11px] font-medium text-muted-foreground"
        >{{ channel.short }}</span
      ></label
    >
  </div>
</template>
