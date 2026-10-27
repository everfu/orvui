<script setup lang="ts">
import { Banknote, ChevronDown } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { StatefulButton } from "../../../motion/button";
import { NumberTicker } from "../../../motion/number";
import { Tabs, TabsList, TabsTrigger } from "../../../motion/tabs";
import {
  formatCents,
  formatCompactCurrency,
  formatCurrency,
  parseAmount,
} from "./utils";
import { useMarketOrder } from "./use-market-order";
import type { PredictionMarketClassNames } from "./source-types";
import type {
  PredictionMarketMode,
  PredictionMarketOrderValue,
  PredictionMarketOutcome,
  PredictionMarketQuote,
} from "./types";
import AnimatedAmountInput from "./AnimatedAmountInput.vue";
export type {
  PredictionMarketMode,
  PredictionMarketOrderValue,
  PredictionMarketOutcome,
  PredictionMarketQuote,
} from "./types";
const props = withDefaults(
  defineProps<{
    outcomes?: PredictionMarketOutcome[];
    modelValue?: PredictionMarketOrderValue;
    defaultValue?: Partial<PredictionMarketOrderValue>;
    authenticated?: boolean;
    orderTypeLabel?: string;
    balance?: number;
    positions?: Record<string, number>;
    quickAmounts?: number[];
    minTrade?: number;
    classNames?: PredictionMarketClassNames;
  }>(),
  {
    outcomes: () => [
      { id: "up", label: "Up", price: 0.09 },
      { id: "down", label: "Down", price: 0.91 },
    ],
    authenticated: true,
    orderTypeLabel: "Market",
    balance: 500,
    positions: () => ({ up: 24, down: 16 }),
    quickAmounts: () => [10, 50, 100, 500],
    minTrade: 1,
  },
);
const emit = defineEmits<{
  "update:modelValue": [value: PredictionMarketOrderValue];
  valueChange: [value: PredictionMarketOrderValue];
  trade: [order: PredictionMarketOrderValue, quote: PredictionMarketQuote];
  signIn: [];
}>();
const {
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
} = useMarketOrder(props, {
  change(value) {
    emit("update:modelValue", value);
    emit("valueChange", value);
  },
  trade(order, quote) {
    emit("trade", order, quote);
  },
  signIn() {
    emit("signIn");
  },
});
const isNo = (outcome: PredictionMarketOutcome) =>
  ["no", "down"].includes(outcome.label.toLowerCase());
