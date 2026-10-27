import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { computed, defineComponent, h, nextTick, ref, shallowRef } from "vue";
import { motionValue } from "motion-v";
import type { TabsState } from "../src/context";
import { useTabsList } from "../src/list-state";

const wrappers: VueWrapper[] = [];
const observers: {
  callback: ResizeObserverCallback;
  disconnect: ReturnType<typeof vi.fn>;
}[] = [];

beforeEach(() => {
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
});

afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  observers.splice(0);
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

async function settle() {
  await nextTick();
  await nextTick();
  await nextTick();
}

function harness({
  variant = "pill",
  direction = "ltr",
  reduced = false,
  icons = "always",
}: {
  variant?: "pill" | "segment" | "underline";
  direction?: "ltr" | "rtl";
  reduced?: boolean;
  icons?: "always" | "selected";
} = {}) {
  const selected = ref("tab-0");
  const dimensions = { width: 320, content: 960 };
  let api!: ReturnType<typeof useTabsList>;
  let view!: HTMLElement;
  const scrollBy = vi.fn(function (
    options: ScrollToOptions | number = {},
    _y?: number,
  ) {
    const max = dimensions.content - dimensions.width;
    const next =
      view.scrollLeft +
      Number(typeof options === "number" ? options : (options.left ?? 0));
    view.scrollLeft =
      direction === "rtl"
        ? Math.max(-max, Math.min(0, next))
        : Math.max(0, Math.min(max, next));
    view.dispatchEvent(new Event("scroll"));
  });
  const rect = (left: number, width: number) => ({
    x: left,
    y: 0,
    left,
    top: 0,
    right: left + width,
    bottom: 40,
    width,
    height: 40,
    toJSON() {
      return {};
    },
  });
  const Component = defineComponent({
    setup() {
      const root = ref<HTMLElement | null>(null);
      const viewport = ref<HTMLElement | null>(null);
      const list = ref<HTMLElement | null>(null);
      const state: TabsState = {
        value: selected,
        id: "overflow-test",
        variant: computed(() => variant),
        icons: computed(() => icons),
        track: {
          x: motionValue(0),
          y: motionValue(0),
          width: motionValue(0),
          height: motionValue(0),
        },
        placed: ref(false),
        tabStop: computed(() => selected.value),
        tabs: shallowRef(new Map()),
        panels: shallowRef(new Set()),
        registerTab() {},
        unregisterTab() {},
        registerPanel() {},
        unregisterPanel() {},
        tabId: (value) => value,
        panelId: (value) => value,
      };
      api = useTabsList(state, ref(reduced), root, viewport, list);
      const setRoot = (element: unknown) => {
        root.value = element as HTMLElement | null;
        if (root.value)
          Object.defineProperty(root.value, "clientWidth", {
            configurable: true,
            get: () => dimensions.width,
          });
      };
      const setViewport = (element: unknown) => {
        viewport.value = element as HTMLElement | null;
        if (!viewport.value) return;
        view = viewport.value;
        Object.defineProperties(view, {
          clientWidth: { configurable: true, get: () => dimensions.width },
          scrollWidth: { configurable: true, get: () => dimensions.content },
        });
        view.getBoundingClientRect = () => rect(100, dimensions.width);
        view.scrollBy = scrollBy;
      };
      const setTab = (index: number) => (element: unknown) => {
        if (!element) return;
        const tab = element as HTMLElement;
        tab.getBoundingClientRect = () => {
          const icon = tab.querySelector<HTMLElement>("[data-tabs-icon]");
          const extra = icon
            ? (icon.style.width === "auto"
                ? 14
                : parseFloat(icon.style.width) || 0) +
              (parseFloat(icon.style.marginRight) || 0)
            : 0;
          return rect(
            direction === "rtl"
              ? 100 + dimensions.width - 4 - index * 120 - 112 - view.scrollLeft
              : 104 + index * 120 - view.scrollLeft,
            112 + extra,
          );
        };
        if (icons === "selected" && tab.parentElement) {
          tab.parentElement.getBoundingClientRect = () =>
            tab.getBoundingClientRect();
        }
      };
      const setIcon = (element: unknown) => {
        if (!element || (element as HTMLElement).style.width) return;
        Object.assign((element as HTMLElement).style, {
          width: "0px",
          marginRight: "0px",
        });
      };
      return () =>
        h(
          "div",
          {
            ref: setRoot,
            "data-overflow": String(api.edges.value.overflow),
            "data-left": String(api.edges.value.left),
            "data-right": String(api.edges.value.right),
          },
          [
            h(
              "div",
              {
                ref: setViewport,
                style: { direction },
                onFocusCapture: api.focus,
              },
              [
                h(
                  "div",
                  { ref: list, role: "tablist", onKeydown: api.keyboard },
                  Array.from({ length: 8 }, (_, index) => {
                    const tab = h(
                      "button",
                      {
                        ref: setTab(index),
                        role: "tab",
                        type: "button",
                        "data-tabs-value": `tab-${index}`,
                        "aria-selected": selected.value === `tab-${index}`,
                        onClick: () => {
                          selected.value = `tab-${index}`;
                        },
                      },
                      [
                        icons === "selected"
                          ? h("span", { ref: setIcon, "data-tabs-icon": "" })
                          : null,
                        `Tab ${index}`,
                      ],
                    );
                    return icons === "selected" ? h("div", [tab]) : tab;
                  }),
                ),
              ],
            ),
          ],
        );
    },
  });
  const wrapper = mount(Component, { attachTo: document.body });
  wrappers.push(wrapper);
  return { wrapper, view, api, selected, scrollBy, dimensions };
}

