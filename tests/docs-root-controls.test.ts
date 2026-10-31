import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import SiteSearch from "../apps/docs/app/components/docs/SiteSearch.vue";
import SiteNavigation from "../apps/docs/app/components/docs/SiteNavigation.vue";
import SiteInstallCommand from "../apps/docs/app/components/docs/SiteInstallCommand.vue";
import SiteInstallBlock from "../apps/docs/app/components/docs/SiteInstallBlock.vue";
import CategoryPage from "../apps/docs/app/components/docs/CategoryPage.vue";
import catalog from "../tools/catalog/components.json";
import { getSitePage } from "../apps/docs/app/utils/docs/site-page-data";
import type { CatalogCategory } from "../tools/registry/types";

const wrappers: VueWrapper[] = [];
const nativeAnimate = Element.prototype.animate;
let copy: ReturnType<typeof vi.fn>, fetcher: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.useFakeTimers();
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  Element.prototype.scrollIntoView = vi.fn();
  copy = vi.fn().mockResolvedValue(undefined);
  vi.spyOn(navigator, "clipboard", "get").mockReturnValue({
    writeText: copy,
  } as unknown as Clipboard);
  fetcher = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      dependencies: ["motion-v"],
      files: [
        {
          path: "Button.vue",
          target: "components/orvui/Button.vue",
          content: "<template><button>One</button></template>",
        },
        {
          path: "helper.ts",
          target: "components/orvui/helper.ts",
          content: "export const answer = 42",
        },
      ],
    }),
  });
  vi.stubGlobal("fetch", fetcher);
  if (nativeAnimate)
    vi.spyOn(Element.prototype, "animate").mockImplementation(function (
      this: Element,
      ...args: Parameters<Element["animate"]>
    ) {
      const animation = nativeAnimate.apply(this, args);
      void animation.finished.catch(() => undefined);
      return animation;
    });
});
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  document.body.innerHTML = "";
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function render(component: any, props: Record<string, unknown>) {
  const wrapper = mount(component, { props, attachTo: document.body });
  wrappers.push(wrapper);
  return wrapper;
}
async function settle() {
  await nextTick();
  await Promise.resolve();
  await nextTick();
  await Promise.resolve();
  await nextTick();
}
async function query(value: string) {
  const input = document.querySelector<HTMLInputElement>('[role="combobox"]')!;
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await settle();
  return input;
}
const options = () =>
  Array.from(document.querySelectorAll<HTMLButtonElement>('[role="option"]'));
function key(element: Element, value: string) {
  element.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: value,
      bubbles: true,
      cancelable: true,
    }),
  );
}

