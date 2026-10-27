<script setup lang="ts">
import { Check, Copy } from "lucide-vue-next";
import { ActionSwapCascadeButton } from "../index";
const actions = [{ id: "copy", label: "Copy link", icon: Copy, ariaLabel: "Copy link" }, { id: "copied", label: "Copied!", icon: Check, ariaLabel: "Copied" }];
</script>
<template><div class="flex w-full justify-center"><ActionSwapCascadeButton :items="actions" variant="primary" /></div></template>
