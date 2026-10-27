<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";
import { ArrowDownUp, LoaderCircle, Settings } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { SPRING_PRESS } from "../../../lib/ease";
import { CHAINS, TOKENS } from "./data";
import { EASE } from "./constants";
import { formatAmount } from "./utils";
import { useSwap, type SwapOrder } from "./use-swap";
import type { Chain, Token } from "./types";
import Field from "./Field.vue";
import DestinationRow from "./DestinationRow.vue";
import TokenPicker from "./TokenPicker.vue";
const props = withDefaults(
  defineProps<{
    chains?: Chain[];
    tokens?: Token[];
    defaultFromId?: string;
    defaultToId?: string;
  }>(),
  {
    chains: () => CHAINS,
    tokens: () => TOKENS,
    defaultFromId: "eth-eth",
    defaultToId: "sol-sol",
  },
);
const emit = defineEmits<{ swap: [order: SwapOrder]; connect: [] }>();
const {
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
} = useSwap(props, (order) => emit("swap", order));
</script>
<template>
  <div
    class="relative isolate w-full max-w-[420px] overflow-hidden rounded-3xl border border-border/30 bg-card"
  >
    <div
      class="flex h-12 items-center justify-between border-b border-border/50 px-3"
    >
      <span class="px-2 text-sm font-semibold tracking-tight text-foreground"
        >Swap</span
      ><button
        type="button"
        aria-label="Settings"
        class="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-transform hover:bg-muted/60 hover:text-foreground active:scale-[0.97]"
      >
        <Settings class="h-4 w-4" />
      </button>
    </div>
    <div class="flex flex-col gap-1.5 p-4">
      <Field
        side="from"
        :token="from"
        :chain="fromChain"
        :amount="amount"
        editable
        :quoting="false"
        @amount="amount = $event"
        @open-picker="picking = 'from'"
      />
      <div class="relative -my-4 flex justify-center" :style="{ zIndex: 1 }">
        <motion.button
          type="button"
          aria-label="Reverse direction"
          :while-press="reduce ? undefined : { scale: 0.9 }"
          :animate="reduce ? undefined : { rotate: rotation }"
          :transition="
            reduce
              ? { duration: 0 }
              : { type: 'spring', stiffness: 380, damping: 26, mass: 0.6 }
          "
          class="inline-flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-card bg-muted text-foreground backdrop-blur"
          @click="flip"
          ><ArrowDownUp class="h-3.5 w-3.5"
        /></motion.button>
      </div>
      <Field
        side="to"
        :token="to"
        :chain="toChain"
        :amount="total > 0 ? formatAmount(total) : ''"
        :editable="false"
        :quoting="quoting"
        @open-picker="picking = 'to'"
      />
      <div
        class="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-xl border border-border/50 bg-background/40 px-3.5 py-2.5 text-[11px]"
      >
        <span class="text-muted-foreground">Rate</span
        ><span class="text-right tabular-nums text-foreground"
          ><LoaderCircle
            v-if="quoting"
            class="ml-auto inline h-3 w-3 animate-spin text-muted-foreground"
          /><template v-else
            >1 {{ from.symbol }} ≈ {{ formatAmount(rate) }}
            {{ to.symbol }}</template
          ></span
        ><span class="text-muted-foreground">Network fee</span
        ><span class="text-right tabular-nums text-foreground">$0.42</span
        ><span class="text-muted-foreground">Slippage</span
        ><span class="text-right tabular-nums text-foreground">0.50%</span
        ><span class="text-muted-foreground">ETA</span
        ><span class="text-right text-foreground">≈ 24s</span>
      </div>
      <DestinationRow
        :show="showDest"
        :address="destination"
        :reduce="reduce"
        @toggle="toggleDestination"
        @address="destination = $event"
      /><motion.button
        type="button"
        :while-press="disabled || reduce ? undefined : { scale: 0.97 }"
        :transition="SPRING_PRESS"
        :disabled="disabled"
        :class="
          cn(
            'mt-3 inline-flex h-12 w-full items-center justify-center rounded-2xl text-sm font-semibold transition-colors',
            disabled
              ? 'cursor-not-allowed bg-muted text-muted-foreground'
              : 'bg-primary text-primary-foreground hover:bg-primary/90',
          )
        "
        @click="submit"
        ><AnimatePresence mode="wait" :initial="false"
          ><motion.span
            :key="label"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="{ duration: reduce ? 0 : 0.14, ease: EASE }"
            >{{ label }}</motion.span
          ></AnimatePresence
        ></motion.button
      >
    </div>
    <TokenPicker
      :open="picking !== null"
      :side="picking"
      :chains="chains"
      :tokens="tokens"
      :selected-id="picking === 'from' ? fromId : toId"
      :reduce="reduce"
      @pick="pick"
      @close="picking = null"
    />
  </div>
</template>
