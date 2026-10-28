import catalog from "../catalog/components.json";
import { sitePages } from "../../apps/docs/app/docs/site-page-data";

export interface DocsPage {
  path: string;
  relativePath: string;
  title: string;
  description: string;
  frontmatter: Record<string, unknown>;
}

/** One manifest serves Nuxt, social metadata and documentation verification. */
export function createDocsPages(): DocsPage[] {
  const pages: DocsPage[] = [];
  const put = (
    path: string,
    title: string,
    frontmatter: Record<string, unknown>,
  ) => {
    pages.push({
      path,
      title,
      description: "",
      frontmatter: { ...frontmatter, title },
      relativePath:
        (path === "/"
          ? "index"
          : path === "/en/"
            ? "en/index"
            : path.slice(1)) + ".md",
    });
  };
  for (const en of [false, true]) {
    const prefix = en ? "/en" : "";
    put(
      prefix + "/",
      en ? "Animated components for Vue" : "为 Vue 而生的动态组件",
      { layout: "home" },
    );
    for (const page of sitePages)
      put(prefix + page.path, page.title[en ? "en" : "zh"], {
        layout: "site-page",
        sitePage: page.slug,
      });
    for (const category of catalog.categories) {
      const base =
        prefix +
        (category.slug === "charts"
          ? "/charts"
          : `/components/${category.slug}`);
      put(base, category.name, { layout: "category", category: category.slug });
      for (const entry of category.components)
        put(`${base}/${entry.slug}`, entry.name, {
          layout: "component",
          category: category.slug,
          slug: entry.slug,
        });
    }
  }
  return pages.sort((a, b) => a.path.localeCompare(b.path));
}
