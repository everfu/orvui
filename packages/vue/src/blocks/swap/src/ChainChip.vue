<script setup lang="ts">
import { cn } from "../../../lib/utils";
import type { Chain } from "./types";
defineProps<{ active: boolean; chain?: Chain; label?: string }>();
</script>
<template>
  <button
    type="button"
    :aria-pressed="active"
    :title="chain?.name ?? label"
    :class="
      cn(
        'inline-flex h-9 shrink-0 items-center justify-center rounded-xl border transition-colors active:scale-[0.97] transition-transform',
        chain ? 'w-9' : 'px-3',
        active
          ? 'border-primary/20 bg-muted/60 text-foreground'
          : 'border-border/60 bg-background/40 text-foreground hover:border-border',
      )
    "
  >
    <span
      v-if="chain"
      :style="{ width: '20px', height: '20px' }"
      :class="
        cn(
          'inline-flex shrink-0 items-center justify-center rounded-full text-[9px] font-bold',
          chain.tone,
        )
      "
      >{{ chain.symbol }}</span
    ><span v-else class="text-xs font-semibold">{{ label }}</span>
  </button>
</template>
