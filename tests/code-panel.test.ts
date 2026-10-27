import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import CodePanel from "../apps/docs/.vitepress/theme/CodePanel.vue";
import { Button } from "../packages/vue/src/motion/button";

const highlighting = vi.hoisted(() => ({
  deferred: false,
  pending: [] as { resolve: (value: object) => void }[],
}));
vi.mock("../apps/docs/.vitepress/theme/highlight", () => ({
  getHighlighter: vi.fn(() =>
    highlighting.deferred
      ? new Promise<object>((resolve) => highlighting.pending.push({ resolve }))
      : Promise.resolve({}),
  ),
  highlightCode: (_highlighter: unknown, code: string, lang: string) =>
    `<pre class="shiki" data-lang="${lang}"><code>${code.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</code></pre>`,
}));

const wrappers: VueWrapper[] = [];
const observers: {
  callback: ResizeObserverCallback;
  disconnect: ReturnType<typeof vi.fn>;
}[] = [];
const nativeAnimate = Element.prototype.animate;
let height = 480;
let writeText: ReturnType<typeof vi.fn>;
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
      disconnect = vi.fn();
      constructor(callback: ResizeObserverCallback) {
        observers.push({ callback, disconnect: this.disconnect });
      }
      observe() {}
    },
  );
  vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(
    () => height,
  );
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
  height = 480;
  highlighting.deferred = false;
  highlighting.pending.length = 0;
  observers.length = 0;
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function render(props: Record<string, unknown>) {
  const wrapper = mount(CodePanel, {
    props: { code: "const answer = 42", ...props },
  });
  wrappers.push(wrapper);
  return wrapper;
}
async function settle() {
  await nextTick();
  await Promise.resolve();
  await nextTick();
}

it("shows the complete filename and source language badge while keeping file labels compatible", async () => {
  const wrapper = render({
    filename: "components/orvui/button/Button.vue",
    label: "Vue",
  });
  await settle();
  expect(wrapper.find(".code-language").text()).toBe("VUE");
  expect(wrapper.find(".code-file-path").text()).toBe(
    "components/orvui/button/Button.vue",
  );
  expect(wrapper.find(".code-file-name").text()).toBe("Button.vue");
  expect(wrapper.findComponent(Button).props()).toMatchObject({
    variant: "secondary",
    size: "icon",
    pressScale: 0.97,
  });
  await wrapper.setProps({ filename: undefined, label: "style.css" });
  await settle();
  expect(wrapper.find(".code-language").text()).toBe("CSS");
  expect(wrapper.find("pre").attributes("data-lang")).toBe("css");
});
it("uses the source floating copy button when no filename is supplied", async () => {
  const wrapper = render({ label: "Terminal", code: "pnpm add @orvui/vue" });
  await settle();
  expect(wrapper.find(".code-file-header").exists()).toBe(false);
  expect(wrapper.find(".code-copy-floating button").exists()).toBe(true);
  expect(wrapper.find("pre").attributes("data-lang")).toBe("bash");
});
it("measures long content, expands once, and releases its observer on unmount", async () => {
  const wrapper = render({
    code: Array.from({ length: 40 }, (_, index) => `line ${index}`).join("\n"),
  });
  await settle();
  expect(wrapper.find(".code-scroll").classes()).toContain("is-collapsed");
  expect(wrapper.find(".code-expand-gradient").exists()).toBe(true);
  await wrapper.find(".code-expand-button").trigger("click");
  expect(wrapper.find(".code-scroll").classes()).toContain("is-expanded");
  expect(wrapper.find(".code-expand-gradient").exists()).toBe(false);
  wrapper.unmount();
  wrappers.splice(wrappers.indexOf(wrapper), 1);
  expect(observers[0].disconnect).toHaveBeenCalledOnce();
});
it("does not crop short content and reacts to subsequent resize measurements", async () => {
  height = 200;
  const wrapper = render({ code: "short" });
  await settle();
  expect(wrapper.find(".code-scroll").classes()).toContain("is-short");
  expect(wrapper.find(".code-expand-button").exists()).toBe(false);
  height = 500;
  observers[0].callback([], {} as ResizeObserver);
  await nextTick();
  expect(wrapper.find(".code-scroll").classes()).toContain("is-collapsed");
  expect(wrapper.find(".code-expand-button").text()).toBe("Expand Code");
});
it("copies the current source and restarts the 1500ms copied feedback", async () => {
  const wrapper = render({ code: "first" });
  await wrapper.find("button").trigger("click");
  await settle();
  expect(writeText).toHaveBeenLastCalledWith("first");
  expect(wrapper.find("button").attributes("aria-label")).toBe("Copied");
  await vi.advanceTimersByTimeAsync(1000);
  await wrapper.setProps({ code: "next" });
  await wrapper.find("button").trigger("click");
  await settle();
  expect(writeText).toHaveBeenLastCalledWith("next");
  await vi.advanceTimersByTimeAsync(1499);
  expect(wrapper.find("button").attributes("aria-label")).toBe("Copied");
  await vi.advanceTimersByTimeAsync(1);
  expect(wrapper.find("button").attributes("aria-label")).toBe("Copy code");
});
it("keeps a failed clipboard attempt retryable without a false copied state", async () => {
  writeText.mockRejectedValueOnce(new Error("clipboard denied"));
  const wrapper = render({});
  await wrapper.find("button").trigger("click");
  await settle();
  expect(wrapper.find('[role="status"]').text()).toContain(
    "Clipboard unavailable",
  );
  expect(wrapper.find("button").attributes("aria-label")).toBe("Copy code");
  await wrapper.find("button").trigger("click");
  await settle();
  expect(wrapper.find('[role="status"]').exists()).toBe(false);
  expect(wrapper.find("button").attributes("aria-label")).toBe("Copied");
});
it("ignores older async highlight results after a language/source change", async () => {
  highlighting.deferred = true;
  const wrapper = render({ filename: "old.ts", code: "old" });
  await nextTick();
  await wrapper.setProps({ filename: "next.css", code: "next" });
  highlighting.pending[1].resolve({});
  await settle();
  expect(wrapper.find("pre").attributes("data-lang")).toBe("css");
  expect(wrapper.find("pre").text()).toBe("next");
  highlighting.pending[0].resolve({});
  await settle();
  expect(wrapper.find("pre").text()).toBe("next");
});
it("does not schedule copied feedback after a pending clipboard operation is unmounted", async () => {
  let resolve!: () => void;
  writeText.mockImplementation(
    () =>
      new Promise<void>((done) => {
        resolve = done;
      }),
  );
  const wrapper = render({});
  await wrapper.find("button").trigger("click");
  wrapper.unmount();
  wrappers.splice(wrappers.indexOf(wrapper), 1);
  const timers = vi.getTimerCount();
  resolve();
  await settle();
  expect(vi.getTimerCount()).toBeLessThanOrEqual(timers);
});
it("clears the source copy-feedback timeout on unmount", async () => {
  const timeouts = vi.spyOn(globalThis, "setTimeout");
  const clear = vi.spyOn(globalThis, "clearTimeout");
  const wrapper = render({});
  await wrapper.find("button").trigger("click");
  await settle();
  const feedback = timeouts.mock.calls.findIndex(([, delay]) => delay === 1500);
  expect(feedback).toBeGreaterThanOrEqual(0);
  const timer = timeouts.mock.results[feedback].value;
  wrapper.unmount();
  wrappers.splice(wrappers.indexOf(wrapper), 1);
  expect(clear).toHaveBeenCalledWith(timer);
});
