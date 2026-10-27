<script setup lang="ts">
import { Menu, Search, Sun, Moon, Monitor } from "lucide-vue-next";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../../../packages/vue/src/motion/tabs";
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
  theme,
  changeTheme,
  navigate,
  t,
  routeTo,
  categoryLabel,
} = useSiteShell();
const sections = ["motion", "blocks", "agents", "charts"];
const modes = [
  { value: "light", label: "Light theme", icon: Sun },
  { value: "dark", label: "Dark theme", icon: Moon },
  { value: "system", label: "System theme", icon: Monitor },
];
const sectionLabel = (section: string) =>
  section === "agents" ? t("AI 代理", "Agents") : categoryLabel(section);
</script>
<template>
  <header class="site-header" :class="{ scrolled }">
    <button
      class="icon-button mobile-toggle site-action site-action--icon site-action--ghost"
      type="button"
      :aria-label="t('打开导航', 'Open navigation')"
      :aria-expanded="mobileMenu"
      aria-haspopup="dialog"
      @click="mobileMenu = true"
    >
      <Menu :size="20" />
    </button>
    <a class="brand" :href="`${locale}/`" aria-label="orvui home"
      ><SiteLogo class="site-logo--header" /></a
    >
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
        class="icon-button site-action site-action--icon"
        type="button"
        :aria-label="t('搜索组件', 'Search components')"
        @click="searchOpen = true"
      >
        <Search :size="14" />
      </button>
      <Tabs
        :model-value="theme"
        variant="pill"
        class="site-theme-tabs"
        @update:model-value="changeTheme"
      >
        <TabsList class="site-segmented" :aria-label="t('主题', 'Theme')">
          <TabsTrigger
            v-for="mode in modes"
            :key="mode.value"
            :value="mode.value"
            :aria-label="mode.label"
            indicator-class-name="bg-foreground"
            class="site-theme-trigger site-segmented-trigger"
            ><component :is="mode.icon" :size="16"
          /></TabsTrigger>
        </TabsList>
      </Tabs>
      <SitePreferences
        v-model:open="preferencesOpen"
        :lang="en ? 'en' : 'zh-CN'"
      />
      <SiteLanguageSwitch
        :en="en"
        :current-href="pathname + suffix"
        :alternate-href="alternate"
      />
    </div>
  </header>
  <SiteSearch v-model:open="searchOpen" :en="en" @navigate="navigate" />
  <BottomSheet
    v-model:open="mobileMenu"
    :title="t('菜单', 'Menu')"
    :snap-points="[0.85]"
  >
    <div class="mobile-menu-content">
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
