<script setup lang="ts">
import { ref } from "vue";
import { BounceSidebar } from "./index";
const selected = ref("components");
const sections = ["Overview", "Components", "Motion", "Templates", "Changelog"].map(label => ({ id: label.toLowerCase(), label }));
</script>
<template><div class="flex min-h-[360px] w-full items-center justify-center"><BounceSidebar v-model="selected" :items="sections" aria-label="orvui sections" class="w-52" list-class-name="w-full" item-class-name="text-base" /></div></template>
