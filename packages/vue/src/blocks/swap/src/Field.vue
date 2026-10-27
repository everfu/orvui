<script setup lang="ts">
import { computed, useId } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { ChevronDown, LoaderCircle, Wallet } from "lucide-vue-next";
import { useReducedMotion } from "../../../lib/composables";
import { EASE } from "./constants";
import { formatAmount, sanitizeAmount } from "./utils";
import type { Chain, Token, TokenSide } from "./types";
import TokenDot from "./TokenDot.vue";
const props = defineProps<{
    side: TokenSide;
    token: Token;
    chain: Chain;
    amount: string;
    editable: boolean;
    quoting: boolean;
  }>(),
  emit = defineEmits<{ amount: [amount: string]; openPicker: [] }>();
const id = useId(),
  reduce = useReducedMotion(),
  usd = computed(() => (Number(props.amount) || 0) * (props.token.usd ?? 0));
</script>
<template>
  <div
    class="relative rounded-2xl border border-border/50 bg-background/40 p-3.5"
  >
    <label
      :for="id"
      class="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
      >{{ side === "from" ? "You pay" : "You get" }}</label
    >
    <div class="flex items-center justify-between gap-3">
      <div class="min-w-0 flex-1">
        <input
          v-if="editable"
          :id="id"
          inputmode="decimal"
          :value="amount"
          placeholder="0"
          class="w-full bg-transparent text-2xl font-semibold tracking-tight text-foreground tabular-nums outline-none placeholder:text-muted-foreground/60"
          @input="
            emit(
              'amount',
              sanitizeAmount(($event.target as HTMLInputElement).value),
            )
          "
        />
        <div
          v-else
          class="flex h-9 items-center gap-2 text-2xl font-semibold tracking-tight tabular-nums"
        >
          <motion.span
            :animate="{
              opacity: quoting ? 0.55 : 1,
              filter: quoting ? 'blur(2px)' : 'blur(0px)',
            }"
            :transition="{ duration: reduce ? 0 : 0.18, ease: EASE }"
            class="text-foreground"
            >{{ amount || "0" }}</motion.span
          ><AnimatePresence as="span" class="contents"
            ><motion.span
              v-if="quoting"
              :initial="{ opacity: 0, scale: 0.85 }"
              :animate="{ opacity: 1, scale: 1 }"
              :exit="{ opacity: 0, scale: 0.85 }"
              :transition="{ duration: reduce ? 0 : 0.14, ease: EASE }"
              ><LoaderCircle
                class="h-4 w-4 animate-spin text-muted-foreground" /></motion.span
          ></AnimatePresence>
        </div>
        <p class="mt-1 text-[11px] text-muted-foreground tabular-nums">
          ≈ ${{ formatAmount(usd, 2) }}
        </p>
      </div>
      <button
        type="button"
        class="group inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card pl-1 pr-2.5 text-sm font-semibold text-foreground transition-transform hover:border-border active:scale-[0.97]"
        @click="emit('openPicker')"
      >
        <TokenDot :token="token" :chain="chain" /><span>{{ token.symbol }}</span
        ><ChevronDown class="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    </div>
    <div
      class="mt-2 flex items-center justify-between text-[11px] text-muted-foreground"
    >
      <span class="inline-flex items-center gap-1"
        ><Wallet class="h-3 w-3" /><span class="tabular-nums">{{
          token.balance ? formatAmount(token.balance) : "0.00"
        }}</span
        ><span>· {{ chain.name }}</span></span
      ><button
        v-if="side === 'from' && token.balance"
        type="button"
        class="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        @click="emit('amount', String(token.balance))"
      >
        Max
      </button>
    </div>
  </div>
</template>
