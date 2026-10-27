<script setup lang="ts">
import {
  FileText,
  LayoutGrid,
  Table,
  FolderClosed,
  Bell,
  Link,
} from "lucide-vue-next";
import { BloomMenu, type BloomMenuItem } from "./index";
const entries: BloomMenuItem[] = [
  { label: "Note", icon: FileText },
  { label: "Canvas", icon: LayoutGrid },
  { label: "Grid", icon: Table },
  { label: "Space", icon: FolderClosed },
  { label: "Alert", icon: Bell },
  { label: "URL", icon: Link },
];
</script>
<template>
  <div class="flex min-h-[420px] w-full items-start justify-center pt-24">
    <BloomMenu :items="entries" />
  </div>
</template>
