import type { TableOfContentsItem } from "../../../../../packages/vue/src/motion/table-of-contents";
import type {
  CatalogCategory,
  CatalogEntry,
} from "../../../../../tools/registry/types";
import {
  getComponentAbout,
  getComponentGuide,
  relatedComponents,
} from "./details";
import { variantNames } from "./i18n";
import { localize, sitePageToc, type SitePageSlug } from "./site-page-data";
import { changelogAnchor, changelogEntries } from "./site-changelog-data";
import { projectCategory } from "./category-projection";
import type { NewBadgeEntry } from "../../composables/new-badge";
import { componentGroups } from "./document-sections";
import { templateSections } from "./template-definitions";

export function componentOutline(
  category: CatalogCategory,
  entry: CatalogEntry,
  en: boolean,
): TableOfContentsItem[] {
  const t = (zh: string, english: string) => (en ? english : zh);
  const about = getComponentAbout(category.slug, entry.slug, en);
  return [
    { id: "overview", label: t("概览", "Overview") },
    ...(about
      ? [{ id: "when-to-use", label: t("适用场景", "When to use it") }]
      : []),
    { id: "install", label: t("安装", "Installation") },
    { id: "examples", label: t("示例", "Examples") },
    ...(entry.examples ?? []).map((example) => ({
      id: example.slug,
      label: en ? example.name : variantNames[example.slug] || example.name,
      level: 3 as const,
    })),
    ...(getComponentGuide(category.slug, entry.slug, en)
      ? [
          { id: "composition", label: t("组合结构", "Composition") },
          { id: "behavior", label: t("工作方式", "How it works") },
        ]
      : []),
    { id: "state-and-events", label: t("状态与事件", "State and events") },
    { id: "api-reference", label: t("API 参考", "API Reference") },
    ...(about
      ? [
          { id: "accessibility", label: t("无障碍", "Accessibility") },
          { id: "faq", label: t("常见问题", "FAQ") },
        ]
      : []),
    ...(relatedComponents(category.slug, entry.slug, 3).length
      ? [
          {
            id: "related-components",
            label: t("相关组件", "Related components"),
          },
        ]
      : []),
    { id: "licenses", label: t("来源与许可", "Attribution and licenses") },
  ];
}

export function documentOutline(input: {
  layout?: string;
  category?: CatalogCategory;
  entry?: CatalogEntry;
  page?: SitePageSlug;
  en: boolean;
  isNew: (entry: NewBadgeEntry) => boolean;
}): TableOfContentsItem[] {
  const { category, entry, page, en, isNew } = input;
  if (input.layout === "components")
    return [
      { id: "overview", label: en ? "Overview" : "概览" },
      ...componentGroups.map((group) => ({
        id: group.id,
        label: en ? group.en : group.zh,
      })),
      {
        id: "choosing-components",
        label: en ? "Choose a component" : "如何选择组件",
      },
    ];
  if (input.layout === "templates")
    return [
      { id: "overview", label: en ? "Overview" : "概览" },
      { id: "applications", label: en ? "Workspaces" : "应用工作台" },
      {
        id: "choosing-template",
        label: en ? "Choose a starting point" : "选择模板",
      },
      { id: "start-building", label: en ? "Make it your own" : "开始使用" },
    ];
  if (input.layout === "template")
    return templateSections.map((section) => ({
      id: section.id,
      label: en ? section.en : section.zh,
      level: "level" in section ? section.level : undefined,
    }));
  if (category && entry) return componentOutline(category, entry, en);
  if (category)
    return projectCategory(category, en, isNew).groups.map((group) => ({
      id: group.id,
      label: group.title,
    }));
  if (page === "changelog")
    return changelogEntries.map((week) => ({
      id: changelogAnchor(week.date),
      label: localize(week.title, en),
    }));
  if (page)
    return [
      { id: "overview", label: en ? "Overview" : "概览" },
      ...sitePageToc(page).map((item) => ({
        id: item.id,
        label: localize(item.label, en),
      })),
    ];
  return [];
}
