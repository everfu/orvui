<script setup lang="ts">
import { computed } from "vue";
import { TextReveal } from "../../../motion/text-animation";
import { NOT_FOUND_DEFAULTS, type NotFoundProps } from "./types";
import NotFoundStage from "./NotFoundStage.vue";
import NotFoundCopy from "./NotFoundCopy.vue";
import NotFoundActions from "./NotFoundActions.vue";
const options = withDefaults(defineProps<NotFoundProps>(), NOT_FOUND_DEFAULTS);
const transition = { stiffness: 320, damping: 30, mass: .6 };
const lines = computed(() => [
  { text: "$ cd /page", stagger: .018, delay: 0, error: false },
  { text: "cd: no such file or directory: /page", stagger: .012, delay: .45, error: true },
  { text: `$ status ${options.code}`, stagger: .018, delay: 1.1, error: false },
]);
const indicators = ["#ff5f57", "#febc2e", "#28c840"];
</script>
<template>
  <NotFoundStage>
    <div class="w-full max-w-md overflow-hidden rounded-xl border border-border bg-neutral-950 text-left shadow-lg">
      <div class="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
        <span v-for="color in indicators" :key="color" class="h-3 w-3 rounded-full" :style="{ backgroundColor: color }" /><span class="ml-2 text-xs text-white/40">~/orvui</span>
      </div>
      <div class="space-y-1.5 p-4 font-mono text-sm leading-relaxed">
        <template v-for="(line, index) in lines" :key="index">
          <p v-if="index === 2" class="flex items-center text-white/80"><TextReveal as="span" split="char" :stagger="line.stagger" :delay="line.delay" :blur="6" :y-offset="0" :spring="transition" :text="line.text" /><span class="ml-1 inline-block h-[1.1em] w-[0.55ch] translate-y-[0.12em] bg-white/80 motion-safe:animate-pulse" /></p>
          <TextReveal v-else as="p" split="char" :stagger="line.stagger" :delay="line.delay" :blur="6" :y-offset="0" :spring="transition" :class="line.error ? 'text-[#ff5f57]' : 'text-white/80'" :text="line.text" />
        </template>
      </div>
    </div>
    <NotFoundCopy :title="options.title" :description="options.description" />
    <NotFoundActions v-bind="options" />
  </NotFoundStage>
</template>
