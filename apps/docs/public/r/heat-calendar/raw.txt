<script setup lang="ts">
import { provide } from "vue";
import { createHeatModel, heatContext } from "./context";
import type { HeatCalendarProps } from "./types";
import HeatCalendarGrid from "./HeatCalendarGrid.vue";
import HeatCalendarLegend from "./HeatCalendarLegend.vue";
import HeatCalendarTooltip from "./HeatCalendarTooltip.vue";
const props = defineProps<HeatCalendarProps>();
const emit = defineEmits(["update:selection", "selectionChange"]);
const calendar = createHeatModel(props, emit);
provide(heatContext.key, calendar);
</script>
<template>
  <section
    aria-label="Activity calendar"
    :class="['relative w-fit max-w-full', props.className]"
  >
    <slot
      ><HeatCalendarGrid><HeatCalendarTooltip /></HeatCalendarGrid
      ><HeatCalendarLegend
    /></slot>
  </section>
</template>
