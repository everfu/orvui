import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { Switch } from "../../packages/vue/src/motion/switch";
import { Checkbox } from "../../packages/vue/src/motion/checkbox";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../../packages/vue/src/motion/collapsible";
import {
  Alert,
  AlertTitle,
  AlertClose,
} from "../../packages/vue/src/motion/alert";
import { RadioGroup, RadioGroupItem } from "../../packages/vue/src/motion/radio";
import { DateRangePicker } from "../../packages/vue/src/motion/date-range-picker";
import {
  ColorPicker,
  ColorPickerChannels,
} from "../../packages/vue/src/motion/color-picker";
import { SortableList } from "../../packages/vue/src/motion/sortable-stack";
import { WaveSlider } from "../../packages/vue/src/motion/range-slider";
import { snapSliderValue } from "../../packages/vue/src/motion/range-slider/src/useSlider";
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
  wrappers.splice(0).forEach((w) => w.unmount());
  document.body.innerHTML = "";
  vi.useRealTimers();
  vi.restoreAllMocks();
});
describe("Motion interaction contracts", () => {
  it("uncontrolled switch owns its state and disabled switch does not change", async () => {
    const wrapper = render(Switch, { label: "Notifications" });
    const button = wrapper.find("button");
    expect(button.attributes("aria-checked")).toBe("false");
    await button.trigger("click");
    expect(button.attributes("aria-checked")).toBe("true");
    await button.trigger("click");
    expect(button.attributes("aria-checked")).toBe("false");
    await wrapper.setProps({ disabled: true });
    await button.trigger("click");
    expect(button.attributes("aria-checked")).toBe("false");
  });
  it("checkbox exposes mixed state and emits a boolean while controlled", async () => {
    const wrapper = render(Checkbox, {
      modelValue: false,
      indeterminate: true,
      label: "Select all",
    });
    expect(wrapper.find("button").attributes("aria-checked")).toBe("mixed");
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("update:modelValue")).toEqual([[true]]);
    expect(wrapper.find("button").attributes("aria-checked")).toBe("mixed");
  });
  it("collapsible toggles without a model binding", async () => {
    const wrapper = render(
      Collapsible,
      {},
      {
        default: () => [
          h(CollapsibleTrigger, {}, () => "Details"),
          h(CollapsibleContent, {}, () => "The details"),
        ],
      },
    );
    const button = wrapper.find("button");
    expect(button.attributes("aria-expanded")).toBe("false");
    expect(
      (wrapper.find('[role="region"]').element as HTMLElement).style.height,
    ).toBe("1px");
    await button.trigger("click");
    expect(button.attributes("aria-expanded")).toBe("true");
    expect(wrapper.find('[role="region"]').text()).toBe("The details");
    await button.trigger("click");
    expect(button.attributes("aria-expanded")).toBe("false");
  });
  it("alert starts open and dismisses without a binding", async () => {
    const wrapper = render(
      Alert,
      { variant: "warning" },
      { default: () => [h(AlertTitle, {}, () => "Warning"), h(AlertClose)] },
    );
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("update:open")).toEqual([[false]]);
  });
  it("radio keyboard focus selects the next option and skips disabled options", async () => {
    const wrapper = render(
      RadioGroup,
      { defaultValue: "one" },
      {
        default: () => [
          h(RadioGroupItem, { value: "one", label: "One" }),
          h(RadioGroupItem, { value: "two", label: "Two", disabled: true }),
          h(RadioGroupItem, { value: "three", label: "Three" }),
        ],
      },
    );
    const buttons = wrapper.findAll("button");
    buttons[0].element.focus();
    await wrapper
      .find('[role="radiogroup"]')
      .trigger("keydown", { key: "ArrowDown" });
    await nextTick();
    expect(document.activeElement).toBe(buttons[2].element);
    expect(buttons[2].attributes("aria-checked")).toBe("true");
  });
  it("date range picker orders backwards selection and rejects a range across a blocked date", async () => {
    const wrapper = render(DateRangePicker, {
      defaultMonth: "2026-10-01",
      showSummary: false,
      isDateDisabled: (date: string) => date === "2026-10-10",
    });
    await wrapper.find('[data-date="2026-10-15"]').trigger("click");
    await wrapper.find('[data-date="2026-10-12"]').trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([
      { from: "2026-10-12", to: "2026-10-15" },
    ]);
    await wrapper.find('[data-date="2026-10-05"]').trigger("click");
    await wrapper.find('[data-date="2026-10-15"]').trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([
      { from: "2026-10-05" },
    ]);
    expect(wrapper.text()).toContain("unavailable dates");
  });
  it("HSL fields change hue and opacity while retaining color-space semantics", async () => {
    const wrapper = render(
      ColorPicker,
      { defaultValue: "#ff0000" },
      { default: () => h(ColorPickerChannels, { format: "hsl" }) },
    );
    const hue = wrapper.find('input[aria-label="Hue"]');
    await hue.setValue("120");
    await hue.trigger("blur");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["#00ff00"]);
    const alpha = wrapper.find('input[aria-label="Opacity percent"]');
    await alpha.setValue("50");
    await alpha.trigger("blur");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["#00ff0080"]);
  });
  it("sortable keyboard ordering can be undone", async () => {
    const wrapper = render(SortableList, {
      defaultItems: [
        { id: "one", label: "One" },
        { id: "two", label: "Two" },
        { id: "three", label: "Three" },
      ],
      getItemLabel: (item: any) => item.label,
    });
    const handle = wrapper.find('[data-sortable-id="one"]');
    await handle.trigger("keydown", { key: "End" });
    expect(
      (wrapper.emitted("itemsChange")?.at(-1)?.[0] as any[]).map(
        (item: any) => item.id,
      ),
    ).toEqual(["two", "three", "one"]);
    const undo = wrapper
      .findAll("button")
      .find((button) => button.text().includes("Undo"))!;
    expect(undo.attributes("disabled")).toBeUndefined();
    await undo.trigger("click");
    expect(
      (wrapper.emitted("itemsChange")?.at(-1)?.[0] as any[]).map(
        (item: any) => item.id,
      ),
    ).toEqual(["one", "two", "three"]);
  });
  it("slider handles a fractional range that does not divide by its step", async () => {
    expect(snapSliderValue(9.7, 0, 10, 4)).toBe(10);
    expect(snapSliderValue(0.27, 0, 0.3, 0.1)).toBe(0.3);
    const wrapper = render(WaveSlider, {
      min: 0,
      max: 10,
      step: 4,
      defaultValue: 8,
      ariaLabel: "Intensity",
    });
    await wrapper.find('[role="slider"]').trigger("keydown", { key: "End" });
    expect(wrapper.find('[role="slider"]').attributes("aria-valuenow")).toBe(
      "10",
    );
    await wrapper.find('[role="slider"]').trigger("keydown", { key: "Home" });
    expect(wrapper.find('[role="slider"]').attributes("aria-valuenow")).toBe(
      "0",
    );
  });
});

