<script setup lang="ts">
import { ArrowUpRight, Sparkles } from "lucide-vue-next";
import { MetallicButton } from "../index";
</script>
<template><div class="flex flex-wrap items-center justify-center gap-3 px-6 py-10">
  <MetallicButton>Continue<ArrowUpRight class="size-4" /></MetallicButton>
  <MetallicButton size="sm"><Sparkles class="size-3.5" />Generate</MetallicButton>
  <MetallicButton size="icon" aria-label="Magic tools"><Sparkles class="size-4" /></MetallicButton>
</div></template>
