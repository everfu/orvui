import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { mount } from "@vue/test-utils";
import { createSSRApp, defineComponent, nextTick } from "vue";
import { renderToString } from "@vue/server-renderer";
import NewBadge from "../apps/docs/app/docs/NewBadge.vue";
import CategoryPage from "../apps/docs/app/docs/CategoryPage.vue";
import SiteSearch from "../apps/docs/app/docs/SiteSearch.vue";
import SiteNavigation from "../apps/docs/app/docs/SiteNavigation.vue";
import type { CatalogCategory } from "../tools/registry/types";
import {
  getNewBadgeRemainingMs,
  isComponentNew,
  NEW_BADGE_DURATION_MS,
} from "../apps/docs/app/docs/new-badge";

const mounted: { unmount: () => void }[] = [];
const nativeAnimate = Element.prototype.animate;
beforeAll(() => {
  // Vue's first client mount creates its own 3s devtools discovery timer.
  // Finish that bootstrap before measuring application timer ownership.
  vi.useFakeTimers();
  mount(defineComponent({ render: () => null })).unmount();
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});
beforeEach(() => {
  // Happy DOM rejects finished on cancel; Motion consumes onfinish instead.
  vi.spyOn(Element.prototype, "animate").mockImplementation(function (
    this: Element,
    ...args: Parameters<Element["animate"]>
  ) {
    const animation = nativeAnimate.apply(this, args);
    void animation.finished.catch(() => undefined);
    return animation;
  });
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-26T23:59:59.990Z"));
});
afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});
function badge(launchedAt?: string) {
  const wrapper = mount(NewBadge, { props: { launchedAt } });
  mounted.push(wrapper);
  return wrapper;
}
function categoryFixture(): CatalogCategory {
  return {
    slug: "motion",
    name: "Motion",
    description: "",
    components: [
      { slug: "old", name: "Old", file: "", description: "Old example" },
      {
        slug: "fresh",
        name: "Fresh",
        file: "",
        description: "New example",
        badge: "new",
        launchedAt: "2026-10-20",
      },
    ],
  };
}

