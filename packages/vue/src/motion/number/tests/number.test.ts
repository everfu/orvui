import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { createSSRApp, nextTick } from "vue";
import { renderToString } from "@vue/server-renderer";
import {
  NumberTicker,
  DigitSwap,
  AnimatedNumber,
} from "..";
const wrappers: VueWrapper[] = [];
const disconnect = vi.fn();
beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {
        disconnect();
      }
    },
  );
});
afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount());
});
function track(component: any, props: any) {
  const wrapper = mount(component, { props });
  wrappers.push(wrapper);
  return wrapper;
}
describe("number primitives", () => {
  it("formats the rounded target accessibly and preserves fractional custom format data", () => {
    const formatted = vi.fn((v: number) => v.toFixed(2));
    const wrapper = track(NumberTicker, {
      value: 12.345,
      decimals: 2,
      format: formatted,
      prefix: "$",
      suffix: " USD",
      startOnView: false,
    });
    expect(wrapper.find(".sr-only").text()).toBe("$12.35 USD");
    expect(formatted).toHaveBeenCalledWith(12.35);
  });
  it("keeps ones and tens DOM slots when a growing value gains a hundreds place", async () => {
    const wrapper = track(NumberTicker, { value: 99, startOnView: false });
    const slots = wrapper.findAllComponents({ name: "NumberTickerDigit" });
    const ones = slots.at(-1)?.element,
      tens = slots.at(-2)?.element;
    await wrapper.setProps({ value: 100 });
    const after = wrapper.findAllComponents({ name: "NumberTickerDigit" });
    expect(after).toHaveLength(3);
    expect(after.at(-1)?.element).toBe(ones);
    expect(after.at(-2)?.element).toBe(tens);
  });
  it("pads ticker text and exposes suffix styles without duplicating accessible output", () => {
    const ticker = track(NumberTicker, {
      value: 7,
      pad: 4,
      startOnView: false,
    });
    expect(ticker.find(".sr-only").text()).toBe("0007");
    const swap = track(DigitSwap, {
      value: "12 3456",
      suffixLength: 2,
      suffixClassName: "last-digits",
      animationKey: 1,
    });
    expect(swap.find(".sr-only").text()).toBe("12 3456");
    expect(swap.findAll(".last-digits")).toHaveLength(2);
    expect(swap.findAll('[data-slot="digit-swap-glyph"]')).toHaveLength(6);
  });
  it("renders a deterministic first frame for the server and disconnects viewport observers", async () => {
    const html = await renderToString(
      createSSRApp(NumberTicker, { value: 42 }),
    );
    expect(html).toContain("42");
    expect(html).not.toContain("NaN");
    const wrapper = track(NumberTicker, { value: 42 });
    wrapper.unmount();
    expect(disconnect).toHaveBeenCalled();
    const animated = track(AnimatedNumber, {
      value: 42,
      startOnView: false,
      duration: 0,
    });
    await nextTick();
    expect(animated.exists()).toBe(true);
  });
});
