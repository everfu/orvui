import { afterEach, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { defineComponent, h, nextTick, reactive } from "vue";
import { focusList, useMotionState } from "../packages/vue/src/motion/state";
import { useSlider } from "../packages/vue/src/motion/range-slider/src/useSlider";
import { RadioGroup, RadioGroupItem } from "../packages/vue/src/motion/radio";
import { SmoothScroll, ScrollTo, useSmoothScroll, type SmoothScrollApi } from "../packages/vue/src/motion/scroll-animation";
import { hsvaToRgba, rgbaToHsva, parseHex, formatHex, hslToHsv, hsvToHsl } from "../packages/vue/src/motion/color-picker/src/color";

const wrappers: VueWrapper[] = [];
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount());
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("Local value ownership", () => {
  it("accepts requests locally, retains parent control, and resumes local ownership when control is removed", () => {
    const props = reactive<{ modelValue: boolean | undefined }>({ modelValue: undefined });
    const emit = vi.fn();
    const value = useMotionState(props, emit, "modelValue", false);
    value.value = true;
    expect(value.value).toBe(true);
    props.modelValue = false;
    value.value = true;
    expect(value.value).toBe(false);
    expect(emit.mock.calls).toEqual([
      ["update:modelValue", true], ["change", true],
      ["update:modelValue", true], ["change", true],
    ]);
    props.modelValue = undefined;
    expect(value.value).toBe(true);
  });
  it("starts reverse roving focus at the final enabled control when the surface itself has focus", () => {
    const root = document.createElement("section");
    root.tabIndex = 0;
    root.innerHTML = '<button>First</button><button disabled>Skipped</button><button>Last</button>';
    document.body.append(root);
    root.addEventListener("keydown", event => focusList(event));
    root.focus();
    const event = new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true });
    root.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement?.textContent).toBe("Last");
  });
});

describe("Slider pointer ownership", () => {
  function slider() {
    const component = defineComponent({
      props: { disabled: Boolean },
      emits: ["update:modelValue", "change", "valueCommit"],
      setup(props, { emit }) {
        const state = useSlider(props, emit);
        return () => h("div", { ref: state.trackRef, ...state.trackProps, "data-track": "" }, [h("button", { ref: state.sliderRef, ...state.sliderProps.value })]);
      },
    });
    const wrapper = mount(component, { attachTo: document.body });
    wrappers.push(wrapper);
    const track = wrapper.find("[data-track]");
    vi.spyOn(track.element, "getBoundingClientRect").mockReturnValue({ left: 0, width: 100 } as DOMRect);
    const capture = vi.fn(), release = vi.fn();
    Object.assign(track.element, { setPointerCapture: capture, releasePointerCapture: release });
    return { wrapper, track, capture, release };
  }
  it("ignores a second pointer and releases capture when disabled during a drag", async () => {
    const { wrapper, track, release } = slider();
    await track.trigger("pointerdown", { button: 0, pointerId: 1, clientX: 25 });
    await track.trigger("pointermove", { pointerId: 2, clientX: 90 });
    expect(wrapper.find("button").attributes("aria-valuenow")).toBe("25");
    await wrapper.setProps({ disabled: true });
    expect(release).toHaveBeenCalledWith(1);
    await track.trigger("pointermove", { pointerId: 1, clientX: 70 });
    expect(wrapper.find("button").attributes("aria-valuenow")).toBe("25");
    expect(wrapper.emitted("valueCommit")).toBeUndefined();
  });
  it("releases an active pointer when its slider unmounts", async () => {
    const { wrapper, track, release } = slider();
    await track.trigger("pointerdown", { button: 0, pointerId: 7, clientX: 50 });
    wrapper.unmount();
    wrappers.splice(wrappers.indexOf(wrapper), 1);
    expect(release).toHaveBeenCalledWith(7);
  });
});

it("reassigns a radio group's tab stop when a selected item becomes disabled", async () => {
  const disabled = reactive({ first: false });
  const wrapper = mount(RadioGroup, { props: { defaultValue: "first" }, attachTo: document.body,
    slots: { default: () => [h(RadioGroupItem, { value: "first", label: "First", disabled: disabled.first }), h(RadioGroupItem, { value: "next", label: "Next" })] },
  });
  wrappers.push(wrapper);
  await nextTick();
  expect(wrapper.findAll("button").map(button => button.attributes("tabindex"))).toEqual(["0", "-1"]);
  disabled.first = true;
  await nextTick();
  await nextTick();
  expect(wrapper.findAll("button").map(button => button.attributes("tabindex"))).toEqual(["-1", "0"]);
});

