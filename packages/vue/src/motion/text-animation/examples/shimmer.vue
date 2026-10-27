<script setup lang="ts">
import { TextShimmer } from "../index";
const examples = [{ text: "Loading projects…", class: "text-3xl font-semibold", duration: 2 }, { text: "Faster shimmer", class: "text-sm", duration: 1.5 }];
</script>
<template><div class="flex flex-col gap-4"><TextShimmer v-for="example in examples" :key="example.text" :duration="example.duration" :class="example.class">{{ example.text }}</TextShimmer></div></template>
