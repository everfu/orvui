import { describe, expect, it } from "vitest";
import {
  componentDetails,
  getComponentAbout,
  getComponentGuide,
  getLocalizedDetails,
} from "../../apps/docs/app/utils/docs/details";
import { zhAboutByCategory } from "../../apps/docs/app/utils/docs/details/zh-about";
import catalog from "../../tools/catalog/components.json";
describe("fixed component documentation baseline", () => {
  it("provides 110 owned About entries and 18 public composition guides", () => {
    expect(componentDetails).toHaveLength(110);
    expect(componentDetails.filter((item) => item.guide)).toHaveLength(18);
    expect(
      new Set(componentDetails.map((item) => `${item.category}/${item.slug}`))
        .size,
    ).toBe(110);
    for (const category of catalog.categories)
      for (const component of category.components) {
        const item = componentDetails.find(
          (item) =>
            item.category === category.slug && item.slug === component.slug,
        )!;
        expect(item.about.overview).toBeTruthy();
        expect(item.about.accessibility).toBeTruthy();
        expect(item.about.useWhen.length).toBeGreaterThan(0);
        expect(item.about.faq.length).toBeGreaterThan(0);
        expect(item.dates.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(JSON.stringify(item.about)).not.toMatch(
          /React|Next\.js|Framer Motion|onValueChange|onOpenChange|render prop/,
        );
      }
  });
  it("translates every displayed guide and every connection without changing its composition tree", () => {
    for (const record of componentDetails.filter((item) => item.guide)) {
      const guide = getComponentGuide(record.category, record.slug, false)!;
      expect(guide.introduction).toMatch(/[\u4e00-\u9fff]/);
      expect(guide.composition.description).toMatch(/[\u4e00-\u9fff]/);
      expect(guide.composition.tree).toBe(record.guide!.composition.tree);
      expect(guide.connections.map((c) => c.slug)).toEqual(
        record.guide!.connections.map((c) => c.slug),
      );
      for (const connection of guide.connections)
        expect(connection.description).toMatch(/[\u4e00-\u9fff]/);
    }
  });
  it("provides a complete Chinese translation of every About paragraph, use case and FAQ", () => {
    expect(
      Object.fromEntries(
        Object.entries(zhAboutByCategory).map(([category, records]) => [
          category,
          Object.keys(records).length,
        ]),
      ),
    ).toEqual({
      motion: 55,
      blocks: 23,
      agents: 18,
      charts: 14,
    });
    for (const record of componentDetails) {
      const translated = getComponentAbout(
        record.category,
        record.slug,
        false,
      )!;
      expect(translated, record.slug).toBeDefined();
      expect(Object.keys(translated).sort()).toEqual(
        Object.keys(record.about).sort(),
      );
      expect(translated.useWhen, record.slug).toHaveLength(
        record.about.useWhen.length,
      );
      expect(translated.faq, record.slug).toHaveLength(record.about.faq.length);
      for (const paragraph of [
        translated.overview,
        translated.accessibility,
        ...translated.useWhen,
        ...translated.faq.flatMap((item) => [item.question, item.answer]),
      ]) {
        expect(paragraph, record.slug).toMatch(/[\u4e00-\u9fff]/);
        expect(paragraph, record.slug).not.toMatch(
          /React|Next\.js|onValueChange|onOpenChange/,
        );
      }
      expect(getComponentAbout(record.category, record.slug, true)).toBe(
        record.about,
      );
      expect(
        getLocalizedDetails(record.category, record.slug, false)!.about,
      ).toBe(translated);
      expect(
        getLocalizedDetails(record.category, record.slug, true)!.about,
      ).toBe(record.about);
    }
    expect(getComponentAbout("unknown", "timeline", false)).toBeUndefined();
  });
});
