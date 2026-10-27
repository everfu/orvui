import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import {
  RangeSlider,
  RulerSlider,
} from "..";
let wrapper: VueWrapper | undefined, resize: ResizeObserverCallback | undefined;
beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  });
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: ResizeObserverCallback) {
        resize = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  wrapper?.unmount();
  wrapper = undefined;
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});
it("keeps the thumb on its value after the first real measurement and later resize", async () => {
  let width = 384;
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    () => ({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: width,
      bottom: 40,
      width,
      height: 40,
      toJSON() {
        return {};
      },
    }),
  );
  wrapper = mount(RangeSlider, {
    props: { defaultValue: 40, ariaLabel: "Volume" },
    attachTo: document.body,
  });
  const thumb = wrapper.find("[role=slider]");
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 35));
  expect((thumb.element as HTMLElement).style.transform).toContain("153.6px");
  width = 200;
  resize?.([], {} as ResizeObserver);
  await new Promise((resolve) => setTimeout(resolve, 35));
  expect((thumb.element as HTMLElement).style.transform).toContain("80px");
  expect(thumb.attributes("aria-valuenow")).toBe("40");
});

it("keeps the ruler scale and spoken unit in sync when its configuration changes", async () => {
  wrapper = mount(RulerSlider, {
    props: {
      defaultValue: 72.5,
      min: 40,
      max: 120,
      step: 0.5,
      gap: 12,
      majorEvery: 10,
      unit: "kg",
      ariaLabel: "Weight",
    },
    attachTo: document.body,
  });
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 35));
  const strip = wrapper.find(".left-1\\/2");
  expect((strip.element as HTMLElement).style.transform).toContain("-780px");
  expect(wrapper.attributes("aria-valuetext")).toBe("72.5 kg");
  await wrapper.setProps({ min: 50, gap: 20 });
  await new Promise((resolve) => setTimeout(resolve, 35));
  expect((strip.element as HTMLElement).style.transform).toContain("-900px");
  expect(wrapper.attributes("aria-valuenow")).toBe("72.5");
});
