import catalog from "../../../../../tools/catalog/components.json";
import { templateDefinitions } from "./template-definitions";
import { sitePages } from "./site-page-data";

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
        docsSection: page.slug === "changelog" ? "releases" : "guides",
      });
    put(prefix + "/components", en ? "Vue Components" : "Vue 组件", {
      layout: "components",
      docsSection: "components",
    });
    put(prefix + "/templates", en ? "Templates" : "应用模板", {
      layout: "templates",
      docsSection: "templates",
    });
    for (const template of templateDefinitions)
      put(`${prefix}/templates/${template.slug}`, template.name, {
        layout: "template",
        templateSlug: template.slug,
        docsSection: "templates",
      });
    for (const category of catalog.categories) {
      const base =
        prefix +
        (category.slug === "charts"
          ? "/charts"
          : `/components/${category.slug}`);
      put(base, category.name, {
        layout: "category",
        category: category.slug,
        docsSection: "components",
      });
      for (const entry of category.components)
        put(`${base}/${entry.slug}`, entry.name, {
          layout: "component",
          docsSection: "components",
          category: category.slug,
          slug: entry.slug,
        });
    }
  }
  pages.push(
    ...pages.map((page) => ({
      ...page,
      path: "/beta" + page.path,
      relativePath: "beta/" + page.relativePath,
      frontmatter: { ...page.frontmatter, channel: "beta" },
    })),
  );
  return pages.sort((a, b) => a.path.localeCompare(b.path));
}
