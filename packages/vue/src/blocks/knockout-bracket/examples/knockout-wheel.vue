<script setup lang="ts">
import { KnockoutWheel, WHEEL_ROUNDS } from "../index";
const season = { rounds: WHEEL_ROUNDS, initialRound: 0 };
</script>
<template>
  <div class="w-full py-8"><KnockoutWheel v-bind="season" /></div>
</template>
