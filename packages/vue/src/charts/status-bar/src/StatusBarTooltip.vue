<script setup lang="ts">
import { computed } from "vue";
import ChartTooltip from "../../ChartTooltip.vue";
import { useStatusBar } from "./context";
withDefaults(defineProps<{ side?: "top" | "right" | "bottom" | "left" }>(), {
  side: "top",
});
const history = useStatusBar();
const point = computed(() => ({
  x:
    (Math.max(0, history.activeIndex) + 0.5) / Math.max(1, history.rows.length),
  y: 0.1,
}));
</script>

<template>
  <ChartTooltip
    :open="history.tooltipOpen && history.active !== null"
    :anchor="history.plotRef"
    :id="history.tooltipId"
    :point="point"
    :side="side"
    :follow-cursor="false"
    @update:open="history.tooltipOpen = $event"
  >
    <slot
      v-if="history.active"
      :datum="history.active.datum"
      :status="history.active.status"
    >
      <p class="text-muted-foreground">{{ history.active.datum.label }}</p>
      <p class="mt-1 flex items-center gap-2 font-medium">
        <span
          class="size-2 rounded-full"
          :style="{ backgroundColor: history.active.status.color }"
        />{{ history.active.status.label }}
      </p>
      <p
        v-if="history.active.datum.description"
        class="mt-1 text-muted-foreground"
      >
        {{ history.active.datum.description }}
      </p>
    </slot>
  </ChartTooltip>
</template>
