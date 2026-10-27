<script setup lang="ts">
import { ReasoningText, type ReasoningTextVariant } from "../index";
const ordinary = [
  "Thinking",
  "Reading the request",
  "Working through the details",
  "Preparing the answer",
];
const examples = (
  ["cascade", "swap", "scramble"] as ReasoningTextVariant[]
).map((variant) => ({
  variant,
  label: variant[0].toUpperCase() + variant.slice(1),
  phrases:
    variant === "scramble"
      ? ["Thinking", "Searching", "Reasoning", "Composing"]
      : ordinary,
}));
</script>
<template>
  <div class="grid w-full max-w-sm gap-7">
    <div v-for="example in examples" :key="example.variant" class="grid gap-2">
      <span
        class="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60"
        >{{ example.label }}</span
      ><ReasoningText
        :variant="example.variant"
        :phrases="example.phrases"
        class="text-base"
      />
    </div>
  </div>
</template>
