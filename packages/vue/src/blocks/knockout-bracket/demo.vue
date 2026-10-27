<script setup lang="ts">
import { KnockoutBracket, ROUNDS, THIRD_PLACE } from "./index";
const season = { rounds: ROUNDS, thirdPlace: THIRD_PLACE, initialRound: 1 };
</script>
<template>
  <div class="w-full py-8"><KnockoutBracket v-bind="season" /></div>
</template>
