import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { h, nextTick } from "vue";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../packages/vue/src/motion/tabs";
import { BouncyAccordion } from "../packages/vue/src/motion/bouncy-accordion";
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
describe("Tabs source accessibility and grouping", () => {
  it("keeps one reachable enabled tab with no selected value and keeps inactive panels in the DOM", async () => {
    const wrapper = mount(Tabs, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(
            TabsList,
            { class: "custom-list", wrapperClassName: "custom-wrapper" },
            () => [
              h(
                TabsTrigger,
                { value: "blocked", disabled: true },
                () => "Blocked",
              ),
              h(
                TabsTrigger,
                { value: "one", indicatorClassName: "custom-indicator" },
                () => "One",
              ),
              h(TabsTrigger, { value: "two" }, () => "Two"),
            ],
          ),
          h(TabsContent, { value: "one" }, () => "First panel"),
          h(TabsContent, { value: "two" }, () => "Second panel"),
        ],
      },
    });
    wrappers.push(wrapper);
    await nextTick();
    const tabs = wrapper.findAll("[role=tab]");
    expect(tabs.map((tab) => tab.attributes("tabindex"))).toEqual([
      "-1",
      "0",
      "-1",
    ]);
    expect(wrapper.find("[role=tablist]").classes()).toContain("custom-list");
    expect(wrapper.find(".custom-wrapper").classes()).not.toContain(
      "custom-list",
    );
    expect(wrapper.findAll("[role=tabpanel]")).toHaveLength(2);
    expect(
      wrapper
        .findAll("[role=tabpanel]")
        .every((panel) => panel.attributes("hidden") !== undefined),
    ).toBe(true);
    await tabs[1].trigger("click");
    expect(wrapper.find("[data-tabs-indicator]").classes()).toContain(
      "custom-indicator",
    );
    expect(tabs[1].attributes("data-tabs-value")).toBe("one");
    expect(tabs[1].attributes("aria-controls")).toBe(
      wrapper.find("[role=tabpanel]").attributes("id"),
    );
    expect(
      wrapper.find("[role=tabpanel]").attributes("hidden"),
    ).toBeUndefined();
  });
  it("uses RTL arrow direction, skips disabled tabs and wraps", async () => {
    const wrapper = mount(Tabs, {
      props: { defaultValue: "one" },
      attachTo: document.body,
      slots: {
        default: () =>
          h(TabsList, { style: { direction: "rtl" } }, () => [
            h(TabsTrigger, { value: "one" }, () => "One"),
            h(
              TabsTrigger,
              { value: "blocked", disabled: true },
              () => "Blocked",
            ),
            h(TabsTrigger, { value: "two" }, () => "Two"),
          ]),
      },
    });
    wrappers.push(wrapper);
    await nextTick();
    const tabs = wrapper.findAll("[role=tab]");
    (tabs[0].element as HTMLElement).focus();
    await tabs[0].trigger("keydown", { key: "ArrowLeft" });
    expect(tabs[2].attributes("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(tabs[2].element);
    await tabs[2].trigger("keydown", { key: "ArrowLeft" });
    expect(tabs[0].attributes("aria-selected")).toBe("true");
  });
  it("accordion keeps joined closed groups and opens only one accessible region", async () => {
    const wrapper = mount(BouncyAccordion, {
      props: {
        items: [
          { id: "one", title: "One", description: "First" },
          { id: "two", title: "Two", description: "Second" },
          { id: "three", title: "Three", description: "Third" },
        ],
      },
      attachTo: document.body,
    });
    wrappers.push(wrapper);
    const buttons = wrapper.findAll("button");
    await buttons[1].trigger("click");
    expect(buttons.map((button) => button.attributes("aria-expanded"))).toEqual(
      ["false", "true", "false"],
    );
    const sections = wrapper.findAll("section");
    expect(sections[0].attributes("inert")).toBeDefined();
    expect(sections[1].attributes("inert")).toBeUndefined();
    expect(sections[1].text()).toBe("Second");
    expect(
      (sections[1].element.parentElement?.parentElement as HTMLElement).style
        .marginTop,
    ).toBe("12px");
    await buttons[2].trigger("click");
    expect(buttons[1].attributes("aria-expanded")).toBe("false");
    expect(buttons[2].attributes("aria-expanded")).toBe("true");
  });
});
