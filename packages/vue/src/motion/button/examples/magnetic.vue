<script setup lang="ts">
import { ArrowRight } from "lucide-vue-next";
import { MagneticButton } from "../index";
const alternatives = [{ variant: "secondary", strength: 0.25, label: "Subtle pull" }, { variant: "outline", strength: 0.5, label: "Strong pull" }] as const;
</script>
<template><div class="flex flex-wrap items-center justify-center gap-4">
  <MagneticButton :strength="0.35">Hover me<ArrowRight class="h-4 w-4" /></MagneticButton>
  <MagneticButton v-for="sample in alternatives" :key="sample.variant" :variant="sample.variant" :strength="sample.strength">{{ sample.label }}</MagneticButton>
</div></template>
