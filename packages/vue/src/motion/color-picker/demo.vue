<script setup lang="ts">
import { computed, ref } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { SPRING_SWAP } from "../../lib/ease";
import { useReducedMotion } from "../../lib/composables";
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerArea,
  ColorPickerChannels,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerHexInput,
  ColorPickerHue,
  ColorPickerPreset,
  ColorPickerPresets,
  ColorPickerSwatch,
  ColorPickerTrigger,
} from "./index";
const color = ref("#3478f6");
const modes = ["hex", "rgb", "hsl"] as const;
const modeIndex = ref(0);
const format = computed(() => modes[modeIndex.value]!);
const next = computed(() => modes[(modeIndex.value + 1) % modes.length]!);
const reduced = useReducedMotion();
const presets = [
  ["#3478f6", "Blue"],
  ["#9270e8", "Purple"],
  ["#e66aa4", "Pink"],
  ["#e55656", "Red"],
  ["#ed9141", "Orange"],
  ["#e5b63c", "Amber"],
  ["#65a65a", "Green"],
  ["#169d83", "Teal"],
].map(([value, label]) => ({ value: value!, label: label! }));
function cycle() {
  modeIndex.value = (modeIndex.value + 1) % modes.length;
}
</script>
<template>
  <div class="flex min-h-[460px] w-full justify-center pt-2">
    <ColorPicker v-model="color" aria-label="Brand color"
      ><ColorPickerTrigger /><ColorPickerContent aria-label="Brand color"
        ><ColorPickerArea />
        <div class="flex items-center gap-3">
          <ColorPickerEyeDropper />
          <div class="flex flex-1 flex-col gap-3">
            <ColorPickerHue /><ColorPickerAlpha />
          </div>
        </div>
        <div class="flex items-start gap-1.5">
          <button
            type="button"
            @click="cycle"
            :aria-label="`Format ${format.toUpperCase()}, switch to ${next.toUpperCase()}`"
            class="relative inline-flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <AnimatePresence mode="popLayout" :initial="false"
              ><motion.span
                :key="format"
                :initial="{ opacity: 0, y: reduced ? 0 : 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :exit="{ opacity: 0, y: reduced ? 0 : -10 }"
                :transition="SPRING_SWAP"
                >{{ format.toUpperCase() }}</motion.span
              ></AnimatePresence
            ></button
          ><ColorPickerHexInput v-if="format === 'hex'" /><ColorPickerChannels
            v-else
            :format="format"
          /><ColorPickerSwatch v-if="format === 'hex'" />
        </div>
        <ColorPickerPresets
          aria-label="Presets"
          class="justify-between px-0.5 pt-1"
          ><ColorPickerPreset
            v-for="preset in presets"
            :key="preset.value"
            v-bind="preset" /></ColorPickerPresets></ColorPickerContent
    ></ColorPicker>
  </div>
</template>
