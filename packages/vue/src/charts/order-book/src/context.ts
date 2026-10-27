import { computed, getCurrentInstance, reactive } from "vue";
import { useReducedMotion } from "../../../lib/composables";
import { selection, context, formatCompact } from "../../shared";
import { buildOrderBook, summarizeDepth, type DepthLevel } from "./model";
export type OrderBookLevel = { price: number; size: number };
export type OrderBookActiveLevel = {
  side: "bid" | "ask";
  price: number;
} | null;
export interface OrderBookProps {
  bids: readonly OrderBookLevel[];
  asks: readonly OrderBookLevel[];
  levels?: number;
  lastPrice?: number;
  label?: string;
  baseSymbol?: string;
  quoteSymbol?: string;
  formatPrice?: (value: number) => string;
  formatSize?: (value: number) => string;
  activeLevel?: OrderBookActiveLevel;
  defaultActiveLevel?: OrderBookActiveLevel;
  className?: string;
}
const priceFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
export function createOrderBookModel(
  props: OrderBookProps,
  emit: (event: any, ...args: any[]) => void,
) {
  const instance = getCurrentInstance();
  const book = computed(() =>
    buildOrderBook(props.bids, props.asks, props.levels ?? 9),
  );
  const selectionState = selection(
    () => props.activeLevel,
    props.defaultActiveLevel ?? null,
    (value) => {
      emit("update:activeLevel", value);
      emit("activeLevelChange", value);
    },
  );
  const active = computed(() => {
    const selected = selectionState.value;
    if (!selected) return null;
    const rows = selected.side === "bid" ? book.value.bids : book.value.asks;
    const index = rows.findIndex((row) => row.price === selected.price);
    return index < 0 ? null : { side: selected.side, index };
  });
  const summary = computed(() => {
    if (!active.value) return null;
    const side = active.value.side;
    const rows = side === "bid" ? book.value.bids : book.value.asks;
    return summarizeDepth(rows.slice(0, active.value.index + 1), side);
  });
  return reactive({
    book,
    active,
    summary,
    selectable: computed(() => Boolean(instance?.vnode.props?.onLevelSelect)),
    bids: computed(() => book.value.bids),
    asks: computed(() => book.value.asks),
    bidTotal: computed(() => book.value.bidTotal),
    askTotal: computed(() => book.value.askTotal),
    maxTotal: computed(() => book.value.maxTotal),
    spread: computed(() => book.value.spread),
    midpoint: computed(() => book.value.midpoint),
    price: computed(() =>
      props.lastPrice != null &&
      Number.isFinite(props.lastPrice) &&
      props.lastPrice > 0
        ? props.lastPrice
        : book.value.midpoint,
    ),
    setActiveLevel(value: OrderBookActiveLevel) {
      selectionState.value = value;
    },
    select(value: DepthLevel, side: "bid" | "ask") {
      emit("levelSelect", value, side);
    },
    label: computed(() => props.label ?? "Order book"),
    baseSymbol: computed(() => props.baseSymbol ?? ""),
    quoteSymbol: computed(() => props.quoteSymbol ?? "USD"),
    formatPrice: computed(
      () => props.formatPrice ?? ((value: number) => priceFormat.format(value)),
    ),
    formatSize: computed(() => props.formatSize ?? formatCompact),
    reduce: useReducedMotion(),
  });
}
export const orderBookContext =
  context<ReturnType<typeof createOrderBookModel>>("OrderBook");
export const useOrderBook = orderBookContext.use;
