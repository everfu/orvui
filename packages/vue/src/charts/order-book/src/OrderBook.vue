<script setup lang="ts">
import { provide } from "vue";
import {
  createOrderBookModel,
  orderBookContext,
  type OrderBookProps,
} from "./context";
import OrderBookHeader from "./OrderBookHeader.vue";
import OrderBookSide from "./OrderBookSide.vue";
import OrderBookSpread from "./OrderBookSpread.vue";
import OrderBookBalance from "./OrderBookBalance.vue";
const props = defineProps<OrderBookProps>();
const emit = defineEmits([
  "update:activeLevel",
  "activeLevelChange",
  "levelSelect",
]);
const book = createOrderBookModel(props, emit);
provide(orderBookContext.key, book);
</script>
<template>
  <section
    :aria-label="book.label"
    :class="[
      'w-full max-w-[560px] overflow-hidden rounded-2xl border border-border bg-background font-mono text-xs tabular-nums',
      props.className,
    ]"
  >
    <slot
      ><OrderBookHeader /><OrderBookSide
        side="ask" /><OrderBookSpread /><OrderBookSide
        side="bid" /><OrderBookBalance
    /></slot>
  </section>
</template>
