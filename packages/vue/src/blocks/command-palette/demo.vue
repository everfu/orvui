<script setup lang="ts">
import { ref } from "vue";
import { FileText, Home, Plus, Settings, User } from "lucide-vue-next";
import { CommandPalette } from "./index";
const open = ref(false);
const items = [
  {
    id: "home",
    label: "Go to Home",
    group: "Navigation",
    icon: Home,
    hint: "G H",
  },
  {
    id: "profile",
    label: "Open profile",
    group: "Navigation",
    icon: User,
    hint: "G P",
  },
  { id: "settings", label: "Settings", group: "Navigation", icon: Settings },
  {
    id: "new-doc",
    label: "Create document",
    group: "Actions",
    icon: FileText,
    hint: "⌘ N",
  },
  {
    id: "new-project",
    label: "New project",
    group: "Actions",
    icon: Plus,
    hint: "⌘ ⇧ N",
  },
];
</script>
<template>
  <div class="flex flex-col items-start gap-3">
    <button
      type="button"
      @click="open = true"
      class="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground press hover:border-(--color-border-strong)"
    >
      Open command palette
    </button>
    <p class="text-sm text-muted-foreground">
      Press
      <kbd
        class="rounded border border-border bg-card px-1.5 py-0.5 text-xs text-foreground"
        >⌘ J</kbd
      >
      (or
      <kbd
        class="rounded border border-border bg-card px-1.5 py-0.5 text-xs text-foreground"
        >Ctrl J</kbd
      >) to open.
    </p>
    <CommandPalette v-model:open="open" shortcut="j" :items="items" />
  </div>
</template>
