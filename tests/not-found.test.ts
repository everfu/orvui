import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import {
  NotFoundStacked,
  NotFoundMagnetic,
  NotFoundSpotlight,
  NotFoundTerminal,
  NotFoundGlitch,
} from "../packages/vue/src/blocks/not-found";
import Scramble from "../packages/vue/src/blocks/not-found/src/NotFoundScramble.vue";
import Magnetic from "../packages/vue/src/motion/button/src/Magnetic.vue";
const wrappers: VueWrapper[] = [],
  nativeAnimate = Element.prototype.animate;
let frames: Map<number, FrameRequestCallback>,
  nextFrame = 0,
  reduced = false;
beforeEach(() => {
  frames = new Map();
  nextFrame = 0;
  reduced = false;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++nextFrame, callback);
    return nextFrame;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.spyOn(performance, "now").mockReturnValue(0);
  vi.spyOn(Math, "random").mockReturnValue(0);
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("reduced-motion") ? reduced : true,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }));
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
  vi.unstubAllGlobals();
});
function runFrame(now: number) {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach((callback) => callback(now));
}
describe("NotFound source variants", () => {
  it("scrambles once on mount, settles at 700ms, restarts after text changes and cancels its frame on unmount", async () => {
    const wrapper = mount(Scramble, { props: { text: "404" } });
    wrappers.push(wrapper);
    expect(wrapper.text()).toBe("404");
    runFrame(100);
    await nextTick();
    expect(wrapper.text()).toBe("AAA");
    runFrame(750);
    await nextTick();
    expect(wrapper.text()).toBe("404");
    expect(frames.size).toBe(0);
    await wrapper.setProps({ text: "410" });
    expect(frames.size).toBe(1);
    wrapper.unmount();
    wrappers.pop();
    expect(frames.size).toBe(0);
  });
  it("does not scramble under reduced motion, including after updating the code", async () => {
    reduced = true;
    const wrapper = mount(Scramble, { props: { text: "404" } });
    wrappers.push(wrapper);
    runFrame(100);
    await wrapper.setProps({ text: "500" });
    expect(wrapper.text()).toBe("500");
    expect(Math.random).not.toHaveBeenCalled();
    expect(frames.size).toBe(0);
  });
  it("shows aligned resting cards, original source copy, custom action links and an accessible code heading", () => {
    const wrapper = mount(NotFoundStacked, {
      props: { code: "410", homeHref: "/home", browseHref: "/library" },
    });
    wrappers.push(wrapper);
    expect(wrapper.find("h1").text()).toBe("410");
    expect(wrapper.text()).toContain("out of the deck");
    expect(wrapper.find('a[href="/home"]').text()).toBe("Back home");
    expect(wrapper.find('a[href="/library"]').text()).toBe("Browse components");
    expect(wrapper.findAll("[aria-hidden=true]")).toHaveLength(2);
    expect(wrapper.find("h1").classes()).toContain(
      "[font-size:clamp(3.5rem,9vw,5rem)]",
    );
  });
  it("uses the source .6 magnetic strength and resets its target when the pointer leaves", async () => {
    const wrapper = mount(Magnetic, {
      props: { strength: 0.6 },
      slots: { default: "4" },
    });
    wrappers.push(wrapper);
    vi.spyOn(wrapper.element, "getBoundingClientRect").mockReturnValue({
      left: 20,
      top: 10,
      width: 100,
      height: 80,
      right: 120,
      bottom: 90,
      x: 20,
      y: 10,
      toJSON() {},
    });
    await wrapper.trigger("mousemove", { clientX: 110, clientY: 70 });
    expect(wrapper.vm.x.get()).toBe(24);
    expect(wrapper.vm.y.get()).toBe(12);
    await wrapper.trigger("mouseleave");
    expect(wrapper.vm.x.get()).toBe(0);
    expect(wrapper.vm.y.get()).toBe(0);
  });
  it("provides deterministic server output for all five variants and source terminal commands", async () => {
    for (const component of [
      NotFoundStacked,
      NotFoundMagnetic,
      NotFoundSpotlight,
      NotFoundTerminal,
      NotFoundGlitch,
    ]) {
      const html = await renderToString(h(component, { code: "410" }));
      expect(html).toContain("410");
      expect(html).toContain("Back home");
      expect(html).not.toContain("NaN");
    }
    const terminal = await renderToString(h(NotFoundTerminal));
    expect(terminal.replace(/<[^>]*>/g, "")).toContain(
      "no such file or directory",
    );
    expect(terminal).toContain("~/orvui");
  });
});