</script>
<template>
  <div
    :class="
      cn(
        'w-full max-w-[400px] overflow-hidden rounded-3xl border border-border bg-background',
        classNames?.root,
      )
    "
  >
    <div :class="cn('border-b border-border/80 px-4 pt-4', classNames?.header)">
      <div class="flex items-end justify-between gap-4">
        <Tabs
          :model-value="order.mode"
          variant="underline"
          :class="cn('shrink-0', classNames?.tabs)"
          @update:model-value="
            patch({ mode: $event as PredictionMarketMode, amount: '' })
          "
          ><TabsList class="gap-5 border-b-0 bg-transparent p-0"
            ><TabsTrigger
              v-for="mode in ['buy', 'sell'] as const"
              :key="mode"
              :value="mode"
              class="px-0 pb-3 pt-0 text-2xl font-semibold"
              indicator-class-name="h-0.5 bg-foreground"
              >{{ mode === "buy" ? "Buy" : "Sell" }}</TabsTrigger
            ></TabsList
          ></Tabs
        ><button
          type="button"
          :disabled="status === 'placing'"
          class="mb-3 inline-flex items-center gap-2 text-xl font-semibold text-foreground transition-opacity disabled:opacity-50"
        >
          {{ orderTypeLabel }}<ChevronDown class="h-5 w-5" />
        </button>
      </div>
    </div>
    <div class="space-y-4 p-3">
      <Tabs
        :model-value="selected?.id"
        variant="pill"
        :class="classNames?.outcomes"
        @update:model-value="patch({ outcomeId: $event })"
        ><TabsList class="grid w-full grid-cols-2 gap-2 p-1.5"
          ><TabsTrigger
            v-for="outcome in outcomes"
            :key="outcome.id"
            :value="outcome.id"
            :indicator-class-name="
              isNo(outcome)
                ? 'bg-red-500/10 dark:bg-red-500/15'
                : 'bg-emerald-500/20'
            "
            :class="
              cn(
                'h-14 w-full rounded-[1.35rem] px-0 py-0 text-base font-semibold active:scale-[0.99]',
                isNo(outcome)
                  ? outcome.id === selected?.id
                    ? 'text-red-300 dark:text-red-300'
                    : 'text-red-300/55 dark:text-red-300/50'
                  : outcome.id === selected?.id
                    ? 'text-emerald-400 dark:text-emerald-300'
                    : 'text-muted-foreground',
              )
            "
            >{{ outcome.label }} {{ formatCents(outcome.price) }}</TabsTrigger
          ></TabsList
        ></Tabs
      >
      <div
        ref="amount"
        :class="cn('rounded-3xl bg-card p-4', classNames?.amount)"
      >
        <div
          class="flex min-h-24 flex-col items-center justify-center gap-5 text-center"
        >
          <label :for="id" class="text-xl font-medium text-foreground mr-6">{{
            order.mode === "buy" ? "Amount" : "Shares"
          }}</label>
          <div class="w-full min-w-0">
            <AnimatedAmountInput
              :id="id"
              :mode="order.mode"
              :value="order.amount"
              :disabled="status === 'placing'"
              :input-size="inputSize"
              :reduce="reduce"
              @change="patch({ amount: $event })"
            />
          </div>
        </div>
        <div
          :class="
            cn('mt-8 flex flex-wrap justify-center gap-2', classNames?.chips)
          "
        >
          <button
            v-for="increment in quickAmounts"
            :key="increment"
            type="button"
            :disabled="status === 'placing'"
            class="h-9 rounded-xl bg-background px-3.5 text-sm font-semibold text-foreground transition-[background-color,transform] duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            @click="
              patch({ amount: String(parseAmount(order.amount) + increment) })
            "
          >
            +{{
              order.mode === "buy"
                ? formatCompactCurrency(increment)
                : increment
            }}</button
          ><button
            type="button"
            :disabled="status === 'placing'"
            class="h-9 rounded-xl bg-background px-3.5 text-sm font-semibold text-foreground transition-[background-color,transform] duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            @click="max"
          >
            Max
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="authenticated"
      :class="cn('border-t border-border/80 px-4 py-4', classNames?.footer)"
    >
      <div class="mb-4 flex items-end justify-between gap-3">
        <div class="min-w-0 shrink">
          <div
            class="flex items-center gap-2 text-xl font-semibold text-foreground"
          >
            {{ order.mode === "buy" ? "To win" : "To receive"
            }}<Banknote class="h-5 w-5 text-emerald-500" />
          </div>
          <p class="text-sm font-medium text-muted-foreground">
            Avg. Price {{ formatCents(quote.price) }}
          </p>
        </div>
        <NumberTicker
          :value="quote.payout * 100"
          :start-on-view="false"
          :duration="0.45"
          :stagger="0"
          blur
          :class="
            cn(
              'ml-auto min-w-0 shrink-0 justify-end whitespace-nowrap text-right font-semibold leading-none tracking-tight text-emerald-500 tabular-nums transition-[font-size] duration-200',
              payoutSize,
            )
          "
          :format="(cents) => formatCurrency(cents / 100)"
        />
      </div>
      <StatefulButton
        :state="actionState"
        variant="primary"
        size="lg"
        :press-scale="0.98"
        loading-text="Trading"
        success-text="Trade filled"
        :error-text="quote.error ?? 'Enter an amount'"
        :class="
          cn(
            'h-12 w-full rounded-2xl text-base font-semibold',
            classNames?.action,
          )
        "
        @click="submit"
        >Trade</StatefulButton
      >
    </div>
    <div v-else class="px-4 pb-5">
      <StatefulButton
        state="idle"
        variant="primary"
        size="lg"
        :press-scale="0.98"
        :class="
          cn(
            'h-14 w-full rounded-2xl text-base font-semibold',
            classNames?.action,
          )
        "
        @click="submit"
        >Connect</StatefulButton
      >
    </div>
  </div>
</template>
