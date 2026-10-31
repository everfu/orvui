<script setup lang="ts">
import { computed } from "vue";
import SiteLogo from "./SiteLogo.vue";
import catalog from "../../../../../tools/catalog/components.json";
import type { CatalogCategory } from "../../../../../tools/registry/types";
const props = withDefaults(defineProps<{ en?: boolean }>(), { en: false });
const t = (zh: string, en: string) => (props.en ? en : zh);
const prefix = computed(() => (props.en ? "/en" : ""));
const columns = computed(() => {
  const bySlug = new Map((catalog.categories as CatalogCategory[]).map(category => [category.slug, category.components]));
  const labels = [["motion", "组件", "Components"], ["blocks", "组合模块", "Blocks"], ["agents", "AI 代理", "AI Agents"], ["charts", "图表", "Charts"]];
  const result = [];
  for (const [category, zh, en] of labels) {
    const entries = bySlug.get(category!) ?? [];
    const items = [];
    for (const entry of entries) { if (items.length === 7) break; items.push(entry); }
    result.push({ category: category!, title: t(zh!, en!), total: entries.length, items });
  }
  return result;
});
const componentPath = (category: string, slug?: string) =>
  `${prefix.value}/${category === "charts" ? "charts" : `components/${category}`}${slug ? `/${slug}` : ""}`;
const links = computed(() => [
  { href: componentPath("motion"), label: t("浏览全部", "Browse all") },
  { href: `${prefix.value}/changelog`, label: t("更新日志", "Changelog") },
  {
    href: `${prefix.value}/docs/ai-agents`,
    label: t("面向编程代理", "For coding agents"),
  },
  { href: `${prefix.value}/docs/theme`, label: t("主题配置", "Theming") },
  {
    href: `${prefix.value}/docs/motion-patterns`,
    label: t("动效模式", "Motion patterns"),
  },
  { href: "/llms.txt", label: "llms.txt" },
  { href: "/licenses/MIT.txt", label: t("MIT 许可", "MIT License") },
  { href: "/licenses/orvui-NOTICE.txt", label: "NOTICE" },
  {
    href: "/licenses/paper-design-PolyForm-Shield.txt",
    label: t("Shader 许可", "Shader license"),
  },
]);
</script>
<template>
  <footer class="orvui-site-footer">
    <div class="orvui-site-footer-grid">
      <div class="orvui-site-footer-brand">
        <a
          :href="`${prefix}/`"
          class="orvui-site-footer-logo"
          :aria-label="en ? 'orvui home' : 'orvui 首页'"
        >
          <SiteLogo />
        </a>
        <p class="orvui-site-footer-description">
          {{
            t(
              "为 Vue 打造的动效组件库，让界面更生动，让开发更轻松。",
              "Animated components for Vue. Bring interfaces to life and make development easier.",
            )
          }}
        </p>
        <p class="orvui-site-footer-copyright">
          © 2026 everfu · orvui<br />
          <a href="/licenses/MIT.txt">MIT</a> ·
          {{
            t(
              "版权与依赖许可见 NOTICE",
              "Copyright and dependency licenses are listed in NOTICE",
            )
          }}
        </p>
      </div>
      <nav
        v-for="column in columns"
        :key="column.category"
        :aria-label="column.title"
        :data-footer-category="column.category"
      >
        <p class="orvui-site-footer-heading">{{ column.title }}</p>
        <ul>
          <li v-for="item in column.items" :key="item.slug">
            <a :href="componentPath(column.category, item.slug)">{{
              item.name
            }}</a>
          </li>
          <li v-if="column.total > column.items.length">
            <a
              :href="componentPath(column.category)"
              class="orvui-site-footer-view-all"
              >{{ t("查看全部", "View all") }} ({{ column.total }})</a
            >
          </li>
        </ul>
      </nav>
      <nav :aria-label="t('链接', 'Links')">
        <p class="orvui-site-footer-heading">{{ t("链接", "Links") }}</p>
        <ul>
          <li v-for="item in links" :key="item.href">
            <a
              :href="item.href"
              :target="item.href.startsWith('http') ? '_blank' : undefined"
              :rel="
                item.href.startsWith('http') ? 'noreferrer noopener' : undefined
              "
              >{{ item.label }}</a
            >
          </li>
        </ul>
      </nav>
    </div>
  </footer>
</template>
<style scoped>
.orvui-site-footer {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-top: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
}
.orvui-site-footer-grid {
  position: relative;
  z-index: 10;
  display: grid;
  width: 100%;
  max-width: 1280px;
  grid-template-columns: minmax(0, 1fr);
  column-gap: 24px;
  row-gap: 48px;
  margin: 0 auto;
  padding: 64px 16px;
  font-size: 16px;
  line-height: 24px;
}
.orvui-site-footer-brand {
  max-width: 320px;
}
.orvui-site-footer-logo {
  --orvui-logo-height: 30px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--foreground);
}
.orvui-site-footer-description {
  margin: 16px 0 0;
  font-size: 14px;
  line-height: 24px;
  color: var(--muted-foreground);
}
.orvui-site-footer-copyright {
  margin: 16px 0 0;
  color: var(--muted-foreground);
  font-size: 12px;
  line-height: 20px;
}
.orvui-site-footer-heading {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}
.orvui-site-footer nav ul {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}
.orvui-site-footer nav li {
  line-height: 24px;
}
.orvui-site-footer nav li + li {
  margin-top: 10px;
}
.orvui-site-footer nav a {
  font-size: 14px;
  line-height: 20px;
  color: var(--muted-foreground);
  text-decoration: none;
  transition: color 150ms;
}
.orvui-site-footer nav a:hover {
  color: var(--foreground);
}
.orvui-site-footer nav a.orvui-site-footer-view-all {
  font-weight: 500;
  color: var(--foreground);
}
.orvui-site-footer nav a.orvui-site-footer-view-all:hover {
  color: var(--muted-foreground);
}
@media (min-width: 640px) {
  .orvui-site-footer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 768px) {
  .orvui-site-footer-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .orvui-site-footer-grid {
    grid-template-columns: 1.4fr repeat(5, minmax(0, 1fr));
  }
}
</style>
