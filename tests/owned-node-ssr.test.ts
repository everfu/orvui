// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import { createSSRApp, type Component } from "vue";
import { renderToString } from "@vue/server-renderer";
const examples = import.meta.glob(
  [
    "../packages/vue/src/charts/*/demo.vue",
    "../packages/vue/src/motion/{number,select,popover,date-range-picker,color-picker,image-viewer}/examples/*.vue",
    "../packages/vue/src/agents/{ai-sidebar,chat-app}/demo.vue",
    "../packages/vue/src/agents/{ai-sidebar,chat-app}/examples/*.vue",
  ],
  { eager: true, import: "default" },
) as Record<string, Component>;
describe("owned examples in a real server environment", () => {
  for (const [path, Demo] of Object.entries(examples))
    it(path, async () => {
      expect(typeof window).toBe("undefined");
      expect(typeof HTMLElement).toBe("undefined");
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      try {
        const html = await renderToString(createSSRApp(Demo));
        expect(html.length).toBeGreaterThan(10);
        expect(html).not.toContain("[object Object]");
        expect(warn.mock.calls.flat().join(" ")).not.toMatch(
          /injection|Unhandled/i,
        );
      } finally {
        warn.mockRestore();
      }
    });
});
