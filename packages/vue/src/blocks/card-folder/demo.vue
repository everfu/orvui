<script setup lang="ts">
import { ref } from "vue";
import { CardFolder } from "./index";
import { DigitSwap } from "../../motion/number";
const details = ref(false),
  number = "3745 6987 4096 0806",
  masked = "•••• •••• •••• 0806";
const rings = Array.from({ length: 18 }, (_, index) => ({
  radius: 72 + index * 24,
  opacity: 0.32 - index * 0.009,
}));
</script>
<template>
  <div class="flex min-h-72 w-full items-center justify-center px-6 py-9">
    <CardFolder
      v-model:details-visible="details"
      title="orvui Demo Member"
      :card-number="number"
      expiry="08/29"
      cvv="123"
      ><template #card
        ><span
          class="relative block h-full w-full overflow-hidden bg-[linear-gradient(135deg,#383a38_0%,#202120_48%,#111211_100%)] text-white"
          ><svg
            aria-hidden="true"
            viewBox="0 0 640 404"
            class="absolute inset-0 h-full w-full"
          >
            <circle
              v-for="ring in rings"
              :key="ring.radius"
              cx="-20"
              cy="-28"
              :r="ring.radius"
              fill="none"
              stroke="currentColor"
              :stroke-opacity="ring.opacity"
              stroke-width="1.5"
            /></svg
          ><span
            class="absolute inset-0 bg-[radial-gradient(circle_at_78%_8%,rgb(255_255_255/0.11),transparent_32%)]" /><span
            class="absolute left-[6%] top-[8%] flex flex-col gap-2"
            ><span
              class="text-[10px] font-medium uppercase tracking-[.22em] text-white/55"
              >orvui Demo Member</span
            ><DigitSwap
              :value="details ? number : masked"
              :animation-key="details ? 'revealed' : 'masked'"
              :direction="details ? 'up' : 'down'"
              :suffix-length="4"
              :glyph-class-name="details ? 'text-white/90' : 'text-white/65'"
              suffix-class-name="text-white/90"
              class="font-mono text-xs tracking-[.13em]" /></span
          ><span
            class="absolute right-[7%] top-[8%] h-[20%] w-[13%] overflow-hidden rounded-[18%] border border-black/30 bg-[linear-gradient(135deg,#f2f0ea_0%,#b9b7b1_45%,#e4e1d9_100%)]"
            ><span
              class="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-black/30" /><span
              class="absolute inset-x-0 top-1/3 h-px bg-black/30" /><span
              class="absolute inset-x-0 bottom-1/3 h-px bg-black/30" /><span
              class="absolute left-0 top-1/2 h-[34%] w-[28%] -translate-y-1/2 rounded-r-[35%] border border-l-0 border-black/30" /><span
              class="absolute right-0 top-1/2 h-[34%] w-[28%] -translate-y-1/2 rounded-l-[35%] border border-r-0 border-black/30" /></span
          ><span
            class="absolute bottom-[9%] left-[6%] flex items-center gap-2 text-lg font-semibold tracking-[-.04em]"
            >orvui<span
              class="block size-2.5 rotate-45 rounded-[2px] bg-white/85" /></span
          ><span class="absolute bottom-[10%] right-[7%] flex items-end gap-5"
            ><span class="flex flex-col gap-1"
              ><span
                class="text-[8px] font-medium uppercase tracking-[.16em] text-white/40"
                >Expiry</span
              ><span class="text-xs font-medium tabular-nums text-white/90"
                >08/29</span
              ></span
            ><span class="flex flex-col gap-1"
              ><span
                class="text-[8px] font-medium uppercase tracking-[.16em] text-white/40"
                >CVV</span
              ><DigitSwap
                :value="details ? '123' : '•••'"
                :animation-key="details ? 'revealed' : 'masked'"
                :direction="details ? 'up' : 'down'"
                class="font-mono text-xs font-medium text-white/90" /></span></span></span></template
    ></CardFolder>
  </div>
</template>
