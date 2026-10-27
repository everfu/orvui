import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import {
  componentPath,
  docsPath,
} from "../apps/docs/.vitepress/theme/docs-routes";
import SiteNavigation from "../apps/docs/.vitepress/theme/SiteNavigation.vue";

const wrappers: VueWrapper[] = [];
beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    })),
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.unstubAllGlobals();
});

it("keeps Web component URLs stable in both languages", () => {
  expect(componentPath("motion", "button")).toBe("/components/motion/button");
  expect(componentPath("charts", "bump-chart", true)).toBe(
    "/en/charts/bump-chart",
  );
  expect(docsPath("/docs/installation", true)).toBe("/en/docs/installation");
  expect(docsPath("/en/guide", false)).toBe("/guide");
});

it.each([false, true])(
  "keeps introduction and installation reachable in restored navigation (en=%s)",
  (en) => {
    const prefix = en ? "/en" : "";
    const wrapper = mount(SiteNavigation, {
      props: { pathname: `${prefix}/docs/installation`, en },
      global: {
        stubs: {
          SharedLayoutBg: { template: "<div><slot /></div>" },
          NewBadge: true,
          Tooltip: { template: "<div><slot /></div>" },
        },
      },
    });
    wrappers.push(wrapper);
    expect(wrapper.get(`a[href="${prefix}/guide"]`).text()).toBe(
      en ? "Introduction" : "介绍",
    );
    expect(wrapper.get(`a[href="${prefix}/docs/installation"]`).text()).toBe(
      en ? "Installation" : "安装指南",
    );
    expect(
      wrapper
        .get(`a[href="${prefix}/docs/installation"]`)
        .attributes("aria-current"),
    ).toBe("page");
    expect(wrapper.find(`a[href="${prefix}/docs/theme"]`).exists()).toBe(true);
    expect(wrapper.find(`a[href="${prefix}/docs/openui"]`).exists()).toBe(true);
  },
);
