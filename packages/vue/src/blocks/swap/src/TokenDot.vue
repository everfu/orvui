<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../../lib/utils";
import type { Chain, Token } from "./types";
const props = withDefaults(
  defineProps<{ token: Token; chain: Chain; size?: number }>(),
  { size: 28 },
);
const diameter = computed(() => `${props.size}px`),
  badge = computed(() => `${props.size * 0.42}px`);
</script>
<template>
  <span
    class="relative inline-flex shrink-0"
    :style="{ width: diameter, height: diameter }"
    ><span
      class="absolute inset-0 inline-flex items-center justify-center rounded-full border border-border bg-background text-[11px] font-bold text-foreground"
      >{{ token.symbol.substring(0, 2) }}</span
    ><span
      :style="{ width: badge, height: badge }"
      :class="
        cn(
          'absolute -bottom-0.5 -right-0.5 inline-flex items-center justify-center rounded-full border-2 border-card text-[7px] font-bold',
          chain.tone,
        )
      "
      >{{ chain.symbol }}</span
    ></span
  >
</template>
