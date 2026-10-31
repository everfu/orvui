import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { descriptions } from "../../apps/docs/app/utils/docs/i18n";
import catalogData from "../../tools/catalog/components.json";
import { createDocsPages } from "../../apps/docs/app/utils/docs/route-manifest";
import type { ProductCatalog } from "../../tools/registry/types";
const docsRoutes = new Set(createDocsPages().map((page) => page.path));
const catalog = catalogData as ProductCatalog;

describe("orvui product catalog contract", () => {
  it("owns four categories, 110 stable components and 72 registered variants", () => {
    expect(catalog.schemaVersion).toBe(2);
    expect(catalog.product.name).toBe("orvui");
    expect(
      Object.fromEntries(
        catalog.categories.map((category) => [
          category.slug,
          category.components.length,
        ]),
      ),
    ).toEqual({ motion: 55, charts: 14, agents: 18, blocks: 23 });
    expect(
      catalog.categories
        .flatMap((category) => category.components)
        .reduce((count, entry) => count + (entry.examples?.length ?? 0), 0),
    ).toBe(72);
    expect(catalog).not.toHaveProperty("sources");
  });
  it("keeps bilingual routes, unique install names, actual Vue barrels and example sources", () => {
    const names = new Set<string>();
    for (const category of catalog.categories)
      for (const item of category.components) {
        expect(names.has(item.slug), item.slug).toBe(false);
        names.add(item.slug);
        const route =
          category.slug === "charts"
            ? `charts/${item.slug}`
            : `components/${category.slug}/${item.slug}`;
        for (const locale of ["", "en/"])
          expect(docsRoutes.has("/" + locale + route), locale + route).toBe(
            true,
          );
        expect(descriptions[item.slug], item.slug).toBeTruthy();
        expect(item.file.endsWith("/index.ts")).toBe(true);
        expect(existsSync(item.file), item.file).toBe(true);
        expect(item).not.toHaveProperty("source");
        for (const example of item.examples ?? []) {
          expect(existsSync(example.file), example.file).toBe(true);
          expect(example).not.toHaveProperty("source");
        }
      }
  });
});
