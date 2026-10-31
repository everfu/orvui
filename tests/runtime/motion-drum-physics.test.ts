import { beforeEach, afterEach, it, expect, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { h, nextTick, createCommentVNode, ref, defineComponent } from "vue";
import { CylinderCarousel } from "../../packages/vue/src/motion/cylinder-carousel";
import { WheelPicker } from "../../packages/vue/src/motion/wheel-picker";
const calls = vi.hoisted(
  () =>
    [] as {
      from: any;
      to: number;
      options: any;
      stop: ReturnType<typeof vi.fn>;
    }[],
);
vi.mock("../../packages/vue/node_modules/motion-v", async (original) => {
  const module = await original<Record<string, any>>();
  return {
    ...module,
    animate: (from: any, to: number, options: any) => {
      const stop = vi.fn();
      calls.push({ from, to, options, stop });
      return { stop };
    },
  };
});
const wrappers: VueWrapper[] = [],
  resizes: ResizeObserverCallback[] = [],
  mediaListeners: (() => void)[] = [];
let width = 600,
  reduced = false;
beforeEach(() => {
  vi.useFakeTimers();
  window.matchMedia = vi.fn().mockImplementation(() => ({
    get matches() {
      return reduced;
    },
    addEventListener(_event: string, callback: () => void) {
      mediaListeners.push(callback);
    },
    removeEventListener(_event: string, callback: () => void) {
      const index = mediaListeners.indexOf(callback);
      if (index >= 0) mediaListeners.splice(index, 1);
    },
  }));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: ResizeObserverCallback) {
        resizes.push(callback);
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(
    () => width,
  );
});
afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount());
  calls.length = 0;
  resizes.length = 0;
  mediaListeners.length = 0;
  width = 600;
  reduced = false;
  document.body.innerHTML = "";
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function render(component: any, props: any = {}, slots: any = {}) {
  const w = mount(component, { props, slots, attachTo: document.body });
  wrappers.push(w);
  return w;
}
const balls = () =>
  Array.from({ length: 9 }, (_, i) => h("span", { key: i }, String(i)));
