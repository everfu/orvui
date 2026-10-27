<script setup lang="ts">
import { ref } from "vue";
import { WalletCard } from "./index";
import { Button } from "../../motion/button";
const accounts = [
  {
    id: "main",
    name: "Main Wallet",
    address: "0x8f3Cb1a29e4D7c6F1B2a3E9d0C4b5A6f7D8e9C0b",
  },
  {
    id: "trading",
    name: "Trading",
    address: "0x1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B",
  },
  {
    id: "cold",
    name: "Cold Storage",
    address: "0x9F8e7D6c5B4a3E2d1C0b9A8f7E6d5C4b3A2e1F0d",
  },
];
const recent = ["vitalik.eth", "0xA0b8…6EB4", "Uniswap", "Send to Trading"],
  balance = ref(12480.32);
function change() {
  balance.value += (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 400);
}
</script>
<template>
  <div class="flex w-full flex-col items-center gap-4 p-6">
    <WalletCard
      :accounts="accounts"
      :balance="balance"
      :default-change="124.5"
      :search-recent="recent"
      has-notifications
    /><Button variant="ghost" size="sm" @click="change"
      >Simulate balance change</Button
    >
  </div>
</template>
