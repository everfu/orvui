<script setup lang="ts">
import { ChromaticTextReveal } from "../index";
const adjectives = ["natural.", "intentional.", "alive."];
</script>
<template><div class="@container flex w-full justify-center"><ChromaticTextReveal prefix="Motion that feels" :words="adjectives" :start-on-view="false" class="shrink-0 font-medium tracking-[-.04em] text-foreground [font-size:clamp(1.25rem,7.8cqw,3rem)]" /></div></template>
