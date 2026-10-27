<script setup lang="ts">
import { ref, useId } from "vue";
import { Tabs, TabsList, TabsTrigger } from "../../motion/tabs";
import {
  VolumeProfile,
  VolumeProfilePlot,
  VolumeProfileTooltip,
  VolumeProfileSummary,
  type VolumeProfileBin,
} from "./index";
const sessions = [
  {
    id: "today",
    label: "Today",
    volumes: [
      18, 27, 36, 52, 70, 96, 135, 172, 205, 241, 278, 225, 192, 146, 108, 79,
      56, 42, 31, 22, 16, 11, 8, 5,
    ],
  },
  {
    id: "previous",
    label: "Previous",
    volumes: [
      6, 9, 13, 18, 27, 40, 56, 74, 95, 114, 146, 188, 242, 286, 253, 208, 165,
      126, 92, 65, 42, 30, 21, 14,
    ],
  },
  {
    id: "week",
    label: "Week",
    volumes: [
      75, 104, 143, 214, 305, 382, 494, 626, 795, 902, 1028, 1182, 1097, 973,
      825, 695, 589, 481, 372, 289, 195, 154, 119, 84,
    ],
  },
];
const data: Record<string, readonly VolumeProfileBin[]> = {};
for (const session of sessions)
  data[session.id] = session.volumes.map((volume, index) => ({
    id: `price-${64000 + index * 100}`,
    priceLow: 64000 + index * 100,
    priceHigh: 64100 + index * 100,
    volume,
  }));
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const amount = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const formatPrice = (price: number) => currency.format(price),
  formatVolume = (volume: number) => amount.format(volume);
const session = ref("today"),
  previewId = useId(),
  panelId = previewId + "-profile";
</script>
<template>
  <div class="w-full max-w-xl min-w-0 py-2">
    <Tabs v-model="session"
      ><div class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div class="space-y-1">
          <p class="text-sm font-medium">BTC / USD</p>
          <p class="text-xs text-muted-foreground">
            Volume by price · Demo data
          </p>
        </div>
        <TabsList
          aria-label="Profile session"
          wrapper-class-name="w-auto"
          class="bg-muted"
          ><TabsTrigger
            v-for="item in sessions"
            :key="item.id"
            :value="item.id"
            :id="`${previewId}-${item.id}`"
            :aria-controls="panelId"
            :tabindex="session === item.id ? 0 : -1"
            indicator-class-name="bg-background"
            class="min-h-8 px-3 py-1.5 text-xs [&_[data-tabs-label]]:text-foreground"
            >{{ item.label }}</TabsTrigger
          ></TabsList
        >
      </div>
      <div
        :id="panelId"
        role="tabpanel"
        :aria-labelledby="`${previewId}-${session}`"
      >
        <VolumeProfile
          :data="data[session]"
          :format-price="formatPrice"
          :format-volume="formatVolume"
          unit="BTC"
          label="BTC volume profile"
          ><VolumeProfilePlot
            class="h-72 sm:h-80" /><VolumeProfileTooltip /><VolumeProfileSummary
        /></VolumeProfile></div
    ></Tabs>
  </div>
</template>
