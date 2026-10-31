// @vitest-environment node
import { renderToString } from "@vue/server-renderer";
import { describe, expect, it, vi } from "vitest";
import { createSSRApp, type Component } from "vue";
import catalog from "../../tools/catalog/components.json";
const demos = {
  ...import.meta.glob("../../packages/vue/src/**/demo.vue", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../../packages/vue/src/**/examples/*.vue", {
    eager: true,
    import: "default",
  }),
} as Record<string, Component>;
describe("component examples render on the server", () => {
  it("includes every catalog root and registered example", () => {
    for (const category of catalog.categories)
      for (const item of category.components) {
        const base = `../../packages/vue/src/${category.slug}/${item.slug}`;
        expect(demos[`${base}/demo.vue`]).toBeTruthy();
        for (const example of ("examples" in item ? item.examples : []) ?? [])
          expect(demos[`${base}/examples/${example.slug}.vue`]).toBeTruthy();
      }
  });
  for (const [path, Demo] of Object.entries(demos))
    it(path, async () => {
      expect(typeof window).toBe("undefined");
      expect(typeof HTMLElement).toBe("undefined");
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      try {
        const html = await renderToString(createSSRApp(Demo));
        expect(html.length).toBeGreaterThan(10);
        expect(html).not.toContain("[object Object]");
        expect(html).not.toContain("NaN");
        expect(warn.mock.calls.flat().join(" ")).not.toMatch(
          /injection|Unhandled/i,
        );
      } finally {
        warn.mockRestore();
      }
    });
});
