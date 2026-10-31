<script setup lang="ts">
import { Search } from "lucide-vue-next";
import { Button } from "../../../../../packages/vue/src/motion/button";
import CopyPage from "./CopyPage.vue";
import { useSiteShell } from "../../composables/site-shell-state";
defineProps<{ title: string; description: string; en: boolean }>();
const { origin, pathname, searchOpen } = useSiteShell();
</script>
<template>
  <header id="overview" class="docs-catalog-header">
    <div class="docs-catalog-title-row">
      <h1>{{ title }}</h1>
      <CopyPage
        :page-url="origin + pathname"
        :markdown-path="pathname + '.md'"
        :component-name="title"
        :en="en"
      />
    </div>
    <p class="page-description">{{ description }}</p>
    <div class="docs-catalog-meta">
      <div class="docs-catalog-counts"><slot /></div>
      <Button variant="secondary" size="sm" @click="searchOpen = true"
        ><Search :size="14" aria-hidden="true" />{{
          en ? "Search documentation" : "搜索文档"
        }}</Button
      >
    </div>
  </header>
</template>
