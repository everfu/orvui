<script setup lang="ts">
import { Blocks, BookOpen, Bot, FolderOpen, Palette } from "lucide-vue-next";
import { MorphingSearch, type MorphingSearchItem } from "./index";
const entries = [
  [
    "project-folder",
    "Project Folder",
    "Block · Files and previews",
    ["files", "overlay"],
    FolderOpen,
  ],
  [
    "motion-components",
    "Motion components",
    "Collection · Interaction primitives",
    ["animation", "components"],
    Blocks,
  ],
  [
    "agent-interfaces",
    "Agent interfaces",
    "Collection · AI building blocks",
    ["ai", "chat"],
    Bot,
  ],
  [
    "installation",
    "Installation guide",
    "Documentation · Add your first component",
    ["setup", "shadcn"],
    BookOpen,
  ],
  [
    "design-tokens",
    "Design tokens",
    "Documentation · Color, type, and motion",
    ["theme", "styles"],
    Palette,
  ],
] as const;
const items: MorphingSearchItem[] = entries.map(
  ([id, title, description, keywords, icon]) => ({
    id,
    title,
    description,
    keywords: [...keywords],
    icon,
  }),
);
</script>
<template>
  <div class="flex w-full max-w-[22rem] items-center gap-3">
    <MorphingSearch
      :items="items"
      placeholder="Find components"
    /><MorphingSearch
      :items="items"
      placeholder="Find components"
      shortcut=""
      icon-only
    />
  </div>
</template>