describe("Context menu keyboard and touch behavior", () => {
  async function menu() {
    const {
      ContextMenu,
      ContextMenuTrigger,
      ContextMenuContent,
      ContextMenuItem,
      ContextMenuCheckboxItem,
    } = await import("../../packages/vue/src/motion/context-menu");
    return render(
      ContextMenu,
      {},
      {
        default: () => [
          h(ContextMenuTrigger, {}, () =>
            h("button", { id: "context-trigger" }, "Open menu"),
          ),
          h(ContextMenuContent, {}, () => [
            h(ContextMenuItem, { textValue: "Back" }, () => "Back"),
            h(
              ContextMenuItem,
              { disabled: true, textValue: "Blocked" },
              () => "Blocked",
            ),
            h(ContextMenuItem, { textValue: "Copy" }, () => "Copy"),
            h(ContextMenuCheckboxItem, {}, () => "Bookmarks"),
          ]),
        ],
      },
    );
  }
  it("uses the original trigger and supports keyboard invocation, disabled skipping, typeahead and Escape focus restoration", async () => {
    vi.useFakeTimers();
    const wrapper = await menu();
    const trigger = wrapper.find("#context-trigger");
    (trigger.element as HTMLElement).focus();
    await trigger.trigger("keydown", { key: "F10", shiftKey: true });
    await vi.advanceTimersByTimeAsync(50);
    const panel = document.querySelector<HTMLElement>('[role="menu"]')!;
    const items = Array.from(
      panel.querySelectorAll<HTMLButtonElement>("[data-context-menu-item]"),
    );
    expect(trigger.element.parentElement?.classList.contains("contents")).toBe(
      true,
    );
    expect(document.activeElement).toBe(items[0]);
    items[0].dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    await nextTick();
    expect(document.activeElement).toBe(items[2]);
    panel.dispatchEvent(
      new KeyboardEvent("keydown", { key: "b", bubbles: true }),
    );
    await nextTick();
    expect(document.activeElement).toBe(items[0]);
    panel.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await nextTick();
    expect(wrapper.emitted("update:open")?.at(-1)).toEqual([false]);
    expect(document.activeElement).toBe(trigger.element);
  });
  it("cancels a long press after movement beyond ten pixels", async () => {
    vi.useFakeTimers();
    const wrapper = await menu();
    const trigger = wrapper.find("#context-trigger");
    await trigger.trigger("pointerdown", {
      pointerType: "touch",
      pointerId: 1,
      clientX: 10,
      clientY: 10,
    });
    await vi.advanceTimersByTimeAsync(200);
    await trigger.trigger("pointermove", {
      pointerType: "touch",
      pointerId: 1,
      clientX: 30,
      clientY: 10,
    });
    await vi.advanceTimersByTimeAsync(600);
    expect(wrapper.emitted("update:open")).toBeUndefined();
  });
  it("opens a stationary pen long press after 520 ms", async () => {
    vi.useFakeTimers();
    const wrapper = await menu();
    await wrapper.find("#context-trigger").trigger("pointerdown", {
      pointerType: "pen",
      pointerId: 2,
      clientX: 20,
      clientY: 20,
    });
    await vi.advanceTimersByTimeAsync(519);
    expect(wrapper.emitted("update:open")).toBeUndefined();
    await vi.advanceTimersByTimeAsync(2);
    expect(wrapper.emitted("update:open")?.at(-1)).toEqual([true]);
  });
});
