import catalog from "../../../../../tools/catalog/components.json";
import { componentPath } from "./docs-routes";
import type { CatalogEntry } from "../../../../../tools/registry/types";

export type DocsSection = "guides" | "components" | "templates" | "releases";
export const DOCS_HEADER_HEIGHT = 100;
export const DOCS_ANCHOR_OFFSET = DOCS_HEADER_HEIGHT + 32;
export const documentationSections = [
  {
    id: "guides",
    path: "/guide",
    zh: "引导",
    en: "Getting Started",
    icon: "book",
  },
  {
    id: "components",
    path: "/components",
    zh: "组件",
    en: "Components",
    icon: "components",
  },
  {
    id: "templates",
    path: "/templates",
    zh: "模板",
    en: "Templates",
    icon: "templates",
  },
  {
    id: "releases",
    path: "/changelog",
    zh: "更新日志",
    en: "Releases",
    icon: "releases",
  },
] as const;

export function resolveDocsSection(
  frontmatter: Record<string, unknown>,
): DocsSection {
  if (
    documentationSections.some(
      (section) => section.id === frontmatter.docsSection,
    )
  )
    return frontmatter.docsSection as DocsSection;
  if (frontmatter.category || frontmatter.layout === "components")
    return "components";
  if (frontmatter.layout === "templates" || frontmatter.layout === "template")
    return "templates";
  return frontmatter.sitePage === "changelog" ? "releases" : "guides";
}

export const guideGroups = [
  {
    id: "start",
    zh: "开始使用",
    en: "Getting started",
    pages: [
      { path: "/guide", zh: "介绍", en: "Introduction" },
      { path: "/docs/installation", zh: "安装", en: "Installation" },
    ],
  },
  {
    id: "design",
    zh: "设计与交互",
    en: "Design and interaction",
    pages: [
      { path: "/docs/theme", zh: "主题配置", en: "Theming" },
      { path: "/docs/motion-patterns", zh: "动效指南", en: "Animation" },
    ],
  },
  {
    id: "ai-guides",
    zh: "AI 接入",
    en: "Building with AI",
    pages: [
      { path: "/docs/ai-agents", zh: "代理指南", en: "Agent guide" },
      { path: "/docs/openui", zh: "OpenUI", en: "OpenUI" },
    ],
  },
];

const definitions = [
  [
    "actions",
    "基础操作",
    "Actions",
    "button expanding-arrow-button expandable-control action-swap expandable-action-bar",
  ],
  [
    "forms",
    "表单与选择",
    "Forms and selection",
    "arc-picker date-range-picker color-picker color-selector switch input select combobox multi-select checkbox radio range-slider wheel-picker file-upload otp-input signup-form",
  ],
  [
    "navigation",
    "导航",
    "Navigation",
    "breadcrumb table-of-contents adaptive-stepper tabs bounce-sidebar animated-sidebar dock context-menu command-palette morphing-search overflow-actions expandable-tabs morphing-tabs bloom-menu",
  ],
  [
    "display",
    "布局与展示",
    "Layout and display",
    "timeline aspect-ratio card sortable-stack file-tree preview-rail cylinder-carousel infinite-masonry project-folder card-folder knockout-bracket swipeable-list collapsible bouncy-accordion table",
  ],
  [
    "feedback",
    "反馈",
    "Feedback",
    "alert pull-to-refresh number animated-badge animated-toast-stack loader notification-stack feedback-widget not-found",
  ],
  [
    "overlays",
    "浮层",
    "Overlays",
    "image-viewer bottom-sheet tooltip popover morphing-modal center-morph-modal drawer",
  ],
  [
    "motion",
    "动效与装饰",
    "Motion and effects",
    "tilt-card marquee shared-layout-bg text-animation theme-toggle scroll-animation shader-background",
  ],
  [
    "business",
    "业务组合",
    "Business compositions",
    "availability-scheduler swap dynamic-island prediction-market wallet-card",
  ],
  [
    "ai",
    "AI",
    "AI",
    catalog.categories
      .find((category) => category.slug === "agents")!
      .components.map((entry) => entry.slug)
      .join(" "),
  ],
  [
    "charts",
    "图表",
    "Charts",
    catalog.categories
      .find((category) => category.slug === "charts")!
      .components.map((entry) => entry.slug)
      .join(" "),
  ],
] as const;
export type GroupedComponent = CatalogEntry & { category: string };
const lookup = new Map<string, GroupedComponent>(
  catalog.categories.flatMap((category) =>
    category.components.map(
      (entry) => [entry.slug, { ...entry, category: category.slug }] as const,
    ),
  ),
);
export const componentGroups = definitions.map(([id, zh, en, slugs]) => ({
  id,
  zh,
  en,
  entries: slugs.split(" ").map((slug) => {
    const entry = lookup.get(slug);
    if (!entry) throw new Error(`Unknown documentation component: ${slug}`);
    return entry;
  }),
}));
export const componentGroup = (slug: string) =>
  componentGroups.find((group) =>
    group.entries.some((entry) => entry.slug === slug),
  );
export const groupedComponentPath = (entry: GroupedComponent, en = false) =>
  componentPath(entry.category, entry.slug, en);
