import { computed, onBeforeUnmount, ref, useId } from "vue";
import { animate } from "motion-v";
import { useControllable } from "../../shared";
import { useReducedMotion } from "../../../lib/composables";
import { EASE_OUT } from "../../../lib/ease";
import { amountInputSize, buildQuote, payoutTickerSize } from "./utils";
import type {
  PredictionMarketOrderValue as Order,
  PredictionMarketOutcome as Outcome,
  PredictionMarketQuote as Quote,
} from "./types";
export function useMarketOrder(
  props: {
    modelValue?: Order;
    defaultValue?: Partial<Order>;
    outcomes: Outcome[];
    positions: Record<string, number>;
    balance: number;
    minTrade: number;
    authenticated: boolean;
  },
  events: {
    change: (value: Order) => void;
    trade: (order: Order, quote: Quote) => void;
    signIn: () => void;
  },
) {
  const order = useControllable(
    () => props.modelValue,
    {
      mode: "buy" as const,
      outcomeId: props.outcomes[0]?.id ?? "",
      amount: "",
      ...props.defaultValue,
    },
    events.change,
  );
  const selected = computed(
    () =>
      props.outcomes.find((outcome) => outcome.id === order.value.outcomeId) ??
      props.outcomes[0],
  );
  const position = computed(
    () => props.positions[selected.value?.id ?? ""] ?? 0,
  );
  const quote = computed(() =>
    buildQuote({
      order: order.value,
      outcome: selected.value ?? { id: "", label: "", price: 0 },
      balance: props.balance,
      position: position.value,
      minTrade: props.minTrade,
    }),
  );
  const status = ref<"idle" | "placing" | "filled">("idle"),
    reduce = useReducedMotion(),
    id = useId(),
    amount = ref<HTMLElement>();
  const actionState = computed(() =>
    status.value === "placing"
      ? "loading"
      : status.value === "filled"
        ? "success"
        : quote.value.valid
          ? "idle"
          : "error",
  );
  const inputSize = computed(() => amountInputSize(order.value.amount)),
    payoutSize = computed(() => payoutTickerSize(quote.value.payout));
  let timer: ReturnType<typeof setTimeout> | undefined,
    shake: ReturnType<typeof animate> | undefined;
  function patch(value: Partial<Order>) {
    clearTimeout(timer);
    status.value = "idle";
    order.value = { ...order.value, ...value };
  }
  function max() {
    patch({
      amount:
        order.value.mode === "buy"
          ? String(Math.floor(props.balance))
          : position.value.toFixed(position.value % 1 === 0 ? 0 : 2),
    });
  }
  function submit() {
    if (!props.authenticated) {
      events.signIn();
      return;
    }
    if (!quote.value.valid) {
      if (amount.value && !reduce.value) {
        shake?.stop();
        shake = animate(
          amount.value,
          { x: [0, -5, 5, -3, 3, -1, 0] },
          { duration: 0.38, ease: EASE_OUT },
        );
      }
      return;
    }
    if (status.value === "placing") return;
    status.value = "placing";
    const payload = { ...order.value },
      valuation = { ...quote.value };
    timer = setTimeout(() => {
      status.value = "filled";
      events.trade(payload, valuation);
    }, 650);
  }
  onBeforeUnmount(() => {
    clearTimeout(timer);
    shake?.stop();
  });
  return {
    order,
    selected,
    quote,
    reduce,
    id,
    amount,
    status,
    actionState,
    inputSize,
    payoutSize,
    patch,
    max,
    submit,
  };
}
