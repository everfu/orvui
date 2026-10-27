<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";
import {
  Bell,
  Eye,
  EyeOff,
  TrendingDown,
  TrendingUp,
  ArrowUp,
  ArrowDownToLine,
  Repeat,
  CreditCard,
} from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { ActionSwapText } from "../../../motion/action-swap";
import { Button } from "../../../motion/button";
import { useReducedMotion } from "../../../lib/composables";
import { EASE_OUT, SPRING_PRESS } from "../../../lib/ease";
import { type Content } from "../../shared";
import { useWallet, money } from "./use-wallet";
import AccountSwitcher from "./AccountSwitcher.vue";
import SearchBar from "./SearchBar.vue";
export interface WalletAccount {
  id: string;
  name: string;
  address: string;
  avatar?: Content;
}
const props = withDefaults(
  defineProps<{
    accounts: WalletAccount[];
    accountId?: string;
    defaultAccountId?: string;
    balance: number;
    balancePrefix?: string;
    defaultChange?: number;
    defaultBalanceHidden?: boolean;
    searchPlaceholder?: string;
    searchRecent?: string[];
    hasNotifications?: boolean;
  }>(),
  {
    balancePrefix: "$",
    defaultBalanceHidden: false,
    searchRecent: () => [],
    hasNotifications: false,
  },
);
const emit = defineEmits<{
  "update:accountId": [id: string];
  accountChange: [id: string];
  send: [];
  deposit: [];
  swap: [];
  buy: [];
  searchChange: [value: string];
  searchSubmit: [value: string];
  notifications: [];
}>();
const reduce = useReducedMotion();
const { accountId, account, hidden, delta, shownBalance } = useWallet(
  props,
  (id) => {
    emit("update:accountId", id);
    emit("accountChange", id);
  },
);
const actions = [
  { id: "send", label: "Send", icon: ArrowUp, run: () => emit("send") },
  {
    id: "deposit",
    label: "Deposit",
    icon: ArrowDownToLine,
    run: () => emit("deposit"),
  },
  { id: "swap", label: "Swap", icon: Repeat, run: () => emit("swap") },
  { id: "buy", label: "Buy", icon: CreditCard, run: () => emit("buy") },
];
</script>
<template>
  <div
    class="relative w-full max-w-xs overflow-hidden rounded-4xl border border-border p-6"
  >
    <div class="relative flex items-center justify-between gap-2">
      <AccountSwitcher
        :accounts="accounts"
        :active-account="account"
        @select="accountId = $event"
      />
      <div class="flex shrink-0 items-center gap-1">
        <SearchBar
          :placeholder="searchPlaceholder"
          :recent="searchRecent"
          @change="emit('searchChange', $event)"
          @submit="emit('searchSubmit', $event)"
        /><Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          class="relative"
          @click="emit('notifications')"
          ><Bell class="h-4 w-4" /><span
            v-if="hasNotifications"
            class="absolute right-1.5 top-1.5 flex h-2 w-2"
            ><span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" /><span
              class="relative inline-flex h-2 w-2 rounded-full bg-primary" /></span
        ></Button>
      </div>
    </div>
    <div class="mt-8 flex flex-col items-center text-center">
      <div class="flex items-center gap-1.5">
        <p class="text-xs text-muted-foreground">Balance</p>
        <button
          type="button"
          :aria-label="hidden ? 'Show balance' : 'Hide balance'"
          :aria-pressed="hidden"
          class="text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          @click="hidden = !hidden"
        >
          <component :is="hidden ? EyeOff : Eye" class="h-3.5 w-3.5" />
        </button>
      </div>
      <ActionSwapText
        :value="hidden ? 'hidden' : shownBalance"
        animation="cascade"
        class="text-3xl font-semibold text-foreground"
        >{{ hidden ? "*******" : shownBalance }}</ActionSwapText
      >
      <div v-if="hidden" class="mt-2 flex h-7 items-center justify-center">
        <span
          class="translate-y-[3px] text-sm font-semibold leading-none tracking-[0.3em] text-muted-foreground"
          >*****</span
        >
      </div>
      <div v-else class="mt-2 flex h-7 items-center justify-center">
        <AnimatePresence mode="wait" as="span" class="contents"
          ><motion.span
            v-if="delta"
            :key="delta.id"
            :initial="{
              opacity: 0,
              y: reduce ? 0 : 6,
              scale: reduce ? 1 : 0.9,
            }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :exit="{ opacity: 0, y: reduce ? 0 : -6, scale: reduce ? 1 : 0.9 }"
            :transition="{ duration: 0.2, ease: EASE_OUT }"
            :class="
              cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums',
                delta.amount > 0
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-500/15 text-red-600 dark:text-red-400',
              )
            "
            ><component
              :is="delta.amount > 0 ? TrendingUp : TrendingDown"
              class="h-3.5 w-3.5"
            />{{ delta.amount > 0 ? "+" : "-" }}${{
              money(Math.abs(delta.amount))
            }}</motion.span
          ></AnimatePresence
        >
      </div>
    </div>
    <div class="mt-8">
      <div class="flex items-start justify-between gap-2">
        <motion.button
          v-for="item in actions"
          :key="item.id"
          type="button"
          :while-press="reduce ? undefined : { scale: 0.94 }"
          :transition="SPRING_PRESS"
          class="flex flex-1 flex-col items-center gap-2 outline-none"
          @click="item.run"
          ><span
            class="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground"
            ><component :is="item.icon" class="h-5 w-5" /></span
          ><span class="text-xs font-medium text-muted-foreground">{{
            item.label
          }}</span></motion.button
        >
      </div>
    </div>
  </div>
</template>
