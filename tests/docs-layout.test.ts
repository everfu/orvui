import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import {
  componentPath,
  docsPath,
} from "../apps/docs/app/utils/docs/docs-routes";
import SiteNavigation from "../apps/docs/app/components/docs/SiteNavigation.vue";
import DocsNavigation from "../apps/docs/app/components/docs/DocsNavigation.vue";

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

it.each([false, true])(
  "groups every category and reopens the current route without changing the homepage navigation (en=%s)",
  async (en) => {
    const prefix = en ? "/en" : "";
    const wrapper = mount(DocsNavigation, {
      props: {
        category: "charts",
        pathname: prefix + "/charts/donut-chart",
        en,
      },
      global: {
        stubs: {
          SharedLayoutBg: { template: "<div><slot /></div>" },
          NewBadge: true,
        },
      },
    });
    wrappers.push(wrapper);
    expect(wrapper.findAll(".docs-nav-group-trigger")).toHaveLength(11);
    expect(wrapper.find(".category-filter-rail").exists()).toBe(false);
    expect(wrapper.get('a[aria-current="page"]').attributes("href")).toBe(
      prefix + "/charts/donut-chart",
    );
    const group = wrapper.findAll(".docs-nav-group-trigger").at(-1)!;
    expect(group.attributes("aria-expanded")).toBe("true");
    await group.trigger("click");
    expect(group.attributes("aria-expanded")).toBe("false");
    await wrapper.setProps({
      category: "motion",
      pathname: prefix + "/components/motion/switch",
    });
    expect(
      wrapper
        .findAll(".docs-nav-group-trigger")
        .find((trigger) => /表单|Forms/.test(trigger.text()))!
        .attributes("aria-expanded"),
    ).toBe("true");
    expect(wrapper.get('a[aria-current="page"]').attributes("href")).toBe(
      prefix + "/components/motion/switch",
    );
  },
);
