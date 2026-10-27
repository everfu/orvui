<script setup lang="ts">
import { computed } from "vue";
import { useOrderBook } from "./context";
import OrderBookDepthRow from "./OrderBookDepthRow.vue";
const props = defineProps<{ side: "bid" | "ask" }>();
const book = useOrderBook();
const rows = computed(() => {
  const levels = props.side === "ask" ? book.asks.slice().reverse() : book.bids;
  return levels.map((row, index) => {
    const depthIndex = props.side === "ask" ? levels.length - index - 1 : index;
    return {
      row,
      depthIndex,
      inRange:
        book.active?.side === props.side && depthIndex <= book.active.index,
      fraction: book.maxTotal ? row.total / book.maxTotal : 0,
    };
  });
});
</script>
<template>
  <table
    :aria-label="side === 'ask' ? 'Asks · sell orders' : 'Bids · buy orders'"
    class="w-full table-fixed border-separate border-spacing-0"
  >
    <thead class="sr-only">
      <tr>
        <th scope="col">Price {{ book.quoteSymbol }}</th>
        <th scope="col">Size {{ book.baseSymbol }}</th>
        <th scope="col">Cumulative total {{ book.baseSymbol }}</th>
      </tr>
    </thead>
    <tbody @pointerleave="book.setActiveLevel(null)">
      <tr v-if="!rows.length">
        <td colspan="3" class="px-4 py-6 text-center text-muted-foreground">
          No {{ side === "ask" ? "asks" : "bids" }}
        </td>
      </tr>
      <OrderBookDepthRow
        v-for="entry in rows"
        :key="entry.row.price"
        :row="entry.row"
        :side="side"
        :in-range="entry.inRange"
        :fraction="entry.fraction"
        :entrance-index="entry.depthIndex"
      />
    </tbody>
  </table>
</template>
