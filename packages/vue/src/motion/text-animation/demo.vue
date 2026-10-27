<script setup lang="ts">
import { ref } from "vue";
import { TextReveal } from "./index";
const replay = ref(0);
</script>
<template><div class="flex w-full flex-col items-center gap-8 text-center"><div :key="replay" class="flex flex-col gap-2"><TextReveal as="h2" :text="['Motion that feels', 'considered.']" class="text-balance text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-5xl" /><TextReveal text="Word by word, with a soft blur." :delay=".9" :stagger=".05" :blur="6" y-offset="20%" class="text-sm text-muted-foreground" /></div><button type="button" @click="replay += 1" class="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground press hover:border-(--color-border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Replay</button></div></template>
