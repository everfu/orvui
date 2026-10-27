<script setup lang="ts">
import { NumberTicker } from "../../../motion/number";
import ChartTooltip from "../../ChartTooltip.vue";
import { useVolumeProfile } from "./context";
withDefaults(defineProps<{ side?: "top" | "right" | "bottom" | "left" }>(), {
  side: "top",
});
const profile = useVolumeProfile();
</script>
<template>
  <ChartTooltip
    :open="profile.tooltipOpen && profile.active !== null"
    :anchor="profile.plotRef"
    :id="profile.tooltipId"
    :point="{ x: 0.55, y: profile.active?.center ?? 0.5 }"
    :side="side"
    :follow-cursor="true"
    @update:open="profile.tooltipOpen = $event"
    ><slot v-if="profile.active" :row="profile.active"
      ><p class="text-muted-foreground">
        {{ profile.formatPrice(profile.active.priceLow) }} –
        {{ profile.formatPrice(profile.active.priceHigh) }}
      </p>
      <p class="mt-1 font-mono">
        <NumberTicker
          :value="profile.active.volume"
          :format="() => profile.formatVolume(profile.active!.volume)"
          :start-on-view="false"
          :duration="0.2"
          :stagger="0"
        />
        {{ profile.unit }} · {{ (profile.active.share * 100).toFixed(1) }}%
      </p>
      <p
        v-if="profile.active.isPoc || profile.active.inValueArea"
        class="mt-1 text-muted-foreground"
      >
        {{ profile.active.isPoc ? "Point of control" : "Inside value area" }}
      </p></slot
    ></ChartTooltip
  >
</template>
