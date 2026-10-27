<script setup lang="ts">
import { h, mergeProps, renderSlot, useAttrs } from "vue";
import PriceTargetFanSvg from "./PriceTargetFanSvg.vue";
import PriceTargetFanTooltip from "./PriceTargetFanTooltip.vue";
defineOptions({ inheritAttrs: false });
const slots = defineSlots<{ default?(props: {}): any }>();
const attrs = useAttrs();
const builtInLayers = [PriceTargetFanSvg, PriceTargetFanTooltip] as const;
const RenderFrame = () =>
  h("div", mergeProps({ class: "relative" }, attrs), [
    renderSlot(slots, "default", {}, () =>
      builtInLayers.map((layer) => h(layer)),
    ),
  ]);
</script>
<template><RenderFrame /></template>
