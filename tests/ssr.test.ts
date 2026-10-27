// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import { createSSRApp, type Component } from "vue";
import { renderToString } from "@vue/server-renderer";
import catalog from "../tools/catalog/components.json";
const demos = {
  ...import.meta.glob("../packages/vue/src/**/demo.vue", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../packages/vue/src/**/examples/*.vue", {
    eager: true,
    import: "default",
  }),
} as Record<string, Component>;
describe("component examples render on the server", () => {
  it("includes every catalog root and registered example", () => {
    for (const category of catalog.categories)
      for (const item of category.components) {
        const base = `../packages/vue/src/${category.slug}/${item.slug}`;
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
      const html = await renderToString(createSSRApp(Demo));
      expect(html.length).toBeGreaterThan(10);
      expect(html).not.toContain("[object Object]");
      const errors = warn.mock.calls.filter(
        (c) =>
          String(c[0]).includes("injection") ||
          String(c[0]).includes("Unhandled"),
      );
      warn.mockRestore();
      expect(errors).toEqual([]);
    });
});
