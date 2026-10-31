import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import CopyPage from "../../apps/docs/app/components/docs/CopyPage.vue";

const wrappers: VueWrapper[] = [];
const nativeAnimate = Element.prototype.animate;
let fetcher: ReturnType<typeof vi.fn>, writeText: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.useFakeTimers();
  window.matchMedia = vi
    .fn()
    .mockImplementation(() => ({
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
  fetcher = vi
    .fn()
    .mockResolvedValue({
      ok: true,
      text: async () => "# Complete page\n\n## API Reference",
    });
  vi.stubGlobal("fetch", fetcher);
  writeText = vi.fn().mockResolvedValue(undefined);
  vi.spyOn(navigator, "clipboard", "get").mockReturnValue({
    writeText,
  } as unknown as Clipboard);
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
function render(props: Record<string, unknown> = {}) {
  const wrapper = mount(CopyPage, {
    props: {
      pageUrl: "http://127.0.0.1:5173/components/motion/button",
      markdownPath: "/components/motion/button.md",
      componentName: "Button",
      ...props,
    },
    attachTo: document.body,
  });
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
async function openMenu(wrapper: VueWrapper, key = "ArrowDown") {
  await wrapper
    .find('[aria-label="More page actions"]')
    .trigger("keydown", { key });
  await settle();
  await vi.advanceTimersByTimeAsync(0);
  await settle();
}
const links = () =>
  Array.from(document.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]'));

it("fetches complete Markdown with a busy state, copies it, and resets after 1800ms", async () => {
  let resolve!: (response: object) => void;
  fetcher.mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  const wrapper = render();
  const button = wrapper.find('[aria-label="Copy page as Markdown"]');
  await button.trigger("click");
  expect(button.attributes("aria-busy")).toBe("true");
  expect(button.attributes("disabled")).toBeDefined();
  expect(fetcher).toHaveBeenCalledWith(
    "/components/motion/button.md",
    expect.objectContaining({ signal: expect.any(AbortSignal) }),
  );
  resolve({
    ok: true,
    text: async () => "# Button\n\n## Usage\n\n## API Reference\n\n## About",
  });
  await settle();
  expect(writeText).toHaveBeenCalledWith(
    "# Button\n\n## Usage\n\n## API Reference\n\n## About",
  );
  expect(button.attributes("aria-label")).toBe("Page copied");
  expect(button.text()).toBe("Copy Page");
  await vi.advanceTimersByTimeAsync(1799);
  expect(button.attributes("aria-label")).toBe("Page copied");
  await vi.advanceTimersByTimeAsync(1);
  expect(button.attributes("aria-label")).toBe("Copy page as Markdown");
});
it("supports directly supplied guide Markdown without fetching", async () => {
  const wrapper = render({ markdown: "# Motion guide\n\nComplete guide body" });
  await wrapper.find('[aria-label="Copy page as Markdown"]').trigger("click");
  await settle();
  expect(fetcher).not.toHaveBeenCalled();
  expect(writeText).toHaveBeenCalledWith(
    "# Motion guide\n\nComplete guide body",
  );
});
it("shows a retry state after failed Markdown fetch or clipboard write", async () => {
  fetcher.mockResolvedValueOnce({ ok: false, status: 404 });
  const wrapper = render();
  await wrapper.find("button").trigger("click");
  await settle();
  expect(wrapper.find("button").attributes("aria-label")).toBe(
    "Copy failed. Try again",
  );
  expect(wrapper.find("button").text()).toBe("Try again");
  expect(writeText).not.toHaveBeenCalled();
  writeText.mockRejectedValueOnce(new Error("denied"));
  await wrapper.find("button").trigger("click");
  await settle();
  expect(wrapper.find("button").text()).toBe("Try again");
  await wrapper.find("button").trigger("click");
  await settle();
  expect(wrapper.find("button").attributes("aria-label")).toBe("Page copied");
});
it("renders the four page actions with sourced icons and current page prompts", async () => {
  const wrapper = render();
  await openMenu(wrapper);
  const actions = links();
  expect(actions.map((link) => link.textContent?.trim())).toEqual([
    "View as Markdown",
    "Open in v0",
    "Open in ChatGPT",
    "Open in Claude",
  ]);
  expect(actions[0].getAttribute("href")).toBe("/components/motion/button.md");
  expect(actions[1].querySelector("svg")?.getAttribute("viewBox")).toBe(
    "0 0 24 24",
  );
  expect(actions[1].querySelector("path")?.getAttribute("d")).toContain(
    "M14.066 6.028",
  );
  for (const [index, host] of [
    [1, "v0.dev"],
    [2, "chatgpt.com"],
    [3, "claude.ai"],
  ] as const) {
    const url = new URL(actions[index].href);
    expect(url.host).toBe(host);
    expect(url.searchParams.get("q")).toContain(
      "orvui component documentation: http://127.0.0.1:5173/components/motion/button",
    );
    expect(actions[index].target).toBe("_blank");
    expect(actions[index].rel).toBe("noopener noreferrer");
  }
});
it("opens at either menu edge, wraps keyboard navigation and restores trigger focus on Escape", async () => {
  const wrapper = render();
  const trigger = wrapper.find('[aria-label="More page actions"]');
  await openMenu(wrapper);
  const actions = links();
  expect(document.activeElement).toBe(actions[0]);
  actions[0].dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "ArrowUp",
      bubbles: true,
      cancelable: true,
    }),
  );
  expect(document.activeElement).toBe(actions[3]);
  actions[3].dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
      cancelable: true,
    }),
  );
  expect(document.activeElement).toBe(actions[0]);
  actions[0].dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "End",
      bubbles: true,
      cancelable: true,
    }),
  );
  expect(document.activeElement).toBe(actions[3]);
  actions[3].dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Home",
      bubbles: true,
      cancelable: true,
    }),
  );
  expect(document.activeElement).toBe(actions[0]);
  actions[0].dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    }),
  );
  await settle();
  expect(trigger.attributes("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(trigger.element);
  await openMenu(wrapper, "ArrowUp");
  expect(document.activeElement).toBe(links()[3]);
});
it("closes an activated link and preserves normal link behavior without automatically opening a service", async () => {
  const wrapper = render();
  await openMenu(wrapper);
  const link = links()[2];
  link.addEventListener("click", (event) => event.preventDefault(), {
    once: true,
  });
  link.click();
  await settle();
  expect(
    wrapper
      .find('[aria-label="More page actions"]')
      .attributes("aria-expanded"),
  ).toBe("false");
  expect(document.activeElement).toBe(
    wrapper.find('[aria-label="More page actions"]').element,
  );
});
it("aborts a pending fetch and never copies after unmount", async () => {
  let resolve!: (response: object) => void;
  fetcher.mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  const wrapper = render();
  await wrapper.find("button").trigger("click");
  const signal = fetcher.mock.calls[0][1].signal as AbortSignal;
  wrapper.unmount();
  wrappers.splice(wrappers.indexOf(wrapper), 1);
  expect(signal.aborted).toBe(true);
  resolve({ ok: true, text: async () => "late" });
  await settle();
  expect(writeText).not.toHaveBeenCalled();
});
it("clears reset and scheduled menu-focus timers on unmount", async () => {
  const scheduled = vi.spyOn(globalThis, "setTimeout"),
    clear = vi.spyOn(globalThis, "clearTimeout");
  const wrapper = render({ markdown: "# Page" });
  await wrapper.find("button").trigger("click");
  await settle();
  await wrapper
    .find('[aria-label="More page actions"]')
    .trigger("keydown", { key: "ArrowDown" });
  const reset = scheduled.mock.calls.findIndex(([, delay]) => delay === 1800);
  expect(reset).toBeGreaterThanOrEqual(0);
  const resetId = scheduled.mock.results[reset].value;
  wrapper.unmount();
  wrappers.splice(wrappers.indexOf(wrapper), 1);
  expect(clear).toHaveBeenCalledWith(resetId);
  expect(
    clear.mock.calls.some(([id]) => id !== resetId && id !== undefined),
  ).toBe(true);
});
it("localizes copy feedback and all menu labels without translating API names", async () => {
  const wrapper = render({ en: false, markdown: "# 组件" });
  await wrapper.find('[aria-label="复制页面 Markdown"]').trigger("click");
  await settle();
  expect(wrapper.find('[aria-label="页面已复制"]').text()).toBe("复制页面");
  await wrapper
    .find('[aria-label="更多页面操作"]')
    .trigger("keydown", { key: "ArrowDown" });
  await settle();
  await vi.advanceTimersByTimeAsync(0);
  expect(links().map((link) => link.textContent?.trim())).toEqual([
    "查看 Markdown",
    "在 v0 中打开",
    "在 ChatGPT 中打开",
    "在 Claude 中打开",
  ]);
});
