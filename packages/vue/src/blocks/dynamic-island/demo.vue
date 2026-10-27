<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { motion } from "motion-v";
import { Music, Phone, PhoneOff, Timer } from "lucide-vue-next";
import { DynamicIsland, DynamicIslandView } from "./index";
import { Button } from "../../motion/button";
import { NumberTicker } from "../../motion/number";
import { useReducedMotion } from "../../lib/composables";
const view = ref<"call" | "timer" | "music" | null>(null),
  seconds = ref(154),
  reduce = useReducedMotion(),
  delays = [0, 0.18, 0.09, 0.27];
let tick: ReturnType<typeof setInterval> | undefined;
watch(view, (next) => {
  clearInterval(tick);
  if (next === "timer")
    tick = setInterval(() => {
      seconds.value = Math.max(0, seconds.value - 1);
    }, 1000);
});
onBeforeUnmount(() => clearInterval(tick));
const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
</script>
<template>
  <div class="flex w-full flex-col items-center gap-4">
    <div class="flex h-32 w-full items-start justify-center pt-2">
      <DynamicIsland :view="view"
        ><template #compact
          ><span class="h-1.5 w-1.5 rounded-full bg-(--color-success)" /><span
            >9:41</span
          ></template
        ><DynamicIslandView id="call" class="gap-4"
          ><div class="flex flex-col">
            <span class="text-[10px] uppercase tracking-wider opacity-60"
              >Incoming call</span
            ><span class="text-sm font-semibold">orvui Demo</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-for="action in [
                { label: 'Decline', icon: PhoneOff, tone: 'bg-destructive' },
                { label: 'Accept', icon: Phone, tone: 'bg-(--color-success)' },
              ]"
              :key="action.label"
              type="button"
              :aria-label="action.label"
              class="flex h-8 w-8 items-center justify-center rounded-full text-white"
              :class="action.tone"
              @click="view = null"
            >
              <component :is="action.icon" class="h-3.5 w-3.5" />
            </button></div></DynamicIslandView
        ><DynamicIslandView id="timer" class="gap-3"
          ><Timer class="h-4 w-4 text-(--color-warning)" /><span
            class="text-[10px] uppercase tracking-wider opacity-60"
            >Timer</span
          ><NumberTicker
            :value="seconds"
            :format="clock"
            :start-on-view="false"
            :duration="0.5"
            class="text-sm font-semibold" /></DynamicIslandView
        ><DynamicIslandView id="music" class="gap-3"
          ><span
            class="flex h-7 w-7 items-center justify-center rounded-lg bg-background/15"
            ><Music class="h-3.5 w-3.5"
          /></span>
          <div class="flex flex-col text-left">
            <span class="text-xs font-semibold leading-tight"
              >Midnight City</span
            ><span class="text-[10px] opacity-60">M83</span>
          </div>
          <span class="flex h-4 items-end gap-0.5" aria-hidden="true"
            ><motion.span
              v-for="delay in delays"
              :key="delay"
              :animate="
                reduce ? undefined : { scaleY: [0.4, 1, 0.55, 0.9, 0.4] }
              "
              :transition="{
                duration: 1.1,
                repeat: Infinity,
                ease: 'easeInOut',
                delay,
              }"
              class="h-full w-0.5 origin-bottom rounded-full bg-(--color-success)"
              :style="{ scaleY: 0.6 }" /></span></DynamicIslandView
      ></DynamicIsland>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-2">
      <Button size="sm" variant="secondary" @click="view = 'call'">Call</Button
      ><Button
        size="sm"
        variant="secondary"
        @click="
          seconds = 154;
          view = 'timer';
        "
        >Timer</Button
      ><Button size="sm" variant="secondary" @click="view = 'music'"
        >Music</Button
      ><Button size="sm" variant="ghost" @click="view = null">Dismiss</Button>
    </div>
  </div>
</template>
