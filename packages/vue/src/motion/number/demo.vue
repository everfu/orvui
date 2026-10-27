<script setup lang="ts">
import { ref } from "vue";
import { AnimatedNumber, DigitSwap, NumberTicker } from "./index";
const amount = ref(4826);
function randomize() { amount.value = Math.round(99999 * Math.random()); }
</script>
<template>
  <div class="space-y-8 text-center">
    <div class="text-5xl font-semibold"><AnimatedNumber :value="amount" /></div>
    <div class="text-4xl font-semibold"><NumberTicker :value="amount" prefix="$" /></div>
    <button class="rounded-full border px-5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" @click="randomize">Change value</button>
  </div>
</template>
