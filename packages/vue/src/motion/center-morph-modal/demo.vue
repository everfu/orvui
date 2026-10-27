<script setup lang="ts">
import { useId } from "vue";
import { ArrowUpRight, Check } from "lucide-vue-next";
import { CenterMorphModal, CenterMorphModalClose, CenterMorphModalContent, CenterMorphModalTrigger } from "./index";
const descriptionId = `${useId()}-description`;
const features = ["Animated Vue components", "Composition API and TypeScript", "Editable source and registry"];
</script>
<template><div class="flex min-h-[420px] w-full items-center justify-center"><CenterMorphModal>
  <CenterMorphModalTrigger><button type="button" class="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Open modal</button></CenterMorphModalTrigger>
  <CenterMorphModalContent ariaLabel="orvui" :ariaDescribedBy="descriptionId"><div class="p-7 sm:p-8"><p class="text-sm font-medium text-muted-foreground">orvui</p>
    <h2 class="mt-5 max-w-xs pr-8 text-2xl font-medium tracking-tight text-foreground">Ship the whole experience.</h2>
    <p :id="descriptionId" class="mt-3 text-sm leading-relaxed text-muted-foreground">Create distinctive Vue interfaces with accessible controls and thoughtful movement throughout.</p>
    <div class="mt-7 space-y-3 border-y border-border py-5"><div v-for="feature in features" :key="feature" class="flex items-center gap-3 text-sm text-foreground"><Check class="h-4 w-4 text-muted-foreground" aria-hidden="true" /><span>{{ feature }}</span></div></div>
    <CenterMorphModalClose><button class="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Start creating<ArrowUpRight class="h-4 w-4" aria-hidden="true" /></button></CenterMorphModalClose>
  </div></CenterMorphModalContent>
</CenterMorphModal></div></template>
