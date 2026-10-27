<script setup lang="ts">
import { MorphingSearchChips } from "../index";
const tileColors = [
  "from-rose-400/40 to-orange-300/30",
  "from-sky-400/40 to-indigo-400/30",
  "from-emerald-400/40 to-teal-300/30",
  "from-amber-300/40 to-rose-300/30",
  "from-violet-400/40 to-fuchsia-300/30",
  "from-teal-300/40 to-sky-300/30",
];
const suggestions = [
  "dashboards",
  "data tables",
  "dark mode",
  "empty states",
  "onboarding",
  "pricing pages",
  "settings",
  "sign in",
];
</script>
<template>
  <div
    class="relative flex h-[440px] w-full max-w-2xl flex-col justify-end overflow-hidden rounded-3xl border border-border bg-muted/40 p-4"
  >
    <div
      aria-hidden="true"
      class="absolute inset-4 grid grid-cols-3 gap-3 opacity-80"
    >
      <div
        v-for="tile in tileColors"
        :key="tile"
        class="rounded-2xl bg-gradient-to-br"
        :class="tile"
      />
    </div>
    <MorphingSearchChips
      class="mx-auto"
      placeholder="Search inspiration"
      label="Search inspiration"
      :default-chips="['onboarding']"
      :default-recents="['dashboards', 'empty states', 'pricing pages']"
      storage-key="orvui:morphing-search-chips:recents"
      :max-chips="4"
      :suggestions="suggestions"
    />
  </div>
</template>
