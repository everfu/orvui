<script setup lang="ts">
import { useOrderBook } from "./context";
const book = useOrderBook();
</script>
<template>
  <div
    aria-hidden="true"
    class="grid grid-cols-3 py-3 text-[10px] uppercase tracking-wider text-muted-foreground"
  >
    <span class="px-4"
      >Price{{ book.quoteSymbol ? ` (${book.quoteSymbol})` : "" }}</span
    ><span class="px-4 text-right"
      >Size{{ book.baseSymbol ? ` (${book.baseSymbol})` : "" }}</span
    ><span class="px-4 text-right">Total</span>
  </div>
</template>
