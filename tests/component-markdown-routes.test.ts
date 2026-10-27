import { expect, it } from "vitest";
import {
  buildComponentMarkdown,
  type ComponentMarkdownInput,
} from "../tools/registry/component-markdown";
import catalog from "../tools/catalog/components.json";
import apiData from "../tools/registry/component-docs.json";
import type { ComponentDocs } from "../tools/registry/component-docs-types";
import { publicUsage } from "../tools/registry/public-usage-browser";
import { getLocalizedDetails } from "../apps/docs/.vitepress/theme/details";
import type { CatalogCategory } from "../tools/registry/types";

const categories = catalog.categories as CatalogCategory[];

function input(
  categorySlug: string,
  componentSlug: string,
  en: boolean,
): ComponentMarkdownInput {
  const category = categories.find((item) => item.slug === categorySlug)!;
  const component = category.components.find(
    (item) => item.slug === componentSlug,
  )!;
  const entry = publicUsage.entries[`${categorySlug}/${componentSlug}`]!;
  const route = `/${en ? "en/" : ""}${categorySlug === "charts" ? "charts" : `components/${categorySlug}`}/${componentSlug}`;
  return {
    category,
    component,
    api: (apiData as unknown as ComponentDocs).entries[
      `${categorySlug}/${componentSlug}`
    ]!,
    usage: {
      default: entry.default.code,
      ...Object.fromEntries(
        Object.entries(entry.variants).map(([slug, entry]) => [
          slug,
          entry.code,
        ]),
      ),
    },
    details: getLocalizedDetails(categorySlug, componentSlug, en),
    pageUrl: "https://orvui.example" + route,
    registryBaseUrl: "https://orvui.example",
    locale: en ? "en" : "zh",
  };
}
it.each([true, false])(
  "resolves AnimatedSidebar's actual AISidebar category while preserving locale en=%s",
  (en) => {
    const markdown = buildComponentMarkdown(
      input("motion", "animated-sidebar", en),
    );
    expect(markdown).toContain(
      `[AI Sidebar](https://orvui.example/${en ? "en/" : ""}components/agents/ai-sidebar)`,
    );
    expect(markdown).not.toContain("/components/motion/ai-sidebar");
  },
);
it.each([true, false])(
  "resolves a Chart guide connection to /charts while preserving locale en=%s",
  (en) => {
    const value = input("motion", "animated-sidebar", en);
    value.details = {
      ...value.details!,
      guide: {
        ...value.details!.guide!,
        connections: [
          {
            slug: "sankey-chart",
            name: "SankeyChart",
            description: en ? "Weighted flows." : "带权流量。",
          },
        ],
      },
    };
    const markdown = buildComponentMarkdown(value);
    expect(markdown).toContain(
      `[SankeyChart](https://orvui.example/${en ? "en/" : ""}charts/sankey-chart)`,
    );
    expect(markdown).not.toContain("/components/charts/");
    expect(markdown).not.toContain("/components/motion/sankey-chart");
  },
);
it("retains the real default and each registered variant Usage in all 109 static documents", () => {
  let roots = 0,
    variants = 0;
  for (const category of categories)
    for (const component of category.components) {
      const value = input(category.slug, component.slug, false);
      const markdown = buildComponentMarkdown(value);
      expect(markdown, `${category.slug}/${component.slug}/default`).toContain(
        value.usage.default!.trimEnd(),
      );
      for (const example of component.examples ?? []) {
        expect(
          value.usage[example.slug],
          `${component.slug}/${example.slug}`,
        ).toBeTruthy();
        expect(markdown, `${component.slug}/${example.slug}`).toContain(
          value.usage[example.slug]!.trimEnd(),
        );
        variants++;
      }
      expect(markdown, component.slug).toContain(value.details!.about.overview);
      roots++;
    }
  expect(roots).toBe(109);
  expect(variants).toBe(72);
});
