<script setup lang="ts">
import { Content, useData, useRoute, useRouter } from "vitepress";
import { ChevronRight } from "lucide-vue-next";
import SiteChrome from "./SiteChrome.vue";
import SiteHome from "./SiteHome.vue";
import ComponentDocument from "./ComponentDocument.vue";
import SiteNavigation from "./SiteNavigation.vue";
import DocsResources from "./DocsResources.vue";
import SiteFooter from "./SiteFooter.vue";
import SitePage from "./SitePage.vue";
import CategoryPage from "./CategoryPage.vue";
import { createSiteShell, provideSiteShell } from "./site-shell-state";
const { frontmatter } = useData();
const shell = createSiteShell(frontmatter, useRoute(), useRouter());
provideSiteShell(shell);
const {
  home,
  en,
  category,
  entry,
  pathname,
  isSitePage,
  sitePage,
  isGuide,
  origin,
  t,
  routeTo,
  categoryLabel,
} = shell;
</script>
<template>
  <div class="site-shell" :data-layout="home ? 'home' : 'docs'">
    <SiteChrome />
    <SiteHome v-if="home" />
    <div v-else class="docs-frame">
      <aside
        class="docs-sidebar"
        :aria-label="t('站点导航', 'Site navigation')"
      >
        <SiteNavigation
          :category="category?.slug"
          :en="en"
          :pathname="pathname"
        />
      </aside>
      <main id="docs-content" class="docs-main">
        <nav
          v-if="category"
          class="breadcrumb"
          :aria-label="t('面包屑', 'Breadcrumb')"
        >
          <a v-if="entry" :href="routeTo(category.slug)">{{
            categoryLabel(category.slug)
          }}</a
          ><span v-else>{{ categoryLabel(category.slug) }}</span>
          <template v-if="entry"
            ><ChevronRight :size="14" aria-hidden="true" /><span
              aria-current="page"
              >{{ entry.name }}</span
            ></template
          >
        </nav>
        <SitePage
          v-if="isSitePage"
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
        <Content v-else />
      </main>
      <aside
        class="docs-resources"
        :aria-label="t('资源与指南', 'Resources and guides')"
      >
        <DocsResources :en="en" />
      </aside>
    </div>
    <SiteFooter v-if="home" :en="en" />
  </div>
</template>
