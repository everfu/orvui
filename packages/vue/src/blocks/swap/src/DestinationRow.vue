<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { Check, ChevronDown, Send, X } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { EASE } from "./constants";
import { isValidAddress, truncateAddress } from "./utils";
const props = defineProps<{
    show: boolean;
    address: string;
    reduce: boolean;
  }>(),
  emit = defineEmits<{ toggle: []; address: [address: string] }>();
const input = ref<HTMLInputElement>(),
  valid = computed(() => !!props.address && isValidAddress(props.address));
let frame = 0;
watch(
  () => props.show,
  (show) => {
    cancelAnimationFrame(frame);
    if (show)
      frame = requestAnimationFrame(() =>
        input.value?.focus({ preventScroll: true }),
      );
  },
  { flush: "post" },
);
onBeforeUnmount(() => cancelAnimationFrame(frame));
</script>
<template>
  <div
    class="mt-1 overflow-hidden rounded-xl border border-border/50 bg-background/40"
  >
    <button
      type="button"
      class="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-[12px] text-muted-foreground hover:text-foreground"
      @click="emit('toggle')"
    >
      <span class="flex items-center gap-2"
        ><Send class="h-3.5 w-3.5 shrink-0" /><span>{{
          show && valid
            ? "To: " + truncateAddress(address)
            : "Send to different address"
        }}</span></span
      ><motion.span
        :animate="reduce ? {} : { rotate: show ? 180 : 0 }"
        :transition="{ duration: reduce ? 0 : 0.2, ease: EASE }"
        :style="{ display: 'inline-flex' }"
        ><ChevronDown class="h-3.5 w-3.5"
      /></motion.span></button
    ><AnimatePresence as="div" class="contents"
      ><motion.div
        v-if="show"
        key="dest-input"
        :initial="reduce ? { opacity: 0 } : { height: 0, opacity: 0 }"
        :animate="reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }"
        :exit="reduce ? { opacity: 0 } : { height: 0, opacity: 0 }"
        :transition="{ duration: reduce ? 0 : 0.22, ease: EASE }"
        :style="{ overflow: 'hidden' }"
        ><div class="border-t border-border/50 px-3.5 pb-3 pt-2.5">
          <div
            :class="
              cn(
                'flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-colors',
                address && !valid ? 'border-destructive/40' : 'border-border',
              )
            "
          >
            <input
              ref="input"
              :value="address"
              aria-label="Destination address"
              placeholder="0x... or name.eth"
              :spellcheck="false"
              class="min-w-0 flex-1 bg-transparent font-mono text-[12px] text-foreground outline-none placeholder:text-muted-foreground/60"
              @input="
                emit(
                  'address',
                  ($event.target as HTMLInputElement).value.trim(),
                )
              "
            /><AnimatePresence mode="wait" as="span" class="contents"
              ><motion.span
                v-if="valid"
                key="check"
                :initial="{ opacity: 0, scale: 0.7 }"
                :animate="{ opacity: 1, scale: 1 }"
                :exit="{ opacity: 0, scale: 0.7 }"
                :transition="{ duration: reduce ? 0 : 0.14, ease: EASE }"
                ><Check
                  class="h-3.5 w-3.5 shrink-0 text-primary" /></motion.span
              ><motion.button
                v-else-if="address"
                key="clear"
                type="button"
                aria-label="Clear address"
                :initial="{ opacity: 0, scale: 0.7 }"
                :animate="{ opacity: 1, scale: 1 }"
                :exit="{ opacity: 0, scale: 0.7 }"
                :transition="{ duration: reduce ? 0 : 0.14, ease: EASE }"
                class="shrink-0 text-muted-foreground hover:text-foreground"
                @click="emit('address', '')"
                ><X class="h-3.5 w-3.5" /></motion.button
            ></AnimatePresence>
          </div></div></motion.div
    ></AnimatePresence>
  </div>
</template>
