<script setup lang="ts">
import { h } from "vue";
import { Braces, FileCode2, FileJson2, FileText, Palette } from "lucide-vue-next";
import { FileTree, FileTreeFile, FileTreeFolder } from "./index";
const source = () => h(Braces, { class: "size-4 text-sky-500" });
const entries = [
  { value: "app", name: "App.vue", icon: () => h(FileCode2, { class: "size-4 text-sky-500" }) },
  { value: "styles", name: "style.css", icon: () => h(Palette, { class: "size-4 text-violet-500" }) },
];
const documents = [
  { value: "package", name: "package.json", icon: () => h(FileJson2, { class: "size-4 text-amber-500" }) },
  { value: "readme", name: "README.md", icon: () => h(FileText, { class: "size-4 text-muted-foreground" }) },
];
</script>
<template>
  <div class="flex min-h-[420px] w-full items-start justify-center px-4 pt-10"><div class="w-full max-w-xs p-2">
    <FileTree default-value="file-tree" :default-expanded-ids="['src', 'components']" aria-label="Project files">
      <FileTreeFolder value="src" name="src"><FileTreeFolder value="components" name="components"><FileTreeFile v-for="file in ['file-tree', 'button']" :key="file" :value="file" :name="`${file}.vue`" :icon="source" /></FileTreeFolder><FileTreeFile v-for="entry in entries" :key="entry.value" v-bind="entry" /></FileTreeFolder>
      <FileTreeFolder value="public" name="public"><FileTreeFile v-for="file in ['logo', 'grid']" :key="file" :value="file" :name="`${file}.svg`" /></FileTreeFolder>
      <FileTreeFile v-for="entry in documents" :key="entry.value" v-bind="entry" />
    </FileTree>
  </div></div>
</template>
