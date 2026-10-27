<script setup lang="ts">
import { FeedbackWidget } from "./index";
let submissions = 0;
async function submit() {
  await new Promise<void>((resolve) => setTimeout(resolve, 900));
  if (++submissions === 1) throw new Error("Preview submission failed");
}
</script>
<template>
  <div
    class="relative h-80 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background"
  >
    <div class="border-b border-border px-5 py-3">
      <div class="h-2.5 w-24 rounded-full bg-muted-foreground/20" />
    </div>
    <div class="flex flex-col gap-3 p-5">
      <div class="h-2.5 w-3/4 rounded-full bg-muted-foreground/15" />
      <div class="h-2.5 w-1/2 rounded-full bg-muted-foreground/15" />
      <div class="h-24 w-full rounded-xl bg-muted-foreground/[0.06]" />
      <div class="h-2.5 w-2/3 rounded-full bg-muted-foreground/15" />
    </div>
    <FeedbackWidget :on-submit="submit" />
  </div>
</template>
