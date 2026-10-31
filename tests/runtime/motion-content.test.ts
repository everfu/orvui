import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { h, nextTick } from "vue";
import { ActionSwapButton } from "../../packages/vue/src/motion/action-swap";
import { Input } from "../../packages/vue/src/motion/input";
import { ExpandableChip } from "../../packages/vue/src/motion/expandable-control";
import { AnimatedBadge } from "../../packages/vue/src/motion/animated-badge";
import { Checkbox } from "../../packages/vue/src/motion/checkbox";
import { Switch } from "../../packages/vue/src/motion/switch";
import { RadioGroup, RadioGroupItem } from "../../packages/vue/src/motion/radio";
import {
  ColorSelector,
  ColorSelectorItem,
} from "../../packages/vue/src/motion/color-selector";
import { Dock, DockItem } from "../../packages/vue/src/motion/dock";
const wrappers: VueWrapper[] = [],
  nativeAnimate = Element.prototype.animate;
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
  document.getAnimations?.().forEach((animation) => {
    if (Number.isFinite(Number(animation.effect?.getTiming().iterations)))
      animation.finish();
  });
  await nextTick();
  await Promise.resolve();
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});
function render(component: any, props: any = {}, slots: any = {}) {
  const wrapper = mount(component, { props, slots, attachTo: document.body });
  wrappers.push(wrapper);
  return wrapper;
}
describe("Rich content and source control semantics", () => {
  it("ActionSwap renders a VNode label and component icon and cycles to the next item", async () => {
    const wrapper = render(ActionSwapButton, {
      items: [
        {
          id: "one",
          label: h("strong", { "data-rich-label": "" }, "Rich label"),
          icon: () => h("svg", { "data-rich-icon": "" }),
        },
        { id: "two", label: "Second" },
      ],
    });
    expect(wrapper.find("[data-rich-label]").text()).toBe("Rich label");
    expect(wrapper.find("[data-rich-icon]").exists()).toBe(true);
    await wrapper.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["two"]);
  });
  it("applies every Input classNames boundary to its actual node", async () => {
    const classNames = {
        root: "custom-root",
        label: "custom-label",
        field: "custom-field",
        input: "custom-input",
        leftIcon: "custom-left",
        rightIcon: "custom-right",
        successIcon: "custom-success",
        errorMessage: "custom-error",
      },
      wrapper = render(Input, {
        label: "Name",
        leftIcon: h("svg"),
        rightIcon: h("button", {}, "Clear"),
        classNames,
        error: "Required",
      });
    for (const name of [
      "root",
      "label",
      "field",
      "input",
      "left",
      "right",
      "error",
    ])
      expect(wrapper.find(".custom-" + name).exists()).toBe(true);
    await wrapper.setProps({ success: true, error: false });
    expect(wrapper.find("svg.custom-success").exists()).toBe(true);
    expect(wrapper.find(".custom-right").exists()).toBe(false);
  });
  it("expandable chip opens by click and restores the trigger after its action", async () => {
    const wrapper = render(ExpandableChip, {
        label: "Vue",
        actionLabel: "Remove Vue",
      }),
      buttons = wrapper.findAll("button");
    expect(buttons[0].attributes("aria-expanded")).toBe("false");
    await wrapper.trigger("mouseenter");
    expect(buttons[0].attributes("aria-expanded")).toBe("false");
    await buttons[0].trigger("click");
    expect(buttons[1].attributes("disabled")).toBeUndefined();
    await buttons[1].trigger("click");
    expect(wrapper.emitted("action")).toHaveLength(1);
    expect(buttons[0].attributes("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(buttons[0].element);
  });
  it("dock does not nest a default button around child links and badge has separate icon and label slots", () => {
    const dock = render(
      Dock,
      {},
      {
        default: () =>
          h(DockItem, {}, () => h("a", { href: "#example" }, "Link")),
      },
    );
    expect(dock.findAll("button")).toHaveLength(0);
    expect(dock.find("a").exists()).toBe(true);
    const badge = render(
      AnimatedBadge,
      { status: "success" },
      { default: () => "Saved" },
    );
    expect(badge.find("[data-badge-icon]").exists()).toBe(true);
    expect(badge.find("[data-badge-label]").text()).toBe("Saved");
  });
  it("routes native ARIA names and external descriptions onto form controls, and leaves one radio reachable without changing selection on focus", async () => {
    const checkbox = render(
      Checkbox,
      { label: "Visible", description: "Help", ariaLabel: "Override" },
      { default: () => "" },
    );
    await checkbox.setProps({ "aria-describedby": "external-help" } as any);
    expect(checkbox.find("button").attributes("aria-label")).toBe("Override");
    expect(
      checkbox.find("button").attributes("aria-labelledby"),
    ).toBeUndefined();
    expect(checkbox.find("button").attributes("aria-describedby")).toContain(
      "external-help",
    );
    const toggle = render(Switch, { "aria-label": "Notifications" });
    expect(toggle.find("button").attributes("aria-label")).toBe(
      "Notifications",
    );
    const group = render(
      RadioGroup,
      {},
      {
        default: () => [
          h(RadioGroupItem, { value: "one", label: "One" }),
          h(RadioGroupItem, { value: "two", label: "Two" }),
        ],
      },
    );
    await nextTick();
    const radios = group.findAll("[role=radio]");
    expect(radios.map((radio) => radio.attributes("tabindex"))).toEqual([
      "0",
      "-1",
    ]);
    (radios[0].element as HTMLElement).focus();
    await nextTick();
    expect(group.emitted("update:modelValue")).toBeUndefined();
    await radios[0].trigger("keydown", { key: "ArrowDown" });
    expect(group.emitted("update:modelValue")?.at(-1)).toEqual(["two"]);
  });
  it("restores a controlled Input value when the parent rejects typing and merges external help IDs", async () => {
    const wrapper = render(Input, {
        modelValue: "Parent",
        error: "Required",
        "aria-describedby": "external-help",
      }),
      input = wrapper.find("input");
    await input.setValue("Draft");
    await nextTick();
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["Draft"]);
    expect(input.element.value).toBe("Parent");
    expect(input.attributes("aria-describedby")).toContain("external-help");
    expect(input.attributes("aria-describedby")).toContain("-error");
  });
  it("restores native checked state when a controlled ColorSelector request is rejected", async () => {
    const wrapper = render(
      ColorSelector,
      { modelValue: "one" },
      {
        default: () => [
          h(ColorSelectorItem, { value: "one", label: "One", color: "red" }),
          h(ColorSelectorItem, { value: "two", label: "Two", color: "blue" }),
        ],
      },
    );
    await nextTick();
    const radios = wrapper.findAll("input");
    await radios[1].setValue(true);
    await nextTick();
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["two"]);
    expect((radios[0].element as HTMLInputElement).checked).toBe(true);
    expect((radios[1].element as HTMLInputElement).checked).toBe(false);
  });
});
