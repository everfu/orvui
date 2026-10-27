<script setup lang="ts">
import { useVolumeProfile } from "./context";
const profile = useVolumeProfile();
</script>
<template>
  <dl
    v-if="profile.rows.length"
    class="grid grid-cols-2 gap-x-4 gap-y-4 border-t border-border pt-4 text-xs sm:grid-cols-3"
  >
    <div class="space-y-1.5">
      <dt class="text-muted-foreground">Total volume</dt>
      <dd class="font-mono font-medium tabular-nums">
        {{ profile.formatVolume(profile.totalVolume) }} {{ profile.unit }}
      </dd>
    </div>
    <div class="space-y-1.5">
      <dt class="flex items-center gap-1.5 text-muted-foreground">
        <span
          aria-hidden="true"
          class="size-1.5 rounded-full"
          :style="{ backgroundColor: profile.pocColor }"
        />Point of control
      </dt>
      <dd class="font-mono font-medium tabular-nums">
        {{ profile.poc ? profile.formatPrice(profile.poc.price) : "—" }}
      </dd>
    </div>
    <div v-if="profile.valueArea" class="col-span-2 space-y-1.5 sm:col-span-1">
      <dt class="flex items-center gap-1.5 text-muted-foreground">
        <span
          aria-hidden="true"
          class="size-1.5 rounded-full"
          :style="{ backgroundColor: profile.color }"
        />Value area · {{ Math.round(profile.valueArea.target * 100) }}% target
      </dt>
      <dd class="font-mono font-medium tabular-nums">
        {{ profile.formatPrice(profile.valueArea.priceLow) }} –
        {{ profile.formatPrice(profile.valueArea.priceHigh) }}
      </dd>
      <dd class="text-muted-foreground">
        {{ (profile.valueArea.share * 100).toFixed(1) }}% of volume
      </dd>
    </div>
  </dl>
</template>
