import type { DocsHeadConfig as HeadConfig } from "./shared-head";
export interface SocialPageData {
  relativePath: string;
  title: string;
  titleTemplate?: string | boolean;
  description: string;
  isNotFound?: boolean;
  frontmatter: Record<string, unknown> & { head?: HeadConfig[] };
}
import catalog from "../../../../../tools/catalog/components.json";
import { documentationOrigin } from "../../../../../tools/distribution";
import { projectCategory } from "./category-projection";
import { descriptions } from "./i18n";
import { sitePages } from "./site-page-data";
import { notFoundRobots } from "./shared-head";
export { notFoundRobots } from "./shared-head";

export const socialImage = {
  path: "/social/orvui-v2.png",
  width: 1200,
  height: 630,
  type: "image/png",
} as const;

export const siteDescriptions = {
  zh: "可复制、可组合的 Vue 动效组件。基于 Motion 和 Tailwind CSS，完全由你掌控。",
  en: "Copyable, composable Vue components with expressive motion. Built with Motion and Tailwind CSS, ready to customize.",
};

export function canonicalPath(relativePath: string) {
  const path = relativePath
    .split(/[?#]/, 1)[0]
    .replaceAll("\\", "/")
    .replace(/^\/+/, "")
    .replace(/\.(?:md|html)$/, "")
    .replace(/(^|\/)index$/, "$1")
    .replace(/\/+$/, "");
  return path === "" || path === "en"
    ? `/${path}${path ? "/" : ""}`
    : `/${path}`;
}

function titleWithTemplate(title: string, template: string | boolean = true) {
  if (typeof template === "string" && template.includes(":title"))
    return template.replaceAll(":title", title);
  const suffix =
    template === false || template === "orvui"
      ? ""
      : ` | ${template === true ? "orvui" : template}`;
  return title === suffix.slice(3) ? title : title + suffix;
}

export function documentTitle(
  page: Pick<SocialPageData, "title" | "titleTemplate" | "frontmatter">,
) {
  return titleWithTemplate(
    page.title || "orvui",
    page.titleTemplate ??
      (page.frontmatter.layout === "home" ? "orvui | :title" : true),
  );
}

function pageDescription(page: SocialPageData, en: boolean) {
  if (page.description.trim()) return page.description;
  const language = en ? "en" : "zh";
  const { layout, category: categorySlug, slug, sitePage } = page.frontmatter;
  if (layout === "site-page" || layout === "guide") {
    const definition = sitePages.find(
      (item) => item.slug === (sitePage ?? "introduction"),
    );
    if (definition) return definition.description[language];
  }
  const category = catalog.categories.find(
    (item) => item.slug === categorySlug,
  );
  if (category) {
    const entry = category.components.find((item) => item.slug === slug);
    if (layout === "component" && entry)
      return en
        ? entry.description.replace(/\bReact\b/g, "Vue")
        : (descriptions[entry.slug] ?? entry.description);
    if (layout === "category")
      return projectCategory(category, en, () => false).content.description;
  }
  return siteDescriptions[language];
}

function plainDescription(description: string) {
  const entities: Record<string, string> = {
    amp: "&",
    quot: '"',
    apos: "'",
    "#39": "'",
    lt: "<",
    gt: ">",
    nbsp: " ",
  };
  return description
    .replace(/<[^>]*>/g, "")
    .replace(
      /&(amp|quot|apos|#39|lt|gt|nbsp);/g,
      (_, entity: string) => entities[entity],
    )
    .replace(/\s+/g, " ")
    .trim();
}

function isManagedHead([tag, attrs]: HeadConfig) {
  return (
    (tag === "link" && attrs.rel === "canonical") ||
    (tag === "meta" &&
      (attrs.name === "description" ||
        attrs.name === "robots" ||
        attrs.property?.startsWith("og:") ||
        attrs.name?.startsWith("twitter:")))
  );
}

/** Pure metadata shared by Nuxt rendering, resource generation and verification. */
export function applySocialMetadata(page: SocialPageData) {
  const previous: HeadConfig[] = page.frontmatter.head ?? [];
  const retained = previous.filter((tag) => !isManagedHead(tag));
  if (page.isNotFound || /(^|\/)404\.(?:md|html)$/.test(page.relativePath)) {
    page.frontmatter.head = [...retained, notFoundRobots];
    return;
  }

  const path = canonicalPath(page.relativePath);
  const en = path.startsWith("/en/");
  const description = plainDescription(pageDescription(page, en));
  const title = documentTitle(page);
  const url = new URL(path, documentationOrigin).href;
  const image = new URL(socialImage.path, documentationOrigin).href;
  const alt = en
    ? "The orvui mark and Animated components for Vue on a dark background."
    : "深色背景上的 orvui 标志与 Animated components for Vue 标语。";
  const meta = (property: string, content: string): HeadConfig => [
    "meta",
    { property, content },
  ];
  const named = (name: string, content: string): HeadConfig => [
    "meta",
    { name, content },
  ];

  page.description = description;
  page.frontmatter.description = description;
  page.frontmatter.head = [
    ...retained,
    named(
      "robots",
      previous.find(
        ([tag, attrs]) => tag === "meta" && attrs.name === "robots",
      )?.[1].content ?? "index, follow",
    ),
    ["link", { rel: "canonical", href: url }],
    meta("og:type", "website"),
    meta("og:site_name", "orvui"),
    meta("og:title", title),
    meta("og:description", description),
    meta("og:url", url),
    meta("og:locale", en ? "en_US" : "zh_CN"),
    meta("og:locale:alternate", en ? "zh_CN" : "en_US"),
    meta("og:image", image),
    meta("og:image:type", socialImage.type),
    meta("og:image:width", String(socialImage.width)),
    meta("og:image:height", String(socialImage.height)),
    meta("og:image:alt", alt),
    named("twitter:card", "summary_large_image"),
    named("twitter:title", title),
    named("twitter:description", description),
    named("twitter:image", image),
    named("twitter:image:alt", alt),
  ];
}
