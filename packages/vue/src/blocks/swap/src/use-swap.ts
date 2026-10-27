import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useReducedMotion } from "../../../lib/composables";
import { isValidAddress, truncateAddress } from "./utils";
import type { Chain, Token, TokenSide } from "./types";
export type SwapOrder = {
  from: Token;
  to: Token;
  amount: number;
  toAmount: number;
  destination?: string;
};
export function useSwap(
  props: {
    tokens: Token[];
    chains: Chain[];
    defaultFromId: string;
    defaultToId: string;
  },
  send: (order: SwapOrder) => void,
) {
  const reduce = useReducedMotion(),
    fromId = ref(props.defaultFromId),
    toId = ref(props.defaultToId),
    amount = ref("1"),
    rotation = ref(0),
    quoting = ref(false),
    picking = ref<TokenSide | null>(null),
    showDest = ref(false),
    destination = ref("");
  function token(id: string) {
    const entry = props.tokens.find((token) => token.id === id);
    if (!entry) throw new Error("Unknown token id: " + id);
    return entry;
  }
  function chain(id: string) {
    const entry = props.chains.find((chain) => chain.id === id);
    if (!entry) throw new Error("Unknown chain id: " + id);
    return entry;
  }
  const from = computed(() => token(fromId.value)),
    to = computed(() => token(toId.value)),
    fromChain = computed(() => chain(from.value.chainId)),
    toChain = computed(() => chain(to.value.chainId));
  const numeric = computed(() => Number(amount.value) || 0),
    rate = computed(() =>
      from.value.usd && to.value.usd ? from.value.usd / to.value.usd : 1,
    ),
    total = computed(() => numeric.value * rate.value);
  const insufficient = computed(
    () =>
      from.value.balance !== undefined && numeric.value > from.value.balance,
  );
  const disabled = computed(() => numeric.value <= 0 || insufficient.value);
  const label = computed(() =>
    numeric.value <= 0
      ? "Enter an amount"
      : insufficient.value
        ? `Insufficient ${from.value.symbol}`
        : destination.value && isValidAddress(destination.value)
          ? `Swap + Send to ${truncateAddress(destination.value)}`
          : `Swap ${from.value.symbol} → ${to.value.symbol}`,
  );
  let quoteTimer: ReturnType<typeof setTimeout> | undefined,
    mounted = false;
  function quote() {
    clearTimeout(quoteTimer);
    quoting.value = mounted && !!numeric.value;
    if (quoting.value)
      quoteTimer = setTimeout(() => {
        quoting.value = false;
      }, 450);
  }
  watch([numeric, fromId, toId], quote);
  onMounted(() => {
    mounted = true;
    quote();
  });
  onBeforeUnmount(() => {
    mounted = false;
    clearTimeout(quoteTimer);
  });
  function flip() {
    rotation.value += 180;
    [fromId.value, toId.value] = [toId.value, fromId.value];
  }
  function pick(id: string) {
    const side = picking.value;
    if (!side) return;
    const selected = side === "from" ? fromId : toId,
      other = side === "from" ? toId : fromId;
    if (id === other.value) other.value = selected.value;
    selected.value = id;
    picking.value = null;
  }
  function toggleDestination() {
    if (showDest.value) destination.value = "";
    showDest.value = !showDest.value;
  }
  function submit() {
    if (!disabled.value)
      send({
        from: from.value,
        to: to.value,
        amount: numeric.value,
        toAmount: total.value,
        destination: destination.value || undefined,
      });
  }
  return {
    reduce,
    fromId,
    toId,
    amount,
    rotation,
    quoting,
    picking,
    showDest,
    destination,
    from,
    to,
    fromChain,
    toChain,
    rate,
    total,
    disabled,
    label,
    flip,
    pick,
    toggleDestination,
    submit,
  };
}
