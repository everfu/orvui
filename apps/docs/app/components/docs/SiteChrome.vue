<script setup lang="ts">
import { Menu, Search } from "lucide-vue-next";
import SiteAppearanceSwitch from "./SiteAppearanceSwitch.vue";
import SiteGithubLink from "./SiteGithubLink.vue";
import { useGithubStars } from "../../composables/github";
import { BottomSheet } from "../../../../../packages/vue/src/motion/bottom-sheet";
import DocsNavigation from "./DocsNavigation.vue";
import DocsSectionTabs from "./DocsSectionTabs.vue";
import { documentationSections } from "../../utils/docs/document-sections";
import SiteSearch from "./SiteSearch.vue";
import SitePreferences from "./SitePreferences.vue";
import SiteLanguageSwitch from "./SiteLanguageSwitch.vue";
import SiteVersionSwitch from "./SiteVersionSwitch.vue";
import SiteLogo from "./SiteLogo.vue";
import { useSiteShell } from "../../composables/site-shell-state";
const {
  home,
  docsSection,
  category,
  en,
  locale,
  pathname,
  addressPath,
  channel,
  suffix,
  alternate,
  mobileMenu,
  searchOpen,
  preferencesOpen,
  scrolled,
  navigate,
  t,
} = useSiteShell();
const stars = useGithubStars();
</script>
<template>
  <header class="site-header" :class="{ scrolled }">
    <div class="site-header-main">
      <a class="brand" :href="`${locale}/`" aria-label="orvui home"
        ><SiteLogo class="site-logo--header"
      /></a>
      <SiteVersionSwitch
        :en="en"
        :channel="channel"
        :current-href="addressPath + suffix"
      />
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
            :current-href="addressPath + suffix"
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
    </div>
    <DocsSectionTabs
      v-if="!home"
      :section="docsSection"
      :en="en"
      @navigate="mobileMenu = false"
    />
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
          :current-href="addressPath + suffix"
          :alternate-href="alternate"
        />
        <SiteAppearanceSwitch />
      </div>
      <nav v-if="home" class="mobile-primary-nav">
        <a
          v-for="section in documentationSections"
          :key="section.id"
          :href="locale + section.path"
          @click="mobileMenu = false"
          >{{ en ? section.en : section.zh }}</a
        >
      </nav>
      <DocsNavigation
        v-if="!home"
        :section="home ? undefined : docsSection"
        :category="category?.slug"
        :pathname="pathname"
        :en="en"
        @navigate="mobileMenu = false"
      />
    </div>
  </BottomSheet>
</template>
