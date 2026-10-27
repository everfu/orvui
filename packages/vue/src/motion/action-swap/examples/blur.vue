<script setup lang="ts">
import { reactive } from "vue";
import { Check, Copy, Moon, Sun } from "lucide-vue-next";
import { ActionSwapBlurButton } from "../index";
const selected = reactive({ text: "copy", icon: "light", action: "copy" });
const labels = [{ id: "copy", label: "Copy" }, { id: "copied", label: "Copied" }];
const themes = [{ id: "light", label: "Light", icon: Sun, ariaLabel: "Use light theme" }, { id: "dark", label: "Dark", icon: Moon, ariaLabel: "Use dark theme" }];
const actions = [{ id: "copy", label: "Copy link", icon: Copy, ariaLabel: "Copy link" }, { id: "copied", label: "Copied", icon: Check, ariaLabel: "Copied" }];
</script>
<template><div class="flex flex-wrap items-center justify-center gap-3">
  <ActionSwapBlurButton v-model="selected.text" :items="labels" variant="secondary" /><ActionSwapBlurButton v-model="selected.icon" :items="themes" variant="outline" size="icon" icon-only /><ActionSwapBlurButton v-model="selected.action" :items="actions" variant="primary" />
</div></template>
