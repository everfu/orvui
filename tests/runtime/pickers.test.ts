import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { defineComponent, nextTick, ref } from "vue";
import { useOverlay } from "../../packages/vue/src/lib/composables";
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerHexInput,
  ColorPickerHue,
  ColorPickerPreset,
  ColorPickerPresets,
  ColorPickerTrigger,
} from "../../packages/vue/src/motion/color-picker";
import { createPresetArc } from "../../packages/vue/src/motion/color-picker/src/preset-motion";
import {
  DateRangePicker,
  DateRangePickerDropdown,
} from "../../packages/vue/src/motion/date-range-picker";
const wrappers: VueWrapper[] = [];
beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount());
  document.body.innerHTML = "";
});
function render(component: any, props: any = {}) {
  const w = mount(component, { props, attachTo: document.body });
  wrappers.push(w);
  return w;
}
async function settle() {
  for (let i = 0; i < 5; i++) await nextTick();
}
function active(w: VueWrapper, selector = 'fieldset button[tabindex="0"]') {
  return w.find(selector);
}
const dateProps = { defaultMonth: "2026-10-01", showSummary: false };
describe("date controller and choices", () => {
  it("roves month choices, skips bounded choices, selects directly and restores the header on Escape", async () => {
    const w = render(DateRangePicker, {
      ...dateProps,
      min: "2026-04-10",
      max: "2027-05-20",
    });
    await w.find('[aria-label="Choose month"]').trigger("click");
    await settle();
    expect(document.activeElement?.textContent).toBe("October");
    const months = w.find("fieldset");
    expect(
      months.findAll("button").filter((b) => b.attributes("tabindex") === "0"),
    ).toHaveLength(1);
    await active(w).trigger("keydown", { key: "Home" });
    await settle();
    expect(document.activeElement?.textContent).toBe("April");
    await active(w).trigger("keydown", { key: "ArrowRight" });
    await settle();
    expect(document.activeElement?.textContent).toBe("May");
    await active(w).trigger("click");
    await settle();
    expect(w.find('[data-date="2026-05-01"]').exists()).toBe(true);
    await w.find('[aria-label="Choose month"]').trigger("click");
    await settle();
    await active(w).trigger("keydown", { key: "Escape" });
    await settle();
    expect(document.activeElement).toBe(
      w.find('[aria-label="Choose month"]').element,
    );
  });
  it("pages twelve-year choices without changing to days, and month view pages by a year", async () => {
    const w = render(DateRangePicker, dateProps);
    await w.find('[aria-label="Choose year"]').trigger("click");
    await settle();
    expect(w.find("fieldset").text()).toContain("2026");
    await w.find('[aria-label="Next years"]').trigger("click");
    await settle();
    expect(w.find("fieldset").text()).toContain("2028");
    expect(
      w.find('[aria-label="Choose year"]').attributes("aria-expanded"),
    ).toBe("true");
    await w.find("fieldset button").trigger("keydown", { key: "Escape" });
    await settle();
    await w.find('[aria-label="Choose month"]').trigger("click");
    await settle();
    await w.find('[aria-label="Next year"]').trigger("click");
    await settle();
    expect(w.find('[aria-label="Choose year"]').text()).toContain("2027");
    expect(
      w.find('[aria-label="Choose month"]').attributes("aria-expanded"),
    ).toBe("true");
  });
  it("synchronizes a controlled range with the visible month and preserves parent ownership", async () => {
    const w = render(DateRangePicker, {
      ...dateProps,
      modelValue: { from: "2026-10-15" },
    });
    await w.setProps({ modelValue: { from: "2027-02-03", to: "2027-02-05" } });
    await settle();
    expect(w.find('[data-date="2027-02-03"]').exists()).toBe(true);
    await w.find('[data-date="2027-02-10"]').trigger("click");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([
      { from: "2027-02-10" },
    ]);
    expect(
      w
        .find('[data-date="2027-02-03"]')
        .element.parentElement?.getAttribute("aria-selected"),
    ).toBe("true");
  });
  it("opens the standalone dropdown, focuses the calendar, and restores its trigger", async () => {
    const w = render(DateRangePickerDropdown, dateProps);
    const trigger = w.find('[aria-haspopup="dialog"]');
    await trigger.trigger("click");
    await settle();
    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(document.activeElement?.getAttribute("data-date")).toBe(
      "2026-10-01",
    );
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await settle();
    expect(document.activeElement).toBe(trigger.element);
  });
});
const colorComponents = {
  ColorPicker,
  ColorPickerArea,
  ColorPickerHue,
  ColorPickerAlpha,
  ColorPickerHexInput,
  ColorPickerTrigger,
  ColorPickerContent,
  ColorPickerPresets,
  ColorPickerPreset,
};
function color(template: string) {
  return render(defineComponent({ components: colorComponents, template }));
}
describe("color surfaces and channel semantics", () => {
  it("supports Home/End/Page and shift arrow steps on the 2D area and hue rail", async () => {
    const w = color(
      '<ColorPicker default-value="#ff0000"><ColorPickerArea/><ColorPickerHue/></ColorPicker>',
    );
    let area = w.find('[aria-roledescription="2D slider"]');
    await area.trigger("keydown", { key: "Home" });
    expect(area.attributes("aria-valuenow")).toBe("0");
    await area.trigger("keydown", { key: "End" });
    expect(area.attributes("aria-valuenow")).toBe("100");
    await area.trigger("keydown", { key: "PageDown" });
    expect(area.attributes("aria-valuetext")).toContain("brightness 90%");
    const hue = w.find('[aria-label="Hue"]');
    await hue.trigger("keydown", { key: "End" });
    expect(hue.attributes("aria-valuenow")).toBe("360");
    await hue.trigger("keydown", { key: "ArrowLeft", shiftKey: true });
    expect(hue.attributes("aria-valuenow")).toBe("350");
  });
  it("restores a rejected controlled color while retaining accepted parent updates", async () => {
    const Controlled = defineComponent({
        components: colorComponents,
        template:
          '<ColorPicker model-value="#ff0000"><ColorPickerHue/></ColorPicker>',
      }),
      w = render(Controlled);
    await w
      .find('[aria-label="Hue"]')
      .trigger("keydown", { key: "ArrowRight" });
    await settle();
    expect(w.find('[aria-label="Hue"]').attributes("aria-valuenow")).toBe("0");
    const Accepted = defineComponent({
        components: colorComponents,
        setup() {
          return { value: ref("#ff0000") };
        },
        template:
          '<ColorPicker v-model="value"><ColorPickerHue/></ColorPicker>',
      }),
      accepted = render(Accepted);
    await accepted
      .find('[aria-label="Hue"]')
      .trigger("keydown", { key: "ArrowRight" });
    await settle();
    expect(
      accepted.find('[aria-label="Hue"]').attributes("aria-valuenow"),
    ).toBe("1");
  });
  it("preserves the stored alpha while its display is temporarily disabled", async () => {
    const w = render(ColorPicker, {
      modelValue: "#ff000080",
      name: "color",
      alpha: true,
    });
    expect(w.find('input[type="hidden"]').attributes("value")).toBe(
      "#ff000080",
    );
    await w.setProps({ alpha: false });
    expect(w.find('input[type="hidden"]').attributes("value")).toBe("#ff0000");
    await w.setProps({ alpha: true });
    expect(w.find('input[type="hidden"]').attributes("value")).toBe(
      "#ff000080",
    );
  });
  it("updates full hex drafts live, commits short hex on blur, and rejects invalid drafts", async () => {
    const w = color(
        '<ColorPicker default-value="#ff0000"><ColorPickerHexInput/></ColorPicker>',
      ),
      picker = w.findComponent(ColorPicker),
      input = w.find("input");
    await input.setValue("00ff00");
    expect(picker.emitted("update:modelValue")?.at(-1)).toEqual(["#00ff00"]);
    await input.trigger("blur");
    expect(picker.emitted("valueCommit")?.at(-1)).toEqual(["#00ff00"]);
    await input.setValue("abc");
    expect(picker.emitted("update:modelValue")?.at(-1)).toEqual(["#00ff00"]);
    await input.trigger("blur");
    expect(picker.emitted("valueCommit")?.at(-1)).toEqual(["#aabbcc"]);
    await input.setValue("no");
    await input.trigger("blur");
    expect((input.element as HTMLInputElement).value).toBe("AABBCC");
  });
  it("lifts a loupe while captured and commits only when the drag ends", async () => {
    const w = color("<ColorPicker><ColorPickerArea/></ColorPicker>"),
      picker = w.findComponent(ColorPicker),
      area = w.find(".cursor-crosshair");
    vi.spyOn(area.element, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 100,
      right: 200,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON() {},
    });
    await area.trigger("pointerdown", {
      button: 0,
      pointerId: 1,
      clientX: 100,
      clientY: 25,
    });
    expect(w.find("[data-color-picker-loupe]").exists()).toBe(true);
    expect(
      w.find('[aria-roledescription="2D slider"]').attributes("aria-valuetext"),
    ).toBe("Saturation 50%, brightness 75%");
    expect(picker.emitted("valueCommit")).toBeUndefined();
    await area.trigger("pointerup", { pointerId: 1 });
    expect(picker.emitted("valueCommit")).toHaveLength(1);
  });
  it("opens the chip morph panel and preserves focus, keyboard dismissal and normalized presets", async () => {
    const w = color(
        '<ColorPicker default-value="#ff0000"><ColorPickerTrigger/><ColorPickerContent><ColorPickerArea/><ColorPickerPresets><ColorPickerPreset value="#f00" label="Red"/><ColorPickerPreset value="#00f" label="Blue"/></ColorPickerPresets></ColorPickerContent></ColorPicker>',
      ),
      trigger = w.find("[data-color-picker-trigger]");
    await trigger.trigger("click");
    await settle();
    expect(w.find('[role="dialog"]').exists()).toBe(true);
    expect(document.activeElement?.getAttribute("aria-roledescription")).toBe(
      "2D slider",
    );
    expect(w.find('[aria-label="Red"]').attributes("aria-pressed")).toBe(
      "true",
    );
    await w.find('[aria-label="Blue"]').trigger("click");
    expect(w.find('[aria-label="Blue"]').attributes("aria-pressed")).toBe(
      "true",
    );
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await settle();
    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger.element);
  });
  it("measures the preset ring in untransformed layout coordinates while its panel morphs", async () => {
    const w = color(
      '<ColorPicker default-value="#f00"><ColorPickerPresets><ColorPickerPreset value="#f00" label="Red"/><ColorPickerPreset value="#00f" label="Blue"/></ColorPickerPresets></ColorPicker>',
    );
    await settle();
    const blue = w.find('[aria-label="Blue"]');
    Object.defineProperties(blue.element, {
      offsetWidth: { configurable: true, value: 24 },
      offsetHeight: { configurable: true, value: 24 },
      offsetLeft: { configurable: true, value: 32 },
      offsetTop: { configurable: true, value: 0 },
    });
    vi.spyOn(blue.element, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      toJSON() {},
    });
    await blue.trigger("click");
    await settle();
    await new Promise((resolve) => setTimeout(resolve, 30));
    const ring = w.find<HTMLElement>("[data-color-picker-preset-ring]");
    expect(ring.element.style.width).toBe("30px");
    expect(ring.element.style.height).toBe("30px");
  });
  it("dismisses its floating panel before a containing modal", async () => {
    const dismiss = vi.fn(),
      Modal = defineComponent({
        setup() {
          const open = ref(true),
            panel = ref<HTMLElement | null>(null);
          useOverlay(open, panel, () => {
            dismiss();
            open.value = false;
          });
          return { panel };
        },
        template: '<div ref="panel" tabindex="-1"><slot/></div>',
      }),
      w = render(
        defineComponent({
          components: { ...colorComponents, Modal },
          template:
            "<Modal><ColorPicker><ColorPickerTrigger/><ColorPickerContent><ColorPickerArea/></ColorPickerContent></ColorPicker></Modal>",
        }),
      );
    await w.find("[data-color-picker-trigger]").trigger("click");
    await settle();
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    );
    await settle();
    expect(
      w.find("[data-color-picker-trigger]").attributes("aria-expanded"),
    ).toBe("false");
    expect(dismiss).not.toHaveBeenCalled();
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(dismiss).toHaveBeenCalledTimes(1);
  });
  it("uses the same negative-strength quadratic hop in both horizontal directions and across rows", () => {
    const arc = createPresetArc(),
      first = arc({ x: 0, y: 0 }, { x: 100, y: 0 }),
      back = arc({ x: 100, y: 0 }, { x: 0, y: 0 });
    expect(first(0)).toEqual({ x: 0, y: 0 });
    expect(first(1)).toEqual({ x: 100, y: 0 });
    expect(first(0.5).y).toBe(-15);
    expect(back(0.5).y).toBe(-15);
    const diagonal = arc({ x: 0, y: 0 }, { x: 40, y: 60 });
    expect(diagonal(0.5).x).not.toBe(20);
    expect(diagonal(1)).toEqual({ x: 40, y: 60 });
  });
});
