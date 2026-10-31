import { describe, expect, it } from "vitest";
import {
  componentDetails,
  componentDetailsBaseline,
  getComponentAbout,
  getLocalizedDetails,
  getComponentGuide,
  relatedComponents,
} from "../apps/docs/app/utils/docs/details";
import catalog from "../tools/catalog/components.json";
import { zhAboutByCategory } from "../apps/docs/app/utils/docs/details/zh-about";
import { zhGuideExtras } from "../apps/docs/app/utils/docs/details/zh-guide-extras";
describe("fixed component documentation baseline", () => {
  it("provides 109 owned About entries and 18 public composition guides", () => {
    expect(componentDetails).toHaveLength(109);
    expect(componentDetails.filter((item) => item.guide)).toHaveLength(18);
    expect(
      new Set(componentDetails.map((item) => `${item.category}/${item.slug}`))
        .size,
    ).toBe(109);
    for (const category of catalog.categories)
      for (const component of category.components) {
        const item = componentDetails.find(
          (item) =>
            item.category === category.slug && item.slug === component.slug,
        )!;
        expect(item.about.overview.length).toBeGreaterThan(40);
        expect(item.about.accessibility.length).toBeGreaterThan(40);
        expect(item.about.useWhen.length).toBeGreaterThan(0);
        expect(item.about.faq.length).toBeGreaterThan(0);
        expect(item.dates.updatedAt).toMatch(/^2026-\d\d-\d\d$/);
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
  it("translates all 18 complete Markdown guide sections while retaining lifecycle and principle structure", () => {
    expect(Object.keys(zhGuideExtras)).toHaveLength(18);
    for (const record of componentDetails.filter((item) => item.guide)) {
      const source = getComponentGuide(record.category, record.slug, true)!;
      const translated = getComponentGuide(
        record.category,
        record.slug,
        false,
      )!;
      expect(translated.lifecycle, record.slug).toHaveLength(
        source.lifecycle.length,
      );
      expect(translated.principles, record.slug).toHaveLength(
        source.principles.length,
      );
      for (const paragraph of [
        ...translated.lifecycle.flatMap((item) => [
          item.title,
          item.description,
        ]),
        ...translated.principles.flatMap((item) => [
          item.title,
          item.description,
        ]),
        translated.implementation.title,
        translated.implementation.description,
        translated.contract.owns,
        translated.contract.leaves,
        translated.guidance.useWhen,
        translated.guidance.avoidWhen,
      ])
        expect(paragraph, record.slug).toMatch(/[\u4e00-\u9fff]/);
      expect(Object.keys(translated).sort()).toEqual(
        Object.keys(source).sort(),
      );
      expect(translated.composition.tree).toBe(source.composition.tree);
      expect(
        getLocalizedDetails(record.category, record.slug, false)!.guide,
      ).toEqual(translated);
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
      motion: 54,
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
  it("documents native Vue bindings and scoped slots", () => {
    expect(getComponentAbout("motion", "aspect-ratio")!.faq[0].answer).toContain(':ratio="16 / 9"');
    expect(getComponentAbout("motion", "multi-select")!.faq[0].answer).toContain("modelValue as a string array");
    expect(getComponentAbout("charts", "returns-calendar")!.faq[0].answer).toContain("scoped default slot");
    expect(getComponentAbout("agents", "streaming-response")!.faq[0].answer).toContain("default slot");
  });
  it("uses the original family scores, terms and circular tie-breaker for three related cards", () => {
    expect(
      relatedComponents("motion", "range-slider").map((item) => item.slug),
    ).toEqual(["wheel-picker", "switch", "input"]);
    expect(
      relatedComponents("agents", "message").map((item) => item.slug),
    ).toEqual(["message-scroller", "chat-app", "message-bubble"]);
    expect(
      relatedComponents("blocks", "prediction-market").map((item) => item.slug),
    ).toEqual(["wallet-card", "swap", "feedback-widget"]);
    expect(
      relatedComponents("charts", "heat-calendar").map((item) => item.slug),
    ).toEqual(["returns-calendar", "price-target-fan", "treemap"]);
  });
  it("owns its native Vue content rather than transforming another framework's documentation", () => {
    expect(componentDetailsBaseline).toBe(componentDetails);
    expect(getComponentAbout("motion", "range-slider")!.faq[0].answer).toContain("modelValue with update:modelValue");
    expect(getComponentAbout("motion", "breadcrumb")!.faq[0].answer).toContain("as prop");
    expect(getComponentAbout("motion", "theme-toggle")!.faq[0].answer).toContain("useThemeToggle composable");
    for (const record of componentDetails) expect(JSON.stringify(record.about)).not.toMatch(/onValueChange|onOpenChange|React|Next\.js/);
  });
});
