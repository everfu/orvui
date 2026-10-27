<script setup lang="ts">
import { reactive } from "vue";
import { Moon, Send, Sparkles, Sun } from "lucide-vue-next";
import { ActionSwapRollButton } from "../index";
const selected = reactive({ text: "idle", icon: "light", action: "send" });
const labels = [{ id: "idle", label: "Save" }, { id: "done", label: "Saved" }];
const themes = [{ id: "light", label: "Light", icon: Sun, ariaLabel: "Use light theme" }, { id: "dark", label: "Dark", icon: Moon, ariaLabel: "Use dark theme" }];
const actions = [{ id: "send", label: "Send invite", icon: Send, ariaLabel: "Send invite" }, { id: "sent", label: "Invite sent", icon: Sparkles, ariaLabel: "Invite sent" }];
</script>
<template><div class="flex flex-wrap items-center justify-center gap-3">
  <ActionSwapRollButton v-model="selected.text" :items="labels" variant="secondary" /><ActionSwapRollButton v-model="selected.icon" :items="themes" variant="outline" size="icon" icon-only /><ActionSwapRollButton v-model="selected.action" :items="actions" variant="primary" />
</div></template>
