<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleIndicator,
} from "../../../../../packages/vue/src/motion/collapsible";
import { ButtonLink } from "../../../../../packages/vue/src/motion/button";
import { SharedLayoutBg } from "../../../../../packages/vue/src/motion/shared-layout-bg";
import { useSiteNavigation } from "../../composables/use-site-navigation";
import {
  guideGroups,
  componentGroups,
  componentGroup,
  groupedComponentPath,
  type DocsSection,
} from "../../utils/docs/document-sections";
import { templateDefinitions } from "../../utils/docs/template-definitions";
import {
  changelogEntries,
  changelogAnchor,
} from "../../utils/docs/site-changelog-data";
import { localize } from "../../utils/docs/site-page-data";
import NewBadge from "./NewBadge.vue";
import {
  guideIcon,
  componentIcon,
  LayoutGrid,
} from "../../utils/docs/navigation-icons";
import type { Component } from "vue";

const props = defineProps<{
  category?: string;
  pathname: string;
  en: boolean;
  section?: DocsSection;
}>();
const emit = defineEmits<{ navigate: [] }>();
const { nav } = useSiteNavigation(props);
const section = computed(
  () =>
    props.section ??
    (props.category ||
    props.pathname.replace(/^\/en/, "").startsWith("/components")
      ? "components"
      : props.pathname.endsWith("/changelog")
        ? "releases"
        : props.pathname.includes("/templates")
          ? "templates"
          : "guides"),
);
type Item = {
  href: string;
  label: string;
  icon?: Component;
  badge?: string;
  status?: "preview";
  launchedAt?: string;
};
const groups = computed<{ id: string; label: string; items: Item[] }[]>(() => {
  const prefix = props.en ? "/en" : "";
  if (section.value === "guides")
    return guideGroups.map((group) => ({
      id: group.id,
      label: props.en ? group.en : group.zh,
      items: group.pages.map((page) => ({
        href: prefix + page.path,
        label: props.en ? page.en : page.zh,
        icon: guideIcon(page.path),
        status: page.status,
      })),
    }));
  if (section.value === "components")
    return [
      {
        id: "overview",
        label: props.en ? "Overview" : "概览",
        items: [
          {
            href: prefix + "/components",
            label: props.en ? "All components" : "全部组件",
            icon: LayoutGrid,
          },
        ],
      },
      ...componentGroups.map((group) => ({
        id: group.id,
        label: props.en ? group.en : group.zh,
        items: group.entries.map((entry) => ({
          href: groupedComponentPath(entry, props.en),
          label: entry.name,
          icon: componentIcon(entry.slug, entry.category),
          badge: entry.badge,
          launchedAt: entry.launchedAt,
        })),
      })),
    ];
  if (section.value === "templates")
    return [
      {
        id: "overview",
        label: props.en ? "Overview" : "概览",
        items: [
          {
            href: prefix + "/templates",
            label: props.en ? "All templates" : "全部模板",
            icon: LayoutGrid,
          },
        ],
      },
      {
        id: "applications",
        label: props.en ? "Application templates" : "应用模板",
        items: templateDefinitions.map((template) => ({
          href: `${prefix}/templates/${template.slug}`,
          label: template.name,
          icon: LayoutGrid,
        })),
      },
    ];
  return [
    {
      id: "overview",
      label: props.en ? "Releases" : "更新日志",
      items: [
        {
          href: prefix + "/changelog",
          label: props.en ? "All updates" : "全部更新",
          icon: guideIcon("/changelog"),
        },
      ],
    },
    ...[
      ...new Set(changelogEntries.map((entry) => entry.date.slice(0, 4))),
    ].map((year) => ({
      id: year,
      label: year,
      items: changelogEntries
        .filter((entry) => entry.date.startsWith(year))
        .map((entry) => ({
          href: `${prefix}/changelog#${changelogAnchor(entry.date)}`,
          label: `${entry.date} · ${localize(entry.title, props.en)}`,
        })),
    })),
  ];
});
const opened = reactive<Record<string, boolean>>({});
watch(
  [groups, () => props.pathname],
  () => {
    for (const group of groups.value) {
      if (
        opened[`${section.value}-${group.id}`] === undefined ||
        group.items.some((item) => item.href === props.pathname)
      )
        opened[`${section.value}-${group.id}`] = true;
    }
    const active = componentGroup(props.pathname.split("/").at(-1) ?? "");
    if (active && section.value === "components")
      opened[`components-${active.id}`] = true;
  },
  { immediate: true },
);
</script>
<template>
  <nav
    ref="nav"
    class="docs-navigation"
    :data-section="section"
    :aria-label="en ? 'Documentation navigation' : '文档导航'"
  >
    <Collapsible
      v-for="group in groups"
      :key="`${section}-${group.id}`"
      v-model:open="opened[`${section}-${group.id}`]"
      class="docs-nav-group"
    >
      <CollapsibleTrigger as-child
        ><button class="docs-nav-group-trigger">
          <span>{{ group.label }}</span
          ><span v-if="group.items.length > 2" class="docs-nav-count">{{
            group.items.length
          }}</span
          ><CollapsibleIndicator /></button
      ></CollapsibleTrigger>
      <CollapsibleContent>
        <SharedLayoutBg
          :inset="0"
          pill-class-name="rounded-xl bg-muted/60"
          class="docs-nav-links"
        >
          <ButtonLink
            v-for="item in group.items"
            :key="item.href"
            :href="item.href"
            variant="ghost"
            size="sm"
            :aria-current="pathname === item.href ? 'page' : undefined"
            class="docs-nav-link"
            @click="emit('navigate')"
          >
            <component
              v-if="item.icon"
              :is="item.icon"
              :size="16"
              aria-hidden="true"
            /><span>{{ item.label }}</span
            ><span v-if="item.status === 'preview'" class="docs-preview-badge"
              >Preview</span
            ><NewBadge
              v-if="item.badge === 'new'"
              :launched-at="item.launchedAt"
            />
          </ButtonLink>
        </SharedLayoutBg>
      </CollapsibleContent>
    </Collapsible>
  </nav>
</template>
