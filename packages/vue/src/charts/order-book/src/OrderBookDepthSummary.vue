<script setup lang="ts">
import { useOrderBook } from "./context";
withDefaults(defineProps<{ placeholder?: string }>(), {
  placeholder: "Hover a level to see the cost of filling up to it",
});
const book = useOrderBook();
</script>
<template>
  <p
    aria-live="polite"
    class="flex min-h-10 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border px-4 py-2 text-muted-foreground"
  >
    <span v-if="!book.summary" class="font-sans">{{ placeholder }}</span
    ><slot v-else :summary="book.summary"
      ><span
        >Avg
        <span class="text-foreground">{{
          book.formatPrice(book.summary.averagePrice)
        }}</span></span
      ><span
        ><span class="text-foreground"
          >{{ book.formatSize(book.summary.size) }} {{ book.baseSymbol }}</span
        >
        · {{ book.formatPrice(book.summary.quote) }}
        {{ book.quoteSymbol }}</span
      ></slot
    >
  </p>
</template>
