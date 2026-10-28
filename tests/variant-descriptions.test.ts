import { expect, it } from "vitest";
import catalog from "../tools/catalog/components.json";
import type { CatalogCategory } from "../tools/registry/types";
import {
  getVariantDescription,
  variantDescriptionsZh,
} from "../apps/docs/app/docs/variant-descriptions";

it("provides a complete Chinese translation for every registered description, with English preserved", () => {
  const entries = (catalog.categories as CatalogCategory[]).flatMap(
    (category) =>
      category.components.flatMap((component) =>
        (component.examples ?? []).flatMap((example) =>
          example.description
            ? [{ category: category.slug, slug: component.slug, example }]
            : [],
        ),
      ),
  );
  expect(entries).toHaveLength(72);
  expect(Object.keys(variantDescriptionsZh).sort()).toEqual(
    entries
      .map(
        ({ category, slug, example }) => `${category}/${slug}/${example.slug}`,
      )
      .sort(),
  );
  for (const { category, slug, example } of entries) {
    const translated = getVariantDescription(
      category,
      slug,
      example.slug,
      false,
      example.description!,
    );
    expect(translated, `${category}/${slug}/${example.slug}`).toMatch(
      /[\u3400-\u9fff]/,
    );
    expect(translated).not.toBe(example.description);
    expect(translated).not.toMatch(/·\s*演示|组件示例|此示例展示/);
    expect(
      getVariantDescription(
        category,
        slug,
        example.slug,
        true,
        example.description!,
      ),
    ).toBe(example.description);
  }
});

it("retains concrete behavior and public API details rather than generic example labels", () => {
  expect(
    getVariantDescription("motion", "range-slider", "ruler", false, ""),
  ).toContain("指针固定");
  expect(
    getVariantDescription("motion", "table", "async", false, ""),
  ).toContain("onEndReached");
  expect(
    getVariantDescription("motion", "select", "morph", false, ""),
  ).toContain("共享 layoutId");
  expect(
    getVariantDescription(
      "blocks",
      "knockout-bracket",
      "knockout-bracket",
      false,
      "",
    ),
  ).toContain("季军赛");
  expect(
    getVariantDescription("agents", "agent-activity", "agent-trace", false, ""),
  ).toContain("工具调用数和消息数");
});

it("preserves the supplied fallback for an unknown variant or a missing translation", () => {
  expect(
    getVariantDescription(
      "motion",
      "button",
      "future",
      false,
      "Future behavior.",
    ),
  ).toBe("Future behavior.");
  expect(
    getVariantDescription(
      "unknown",
      "button",
      "base",
      false,
      "Caller fallback",
    ),
  ).toBe("Caller fallback");
});
