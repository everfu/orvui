<script setup lang="ts">
import { toRef } from "vue";
import { ChevronRight } from "lucide-vue-next";
import SiteChrome from "./SiteChrome.vue";
import SiteNavigation from "./SiteNavigation.vue";
import DocsResources from "./DocsResources.vue";
import SiteFooter from "./SiteFooter.vue";
import { createSiteShell, provideSiteShell } from "../../composables/site-shell-state";
const props = defineProps<{
  frontmatter: Record<string, unknown>;
  route: { path: string };
  router: { go: (href: string) => unknown };
}>();
const shell = createSiteShell(
  toRef(props, "frontmatter"),
  props.route,
  props.router,
);
provideSiteShell(shell);
const {
  home,
  en,
  category,
  entry,
  pathname,
  t,
  routeTo,
  categoryLabel,
} = shell;
</script>
<template>
  <div class="site-shell" :data-layout="home ? 'home' : 'docs'">
    <SiteChrome />
    <slot v-if="home" />
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
        <slot />
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