describe("source seven-day New badge semantics", () => {
  it("uses UTC midnight, expires at the exact boundary, and rejects missing or invalid dates", () => {
    const launch = Date.parse("2026-10-20T00:00:00Z");
    expect(getNewBadgeRemainingMs("2026-10-20", launch)).toBe(
      NEW_BADGE_DURATION_MS,
    );
    expect(
      getNewBadgeRemainingMs("2026-10-20", launch + NEW_BADGE_DURATION_MS - 1),
    ).toBe(1);
    expect(
      isComponentNew(
        { badge: "new", launchedAt: "2026-10-20" },
        launch + NEW_BADGE_DURATION_MS,
      ),
    ).toBe(false);
    expect(getNewBadgeRemainingMs(undefined, launch)).toBe(0);
    expect(getNewBadgeRemainingMs("not-a-date", launch)).toBe(0);
    expect(isComponentNew({ launchedAt: "2026-10-20" }, launch)).toBe(false);
    // Upstream has no additional "already launched" condition.
    expect(
      isComponentNew({ badge: "new", launchedAt: "2026-10-21" }, launch),
    ).toBe(true);
  });

  it("hides a mounted badge at expiration without polling", async () => {
    const scheduled = vi.spyOn(globalThis, "setTimeout");
    const wrapper = badge("2026-10-20");
    await nextTick();
    expect(wrapper.get(".new-badge").text()).toBe("New");
    expect(scheduled).toHaveBeenCalledWith(expect.any(Function), 10);
    expect(vi.getTimerCount()).toBe(1);
    await vi.advanceTimersByTimeAsync(9);
    expect(wrapper.find(".new-badge").exists()).toBe(true);
    await vi.advanceTimersByTimeAsync(1);
    expect(wrapper.find(".new-badge").exists()).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("shares one nearest-expiration timer and releases it and listeners after the last instance", async () => {
    const addWindow = vi.spyOn(window, "addEventListener");
    const removeWindow = vi.spyOn(window, "removeEventListener");
    const addDocument = vi.spyOn(document, "addEventListener");
    const removeDocument = vi.spyOn(document, "removeEventListener");
    const first = badge("2026-10-20"),
      second = badge("2026-10-21"),
      third = badge("2026-10-21");
    await nextTick();
    expect(vi.getTimerCount()).toBe(1);
    expect(
      addWindow.mock.calls.filter(([name]) => name === "focus"),
    ).toHaveLength(1);
    expect(
      addDocument.mock.calls.filter(([name]) => name === "visibilitychange"),
    ).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(10);
    expect(first.find(".new-badge").exists()).toBe(false);
    expect(second.find(".new-badge").exists()).toBe(true);
    expect(third.find(".new-badge").exists()).toBe(true);
    expect(vi.getTimerCount()).toBe(1);
    first.unmount();
    second.unmount();
    expect(vi.getTimerCount()).toBe(1);
    third.unmount();
    expect(vi.getTimerCount()).toBe(0);
    const focus = addWindow.mock.calls.find(([name]) => name === "focus")!;
    const visibility = addDocument.mock.calls.find(
      ([name]) => name === "visibilitychange",
    )!;
    expect(removeWindow).toHaveBeenCalledWith("focus", focus[1]);
    expect(removeDocument).toHaveBeenCalledWith(
      "visibilitychange",
      visibility[1],
    );
  });

  it("reschedules for a changed launch date and catches a suspended tab clock jump", async () => {
    const wrapper = badge("2026-10-20");
    await wrapper.setProps({ launchedAt: "2026-10-21" });
    await vi.advanceTimersByTimeAsync(10);
    expect(wrapper.find(".new-badge").exists()).toBe(true);
    expect(vi.getTimerCount()).toBe(1);
    vi.setSystemTime(new Date("2026-10-28T00:00:00Z"));
    window.dispatchEvent(new Event("focus"));
    await nextTick();
    expect(wrapper.find(".new-badge").exists()).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
    await wrapper.setProps({ launchedAt: "invalid" });
    expect(wrapper.find(".new-badge").exists()).toBe(false);
    await wrapper.setProps({ launchedAt: "2026-10-28" });
    expect(wrapper.find(".new-badge").exists()).toBe(true);
  });

  it("does not overflow browser timeout limits for future source metadata", async () => {
    const schedule = vi.spyOn(globalThis, "setTimeout");
    const wrapper = badge("2099-01-01");
    await nextTick();
    expect(wrapper.find(".new-badge").exists()).toBe(true);
    expect(schedule.mock.calls.at(-1)?.[1]).toBe(2_147_483_647);
  });

  it("moves an expired category entry out of New and into All using the live clock", async () => {
    const wrapper = mount(CategoryPage, {
      props: { category: categoryFixture(), en: true },
    });
    mounted.push(wrapper);
    await nextTick();
    expect(
      wrapper.find('#new a[href="/en/components/motion/fresh"]').exists(),
    ).toBe(true);
    expect(wrapper.findAll(".new-badge")).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(10);
    expect(wrapper.find("#new").exists()).toBe(false);
    expect(
      wrapper.find('#all a[href="/en/components/motion/fresh"]').exists(),
    ).toBe(true);
    expect(wrapper.findAll(".new-badge")).toHaveLength(0);
  });

  it("removes a navigation badge at expiration while retaining its route and current-page semantics", async () => {
    vi.setSystemTime(new Date("2026-10-28T23:59:59.990Z"));
    const wrapper = mount(SiteNavigation, {
      props: {
        category: "charts",
        pathname: "/en/charts/sankey-chart",
        en: true,
      },
      global: {
        stubs: { SharedLayoutBg: { template: "<div><slot /></div>" } },
      },
    });
    mounted.push(wrapper);
    await nextTick();
    const link = 'a[href="/en/charts/sankey-chart"]';
    expect(wrapper.find(`${link} .new-badge`).exists()).toBe(true);
    expect(wrapper.get(link).attributes("aria-current")).toBe("page");
    await vi.advanceTimersByTimeAsync(10);
    expect(wrapper.find(`${link} .new-badge`).exists()).toBe(false);
    expect(wrapper.get(link).text()).toBe("Sankey Chart");
    expect(wrapper.get(link).attributes("aria-current")).toBe("page");
  });

  it("renders root and variant search badges and expires each own date", async () => {
    vi.setSystemTime(new Date("2026-09-15T23:59:59.990Z"));
    const animate = Element.prototype.animate;
    if (animate)
      vi.spyOn(Element.prototype, "animate").mockImplementation(function (
        this: Element,
        ...args: Parameters<Element["animate"]>
      ) {
        const animation = animate.apply(this, args);
        // happy-dom rejects canceled WAAPI promises during the palette teardown.
        void animation.finished.catch(() => undefined);
        return animation;
      });
    const wrapper = mount(SiteSearch, {
      props: { open: true, en: true },
      global: { stubs: { teleport: true } },
    });
    mounted.push(wrapper);
    await nextTick();
    await wrapper.get("input").setValue("slider");
    await nextTick();
    const option = (label: string) =>
      wrapper
        .findAll('[role="option"]')
        .find((row) => row.get(".site-search-result-label").text() === label)!;
    expect(option("Range Slider").find(".new-badge").exists()).toBe(true);
    expect(option("Inline Slider").find(".new-badge").exists()).toBe(true);
    expect(option("Ruler Slider").find(".new-badge").exists()).toBe(false);
    await vi.advanceTimersByTimeAsync(10);
    expect(option("Range Slider").find(".new-badge").exists()).toBe(false);
    expect(option("Inline Slider").find(".new-badge").exists()).toBe(false);
    expect(option("Range Slider").text()).toBe("Range Slider");
  });

  it("hydrates the source's hidden SSR badge before showing the current client state", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    host.innerHTML = await renderToString(
      createSSRApp(NewBadge, { launchedAt: "2026-10-20" }),
    );
    expect(host.querySelector(".new-badge")).toBeNull();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const app = createSSRApp(NewBadge, { launchedAt: "2026-10-20" });
    mounted.push(app);
    app.mount(host);
    await nextTick();
    expect(host.querySelector(".new-badge")?.textContent).toBe("New");
    expect(
      [...warn.mock.calls, ...error.mock.calls].flat().join(" "),
    ).not.toMatch(/hydration|mismatch/i);
    await vi.advanceTimersByTimeAsync(10);
    expect(host.querySelector(".new-badge")).toBeNull();
  });

  it("hydrates deterministic snapshot groups before applying an already expired client date", async () => {
    vi.setSystemTime(new Date("2030-01-01T00:00:00Z"));
    const props = { category: categoryFixture(), en: true };
    const host = document.createElement("div");
    document.body.append(host);
    host.innerHTML = await renderToString(createSSRApp(CategoryPage, props));
    expect(
      host.querySelector('#new a[href="/en/components/motion/fresh"]'),
    ).not.toBeNull();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const app = createSSRApp(CategoryPage, props);
    mounted.push(app);
    app.mount(host);
    await nextTick();
    expect(host.querySelector("#new")).toBeNull();
    expect(
      host.querySelector('#all a[href="/en/components/motion/fresh"]'),
    ).not.toBeNull();
    expect(
      [...warn.mock.calls, ...error.mock.calls].flat().join(" "),
    ).not.toMatch(/hydration|mismatch/i);
  });
});