it("searches registered Ruler Slider usage and navigates to its locale-preserving hash", async () => {
  const wrapper = render(SiteSearch, { open: true, en: true });
  await settle();
  const input = await query("Ruler Slider");
  expect(options()[0].textContent).toBe("Ruler Slider");
  key(input, "Enter");
  await settle();
  expect(wrapper.emitted("navigate")?.at(-1)).toEqual([
    "/en/components/motion/range-slider#ruler",
  ]);
  expect(wrapper.emitted("update:open")?.at(-1)).toEqual([false]);
  await query("range-slider-ruler");
  const aliasResult = options().find(
    (option) => option.textContent === "Ruler Slider",
  );
  expect(aliasResult).toBeDefined();
  aliasResult!.click();
  await settle();
  expect(wrapper.emitted("navigate")?.at(-1)).toEqual([
    "/en/components/motion/range-slider#ruler",
  ]);
});
it("keeps fuzzy results useful while requiring every query word", async () => {
  render(SiteSearch, { open: true, en: true });
  await settle();
  await query("rler");
  expect(
    options().some((option) => option.textContent === "Ruler Slider"),
  ).toBe(true);
  await query("ruler impossibleword");
  expect(options()).toHaveLength(0);
  expect(document.querySelector('[role="dialog"]')?.textContent).toContain(
    "No results found.",
  );
});
it("searches supporting pages in both locales and uses their actual routes", async () => {
  const wrapper = render(SiteSearch, { open: true, en: false });
  await settle();
  expect(document.querySelector<HTMLInputElement>("input")?.placeholder).toBe(
    "搜索组件…",
  );
  await query("主题设置");
  options()
    .find((option) => option.textContent === "主题设置")!
    .click();
  await settle();
  expect(wrapper.emitted("navigate")?.at(-1)).toEqual(["/docs/theme"]);
  await wrapper.setProps({ en: true });
  await query("OpenUI");
  options()
    .find((option) => option.textContent === getSitePage("openui").title.en)!
    .click();
  await settle();
  expect(wrapper.emitted("navigate")?.at(-1)).toEqual(["/en/docs/openui"]);
});
it("finds the Web installation guide in both languages", async () => {
  const wrapper = render(SiteSearch, { open: true, en: false });
  await settle();
  await query("安装指南");
  options()
    .find(
      (option) => option.textContent === getSitePage("installation").title.zh,
    )!
    .click();
  await settle();
  expect(wrapper.emitted("navigate")?.at(-1)).toEqual(["/docs/installation"]);
  await wrapper.setProps({ en: true });
  await query("installation");
  options()
    .find(
      (option) => option.textContent === getSitePage("installation").title.en,
    )!
    .click();
  await settle();
  expect(wrapper.emitted("navigate")?.at(-1)).toEqual([
    "/en/docs/installation",
  ]);
});
it("preserves the navigation filter on an intra-category route change and exposes the current link", async () => {
  const wrapper = render(SiteNavigation, {
    category: "motion",
    pathname: "/en/components/motion/button",
    en: true,
  });
  await wrapper.find('[role="tab"][aria-label="Components"]').trigger("click");
  await wrapper.setProps({ pathname: "/en/components/motion/input" });
  expect(
    wrapper
      .find('[role="tab"][aria-label="Components"]')
      .attributes("aria-selected"),
  ).toBe("true");
  expect(
    wrapper
      .find('a[href="/en/components/motion/input"]')
      .attributes("aria-current"),
  ).toBe("page");
  expect(
    wrapper
      .find('a[href="/en/components/agents/prompt-input"]')
      .element.closest("[hidden]"),
  ).not.toBeNull();
  expect(
    wrapper
      .find('a[href="/en/components/motion/input"]')
      .element.closest("[hidden]"),
  ).toBeNull();
});
it("supports roving category keys in both text directions without navigating a component", async () => {
  const wrapper = render(SiteNavigation, {
    category: "motion",
    pathname: "/en/components/motion/button",
    en: true,
  });
  const all = wrapper.find('[role="tab"][aria-label="All"]');
  (all.element as HTMLElement).focus();
  key(all.element, "ArrowRight");
  await settle();
  expect(
    wrapper
      .find('[role="tab"][aria-label="Agents"]')
      .attributes("aria-selected"),
  ).toBe("true");
  expect(document.activeElement).toBe(
    wrapper.find('[role="tab"][aria-label="Agents"]').element,
  );
  key(document.activeElement!, "End");
  await settle();
  expect(
    wrapper
      .find('[role="tab"][aria-label="Blocks"]')
      .attributes("aria-selected"),
  ).toBe("true");
  key(document.activeElement!, "Home");
  await settle();
  const section = wrapper.find("section").element as HTMLElement;
  section.style.direction = "rtl";
  key(document.activeElement!, "ArrowRight");
  await settle();
  expect(
    wrapper
      .find('[role="tab"][aria-label="Blocks"]')
      .attributes("aria-selected"),
  ).toBe("true");
  expect(wrapper.emitted("navigate")).toBeUndefined();
});
it("isolates chart navigation from component guides and updates localized hrefs", async () => {
  const wrapper = render(SiteNavigation, {
    category: "charts",
    pathname: "/en/charts/area-chart",
    en: true,
  });
  expect(wrapper.find('[role="tablist"]').exists()).toBe(false);
  expect(wrapper.find('a[href="/en/docs/ai-agents"]').exists()).toBe(false);
  expect(wrapper.find('a[href="/en/charts"]').exists()).toBe(true);
  expect(wrapper.find('a[href^="/en/components/"]').exists()).toBe(false);
  await wrapper.setProps({
    category: "motion",
    pathname: "/docs/motion-patterns",
    en: false,
  });
  expect(
    wrapper.find('a[href="/docs/motion-patterns"]').attributes("aria-current"),
  ).toBe("page");
  expect(
    wrapper.find('[role="tab"][aria-label="全部"]').attributes("aria-selected"),
  ).toBe("true");
});
it("copies the selected package-manager command at the mounted origin", async () => {
  const wrapper = render(SiteInstallCommand, { slug: "button", en: true });
  const expectations = {
    bun: "bunx --bun",
    npm: "npx",
    pnpm: "pnpm dlx",
    yarn: "yarn dlx",
  };
  for (const [manager, runner] of Object.entries(expectations)) {
    await wrapper
      .find(`[role="tab"][data-tabs-value="${manager}"]`)
      .trigger("click");
    await wrapper.find(".command-copy").trigger("click");
    await settle();
    expect(copy).toHaveBeenLastCalledWith(
      `${runner} shadcn-vue@2.8.2 add ${window.location.origin}/r/button.json`,
    );
  }
});
it("cycles valid aliases only when no fixed slug is supplied and releases its interval", async () => {
  const clear = vi.spyOn(globalThis, "clearInterval"),
    scheduled = vi.spyOn(globalThis, "setInterval");
  const wrapper = render(SiteInstallCommand, { en: true });
  await wrapper.find(".command-copy").trigger("click");
  await settle();
  const first = copy.mock.calls.at(-1)![0] as string;
  await vi.advanceTimersByTimeAsync(1800);
  await wrapper.find(".command-copy").trigger("click");
  await settle();
  const second = copy.mock.calls.at(-1)![0] as string;
  expect(first).toMatch(/\/r\/timeline\.json$/);
  expect(second).toMatch(/\/r\/alert\.json$/);
  await wrapper.setProps({ slug: "range-slider-ruler" });
  await vi.advanceTimersByTimeAsync(3600);
  await wrapper.find(".command-copy").trigger("click");
  await settle();
  expect(copy).toHaveBeenLastCalledWith(
    `bunx --bun shadcn-vue@2.8.2 add ${window.location.origin}/r/range-slider-ruler.json`,
  );
  const interval =
    scheduled.mock.results[
      scheduled.mock.calls.findIndex(([, delay]) => delay === 1800)
    ].value;
  wrapper.unmount();
  wrappers.splice(wrappers.indexOf(wrapper), 1);
  expect(clear).toHaveBeenCalledWith(interval);
});
it("keeps clipboard failures retryable and resets successful install feedback after two seconds", async () => {
  copy.mockRejectedValueOnce(new Error("clipboard denied"));
  const scheduled = vi.spyOn(globalThis, "setTimeout"),
    clear = vi.spyOn(globalThis, "clearTimeout");
  const wrapper = render(SiteInstallCommand, { slug: "button", en: false });
  await wrapper.find(".command-copy").trigger("click");
  await settle();
  expect(wrapper.find('[role="status"]').text()).toContain("剪贴板不可用");
  expect(wrapper.find(".command-copy").attributes("aria-label")).toBe(
    "复制命令",
  );
  await wrapper.find(".command-copy").trigger("click");
  await settle();
  expect(wrapper.find('[role="status"]').exists()).toBe(false);
  expect(wrapper.find(".command-copy").attributes("aria-label")).toBe("已复制");
  await vi.advanceTimersByTimeAsync(1999);
  expect(wrapper.find(".command-copy").attributes("aria-label")).toBe("已复制");
  await vi.advanceTimersByTimeAsync(1);
  expect(wrapper.find(".command-copy").attributes("aria-label")).toBe(
    "复制命令",
  );
  await wrapper.find(".command-copy").trigger("click");
  await settle();
  const at = scheduled.mock.calls
    .map(([, delay], index) => (delay === 2000 ? index : -1))
    .filter((index) => index >= 0)
    .at(-1)!;
  const timer = scheduled.mock.results[at].value;
  wrapper.unmount();
  wrappers.splice(wrappers.indexOf(wrapper), 1);
  expect(clear).toHaveBeenCalledWith(timer);
});
it("clears feedback timers and does not start a new one if a clipboard promise resolves after unmount", async () => {
  let resolveCopy!: () => void;
  copy.mockImplementation(
    () =>
      new Promise<void>((done) => {
        resolveCopy = done;
      }),
  );
  const timeout = vi.spyOn(globalThis, "setTimeout");
  const wrapper = render(SiteInstallCommand, { slug: "button", en: true });
  await wrapper.find(".command-copy").trigger("click");
  wrapper.unmount();
  wrappers.splice(wrappers.indexOf(wrapper), 1);
  const before = timeout.mock.calls.filter(
    ([, delay]) => delay === 2000,
  ).length;
  resolveCopy();
  await settle();
  expect(timeout.mock.calls.filter(([, delay]) => delay === 2000)).toHaveLength(
    before,
  );
});
it("shows the CLI command without a manual installation tab or source-file request", async () => {
  const wrapper = render(SiteInstallBlock, { slug: "button", en: true });
  await settle();
  expect(wrapper.find('[data-tabs-value="manual"]').exists()).toBe(false);
  expect(wrapper.find("select.source-select").exists()).toBe(false);
  expect(fetcher).not.toHaveBeenCalled();
  expect(wrapper.findComponent(SiteInstallCommand).props("slug")).toBe(
    "button",
  );
  await wrapper.find('[role="tab"][data-tabs-value="pnpm"]').trigger("click");
  await wrapper.find(".command-copy").trigger("click");
  expect(copy).toHaveBeenLastCalledWith(
    `pnpm dlx shadcn-vue@2.8.2 add ${window.location.origin}/r/button.json`,
  );
});
it("groups agent components by their actual interaction roles and localized routes", async () => {
  const agents = catalog.categories.find(
    (category) => category.slug === "agents",
  ) as CatalogCategory;
  const wrapper = render(CategoryPage, { category: agents, en: true });
  const cases = [
    ["conversation", "Prompts and conversation", "prompt-input"],
    ["responses", "Answers and supporting sources", "citations"],
    ["progress", "Tasks and activity", "agent-activity"],
    ["tools", "Tool output and files", "file-diff"],
    ["human-control", "Review and decisions", "tool-approval"],
  ];
  for (const [id, title, slug] of cases) {
    expect(wrapper.find(`#${id} h2`).text()).toBe(title);
    expect(
      wrapper.find(`#${id} a[href="/en/components/agents/${slug}"]`).exists(),
    ).toBe(true);
  }
  await wrapper.setProps({ en: false });
  expect(wrapper.find("#human-control h2").text()).toBe("审核与决策");
  expect(
    wrapper
      .find('#conversation a[href="/components/agents/prompt-input"]')
      .exists(),
  ).toBe(true);
});
it("separates current New entries from all other cards at the live seven-day boundary", async () => {
  vi.setSystemTime(new Date("2026-10-25T00:00:00Z"));
  const entry = (slug: string, launchedAt?: string, badge?: string) => ({
    slug,
    name: slug,
    description: "A React example",
    file: "",
    launchedAt,
    badge,
  });
  const category: CatalogCategory = {
    slug: "motion",
    name: "Motion",
    description: "",
    components: [
      entry("old"),
      entry("fresh", "2026-10-20", "new"),
      entry("boundary", "2026-10-18", "new"),
      entry("missing-date", undefined, "new"),
      entry("unbadged", "2026-10-25"),
    ],
  };
  const wrapper = render(CategoryPage, { category, en: true });
  await settle();
  expect(
    wrapper.find('#new a[href="/en/components/motion/fresh"]').exists(),
  ).toBe(true);
  expect(wrapper.find("#new .new-badge").text()).toBe("New");
  for (const slug of ["old", "boundary", "missing-date", "unbadged"])
    expect(
      wrapper.find(`#all a[href="/en/components/motion/${slug}"]`).exists(),
    ).toBe(true);
  expect(wrapper.find("#all").text()).not.toContain("fresh");
  expect(wrapper.find("#all p").text()).toBe("A Vue example");
});
