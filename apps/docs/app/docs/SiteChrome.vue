<script setup lang="ts">
import { Menu, Search } from "lucide-vue-next";
import SiteAppearanceSwitch from "./SiteAppearanceSwitch.vue";
import SiteGithubLink from "./SiteGithubLink.vue";
import { useGithubStars } from "./github";
import { BottomSheet } from "../../../../packages/vue/src/motion/bottom-sheet";
import SiteNavigation from "./SiteNavigation.vue";
import SiteSearch from "./SiteSearch.vue";
import SitePreferences from "./SitePreferences.vue";
import SiteLanguageSwitch from "./SiteLanguageSwitch.vue";
import SiteLogo from "./SiteLogo.vue";
import { useSiteShell } from "./site-shell-state";
const {
  category,
  en,
  locale,
  pathname,
  suffix,
  alternate,
  mobileMenu,
  searchOpen,
  preferencesOpen,
  scrolled,
  navigate,
  t,
  routeTo,
  categoryLabel,
} = useSiteShell();
const sections = ["motion", "blocks", "agents", "charts"];
const stars = useGithubStars();
const sectionLabel = (section: string) =>
  section === "agents" ? t("AI 代理", "Agents") : categoryLabel(section);
</script>
<template>
  <header class="site-header" :class="{ scrolled }">
    <a class="brand" :href="`${locale}/`" aria-label="orvui home"
      ><SiteLogo class="site-logo--header"
    /></a>
    <nav class="top-nav" :aria-label="t('主导航', 'Main navigation')">
      <a
        v-for="section in sections"
        :key="section"
        :href="routeTo(section)"
        :class="{ active: category?.slug === section }"
        >{{ sectionLabel(section) }}</a
      >
    </nav>
    <div class="header-tools">
      <button
        class="icon-button site-action site-action--icon header-control"
        type="button"
        :aria-label="t('搜索组件', 'Search components')"
        @click="searchOpen = true"
      >
        <Search :size="16" aria-hidden="true" />
      </button>
      <SitePreferences
        v-model:open="preferencesOpen"
        :lang="en ? 'en' : 'zh-CN'"
      />
      <div class="desktop-header-settings">
        <SiteAppearanceSwitch />
        <SiteLanguageSwitch
          :en="en"
          :current-href="pathname + suffix"
          :alternate-href="alternate"
        />
        <SiteGithubLink :stars="stars" :en="en" />
      </div>
      <button
        class="icon-button mobile-toggle site-action site-action--icon site-action--ghost header-control"
        type="button"
        :aria-label="t('打开导航', 'Open navigation')"
        :aria-expanded="mobileMenu"
        aria-haspopup="dialog"
        @click="mobileMenu = true"
      >
        <Menu :size="20" />
      </button>
    </div>
  </header>
  <SiteSearch v-model:open="searchOpen" :en="en" @navigate="navigate" />
  <BottomSheet
    v-model:open="mobileMenu"
    :title="t('菜单', 'Menu')"
    :snap-points="[0.85]"
  >
    <div class="mobile-menu-content">
      <div class="mobile-header-settings">
        <SiteGithubLink :stars="stars" :en="en" />
        <SiteLanguageSwitch
          :en="en"
          :current-href="pathname + suffix"
          :alternate-href="alternate"
        />
        <SiteAppearanceSwitch />
      </div>
      <nav class="mobile-primary-nav">
        <a
          v-for="section in sections"
          :key="section"
          :href="routeTo(section)"
          :class="{ active: category?.slug === section }"
          @click="mobileMenu = false"
          >{{ sectionLabel(section) }}</a
        >
      </nav>
      <SiteNavigation
        :category="category?.slug"
        :pathname="pathname"
        :en="en"
        @navigate="mobileMenu = false"
      />
    </div>
  </BottomSheet>
</template>
