import { writeFileSync, mkdirSync } from "node:fs";
import catalog from "../catalog/components.json";
import { sitePages } from "../../apps/docs/.vitepress/theme/site-page-data";
const root = "apps/docs";
const route = (category: string, slug?: string) =>
  category === "charts"
    ? `charts${slug ? "/" + slug : ""}`
    : `components/${category}${slug ? "/" + slug : ""}`;
for (const locale of ["", "en/"]) {
  const put = (path: string, data: Record<string, unknown>) => {
    const file = `${root}/${locale}${path}.md`;
    mkdirSync(file.slice(0, file.lastIndexOf("/")), { recursive: true });
    writeFileSync(
      file,
      `---\n${Object.entries(data)
        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
        .join("\n")}\n---\n`,
    );
  };
  put("index", {
    layout: "home",
    title: locale ? "Animated components for Vue" : "为 Vue 而生的动态组件",
  });
  put("guide", {
    layout: "guide",
    title: locale ? "Getting started" : "开始使用",
  });
  for (const page of sitePages)
    put(page.path.slice(1), {
      layout: "site-page",
      sitePage: page.slug,
      title: page.title[locale ? "en" : "zh"],
    });
  for (const category of catalog.categories) {
    put(route(category.slug), {
      layout: "category",
      category: category.slug,
      title: category.name,
    });
    for (const item of category.components)
      put(route(category.slug, item.slug), {
        layout: "component",
        category: category.slug,
        slug: item.slug,
        title: item.name,
      });
  }
}
console.log(
  `Generated bilingual home, guide, ${catalog.categories.length} category and ${catalog.categories.reduce((total, category) => total + category.components.length, 0)} component pages.`,
);
