import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { h, nextTick } from "vue";
import { WheelPicker } from "../../packages/vue/src/motion/wheel-picker";
import {
  AdaptiveStepper,
  AdaptiveStepperDecrement,
  AdaptiveStepperValue,
  AdaptiveStepperIncrement,
} from "../../packages/vue/src/motion/adaptive-stepper";
const wrappers: VueWrapper[] = [];
const nativeAnimate = Element.prototype.animate;
beforeEach(() => {
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
  if (vi.isFakeTimers()) await vi.advanceTimersByTimeAsync(2000);
  document.getAnimations?.().forEach((animation) => {
    if (Number.isFinite(Number(animation.effect?.getTiming().iterations)))
      animation.finish();
  });
  await nextTick();
  await Promise.resolve();
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  document.body.innerHTML = "";
  vi.useRealTimers();
  vi.restoreAllMocks();
});
describe("Wheel drum and liquid stepper", () => {
  it("wheel movement drives the same drum transform for the crisp and dimmed rows before settling", async () => {
    vi.useFakeTimers();
    const wrapper = mount(WheelPicker, {
      props: { options: ["One", "Two", "Three", "Four"], defaultValue: "One" },
      attachTo: document.body,
    });
    wrappers.push(wrapper);
    wrapper.element.dispatchEvent(
      new WheelEvent("wheel", { deltaY: 100, cancelable: true }),
    );
    await nextTick();
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["Two"]);
    const drums = wrapper.findAll("ul");
    expect(drums[0].element.style.transform).toBe(
      drums[1].element.style.transform,
    );
    expect(drums[0].element.style.transform).toContain("36deg");
    await vi.advanceTimersByTimeAsync(400);
    expect(drums[0].element.style.transform).toContain("30deg");
    expect(drums[0].element.style.transform).toBe(
      drums[1].element.style.transform,
    );
  });
  it("wheel keyboard reaches both end stops and disabled wheel does not intercept page scroll", async () => {
    vi.useFakeTimers();
    const wrapper = mount(WheelPicker, {
      props: { options: ["One", "Two", "Three"] },
      attachTo: document.body,
    });
    wrappers.push(wrapper);
    await wrapper.trigger("keydown", { key: "End" });
    await vi.advanceTimersByTimeAsync(400);
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["Three"]);
    await wrapper.trigger("keydown", { key: "Home" });
    await vi.advanceTimersByTimeAsync(400);
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["One"]);
    await wrapper.setProps({ disabled: true });
    const wheel = new WheelEvent("wheel", { deltaY: 100, cancelable: true });
    wrapper.element.dispatchEvent(wheel);
    expect(wheel.defaultPrevented).toBe(false);
    expect(wrapper.attributes("tabindex")).toBe("-1");
  });
  it("stepper follows the min-anchored fractional grid and transfers keyboard focus when an action disappears", async () => {
    vi.useFakeTimers();
    const wrapper = mount(AdaptiveStepper, {
      props: { defaultValue: 0.2, min: 0, max: 0.3, step: 0.2 },
      attachTo: document.body,
      slots: {
        default: () => [
          h(AdaptiveStepperDecrement),
          h(AdaptiveStepperValue),
          h(AdaptiveStepperIncrement),
        ],
      },
    });
    wrappers.push(wrapper);
    const buttons = wrapper.findAll("button");
    expect(wrapper.findAll("svg rect")).toHaveLength(3);
    expect(buttons[0].find("svg").exists()).toBe(true);
    await buttons[1].trigger("click", { detail: 0 });
    await vi.advanceTimersByTimeAsync(20);
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([0.3]);
    expect(buttons[1].attributes("aria-hidden")).toBe("true");
    expect(buttons[1].attributes("disabled")).toBeDefined();
    expect(document.activeElement).toBe(buttons[0].element);
    await buttons[0].trigger("click", { detail: 0 });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([0.2]);
    await buttons[0].trigger("click", { detail: 0 });
    await vi.advanceTimersByTimeAsync(20);
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([0]);
    expect(document.activeElement).toBe(buttons[1].element);
  });
});
