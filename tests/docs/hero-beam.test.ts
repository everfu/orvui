import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { h, nextTick } from "vue";
import HeroBeam from "../../apps/docs/app/components/docs/HeroBeam.vue";

type Media = {
  matches: boolean;
  listeners: Set<() => void>;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
};
const wrappers: VueWrapper[] = [],
  media = new Map<string, Media>();
const observers: {
  callback: IntersectionObserverCallback;
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  options?: IntersectionObserverInit;
}[] = [];
beforeEach(() => {
  window.matchMedia = vi.fn((query) => {
    if (!media.has(query)) {
      const record = {
        matches: false,
        listeners: new Set<() => void>(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
      record.addEventListener.mockImplementation(
        (_event: string, listener: () => void) =>
          record.listeners.add(listener),
      );
      record.removeEventListener.mockImplementation(
        (_event: string, listener: () => void) =>
          record.listeners.delete(listener),
      );
      media.set(query, record);
    }
    return media.get(query) as unknown as MediaQueryList;
  });
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe = vi.fn();
      disconnect = vi.fn();
      constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit,
      ) {
        observers.push({
          callback,
          options,
          observe: this.observe,
          disconnect: this.disconnect,
        });
      }
    },
  );
});
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  document.documentElement.classList.remove("dark");
  document.body.innerHTML = "";
  media.clear();
  observers.length = 0;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function render() {
  const wrapper = mount(HeroBeam, {
    slots: {
      default: () =>
        h("button", { style: { borderTopLeftRadius: "24px" } }, "Install"),
    },
    attachTo: document.body,
  });
  wrappers.push(wrapper);
  return wrapper;
}
async function preference(query: string, matches: boolean) {
  const record = media.get(query)!;
  record.matches = matches;
  record.listeners.forEach((listener) => listener());
  await nextTick();
}
it("uses OS auto-theme independently of page theme and measures its child radius", async () => {
  document.documentElement.classList.add("dark");
  const wrapper = render();
  await nextTick();
  const css = () => wrapper.find("style").element.innerHTML;
  expect(css()).toContain("border-radius: 24px");
  expect(css()).toContain("* 0.12 * var(--beam-stroke-opacity");
  await preference("(prefers-color-scheme: dark)", true);
  expect(css()).toContain("* 0.26 * var(--beam-stroke-opacity");
  expect(css()).toContain("rgba(255, 255, 255, 0.27)");
});
it("pauses off-screen work, resumes when visible, and honors reduced motion", async () => {
  const wrapper = render();
  await nextTick();
  const beam = wrapper.find("[data-beam]");
  expect(observers[0].options).toEqual({ rootMargin: "256px" });
  expect(observers[0].observe).toHaveBeenCalledWith(beam.element);
  expect(beam.attributes("data-active")).toBe("");
  observers[0].callback(
    [{ isIntersecting: false } as IntersectionObserverEntry],
    {} as IntersectionObserver,
  );
  await nextTick();
  expect(beam.attributes("data-paused")).toBe("");
  observers[0].callback(
    [{ isIntersecting: true } as IntersectionObserverEntry],
    {} as IntersectionObserver,
  );
  await nextTick();
  expect(beam.attributes("data-paused")).toBeUndefined();
  await preference("(prefers-reduced-motion: reduce)", true);
  expect(beam.attributes("data-active")).toBeUndefined();
  await preference("(prefers-reduced-motion: reduce)", false);
  expect(beam.attributes("data-active")).toBe("");
});
it("releases both media subscriptions and its observer on unmount", async () => {
  const wrapper = render();
  await nextTick();
  const records = [...media.values()];
  expect(records).toHaveLength(2);
  wrapper.unmount();
  wrappers.splice(wrappers.indexOf(wrapper), 1);
  expect(observers[0].disconnect).toHaveBeenCalledOnce();
  for (const record of records) {
    const listener = record.addEventListener.mock.calls[0][1];
    expect(record.removeEventListener).toHaveBeenCalledWith("change", listener);
    expect(record.listeners.size).toBe(0);
  }
});
