import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import { TableOfContents } from "../index";

let wrapper: VueWrapper | undefined;
let article: HTMLElement;
let frames: Map<number, FrameRequestCallback>;
let serial: number;
let disconnect: ReturnType<typeof vi.fn>;
const items = [
  { id: "toc-first", label: "First" },
  { id: "toc-next", label: "Next", level: 3 as const },
];
let positions: Record<string, number>;
async function flush() {
  await nextTick();
  const callbacks = [...frames.values()];
  frames.clear();
  callbacks.forEach((callback) => callback(performance.now()));
  await nextTick();
}
beforeEach(() => {
  frames = new Map();
  serial = 0;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++serial, callback);
    return serial;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  }));
  disconnect = vi.fn();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect = disconnect;
    },
  );
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  window.history.replaceState({}, "", "/?example=1");
  article = document.createElement("article");
  article.id = "toc-article";
  positions = { "toc-first": 40, "toc-next": 600 };
  for (const item of items) {
    const heading = document.createElement("h2");
    heading.id = item.id;
    heading.getClientRects = () => [{ height: 32 }] as unknown as DOMRectList;
    heading.getBoundingClientRect = () =>
      ({ top: positions[item.id], height: 32 }) as DOMRect;
    article.append(heading);
  }
  document.body.append(article);
});
afterEach(() => {
  wrapper?.unmount();
  wrapper = undefined;
  article.remove();
  window.history.replaceState({}, "", "/");
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
it("tracks scoped sections without adding browser history entries", async () => {
  const push = vi.spyOn(window.history, "pushState");
  wrapper = mount(TableOfContents, {
    props: { items, target: "#toc-article" },
  });
  await flush();
  expect(wrapper.get('[aria-current="location"]').text()).toBe("First");
  positions["toc-next"] = 80;
  window.dispatchEvent(new Event("scroll"));
  await flush();
  expect(wrapper.get('[aria-current="location"]').text()).toBe("Next");
  expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["toc-next"]);
  expect(push).not.toHaveBeenCalled();
});
it("navigates with the offset, preserves query/router state, and leaves modified links native", async () => {
  window.history.replaceState({ router: "keep" }, "", "/?example=1");
  wrapper = mount(TableOfContents, {
    props: { items, target: "#toc-article" },
  });
  await flush();
  await wrapper.get('a[href="#toc-next"]').trigger("click", { button: 0 });
  expect(window.location.search).toBe("?example=1");
  expect(window.location.hash).toBe("#toc-next");
  expect(window.history.state).toEqual({ router: "keep" });
  expect(window.scrollTo).toHaveBeenLastCalledWith({
    top: 512,
    behavior: "instant",
  });
  vi.mocked(window.scrollTo).mockClear();
  await wrapper
    .get('a[href="#toc-first"]')
    .trigger("click", { button: 0, ctrlKey: true });
  expect(window.scrollTo).not.toHaveBeenCalled();
});
it("supports controlled selection and custom item content", async () => {
  wrapper = mount(TableOfContents, {
    props: { items, target: "#toc-article", modelValue: "toc-next" },
    slots: { item: "<strong>{{ params.item.label }}</strong>" },
  });
  await flush();
  expect(wrapper.get('[aria-current="location"]').text()).toBe("Next");
  expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["toc-first"]);
  await wrapper.setProps({ modelValue: "toc-first" });
  expect(wrapper.get('[aria-current="location"]').text()).toBe("First");
});
it("keeps a clicked near-end section selected when scrolling is clamped at the bottom", async () => {
  Object.defineProperty(window, "scrollY", { value: 1200, configurable: true });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    value: 1200 + window.innerHeight,
    configurable: true,
  });
  positions["toc-first"] = 160;
  positions["toc-next"] = window.innerHeight - 80;
  wrapper = mount(TableOfContents, {
    props: { items, target: "#toc-article" },
  });
  await flush();
  await wrapper.get('a[href="#toc-first"]').trigger("click", { button: 0 });
  await flush();
  expect(wrapper.get('[aria-current="location"]').text()).toBe("First");
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  delete (document.documentElement as unknown as Record<string, unknown>)
    .scrollHeight;
});
it("restores a deep link and removes observers, listeners and pending frames", async () => {
  window.history.replaceState({}, "", "/#toc-next");
  wrapper = mount(TableOfContents, {
    props: { items, target: "#toc-article" },
  });
  await flush();
  expect(window.scrollTo).toHaveBeenCalledWith({
    top: 512,
    behavior: "instant",
  });
  const remove = vi.spyOn(window, "removeEventListener");
  wrapper.unmount();
  expect(disconnect).toHaveBeenCalled();
  window.dispatchEvent(new Event("scroll"));
  await flush();
  expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
  expect(frames.size).toBe(0);
  wrapper = undefined;
});