it("fits default stage height to the projected ball size and uses the 800px fallback for a hidden stage", async () => {
  const w = render(CylinderCarousel, {}, { default: balls });
  await nextTick();
  expect(parseFloat((w.element as HTMLElement).style.height)).toBeCloseTo(
    106.849315,
    5,
  );
  width = 0;
  resizes[0](
    [{ contentRect: { width: 0 } } as ResizeObserverEntry],
    {} as ResizeObserver,
  );
  await nextTick();
  expect(parseFloat((w.element as HTMLElement).style.height)).toBeCloseTo(
    142.465753,
    5,
  );
  const first = w.findAllComponents({ name: "motion.div" })[0];
  expect(
    Object.values(first.props("animate") as Record<string, unknown>).some(
      (v) => typeof v === "number" && !Number.isFinite(v),
    ),
  ).toBe(false);
});
it("matches concave perspective and convex arch geometry at the same fitted width", async () => {
  const w = render(CylinderCarousel, {}, { default: balls });
  await nextTick();
  const center = w
    .findAllComponents({ name: "motion.div" })[0]
    .props("animate") as { x: number; y: number; scale: number };
  expect(center).toMatchObject({ x: 0, scale: 0.55 });
  expect(center.y).toBeCloseTo(106.849315 * 0.35 * 0.5, 5);
  await w.setProps({ variant: "convex" });
  const convex = w
    .findAllComponents({ name: "motion.div" })[0]
    .props("animate") as { x: number; y: number; scale: number };
  expect(convex).toMatchObject({ x: 0, scale: 1 });
  expect(convex.y).toBeCloseTo(-95.1219512 * 0.35 * 0.5, 5);
});
it("projects a last-segment flick by at most six items and keeps the exact release spring", async () => {
  const w = render(CylinderCarousel, {}, { default: balls });
  await w.trigger("pointerdown", { pointerId: 1, button: 0, clientX: 200 });
  await vi.advanceTimersByTimeAsync(20);
  await w.trigger("pointermove", { pointerId: 1, clientX: 180 });
  await vi.advanceTimersByTimeAsync(20);
  await w.trigger("pointermove", { pointerId: 1, clientX: 140 });
  await w.trigger("pointerup", { pointerId: 1 });
  expect(calls.at(-1)?.to).toBe(7);
  expect(calls.at(-1)?.options).toMatchObject({
    type: "spring",
    stiffness: 40,
    damping: 20,
    mass: 3,
    velocity: 30,
    restDelta: 0.001,
    restSpeed: 0.005,
  });
});
it("uses the source active-drag route for move and release from another pointer", async () => {
  const w = render(CylinderCarousel, {}, { default: balls });
  await w.trigger("pointerdown", { pointerId: 1, clientX: 200 });
  await vi.advanceTimersByTimeAsync(20);
  await w.trigger("pointermove", { pointerId: 2, clientX: 140 });
  expect(Number((w.vm as unknown as { scroll: number }).scroll)).toBeCloseTo(
    0.9,
  );
  await w.trigger("pointerup", { pointerId: 2 });
  expect(calls.at(-1)?.to).toBe(7);
});
it("lets cylinder wheel input propagate and settles with zero velocity after the source idle delay", async () => {
  const w = render(CylinderCarousel, {}, { default: balls });
  w.element.dispatchEvent(
    new WheelEvent("wheel", { deltaY: 10, cancelable: true }),
  );
  await vi.advanceTimersByTimeAsync(20);
  const event = new WheelEvent("wheel", { deltaY: 20, cancelable: true });
  w.element.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(false);
  await vi.advanceTimersByTimeAsync(139);
  expect(calls).toHaveLength(0);
  await vi.advanceTimersByTimeAsync(1);
  expect(calls.at(-1)?.to).toBe(0);
  expect(calls.at(-1)?.options.velocity).toBe(0);
});
it("pauses cylinder autoplay on hover and leaves it stopped after an interaction settles", async () => {
  const w = render(CylinderCarousel, { autoRotate: true }, { default: balls });
  await vi.advanceTimersByTimeAsync(1000);
  const position = () => Number((w.vm as unknown as { scroll: number }).scroll);
  expect(position()).toBeGreaterThan(0.35);
  await w.trigger("pointerenter");
  const hovered = position();
  await vi.advanceTimersByTimeAsync(1000);
  expect(position()).toBe(hovered);
  await w.trigger("pointerleave");
  await vi.advanceTimersByTimeAsync(500);
  expect(position()).toBeGreaterThan(hovered);
  await w.trigger("keydown", { key: "ArrowRight" });
  const stopped = position();
  calls.at(-1)?.options.onComplete?.();
  await vi.advanceTimersByTimeAsync(1000);
  expect(position()).toBe(stopped);
});
it("does not autoplay an empty cylinder slot and starts when actual slides replace conditional comments", async () => {
  const shown = ref(false),
    w = render(
      defineComponent({
        setup() {
          return () =>
            h(CylinderCarousel, { autoRotate: true }, () =>
              shown.value ? balls() : [createCommentVNode("v-if")],
            );
        },
      }),
    );
  const carousel = () => w.findComponent(CylinderCarousel),
    position = () =>
      Number((carousel().vm as unknown as { scroll: number }).scroll);
  await vi.advanceTimersByTimeAsync(100);
  expect(position()).toBe(0);
  expect(carousel().findAllComponents({ name: "motion.div" })).toHaveLength(0);
  shown.value = true;
  await nextTick();
  await vi.advanceTimersByTimeAsync(100);
  expect(position()).toBeGreaterThan(0);
  shown.value = false;
  await nextTick();
  const stopped = position();
  await vi.advanceTimersByTimeAsync(100);
  expect(position()).toBe(stopped);
});
it("does not emit a duplicate index when a cylinder movement wraps to the same active item", async () => {
  const w = render(
    CylinderCarousel,
    {},
    { default: () => balls().slice(0, 3) },
  );
  await w.trigger("pointerdown", { pointerId: 1, button: 0, clientX: 200 });
  await w.trigger("pointermove", { pointerId: 1, clientX: 0 });
  expect(w.emitted("indexChange")).toBeUndefined();
});
it("uses the 90ms averaged wheel-picker release instead of treating a final stationary sample as a zero-velocity flick", async () => {
  const labels = Array.from({ length: 12 }, (_, i) => "Row " + i),
    w = render(WheelPicker, { options: labels });
  await w.trigger("pointerdown", {
    pointerId: 1,
    pointerType: "mouse",
    button: 0,
    clientY: 2000,
  });
  for (const y of [1964, 1928, 1892, 1856]) {
    await vi.advanceTimersByTimeAsync(30);
    await w.trigger("pointermove", {
      pointerId: 1,
      pointerType: "mouse",
      clientY: y,
    });
  }
  await vi.advanceTimersByTimeAsync(10);
  await w.trigger("pointermove", {
    pointerId: 1,
    pointerType: "mouse",
    clientY: 1856,
  });
  await vi.advanceTimersByTimeAsync(20);
  await w.trigger("pointerup", { pointerId: 1, pointerType: "mouse" });
  await vi.advanceTimersByTimeAsync(1800);
  expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["Row 5"]);
  const drums = w.findAll("ul");
  expect(drums[0].element.style.transform).toBe(
    drums[1].element.style.transform,
  );
  expect(drums[0].element.style.transform).toContain("150deg");
});
it("rubber-bands a wheel-picker overshoot back to its end detent", async () => {
  const w = render(WheelPicker, { options: ["One", "Two", "Three"] });
  await w.trigger("pointerdown", {
    pointerId: 1,
    pointerType: "pen",
    button: 0,
    clientY: 100,
  });
  await vi.advanceTimersByTimeAsync(30);
  await w.trigger("pointermove", {
    pointerId: 1,
    pointerType: "pen",
    clientY: 280,
  });
  await vi.advanceTimersByTimeAsync(20);
  await w.trigger("pointerup", { pointerId: 1, pointerType: "pen" });
  await vi.advanceTimersByTimeAsync(300);
  expect(w.find("ul").element.style.transform).toContain("rotateX(0deg)");
  expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["One"]);
});
it("retains an unset wheel value in reduced mode and emits when the first row is explicitly chosen", async () => {
  reduced = true;
  const w = render(WheelPicker, { options: ["One", "Two"] });
  await nextTick();
  expect(
    w
      .findAll("button")
      .every((button) => button.classes().includes("text-muted-foreground")),
  ).toBe(true);
  await w.find("button").trigger("click");
  expect(w.emitted("update:modelValue")).toEqual([["One"]]);
  expect(w.find("button").classes()).toContain("text-foreground");
});
it("lets a wheel-picker glide finish when disabled mid-flight while rejecting new input", async () => {
  const w = render(WheelPicker, { options: ["One", "Two", "Three"] });
  await w.trigger("keydown", { key: "End" });
  await vi.advanceTimersByTimeAsync(100);
  await w.setProps({ disabled: true });
  const wheel = new WheelEvent("wheel", { deltaY: -500, cancelable: true });
  w.element.dispatchEvent(wheel);
  expect(wheel.defaultPrevented).toBe(false);
  await w.trigger("keydown", { key: "Home" });
  await vi.advanceTimersByTimeAsync(300);
  expect(w.emitted("update:modelValue")).toEqual([["Three"]]);
  expect(w.find("ul").element.style.transform).toContain("rotateX(60deg)");
});
it("follows the accepted wheel-picker value over 260ms when reduced motion changes away from its detent", async () => {
  const w = render(WheelPicker, { options: ["One", "Two", "Three"] });
  await w.trigger("keydown", { key: "End" });
  await vi.advanceTimersByTimeAsync(100);
  reduced = true;
  mediaListeners.slice().forEach((callback) => callback());
  await nextTick();
  expect(w.findAll("button")).toHaveLength(3);
  expect(w.emitted("update:modelValue")).toBeUndefined();
  await vi.advanceTimersByTimeAsync(200);
  expect(w.emitted("update:modelValue")).toBeUndefined();
  await vi.advanceTimersByTimeAsync(100);
  expect(w.emitted("update:modelValue")).toEqual([["One"]]);
  expect(w.find("button").classes()).toContain("text-foreground");
});
it("preserves a wheel-picker glide if reduced mode changes before it leaves the accepted detent", async () => {
  const w = render(WheelPicker, { options: ["One", "Two", "Three"] });
  await w.trigger("keydown", { key: "End" });
  reduced = true;
  mediaListeners.slice().forEach((callback) => callback());
  await nextTick();
  await vi.advanceTimersByTimeAsync(350);
  expect(w.emitted("update:modelValue")).toEqual([["Three"]]);
  expect(w.findAll("button")[2].classes()).toContain("text-foreground");
});
it("caps a hard wheel-picker fling at .18 rows/ms and 1700ms before publishing the final row", async () => {
  const w = render(WheelPicker, {
    options: Array.from({ length: 100 }, (_, i) => "Row " + i),
  });
  await w.trigger("pointerdown", {
    pointerId: 1,
    pointerType: "mouse",
    clientY: 3000,
  });
  await vi.advanceTimersByTimeAsync(1);
  await w.trigger("pointermove", {
    pointerId: 1,
    pointerType: "mouse",
    clientY: 1200,
  });
  await vi.advanceTimersByTimeAsync(20);
  await w.trigger("pointerup", { pointerId: 1, pointerType: "mouse" });
  expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["Row 50"]);
  await vi.advanceTimersByTimeAsync(1600);
  expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["Row 50"]);
  await vi.advanceTimersByTimeAsync(150);
  expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["Row 89"]);
  expect(w.find("ul").element.style.transform).toContain("rotateX(2670deg)");
});
it("stops both wheel-picker animation frames and timers on unmount", async () => {
  const w = render(WheelPicker, { options: ["One", "Two", "Three"] });
  await w.trigger("keydown", { key: "End" });
  w.unmount();
  wrappers.splice(wrappers.indexOf(w), 1);
  await vi.advanceTimersByTimeAsync(500);
  expect(w.emitted("update:modelValue")).toBeUndefined();
  expect(vi.getTimerCount()).toBe(0);
});
