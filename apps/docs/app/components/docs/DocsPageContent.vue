<script setup lang="ts">
import SiteHome from "./SiteHome.vue";
import SitePage from "./SitePage.vue";
import ComponentDocument from "./ComponentDocument.vue";
import CategoryPage from "./CategoryPage.vue";
import { useSiteShell } from "../../composables/site-shell-state";

const { home, en, category, entry, isSitePage, sitePage, isGuide, origin } =
  useSiteShell();
</script>

<template>
  <SiteHome v-if="home" />
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