describe("Tabs overflow scrolling", () => {
  it.each(["pill", "segment", "underline"] as const)(
    "keeps %s manual scrolling when edge controls rerender",
    async (variant) => {
      const { wrapper, view, api, scrollBy, selected } = harness({ variant });
      await settle();
      scrollBy.mockClear();
      api.scroll(1);
      await settle();
      expect(view.scrollLeft).toBe(256);
      expect(wrapper.attributes("data-left")).toBe("true");
      expect(wrapper.attributes("data-right")).toBe("true");
      expect(scrollBy).toHaveBeenCalledExactlyOnceWith({
        left: 256,
        behavior: "smooth",
      });
      api.scroll(-1);
      await settle();
      expect(view.scrollLeft).toBe(0);
      expect(wrapper.attributes("data-left")).toBe("false");
      expect(selected.value).toBe("tab-0");
    },
  );

  it.each(["ltr", "rtl"] as const)(
    "does not recenter the selected tab after native %s scrolling",
    async (direction) => {
      const { wrapper, view, scrollBy, selected } = harness({ direction });
      await settle();
      scrollBy.mockClear();
      const offset = direction === "rtl" ? -6 : 6;
      view.scrollLeft = offset;
      view.dispatchEvent(new Event("scroll"));
      await settle();
      expect(view.scrollLeft).toBe(offset);
      expect(wrapper.attributes("data-left")).toBe("true");
      expect(wrapper.attributes("data-right")).toBe("true");
      expect(scrollBy).not.toHaveBeenCalled();
      expect(selected.value).toBe("tab-0");
    },
  );

  it("preserves a manual scroll position when the viewport resizes", async () => {
    const { view, dimensions, scrollBy } = harness();
    await settle();
    scrollBy.mockClear();
    view.scrollLeft = 240;
    dimensions.width = 280;
    observers[0].callback([], {} as ResizeObserver);
    await settle();
    expect(view.scrollLeft).toBe(240);
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it.each(["ltr", "rtl"] as const)(
    "still reveals a newly selected tab in %s without animation when motion is reduced",
    async (direction) => {
      const { view, selected, scrollBy } = harness({
        direction,
        reduced: true,
      });
      await settle();
      scrollBy.mockClear();
      selected.value = "tab-7";
      await settle();
      expect(view.scrollLeft).toBe(direction === "rtl" ? -640 : 640);
      expect(scrollBy).toHaveBeenCalledWith(
        expect.objectContaining({ behavior: "instant" }),
      );
      selected.value = "tab-0";
      await settle();
      expect(view.scrollLeft).toBe(0);
    },
  );

  it("keeps a focused offscreen tab visible without changing the selected value", async () => {
    const { wrapper, view, selected } = harness();
    await settle();
    (wrapper.findAll("[role=tab]")[7].element as HTMLElement).focus();
    await settle();
    expect(view.scrollLeft).toBe(640);
    expect(selected.value).toBe("tab-0");
  });

  it("reveals the final selected-icon width and restores pending animation styles", async () => {
    const { wrapper, view, selected, dimensions, scrollBy } = harness({
      icons: "selected",
    });
    await settle();
    dimensions.width = 280;
    selected.value = "tab-7";
    await settle();
    const icons = wrapper.findAll<HTMLElement>("[data-tabs-icon]");
    Object.assign(icons[7].element.style, {
      width: "14px",
      marginRight: "6px",
    });
    view.scrollLeft = 0;
    view.dispatchEvent(new Event("scroll"));
    await settle();
    scrollBy.mockClear();
    selected.value = "tab-1";
    await settle();

    expect(scrollBy).toHaveBeenCalledWith({ left: 12, behavior: "smooth" });
    expect(icons[1].element.style.width).toBe("0px");
    expect(icons[1].element.style.marginRight).toBe("0px");
    expect(icons[7].element.style.width).toBe("14px");
    expect(icons[7].element.style.marginRight).toBe("6px");

    Object.assign(icons[1].element.style, {
      width: "14px",
      marginRight: "6px",
    });
    Object.assign(icons[7].element.style, { width: "0px", marginRight: "0px" });
    const selectedBounds = wrapper
      .findAll("[role=tab]")[1]
      .element.getBoundingClientRect();
    expect(selectedBounds.right).toBeLessThanOrEqual(
      view.getBoundingClientRect().right - 36,
    );
  });

  it("disconnects resize and scroll work on unmount", async () => {
    const { wrapper, view, scrollBy } = harness();
    await settle();
    const remove = vi.spyOn(view, "removeEventListener");
    wrapper.unmount();
    wrappers.splice(wrappers.indexOf(wrapper), 1);
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
    scrollBy.mockClear();
    view.scrollLeft = 240;
    observers[0].callback([], {} as ResizeObserver);
    view.dispatchEvent(new Event("scroll"));
    await settle();
    expect(scrollBy).not.toHaveBeenCalled();
  });
});
