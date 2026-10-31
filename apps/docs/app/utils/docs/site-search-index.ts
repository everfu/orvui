import type { CatalogCategory } from "../../../../../tools/registry/types";
import type { NewBadgeEntry } from "../../composables/new-badge";
import { categoryNames, descriptions } from "./i18n";
import { componentPath, docsPath } from "./docs-routes";
import { localize, sitePages } from "./site-page-data";
export interface SearchRecord {
  id: string;
  label: string;
  href: string;
  group: string;
  keywords: string[];
  kind: "component" | "page";
  status?: NewBadgeEntry;
}
const setupAliases = ["setup", "getting started", "开始使用", "介绍"];
const installAliases = ["install", "installation", "安装", "安装指南"];
export function buildSiteSearchIndex(
  categories: CatalogCategory[],
  en: boolean,
) {
  const records: SearchRecord[] = [];
  for (const category of categories) {
    const group = categoryNames[category.slug]?.[en ? 1 : 0] ?? category.name;
    for (const component of category.components) {
      const href = componentPath(category.slug, component.slug, en);
      const common = [
        component.slug,
        component.name,
        category.slug,
        component.description,
        descriptions[component.slug] ?? "",
        ...(component.keywords ?? []),
      ];
      const variants = component.examples ?? [];
      const primary: SearchRecord = {
        id: category.slug + "-" + component.slug,
        label: component.name,
        href,
        group,
        keywords: [...common],
        kind: "component",
        status: component,
      };
      records.push(primary);
      for (const variant of variants) {
        if (variant.name === component.name) {
          primary.keywords.push(variant.slug, variant.installSlug ?? "");
          continue;
        }
        records.push({
          id: `${primary.id}-${variant.slug}`,
          label: variant.name,
          href: href + "#" + variant.slug,
          group,
          keywords: [
            component.name,
            ...common,
            variant.slug,
            variant.name,
            variant.installSlug ?? "",
            variant.description ?? "",
          ],
          kind: "component",
          status: variant,
        });
      }
    }
  }
  const pageGroup = en ? "Pages" : "页面";
  records.push({
    id: "home",
    label: en ? "Home" : "首页",
    href: en ? "/en/" : "/",
    group: pageGroup,
    keywords: ["home", "首页"],
    kind: "page",
  });
  for (const page of sitePages) {
    const aliases =
      page.slug === "introduction"
        ? setupAliases
        : page.slug === "installation"
          ? installAliases
          : [];
    records.push({
      id: page.slug,
      label: localize(page.title, en),
      href: docsPath(page.path, en),
      group: pageGroup,
      keywords: [
        page.slug,
        page.title.en,
        page.title.zh,
        page.description.en,
        page.description.zh,
        ...aliases,
      ],
      kind: "page",
    });
  }
  return records;
}
