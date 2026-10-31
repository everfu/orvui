<script setup lang="ts">
import { motion } from "motion-v";
import { Button } from "../../../../../packages/vue/src/motion/button";
import { Tooltip } from "../../../../../packages/vue/src/motion/tooltip";
import { SharedLayoutBg } from "../../../../../packages/vue/src/motion/shared-layout-bg";
import {
  EASE_OUT,
  SPRING_LAYOUT,
  SPRING_PRESS,
} from "../../../../../packages/vue/src/lib/ease";
import NewBadge from "./NewBadge.vue";
import { useSiteNavigation } from "../../composables/use-site-navigation";
const props = defineProps<{
  category?: string;
  pathname: string;
  en: boolean;
}>();
const emit = defineEmits<{ navigate: [] }>();
const {
  guides,
  filter,
  tooltip,
  nav,
  id,
  reduce,
  prefix,
  charts,
  filters,
  categories,
  routeTo,
  label,
  sorted,
  select,
  key,
} = useSiteNavigation(props);
</script>
<template>
  <nav
    ref="nav"
    class="site-navigation"
    :aria-label="en ? 'Browse components' : '浏览组件'"
  >
    <div v-if="!charts" class="site-navigation-filter">
      <motion.section
        layout-root
        :aria-label="en ? 'Filter navigation by category' : '按分类筛选导航'"
        @keydown="key"
      >
        <motion.div
          layout
          :layout-dependency="filter"
          :transition="reduce ? { duration: 0 } : SPRING_LAYOUT"
          role="tablist"
          :aria-label="en ? 'Component categories' : '组件分类'"
          class="category-filter-rail"
          :style="{ borderRadius: '9999px' }"
        >
          <Tooltip
            v-for="item in filters"
            :key="item.value"
            :content="item.label"
            side="bottom"
            :open="filter !== item.value && tooltip === item.value"
            @update:open="
              tooltip = $event && filter !== item.value ? item.value : null
            "
          >
            <Button
              variant="ghost"
              size="sm"
              role="tab"
              :id="`${id}-${item.value}`"
              :aria-label="item.label"
              :aria-selected="filter === item.value"
              :aria-controls="`${id}-panel`"
              :tabindex="filter === item.value ? 0 : -1"
              layout
              :layout-dependency="filter"
              :transition="{
                layout: reduce ? { duration: 0 } : SPRING_LAYOUT,
                scale: SPRING_PRESS,
              }"
              :while-hover="undefined"
              :while-press="reduce ? undefined : { scale: 0.97 }"
              :style="{ borderRadius: '9999px' }"
              :class="[
                'category-filter-tab',
                filter === item.value ? 'is-active' : '',
              ]"
              @click="select(item.value)"
            >
              <motion.span
                layout="position"
                :layout-dependency="filter"
                :transition="reduce ? { duration: 0 } : SPRING_LAYOUT"
                class="category-filter-icon"
                aria-hidden="true"
                ><component :is="item.icon" :size="16"
              /></motion.span>
              <motion.span
                layout="position"
                :layout-dependency="filter"
                aria-hidden="true"
                :initial="false"
                :animate="{
                  opacity: filter === item.value ? 1 : 0,
                  filter:
                    reduce || filter === item.value ? 'blur(0px)' : 'blur(4px)',
                }"
                :transition="{
                  layout: reduce ? { duration: 0 } : SPRING_LAYOUT,
                  opacity: {
                    duration: filter === item.value ? 0.18 : 0.1,
                    ease: EASE_OUT,
                  },
                  filter: {
                    duration: filter === item.value ? 0.18 : 0.1,
                    ease: EASE_OUT,
                  },
                }"
                :class="[
                  'category-filter-label',
                  filter === item.value ? 'is-active' : '',
                ]"
                >{{ item.label }}</motion.span
              >
            </Button>
          </Tooltip>
        </motion.div>
      </motion.section>
    </div>
    <div
      :id="`${id}-panel`"
      :role="charts ? undefined : 'tabpanel'"
      :aria-labelledby="charts ? undefined : `${id}-${filter}`"
      class="site-navigation-groups"
    >
      <div :hidden="!charts && filter !== 'all'">
        <p class="site-navigation-heading">{{ en ? "Intro" : "入门" }}</p>
        <SharedLayoutBg
          :inset="0"
          pill-class-name="rounded-lg bg-foreground/[0.05]"
        >
          <a
            :href="routeTo(charts ? 'charts' : 'motion')"
            :class="[
              'site-navigation-link',
              pathname === routeTo(charts ? 'charts' : 'motion')
                ? 'is-current'
                : '',
            ]"
            @click="emit('navigate')"
            >{{ en ? "Home" : "概览" }}</a
          >
          <a
            v-if="!charts"
            :href="`${prefix}/changelog`"
            :class="[
              'site-navigation-link',
              pathname === `${prefix}/changelog` && 'is-current',
            ]"
            :aria-current="
              pathname === `${prefix}/changelog` ? 'page' : undefined
            "
            @click="emit('navigate')"
            >{{ en ? "Changelog" : "更新日志" }}</a
          >
        </SharedLayoutBg>
      </div>
      <div v-if="!charts" :hidden="filter !== 'all'">
        <p class="site-navigation-heading">{{ en ? "Guides" : "指南" }}</p>
        <SharedLayoutBg
          :inset="0"
          pill-class-name="rounded-lg bg-foreground/[0.05]"
        >
          <a
            v-for="guide in guides"
            :key="guide.path"
            :href="prefix + guide.path"
            :class="[
              'site-navigation-link',
              pathname === prefix + guide.path && 'is-current',
            ]"
            :aria-current="
              pathname === prefix + guide.path ? 'page' : undefined
            "
            @click="emit('navigate')"
            >{{ guide.label }}</a
          >
        </SharedLayoutBg>
      </div>
      <div
        v-for="category in categories"
        :key="category.slug"
        :hidden="!charts && filter !== 'all' && filter !== category.slug"
      >
        <a
          class="site-navigation-heading"
          :href="routeTo(category.slug)"
          @click="emit('navigate')"
          >{{ label(category.slug)
          }}<span>{{ category.components.length }}</span></a
        >
        <SharedLayoutBg
          :inset="0"
          pill-class-name="rounded-lg bg-foreground/[0.05]"
        >
          <a
            v-for="entry in sorted(category.components)"
            :key="entry.slug"
            :href="routeTo(category.slug, entry.slug)"
            :class="[
              'site-navigation-link',
              pathname === routeTo(category.slug, entry.slug)
                ? 'is-current'
                : '',
            ]"
            :aria-current="
              pathname === routeTo(category.slug, entry.slug)
                ? 'page'
                : undefined
            "
            @click="emit('navigate')"
            ><span>{{ entry.name }}</span
            ><NewBadge
              v-if="entry.badge === 'new'"
              :launched-at="entry.launchedAt"
          /></a>
        </SharedLayoutBg>
      </div>
    </div>
  </nav>
