<script setup lang="ts">
import { computed } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { EASE_OUT } from "../../../lib/ease";
import { keyedAmountChars, sanitizeAmount } from "./utils";
const props = defineProps<{
    id: string;
    value: string;
    mode: "buy" | "sell";
    inputSize: string;
    disabled: boolean;
    reduce: boolean;
  }>(),
  emit = defineEmits<{ change: [value: string] }>();
const chars = computed(() => keyedAmountChars(props.value || "0"));
</script>
<template>
  <div class="flex min-w-0 items-center justify-center overflow-hidden">
    <span
      v-if="mode === 'buy'"
      aria-hidden="true"
      :class="
        cn(
          'shrink-0 font-semibold leading-none tracking-normal text-muted-foreground/65 tabular-nums transition-[font-size] duration-200',
          inputSize,
        )
      "
      >$</span
    >
    <div class="relative min-w-0 shrink">
      <input
        :id="id"
        :value="value"
        :disabled="disabled"
        placeholder="0"
        inputmode="decimal"
        :aria-label="mode === 'buy' ? 'Amount' : 'Shares'"
        autocomplete="off"
        :class="
          cn(
            'w-[calc((var(--amount-chars)+1)*0.62em)] min-w-[0.8em] max-w-[260px] bg-transparent text-left font-semibold leading-none tracking-normal text-transparent outline-none tabular-nums caret-foreground transition-[font-size] duration-200 placeholder:text-transparent selection:bg-foreground/10 disabled:cursor-not-allowed',
            inputSize,
          )
        "
        :style="{ '--amount-chars': String(chars.length) }"
        @input="
          emit(
            'change',
            sanitizeAmount(($event.target as HTMLInputElement).value),
          )
        "
      />
      <div
        aria-hidden="true"
        :class="
          cn(
            'pointer-events-none absolute inset-0 flex min-w-0 items-center justify-start overflow-hidden font-semibold leading-none tracking-normal text-foreground tabular-nums transition-[font-size] duration-200',
            !value && 'text-muted-foreground/55',
            inputSize,
          )
        "
        :style="{ '--amount-chars': String(chars.length) }"
      >
        <AnimatePresence :initial="false" mode="popLayout"
          ><motion.span
            v-for="character in chars"
            :key="character.id"
            :layout="reduce ? false : 'position'"
            :initial="
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 18, filter: 'blur(10px)' }
            "
            :animate="
              reduce
                ? { opacity: 1 }
                : { opacity: 1, y: 0, filter: 'blur(0px)' }
            "
            :exit="
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: -14, filter: 'blur(10px)' }
            "
            :transition="{ duration: 0.18, ease: EASE_OUT }"
            class="inline-block min-w-[0.55em] text-center will-change-[transform,opacity,filter]"
            >{{ character.char }}</motion.span
          ></AnimatePresence
        >
      </div>
    </div>
  </div>
</template>
