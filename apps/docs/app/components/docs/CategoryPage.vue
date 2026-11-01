<script setup lang="ts">
import { useDocsVersion } from "../../composables/docs-version";
const { href: docsHref } = useDocsVersion();
import { computed } from "vue";
import type { CatalogCategory } from "../../../../../tools/registry/types";
import NewBadge from "./NewBadge.vue";
import { useNewBadgeClock } from "../../composables/new-badge";
import { projectCategory } from "../../utils/docs/category-projection";
const props = defineProps<{ category: CatalogCategory; en: boolean }>();
const clock = useNewBadgeClock(() => props.category.components);
const projection = computed(() =>
  projectCategory(props.category, props.en, clock.isNew),
);
const content = computed(() => projection.value.content),
  groups = computed(() => projection.value.groups);
</script>
<template>
  <div class="category-page">
    <div class="page-title">
      <h1>{{ content.heading }}</h1>
    </div>
    <p class="page-description">{{ content.description }}</p>
    <div
      :class="[
        'category-groups',
        { 'agent-groups': category.slug === 'agents' },
      ]"
    >
      <section v-for="group in groups" :key="group.id" :id="group.id">
        <h2>{{ group.title }}</h2>
        <p v-if="group.description" class="category-group-description">
          {{ group.description }}
        </p>
        <div class="category-card-grid">
          <a
            v-for="item in group.items"
            :key="item.slug"
            :href="docsHref(item.href)"
            class="category-component-card"
          >
            <div>
              <h3>{{ item.name }}</h3>
              <NewBadge
                v-if="item.badge === 'new'"
                :launched-at="item.launchedAt"
              />
            </div>
            <div>
              <p>
                {{ item.summary }}
              </p>
            </div>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>
<style scoped>
.category-groups {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.category-groups h2 {
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--muted-foreground);
  margin: 0;
}
.category-groups.agent-groups {
  margin-top: 48px;
  gap: 56px;
}
.agent-groups h2 {
  font-size: 20px;
  line-height: 28px;
  letter-spacing: -0.025em;
  text-transform: none;
  color: var(--foreground);
}
.category-group-description {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 24px;
  color: var(--muted-foreground);
}
.category-card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.agent-groups .category-card-grid {
  margin-top: 20px;
}
.category-component-card {
  position: relative;
  display: flex;
  height: 160px;
  flex-direction: column;
  overflow: hidden;
  border-radius: 24px;
  background: var(--card);
  contain: paint;
  transition: background-color 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.category-component-card:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.category-component-card > div:first-child {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
}
.category-component-card h3 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}
.category-component-card > div:last-child {
  margin: 0 8px 8px;
  display: flex;
  min-height: 0;
  flex: 1;
  align-items: flex-start;
  overflow: hidden;
  border-radius: 24px;
  background: var(--background);
  padding: 16px;
  transition: background-color 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.category-component-card:hover > div:last-child,
.category-component-card:focus-visible > div:last-child {
  background: color-mix(in oklab, var(--background) 80%, transparent);
}
.category-component-card p {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
  font-size: 14px;
  line-height: 1.625;
  color: var(--muted-foreground);
}
@media (max-width: 1279px) {
  .category-card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 639px) {
  .category-card-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
