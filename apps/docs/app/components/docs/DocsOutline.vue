<script setup lang="ts">
import {
  TableOfContents,
  type TableOfContentsItem,
} from "../../../../../packages/vue/src/motion/table-of-contents";
import { DOCS_ANCHOR_OFFSET } from "../../utils/docs/document-sections";
defineProps<{ items: TableOfContentsItem[]; en: boolean }>();
</script>
<template>
  <TableOfContents
    :items="items"
    target="#docs-content"
    :offset="DOCS_ANCHOR_OFFSET"
    :title="en ? 'On this page' : '本页目录'"
    class="docs-outline"
  />
</template>
