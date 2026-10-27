import { beforeEach, afterEach, it, expect, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick, h } from "vue";
import {
  HoldActionButton,
  SlideActionButton,
} from "..";
const wrappers: VueWrapper[] = [],
  nativeAnimate = Element.prototype.animate;
beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  });
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
afterEach(async () => {
  document.getAnimations?.().forEach((animation) => {
    if (Number.isFinite(Number(animation.effect?.getTiming().iterations)))
      animation.finish();
  });
  await nextTick();
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  vi.restoreAllMocks();
});
it("completes a keyboard hold from the fill animation once and cancels after key release", async () => {
  const wrapper = mount(HoldActionButton, {
    props: { holdDuration: 30 },
    slots: { default: "Confirm" },
  });
  wrappers.push(wrapper);
  expect(wrapper.attributes("aria-label")).toBe("Confirm");
  await wrapper.trigger("keydown", { key: "Enter" });
  await vi.waitFor(
    () => expect(wrapper.emitted("holdComplete")).toHaveLength(1),
    { timeout: 1500, interval: 20 },
  );
  await wrapper.trigger("keyup", { key: "Enter" });
  await nextTick();
  expect(
    wrapper
      .findAll('span[aria-hidden="false"]')
      .some((node) => node.text() === "Done"),
  ).toBe(false);
  expect(wrapper.emitted("holdComplete")).toHaveLength(1);
});
it("measures both track and custom thumb width before completing and accepts rich completion content", async () => {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(
    function (this: HTMLElement) {
      return this.tagName === "BUTTON" ? 80 : 300;
    },
  );
  const wrapper = mount(SlideActionButton, {
    props: { completeLabel: h("strong", "Ready"), resetDelay: 10000 },
    slots: { default: "Slide to continue" },
  });
  wrappers.push(wrapper);
  const thumb = wrapper.find("button");
  expect(thumb.attributes("aria-label")).toBe("Slide to continue");
  await thumb.trigger("keydown", { key: "Enter" });
  expect(wrapper.emitted("complete")).toHaveLength(1);
  expect(wrapper.find("strong").text()).toBe("Ready");
  await thumb.trigger("keydown", { key: "Enter" });
  expect(wrapper.emitted("complete")).toHaveLength(1);
});
