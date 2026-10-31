<script setup lang="ts">
import { computed, toRef } from "vue";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleIndicator,
} from "../../../../../packages/vue/src/motion/collapsible";
import SiteChrome from "./SiteChrome.vue";
import DocsNavigation from "./DocsNavigation.vue";
import DocsOutline from "./DocsOutline.vue";
import DocsResources from "./DocsResources.vue";
import SiteFooter from "./SiteFooter.vue";
import {
  createSiteShell,
  provideSiteShell,
} from "../../composables/site-shell-state";
import { documentOutline } from "../../utils/docs/document-outline";
import { useNewBadgeClock } from "../../composables/new-badge";
import { DOCS_HEADER_HEIGHT } from "../../utils/docs/document-sections";
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
  sitePage,
  isSitePage,
  isGuide,
  docsSection,
  pageLayout,
} = shell;
const clock = useNewBadgeClock(() => category.value?.components ?? []);
const outline = computed(() =>
  documentOutline({
    layout: pageLayout.value,
    category: category.value,
    entry: entry.value,
    page: isSitePage.value
      ? sitePage.value
      : isGuide.value
        ? "introduction"
        : undefined,
    en: en.value,
    isNew: clock.isNew,
  }),
);
</script>
<template>
  <div
    class="site-shell"
    :data-layout="home ? 'home' : 'docs'"
    :data-docs-section="home ? undefined : docsSection"
    :style="{ '--header-height': (home ? 56 : DOCS_HEADER_HEIGHT) + 'px' }"
  >
    <SiteChrome />
    <slot v-if="home" />
    <main v-else-if="pageLayout === 'templates'" id="docs-content" class="templates-wide-main"><slot /></main>
    <div v-else class="docs-frame">
      <aside
        class="docs-sidebar"
        :aria-label="t('站点导航', 'Site navigation')"
      >
        <DocsNavigation
          :section="docsSection"
          :category="category?.slug"
          :en="en"
          :pathname="pathname"
        />
      </aside>
      <main id="docs-content" class="docs-main">
        <Collapsible
          v-if="outline.length"
          :key="pathname"
          class="docs-inline-outline"
        >
          <CollapsibleTrigger class="docs-inline-outline-trigger"
            >{{ t("本页目录", "On this page") }}<CollapsibleIndicator
          /></CollapsibleTrigger>
          <CollapsibleContent
            ><DocsOutline :items="outline" :en="en"
          /></CollapsibleContent>
        </Collapsible>
        <slot />
      </main>
      <aside
        class="docs-resources"
        :aria-label="t('目录与资源', 'Outline and resources')"
      >
        <DocsOutline
          v-if="outline.length"
          :key="pathname"
          :items="outline"
          :en="en"
        />
        <DocsResources :en="en" compact />
      </aside>
    </div>
    <SiteFooter v-if="home" :en="en" />
  </div>
</template>
