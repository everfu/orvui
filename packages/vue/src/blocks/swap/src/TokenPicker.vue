<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { Search, X } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { SPRING_PANEL } from "../../../lib/ease";
import { useOverlay } from "../../../lib/composables";
import { EASE } from "./constants";
import { formatAmount } from "./utils";
import ChainChip from "./ChainChip.vue";
import TokenDot from "./TokenDot.vue";
import type { Chain, Token, TokenSide } from "./types";
const props = defineProps<{
    open: boolean;
    side: TokenSide | null;
    chains: Chain[];
    tokens: Token[];
    selectedId: string;
    reduce: boolean;
  }>(),
  emit = defineEmits<{ pick: [id: string]; close: [] }>();
const chainFilter = ref("all"),
  q = ref(""),
  input = ref<HTMLInputElement>(),
  panel = ref<HTMLElement | null>(null);
const popular = computed(() =>
    props.tokens.filter((token) => token.popular).slice(0, 6),
  ),
  chainById = computed(
    () => new Map(props.chains.map((chain) => [chain.id, chain])),
  );
const filtered = computed(() => {
  const term = q.value.trim().toLowerCase();
  return props.tokens.filter(
    (token) =>
      (chainFilter.value === "all" || token.chainId === chainFilter.value) &&
      (!term ||
        [
          token.symbol,
          token.name,
          chainById.value.get(token.chainId)?.name,
          token.address,
        ].some((field) => field?.toLowerCase().includes(term))),
  );
});
watch(
  () => props.open,
  (show) => {
    if (show) q.value = "";
  },
);
useOverlay(
  computed(() => props.open),
  panel,
  () => emit("close"),
  () => input.value,
);
</script>
<template>
  <AnimatePresence as="div" class="contents"
    ><motion.button
      v-if="open"
      key="backdrop"
      type="button"
      aria-label="Close"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="{ duration: reduce ? 0 : 0.2, ease: EASE }"
      class="absolute inset-0 z-10 cursor-default bg-background/40 backdrop-blur-sm"
      @click="emit('close')"
    /><motion.div
      v-if="open"
      key="sheet"
      ref="panel"
      :initial="reduce ? { opacity: 0 } : { opacity: 0, y: '100%' }"
      :animate="reduce ? { opacity: 1 } : { opacity: 1, y: 0 }"
      :exit="reduce ? { opacity: 0 } : { opacity: 0, y: '100%' }"
      :transition="reduce ? { duration: 0.18, ease: EASE } : SPRING_PANEL"
      class="absolute inset-x-0 bottom-0 z-20 flex max-h-[92%] flex-col rounded-t-3xl border-t border-border bg-card shadow-2xl"
      role="dialog"
      aria-modal="true"
      :aria-label="`Select ${side === 'from' ? 'from' : 'to'} token`"
      ><div class="flex justify-center pb-1 pt-2.5">
        <span class="h-1 w-9 rounded-full bg-muted" />
      </div>
      <div class="flex items-center gap-2 border-b border-border px-4 pb-3">
        <Search class="h-4 w-4 shrink-0 text-muted-foreground" /><input
          ref="input"
          v-model="q"
          placeholder="Search name or paste address"
          aria-label="Search tokens"
          class="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
        /><button
          type="button"
          aria-label="Close"
          class="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          @click="emit('close')"
        >
          <X class="h-3.5 w-3.5" />
        </button>
      </div>
      <div
        class="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex items-center gap-1.5 overflow-x-auto border-b border-border px-3 py-5"
      >
        <ChainChip
          :active="chainFilter === 'all'"
          label="All"
          @click="chainFilter = 'all'"
        /><ChainChip
          v-for="chain in chains"
          :key="chain.id"
          :active="chainFilter === chain.id"
          :chain="chain"
          @click="chainFilter = chain.id"
        />
      </div>
      <div class="flex-1 overflow-y-auto px-3 pb-4 pt-3">
        <template v-if="!q && chainFilter === 'all'"
          ><p
            class="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Most popular
          </p>
          <div
            class="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex items-center gap-1.5 overflow-x-auto pb-3"
          >
            <template v-for="token in popular" :key="token.id"
              ><button
                v-if="chainById.has(token.chainId)"
                type="button"
                class="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-background/50 py-1 pl-1 pr-3 text-sm font-semibold text-foreground transition-transform hover:border-border active:scale-[0.97]"
                @click="emit('pick', token.id)"
              >
                <TokenDot
                  :token="token"
                  :chain="chainById.get(token.chainId)!"
                  :size="22"
                />{{ token.symbol }}
              </button></template
            >
          </div></template
        >
        <p
          class="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {{ q ? "Results" : chainFilter === "all" ? "Trending" : "Tokens" }}
        </p>
        <ul class="flex flex-col gap-0.5">
          <li
            v-if="!filtered.length"
            class="py-8 text-center text-xs text-muted-foreground"
          >
            No tokens found
          </li>
          <li v-for="token in filtered" :key="token.id">
            <button
              v-if="chainById.has(token.chainId)"
              type="button"
              :class="
                cn(
                  'flex w-full items-center justify-between rounded-xl px-2 py-2 text-left transition-colors active:scale-[0.97]',
                  token.id === selectedId ? 'bg-muted/60' : 'hover:bg-muted/60',
                )
              "
              @click="emit('pick', token.id)"
            >
              <span class="flex min-w-0 items-center gap-2.5"
                ><TokenDot
                  :token="token"
                  :chain="chainById.get(token.chainId)!"
                  :size="32"
                /><span class="flex min-w-0 flex-col"
                  ><span
                    class="truncate text-sm font-semibold text-foreground"
                    >{{ token.name }}</span
                  ><span class="truncate text-[11px] text-muted-foreground">{{
                    token.symbol
                  }}</span></span
                ></span
              ><span
                class="shrink-0 text-right text-[11px] tabular-nums text-muted-foreground"
                >{{
                  token.address ??
                  (token.balance ? formatAmount(token.balance) : "")
                }}</span
              >
            </button>
          </li>
        </ul>
      </div></motion.div
    ></AnimatePresence
  >
</template>