describe("Color editing conversions", () => {
  it("round trips all hue sectors and keeps opacity in its own channel", () => {
    for (const h of [0, 60, 120, 180, 240, 300, 359]) {
      const rgba = hsvaToRgba({ h, s: 100, v: 100, a: 0.5 });
      expect(rgba.a).toBe(0.5);
      const result = rgbaToHsva(rgba);
      expect(result.h).toBeCloseTo(h, 0);
      expect(result.s).toBe(100);
      expect(result.v).toBe(100);
    }
  });
  it("retains hue for grey and editing saturation for black", () => {
    const previous = { h: 215, s: 73, v: 60, a: 1 };
    expect(rgbaToHsva({ r: 80, g: 80, b: 80, a: 1 }, previous).h).toBe(215);
    expect(rgbaToHsva({ r: 0, g: 0, b: 0, a: 1 }, previous)).toEqual({ h: 215, s: 73, v: 0, a: 1 });
    expect(formatHex(parseHex("#0f08")!)).toBe("#00ff0087");
    expect(parseHex("rgb(0, 0, 0)")).toBeNull();
  });
  it("preserves HSL coordinates through the HSV editing model", () => {
    const converted = hslToHsv(210, 50, 40, { h: 0, s: 0, v: 0, a: 1 }, 1);
    expect(hsvToHsl(converted).h).toBe(210);
    expect(hsvToHsl(converted).s).toBeCloseTo(50);
    expect(hsvToHsl(converted).l).toBeCloseTo(40);
  });
});


describe("Native scrolling fallback", () => {
  it("tracks a nested viewport and resolves target coordinates relative to it", async () => {
    let api!: SmoothScrollApi;
    const Consumer = defineComponent({
      setup() { api = useSmoothScroll(); return () => h("section", { id: "destination" }, [h(ScrollTo, { to: "#destination", offset: 6 }, () => "Go")]); },
    });
    const wrapper = mount(SmoothScroll, { props: { root: false, enabled: false }, slots: { default: () => h(Consumer) }, attachTo: document.body });
    wrappers.push(wrapper);
    await nextTick();
    const viewport = wrapper.element as HTMLElement;
    Object.defineProperties(viewport, { clientHeight: { value: 100 }, scrollHeight: { value: 500 } });
    viewport.scrollTop = 200;
    viewport.dispatchEvent(new Event("scroll"));
    expect(api.scrollY.get()).toBe(200);
    expect(api.progress.get()).toBe(0.5);
    vi.spyOn(viewport, "getBoundingClientRect").mockReturnValue({ top: 100 } as DOMRect);
    vi.spyOn(wrapper.find("#destination").element, "getBoundingClientRect").mockReturnValue({ top: 220 } as DOMRect);
    const scroll = vi.fn();
    Object.assign(viewport, { scrollTo: scroll });
    await wrapper.find("button").trigger("click");
    expect(scroll).toHaveBeenCalledWith({ top: 326, behavior: "smooth" });
  });
  it("uses the horizontal extent and left position in a horizontal native viewport", async () => {
    let api!: SmoothScrollApi;
    const Consumer = defineComponent({ setup() { api = useSmoothScroll(); return () => h("p", "Content"); } });
    const wrapper = mount(SmoothScroll, { props: { root: false, enabled: false, orientation: "horizontal" }, slots: { default: () => h(Consumer) }, attachTo: document.body });
    wrappers.push(wrapper);
    await nextTick();
    const viewport = wrapper.element as HTMLElement;
    Object.defineProperties(viewport, { clientWidth: { value: 100 }, scrollWidth: { value: 400 } });
    viewport.scrollLeft = 75;
    viewport.dispatchEvent(new Event("scroll"));
    expect(api.scrollY.get()).toBe(75);
    expect(api.progress.get()).toBe(0.25);
    const scroll = vi.fn();
    Object.assign(viewport, { scrollTo: scroll });
    api.scrollTo(150, { immediate: true });
    expect(scroll).toHaveBeenCalledWith({ left: 150, behavior: "instant" });
  });
});
