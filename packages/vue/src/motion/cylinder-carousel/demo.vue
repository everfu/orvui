<script setup lang="ts">
import { ref } from "vue";
import { CylinderCarousel } from "./index";
import { ShaderBackground } from "../shader-background";
import { Tabs, TabsList, TabsTrigger } from "../tabs";
const curvature = ref<"concave" | "convex">("concave");
const surfaces = [
  ["dithering", { colorBack: "#1a1030", colorFront: "#b98cff", speed: .3 }],
  ["metaballs", { colors: ["#e8e8ef", "#8a8a9a", "#1a1a22"], colorBack: "#c9b9a8", speed: .4 }],
  ["warp", { colors: ["#c8ff00", "#3a5a00", "#c8ff00", "#88bb00"], speed: .4 }],
  ["god-rays", { colors: ["#6a7bff", "#00114d"], colorBack: "#000000", speed: .5 }],
  ["swirl", { colorBack: "#1a0000", colors: ["#ffd1a8", "#ff6a3d", "#b31a57"], speed: .3 }],
  ["mesh-gradient", { colors: ["#e0eaff", "#241d9a", "#f75092", "#9f50d3"], speed: .3 }],
  ["voronoi", { colors: ["#ff8247", "#ffe53d"], speed: .3 }],
  ["neuro-noise", { colorFront: "#ffffff", colorMid: "#47a6ff", colorBack: "#000000", speed: .4 }],
] as const;
</script>
<template>
  <div class="flex w-full flex-col items-center gap-4 p-6">
    <Tabs v-model="curvature" variant="segment"><TabsList><TabsTrigger v-for="mode in ['concave', 'convex']" :key="mode" :value="mode">{{ mode === 'concave' ? 'Concave' : 'Convex' }}</TabsTrigger></TabsList></Tabs>
    <div class="w-full rounded-3xl border border-border/60 bg-muted/20 py-6 [clip-path:inset(0_round_1.5rem)]"><CylinderCarousel :variant="curvature" :item-size="230" :height="310" class="w-full"><div v-for="[variant, settings] in surfaces" :key="variant" class="h-full w-full overflow-hidden rounded-full border border-border/40"><ShaderBackground :variant="variant as any" v-bind="settings" class="h-full w-full" /></div></CylinderCarousel></div>
    <p class="text-xs text-muted-foreground">Drag, scroll or use arrow keys to roll</p>
  </div>
</template>
