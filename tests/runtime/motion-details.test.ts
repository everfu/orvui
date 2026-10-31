import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { h, nextTick } from "vue";
import {
  CenterMorphModal,
  CenterMorphModalTrigger,
  CenterMorphModalContent,
  CenterMorphModalClose,
} from "../../packages/vue/src/motion/center-morph-modal";
import { BottomSheet } from "../../packages/vue/src/motion/bottom-sheet";
import { resolveBottomSheetSnap } from "../../packages/vue/src/motion/bottom-sheet/src/snap";
import { ArcPicker } from "../../packages/vue/src/motion/arc-picker";
import { PullToRefresh } from "../../packages/vue/src/motion/pull-to-refresh";
import { PreviewRail } from "../../packages/vue/src/motion/preview-rail";
import { RangeSlider } from "../../packages/vue/src/motion/range-slider";
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
function render(component: any, props: any = {}, slots: any = {}) {
  const wrapper = mount(component, { props, slots, attachTo: document.body });
  wrappers.push(wrapper);
  return wrapper;
}
afterEach(async () => {
  if (vi.isFakeTimers()) await vi.advanceTimersByTimeAsync(1000);
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
describe("Source motion geometry and interaction", () => {
  it("center modal keeps the provided button and unfolds a centered clipping surface with focus restoration", async () => {
    const wrapper = render(
      CenterMorphModal,
      {},
      {
        default: () => [
          h(CenterMorphModalTrigger, {}, () =>
            h("button", { id: "center-opener" }, "Open"),
          ),
          h(CenterMorphModalContent, { ariaLabel: "Details" }, () =>
            h(CenterMorphModalClose, {}, () =>
              h("button", { id: "center-close" }, "Done"),
            ),
          ),
        ],
      },
    );
    const opener = wrapper.find("button");
    expect(wrapper.findAll("button")).toHaveLength(1);
    (opener.element as HTMLElement).focus();
    await opener.trigger("click");
    await nextTick();
    const panel = document.querySelector<HTMLElement>("[role=dialog]")!;
    expect(panel.getAttribute("aria-label")).toBe("Details");
    expect(panel.classList.contains("rounded-[30px]")).toBe(true);
    expect(document.activeElement?.id).toBe("center-close");
    document.querySelector<HTMLElement>("#center-close")!.click();
    await nextTick();
    expect(document.activeElement).toBe(opener.element);
    expect(panel.inert || panel.style.pointerEvents === "none").toBe(true);
  });
  it("preserves trigger cancellation and non-dismissible modal Escape semantics", async () => {
    const wrapper = render(
      CenterMorphModal,
      {},
      {
        default: () => [
          h(CenterMorphModalTrigger, {}, () =>
            h(
              "button",
              { onClick: (event: Event) => event.preventDefault() },
              "Blocked",
            ),
          ),
          h(
            CenterMorphModalContent,
            { ariaLabel: "Details", dismissible: false },
            () => "Body",
          ),
        ],
      },
    );
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("update:open")).toBeUndefined();
    await wrapper.setProps({ open: true });
    await nextTick();
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    expect(wrapper.emitted("update:open")).toBeUndefined();
  });
  it("bottom sheet distinguishes a slow lower detent from strong dismissal and resets on reopen", async () => {
    expect(resolveBottomSheetSnap(1, 2, 130, 650)).toBe(0);
    expect(resolveBottomSheetSnap(1, 2, 130, 900)).toBeNull();
    expect(resolveBottomSheetSnap(0, 2, -20, -600)).toBe(1);
    expect(resolveBottomSheetSnap(0, 2, 79, 0)).toBe(0);
    const wrapper = render(BottomSheet, {
      open: true,
      snapPoints: [0.4, 0.85],
      title: "Actions",
    });
    await nextTick();
    (wrapper.vm as any).onDragEnd(null, {
      offset: { y: -90 },
      velocity: { y: 0 },
    });
    await nextTick();
    expect(
      document.querySelector<HTMLElement>("[role=dialog]")?.style.height,
    ).toBe("85vh");
    await wrapper.setProps({ open: false });
    await wrapper.setProps({ open: true });
    await nextTick();
    expect(
      document.querySelector<HTMLElement>("[role=dialog]")?.style.height,
    ).toBe("40vh");
  });
  it("arc keyboard skips disabled choices, honors rejected controlled state and lets boundary wheel scroll through", async () => {
    vi.useFakeTimers();
    const wrapper = render(ArcPicker, {
      modelValue: "one",
      options: [
        { value: "one", label: "One" },
        { value: "two", label: "Two", disabled: true },
        { value: "three", label: "Three" },
      ],
    });
    const radios = wrapper.findAll("[role=radio]");
    await radios[0].trigger("keydown", { key: "ArrowDown" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["three"]);
    await vi.advanceTimersByTimeAsync(50);
    expect(radios[0].attributes("aria-checked")).toBe("true");
    expect(document.activeElement).toBe(radios[0].element);
    const event = new WheelEvent("wheel", { deltaY: -20, cancelable: true });
    wrapper.element.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });
  it("base range slider reaches a non-divisible max without rendering an extra tick", async () => {
    const wrapper = render(RangeSlider, {
      min: 0,
      max: 10,
      step: 4,
      defaultValue: 8,
      ariaLabel: "Strength",
    });
    await wrapper.find("[role=slider]").trigger("keydown", { key: "End" });
    expect(wrapper.find("[role=slider]").attributes("aria-valuenow")).toBe(
      "10",
    );
    expect(wrapper.findAll("span")).toHaveLength(3);
  });
  it("pull refresh uses source resistance and awaits its callback exactly once while external state holds it", async () => {
    let finish!: () => void;
    const onRefresh = vi.fn(
        () => new Promise<void>((resolve) => (finish = resolve)),
      ),
      wrapper = render(PullToRefresh, { onRefresh });
    await wrapper.trigger("pointerdown", {
      pointerType: "pen",
      pointerId: 1,
      button: 0,
      clientX: 0,
      clientY: 0,
    });
    await wrapper.trigger("pointermove", {
      pointerType: "pen",
      pointerId: 1,
      clientX: 0,
      clientY: 140,
    });
    expect(wrapper.attributes("data-state")).toBe("ready");
    await wrapper.trigger("pointerup", { pointerType: "pen", pointerId: 1 });
    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(wrapper.attributes("data-state")).toBe("refreshing");
    await wrapper.setProps({ refreshing: true });
    finish();
    await nextTick();
    await Promise.resolve();
    expect(wrapper.attributes("aria-busy")).toBe("true");
    await wrapper.setProps({ refreshing: false });
    expect(wrapper.attributes("data-state")).toBe("idle");
  });
  it("preview rail first touch exposes a linked preview and second touch activates it", async () => {
    const wrapper = render(PreviewRail, {
      items: [
        { id: "one", label: "One", href: "#one" },
        { id: "two", label: "Two" },
        { id: "three", label: "Three" },
      ],
    });
    const link = wrapper.find("a");
    await link.trigger("pointerdown", {
      pointerType: "touch",
      pointerId: 1,
      clientX: 10,
      clientY: 10,
    });
    const first = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.element.dispatchEvent(first);
    await nextTick();
    expect(first.defaultPrevented).toBe(true);
    expect(wrapper.find("[data-slot=preview-rail-title]").text()).toBe("One");
    expect(wrapper.emitted("itemSelect")).toBeUndefined();
    await link.trigger("pointerdown", {
      pointerType: "touch",
      pointerId: 2,
      clientX: 10,
      clientY: 10,
    });
    const second = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.element.dispatchEvent(second);
    expect(second.defaultPrevented).toBe(false);
    expect(wrapper.emitted("itemSelect")?.length).toBe(1);
  });
});
