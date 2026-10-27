<script setup lang="ts">
import { computed, ref } from "vue";
import { DigitSwap } from "../index";
const visible = ref(false);
const number = computed(() => visible.value ? "4242 4242 4242 0806" : "•••• •••• •••• 0806");
function toggle() { visible.value = !visible.value; }
</script>
<template>
  <div class="flex w-80 flex-col gap-5">
    <div class="flex flex-col gap-2"><span class="text-xs font-medium text-muted-foreground">Card number</span>
      <DigitSwap :value="number" :animation-key="visible ? 'revealed' : 'masked'" :direction="visible ? 'up' : 'down'" :suffix-length="4"
        :glyph-class-name="visible ? 'text-foreground' : 'text-muted-foreground'" suffix-class-name="text-foreground" class="font-mono text-lg tracking-[0.08em] tabular-nums" />
    </div>
    <button type="button" :aria-label="visible ? 'Animate masked number' : 'Animate card number'" :aria-pressed="visible" @click="toggle"
      class="h-10 self-start rounded-lg border border-border px-3 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">Animate</button>
  </div>
</template>
