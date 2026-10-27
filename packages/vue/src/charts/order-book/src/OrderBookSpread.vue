<script setup lang="ts">
import { computed } from "vue";
import { useOrderBook } from "./context";
const book = useOrderBook();
const spread = computed(() =>
  book.spread === null || book.midpoint === null
    ? "Spread unavailable"
    : book.spread < 0
      ? "Crossed book"
      : `Spread ${book.formatPrice(book.spread)} · ${((book.spread / book.midpoint) * 100).toFixed(3)}%`,
);
</script>
<template>
  <div
    class="my-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-y border-border bg-muted/40 px-4 py-3"
  >
    <span class="text-base font-medium tracking-tight"
      ><span class="sr-only">Reference price: </span
      >{{ book.price === null ? "—" : book.formatPrice(book.price) }}</span
    ><span class="text-[10px] text-muted-foreground">{{ spread }}</span>
  </div>
</template>
