import { beforeAll, afterAll, describe, it, expect, vi } from "vitest";
import { createSSRApp, nextTick, type Component } from "vue";
import { renderToString } from "@vue/server-renderer";
import catalog from "../tools/catalog/components.json";

const examples = {
  ...import.meta.glob("../packages/vue/src/**/demo.vue", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../packages/vue/src/**/examples/*.vue", {
    eager: true,
    import: "default",
  }),
} as Record<string, Component>;
const nativeAnimate = Element.prototype.animate;
beforeAll(() => {
  // happy-dom does not implement canceled WAAPI promises. Motion still uses its JS scheduler.
  Object.defineProperty(Element.prototype, "animate", {
    value: undefined,
    configurable: true,
  });
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("reduced-motion"),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});
afterAll(() => {
  Object.defineProperty(Element.prototype, "animate", {
    value: nativeAnimate,
    configurable: true,
  });
  vi.unstubAllGlobals();
});

describe("all catalog examples retain their server structure during hydration", () => {
  it("covers the 109 roots and all 72 explicitly registered examples", () => {
    for (const category of catalog.categories)
      for (const item of category.components) {
        const base = `../packages/vue/src/${category.slug}/${item.slug}`;
        expect(examples[`${base}/demo.vue`]).toBeTruthy();
        for (const example of ("examples" in item ? item.examples : []) ?? [])
          expect(examples[`${base}/examples/${example.slug}.vue`]).toBeTruthy();
      }
  });
  for (const [path, Example] of Object.entries(examples))
    it(path, async () => {
      const host = document.createElement("div");
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      let app: ReturnType<typeof createSSRApp> | undefined;
      try {
        host.innerHTML = await renderToString(createSSRApp(Example));
        document.body.append(host);
        app = createSSRApp(Example);
        app.mount(host);
        for (let i = 0; i < 6; i++) await nextTick();
        const messages = [...warn.mock.calls, ...error.mock.calls]
          .flat()
          .map(String)
          .join("\n");
        expect(messages).not.toMatch(
          /hydration|mismatch|injection.*not found|Unhandled error/i,
        );
        expect(host.querySelector(".demo-error")).toBeNull();
      } finally {
        app?.unmount();
        host.remove();
        warn.mockRestore();
        error.mockRestore();
      }
    });
});
