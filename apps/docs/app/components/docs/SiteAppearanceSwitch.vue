<script setup lang="ts">
import { Sun, Moon, Monitor } from "lucide-vue-next";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../../../../packages/vue/src/motion/tabs";
import { useSiteShell } from "../../composables/site-shell-state";
const { theme, changeTheme, t } = useSiteShell();
const modes = [
  { value: "light", zh: "浅色", en: "Light theme", icon: Sun },
  { value: "dark", zh: "深色", en: "Dark theme", icon: Moon },
  { value: "system", zh: "系统", en: "System theme", icon: Monitor },
];
</script>
<template>
  <Tabs
    :model-value="theme"
    variant="pill"
    class="site-theme-tabs"
    @update:model-value="changeTheme"
  >
    <TabsList
      class="site-segmented appearance-control"
      :aria-label="t('外观', 'Appearance')"
    >
      <TabsTrigger
        v-for="mode in modes"
        :key="mode.value"
        :value="mode.value"
        :aria-label="t(mode.zh, mode.en)"
        indicator-class-name="appearance-indicator"
        class="site-theme-trigger site-segmented-trigger"
      >
        <component :is="mode.icon" :size="14" aria-hidden="true" />
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>
