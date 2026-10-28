import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import catalog from "../catalog/components.json";
import apiData from "./component-docs.json";
import type { ComponentDocs } from "./component-docs-types";
import { publicUsage } from "./public-usage-browser";
import { demoDependencies } from "./usage-dependencies";
import { buildComponentMarkdown } from "./component-markdown";
import { getLocalizedDetails } from "../../apps/docs/app/docs/details";
import { descriptions } from "../../apps/docs/app/docs/i18n";

export function buildMarkdownPages(
  options: { root?: string; origin?: string } = {},
) {
  const root = resolve(options.root ?? process.cwd());
  const origin = new URL(
    options.origin ??
      process.env.ORVUI_REGISTRY_ORIGIN ??
      "https://orvui.efu.me",
  ).origin;
  const docs = apiData as unknown as ComponentDocs;
  const paths: string[] = [];
  for (const category of catalog.categories)
    for (const component of category.components) {
      const key = `${category.slug}/${component.slug}`,
        api = docs.entries[key],
        snippets = publicUsage.entries[key];
      if (!api || !snippets)
        throw new Error(`Missing API or public Usage for ${key}`);
      const usage = {
        default: snippets.default.code,
        ...Object.fromEntries(
          Object.entries(snippets.variants).map(([key, value]) => [
            key,
            value.code,
          ]),
        ),
      };
      const registryUsage = Object.fromEntries(
        Object.entries({ default: snippets.default, ...snippets.variants }).map(
          ([key, value]) =>
            [
              key,
              {
                code: value.registryCode,
                installSlugs: value.registryInstallSlugs,
                extraDependencies: value.registryExtraDependencies,
              },
            ] as const,
        ),
      );
      const installSlugs = Array.from(
        new Set(
          Object.values(registryUsage).flatMap((value) => value.installSlugs),
        ),
      );
      const dependencies = Array.from(
        new Set(
          installSlugs.flatMap(
            (slug) =>
              JSON.parse(
                readFileSync(
                  resolve(root, `apps/docs/public/r/${slug}.json`),
                  "utf8",
                ),
              ).dependencies ?? [],
          ),
        ),
      );
      const route = `/${category.slug === "charts" ? "charts" : `components/${category.slug}`}/${component.slug}`;
      for (const en of [false, true]) {
        const path = `${en ? "/en" : ""}${route}.md`,
          file = resolve(root, `apps/docs/public${path}`);
        const markdown = buildComponentMarkdown({
          category,
          component,
          api,
          usage,
          registryUsage,
          demoDependencies: Array.from(
            new Set(
              Object.values({
                default: snippets.default,
                ...snippets.variants,
              }).flatMap(demoDependencies),
            ),
          ),
          details: getLocalizedDetails(category.slug, component.slug, en),
          pageUrl: origin + path.slice(0, -3),
          registryBaseUrl: origin,
          locale: en ? "en" : "zh",
          description: en
            ? component.description.replace(/\bReact\b/g, "Vue")
            : descriptions[component.slug] || component.description,
          dependencies,
          productVersion: catalog.product.version,
        });
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, markdown);
        paths.push(path);
      }
    }
  return {
    components: catalog.categories.reduce(
      (sum, category) => sum + category.components.length,
      0,
    ),
    locales: 2,
    pages: paths.length,
    origin,
    paths,
  };
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const { paths, ...summary } = buildMarkdownPages();
  console.log(JSON.stringify(summary, null, 2));
}
