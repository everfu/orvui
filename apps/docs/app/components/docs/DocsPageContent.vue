<script setup lang="ts">
import SiteHome from "./SiteHome.vue";
import SitePage from "./SitePage.vue";
import ComponentDocument from "./ComponentDocument.vue";
import CategoryPage from "./CategoryPage.vue";
import ComponentsIndex from "./ComponentsIndex.vue";
import TemplatesIndex from "./TemplatesIndex.vue";
import TemplateDocument from "./TemplateDocument.vue";
import { useSiteShell } from "../../composables/site-shell-state";

const {
  home,
  en,
  category,
  entry,
  isSitePage,
  sitePage,
  isGuide,
  origin,
  pageLayout,
  templateSlug,
} = useSiteShell();
</script>

<template>
  <SiteHome v-if="home" />
  <ComponentsIndex v-else-if="pageLayout === 'components'" :en="en" />
  <TemplatesIndex v-else-if="pageLayout === 'templates'" :en="en" />
  <TemplateDocument
    v-else-if="pageLayout === 'template'"
    :key="templateSlug + en"
    :slug="templateSlug"
    :en="en"
  />
  <SitePage
    v-else-if="isSitePage"
    :page="sitePage"
    :en="en"
    :site-url="origin"
  />
  <ComponentDocument
    v-else-if="category && entry"
    :category="category"
    :entry="entry"
  />
  <CategoryPage v-else-if="category" :category="category" :en="en" />
  <SitePage
    v-else-if="isGuide"
    page="introduction"
    :en="en"
    :site-url="origin"
  />
</template>