</template>
<style scoped>
.site-navigation,
.site-navigation-groups {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.site-navigation-filter {
  position: sticky;
  top: -24px;
  z-index: 20;
  margin-top: -24px;
  margin-bottom: -16px;
  padding-top: 24px;
  background: var(--background);
}
.site-navigation-filter:after {
  content: "";
  pointer-events: none;
  position: absolute;
  inset: 100% 0 auto;
  height: 16px;
  background: linear-gradient(var(--background), transparent);
}
.site-navigation-filter section {
  background: var(--background);
  padding-bottom: 12px;
}
.category-filter-rail {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  gap: 4px;
  background: var(--card);
  padding: 1px;
  border: 1px solid var(--border);
}
.category-filter-tab {
  height: 32px;
  min-width: 32px;
  flex-shrink: 0;
  justify-content: flex-start;
  gap: 0;
  overflow: hidden;
  border: 0;
  padding: 0;
  font-size: 12px;
  color: var(--muted-foreground);
  background: transparent;
  min-height: 32px;
}
.category-filter-tab.is-active {
  background: var(--foreground);
  color: var(--background);
}
.category-filter-icon {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  flex-shrink: 0;
}
.category-filter-label {
  display: inline-flex;
  flex-shrink: 0;
  overflow: hidden;
  white-space: nowrap;
  width: 0;
}
.category-filter-label.is-active {
  width: auto;
  padding-right: 8px;
}
.site-navigation-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 6px;
  padding: 0 10px;
  font-size: 11px;
  line-height: 16.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted-foreground);
}
.site-navigation-heading > span {
  display: inline-flex;
  height: 16px;
  min-width: 16px;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--foreground) 6%, transparent);
  padding: 0 4px;
  font-size: 10px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  letter-spacing: normal;
}
.site-navigation-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 14px;
  line-height: 20px;
  color: var(--muted-foreground);
}
.site-navigation-link > span:first-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.site-navigation-link:hover,
.site-navigation-link.is-current {
  color: var(--foreground);
}
.site-navigation-link.is-current {
  background: color-mix(in srgb, var(--foreground) 6%, transparent);
  font-weight: 500;
}
.site-navigation-groups > [hidden] {
  display: none;
}
@media (min-width: 768px) {
  .site-navigation-link {
    padding-top: 4px;
    padding-bottom: 4px;
  }
}
</style>
