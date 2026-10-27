<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";
import { Check, ChevronDown } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { HEAD, ITEM, LIST } from "./constants";
import { truncateAddress } from "./utils";
import { useWalletPanel } from "./use-wallet-panel";
import AccountAvatar from "./AccountAvatar.vue";
import CopyButton from "./CopyButton.vue";
import type { WalletAccount } from "./WalletCard.vue";
defineProps<{ accounts: WalletAccount[]; activeAccount?: WalletAccount }>();
const emit = defineEmits<{ select: [id: string] }>();
const { open, armed, root, reduce, layoutId, morph } = useWalletPanel(
  "-account",
  280,
);
</script>
<template>
  <div ref="root" class="min-w-0">
    <div aria-hidden="true" :class="cn('pointer-events-none opacity-0', HEAD)">
      <AccountAvatar :account="activeAccount ?? accounts[0]" /><span
        class="grid"
        ><span
          v-for="account in accounts"
          :key="account.id"
          class="col-start-1 row-start-1 whitespace-nowrap text-sm font-medium"
          >{{ account.name }}</span
        ></span
      ><ChevronDown class="h-4 w-4" />
    </div>
    <AnimatePresence :initial="false" mode="popLayout" as="div" class="contents"
      ><motion.button
        v-if="!open"
        key="trigger"
        :layout-id="layoutId"
        type="button"
        aria-haspopup="listbox"
        aria-expanded="false"
        :transition="morph"
        :style="{ borderRadius: '16px' }"
        :class="
          cn(
            'absolute -left-2 top-0 z-20 max-w-full outline-none transition-colors hover:bg-muted/60',
            HEAD,
          )
        "
        @click="open = true"
        ><template v-if="activeAccount"
          ><AccountAvatar :account="activeAccount" /><motion.span
            layout="position"
            class="truncate text-sm font-medium text-foreground"
            >{{ activeAccount.name }}</motion.span
          ><motion.span layout="position" class="text-muted-foreground"
            ><ChevronDown
              class="h-4 w-4" /></motion.span></template></motion.button
    ></AnimatePresence>
    <AnimatePresence :initial="false" mode="popLayout" as="div" class="contents"
      ><motion.div
        v-if="open"
        key="panel"
        :layout-id="layoutId"
        role="listbox"
        :transition="morph"
        :style="{ borderRadius: '16px' }"
        class="absolute -left-2 -right-2 top-0 z-30 overflow-hidden border border-border/30 bg-background backdrop-blur-md"
        ><button
          type="button"
          :class="cn('w-full outline-none', HEAD)"
          @click="open = false"
        >
          <AccountAvatar :account="activeAccount" /><motion.span
            layout="position"
            class="min-w-0 flex-1 truncate text-sm font-medium text-foreground"
            >{{ activeAccount?.name ?? "Select account" }}</motion.span
          ><motion.span
            layout="position"
            :animate="{ rotate: 180 }"
            :transition="morph"
            class="text-muted-foreground"
            ><ChevronDown class="h-4 w-4"
          /></motion.span></button
        ><motion.ul
          initial="hidden"
          animate="show"
          :variants="reduce ? undefined : LIST"
          :class="
            cn(
              'max-h-64 overflow-y-auto p-1.5',
              !armed && 'pointer-events-none',
            )
          "
          ><motion.li
            v-for="account in accounts"
            :key="account.id"
            :variants="reduce ? undefined : ITEM"
            :class="
              cn(
                'flex items-center rounded-xl pr-1 text-sm transition-colors',
                account.id === activeAccount?.id
                  ? 'bg-muted text-foreground'
                  : [
                      'text-muted-foreground',
                      armed && 'hover:bg-muted hover:text-foreground',
                    ],
              )
            "
            ><button
              type="button"
              role="option"
              :aria-selected="account.id === activeAccount?.id"
              class="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-2 py-2 text-left outline-none"
              @click="
                emit('select', account.id);
                open = false;
              "
            >
              <AccountAvatar :account="account" /><span
                class="flex min-w-0 flex-1 flex-col"
                ><span class="truncate font-medium">{{ account.name }}</span
                ><span class="truncate text-xs text-muted-foreground">{{
                  truncateAddress(account.address)
                }}</span></span
              ><Check
                v-if="account.id === activeAccount?.id"
                class="h-4 w-4 shrink-0 text-foreground"
              /></button
            ><CopyButton
              :value="account.address" /></motion.li></motion.ul></motion.div
    ></AnimatePresence>
  </div>
</template>
