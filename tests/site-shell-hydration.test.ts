import { h, createSSRApp, nextTick } from "vue";
import { renderToString } from "@vue/server-renderer";
import { flushPromises } from "@vue/test-utils";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  it,
  vi,
} from "vitest";
const current = vi.hoisted(() => ({
  path: "/components/motion/switch",
  frontmatter: { category: "motion", slug: "switch" },
}));
import SiteLayout from "../apps/docs/app/components/docs/SiteLayout.vue";
import DocsPageContent from "../apps/docs/app/components/docs/DocsPageContent.vue";

// Exercise the same shell/page composition used by Nuxt, including its slot.
const Layout = (props: InstanceType<typeof SiteLayout>["$props"]) =>
  h(SiteLayout, props, { default: () => h(DocsPageContent) });
const nativeAnimate = Element.prototype.animate;
let app: ReturnType<typeof createSSRApp> | undefined;
let host: HTMLDivElement | undefined;
beforeAll(() => {
  Object.defineProperty(Element.prototype, "animate", {
    value: function (this: Element, ...args: Parameters<Element["animate"]>) {
      const animation = nativeAnimate.apply(this, args);
      // Happy DOM rejects finished on cancellation; Motion owns onfinish instead.
      void animation.finished.catch(() => {});
      return animation;
    },
    configurable: true,
  });
});
afterAll(() => {
  Object.defineProperty(Element.prototype, "animate", {
    value: nativeAnimate,
    configurable: true,
  });
});
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("reduced-motion"),
      media: query,
      addEventListener() {},
      removeEventListener() {},
    })),
  );
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
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
});
afterEach(() => {
  app?.unmount();
  host?.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
it.each([false, true])(
  "hydrates the lazy component document and shell landmarks en=%s",
  async (en) => {
    current.path = `${en ? "/en" : ""}/components/motion/switch`;
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    host = document.createElement("div");
    host.innerHTML = await renderToString(
      createSSRApp(Layout, {
        frontmatter: current.frontmatter,
        route: current,
        router: { go: async () => {} },
      }),
    );
    document.body.append(host);
    app = createSSRApp(Layout, {
      frontmatter: current.frontmatter,
      route: current,
      router: { go: async () => {} },
    });
    app.mount(host);
    await flushPromises();
    await nextTick();
    expect(host.querySelector("header.site-header")).toBeTruthy();
    expect(host.querySelector("aside.docs-sidebar")).toBeTruthy();
    expect(host.querySelector("main#docs-content h1")?.textContent).toBe(
      "Switch",
    );
    expect(host.querySelector("aside.docs-resources")).toBeTruthy();
    expect(host.querySelector(".preview-stage .demo-content")).toBeTruthy();
    expect(host.querySelector(".demo-error")).toBeNull();
    const messages = [...warn.mock.calls, ...error.mock.calls]
      .flat()
      .map(String)
      .join("\n");
    expect(messages).not.toMatch(
      /hydration|mismatch|injection.*not found|Unhandled error/i,
    );
  },
);
