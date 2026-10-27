<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { NumberTicker } from "../index";
const users = ref(48273);
let interval: ReturnType<typeof setInterval> | undefined;
function increment() { users.value += Math.floor(50 * Math.random()); }
onMounted(() => { interval = setInterval(increment, 2500); });
onBeforeUnmount(() => { clearInterval(interval); });
const formatCount = (count: number) => count.toLocaleString();
</script>
<template>
  <div class="flex flex-col items-center gap-3"><p class="text-xs text-muted-foreground">Active users</p>
    <NumberTicker :value="users" prefix="" class="text-4xl font-semibold tracking-tight text-foreground tabular-nums" :format="formatCount" />
    <p class="text-xs text-muted-foreground">live · updates every 2.5s</p>
  </div>
</template>
