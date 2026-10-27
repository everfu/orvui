import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { h, nextTick, type VNodeChild } from "vue";
import { StatefulButton } from "..";
const wrappers: VueWrapper[] = [];
beforeAll(() => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  });
});
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
});
function render(
  props: Record<string, unknown> = {},
  slots: { default?: () => VNodeChild; icon?: () => VNodeChild } = {
    default: () => "Save changes",
  },
) {
  const wrapper = mount(StatefulButton, { props, slots });
  wrappers.push(wrapper);
  return wrapper;
}
describe("StatefulButton labels and presence", () => {
  it("keeps a single accessible label while preserving spaces in its rolling glyphs", () => {
    const wrapper = render();
    expect(wrapper.get(".sr-only").text()).toBe("Save changes");
    const measure = wrapper.get(".invisible");
    expect(measure.attributes("aria-hidden")).toBe("true");
    expect(
      measure
        .findAll("span")
        .map((span) => span.text())
        .join(""),
    ).toBe("Savechanges");
    expect(measure.findAll("span")[4].element.textContent).toBe(" ");
    expect(wrapper.find('[aria-live="polite"]').exists()).toBe(true);
  });
  it("preserves caller disabling and native attributes across idle and busy states", async () => {
    const wrapper = render({
      disabled: true,
      type: "submit",
      "data-save": "settings",
    });
    expect(wrapper.get("button").attributes("disabled")).toBeDefined();
    expect(wrapper.get("button").attributes("type")).toBe("submit");
    expect(wrapper.get("button").attributes("data-save")).toBe("settings");
    await wrapper.setProps({
      disabled: false,
      state: "loading",
      loadingText: "Saving",
    });
    expect(wrapper.get("button").attributes("aria-busy")).toBe("true");
    expect(wrapper.get("button").attributes("disabled")).toBeDefined();
    expect(wrapper.get(".sr-only").text()).toBe("Saving");
    await wrapper.setProps({ state: "success" });
    expect(wrapper.get("button").attributes("aria-busy")).toBe("false");
    expect(wrapper.get("button").attributes("disabled")).toBeUndefined();
    expect(wrapper.get(".sr-only").text()).toBe("Done");
  });
  it("retains rich state labels and the caller icon without splitting their markup", async () => {
    const wrapper = render(
      {
        icon: h("svg", { "data-idle-icon": "" }),
        successText: h("strong", "Published"),
      },
      { default: () => h("em", "Publish") },
    );
    expect(wrapper.find(".sr-only").exists()).toBe(false);
    expect(wrapper.find("[data-idle-icon]").exists()).toBe(true);
    expect(wrapper.find("em").exists()).toBe(true);
    await wrapper.setProps({ state: "success" });
    await nextTick();
    expect(wrapper.find("strong").text()).toBe("Published");
    expect(wrapper.find(".sr-only").exists()).toBe(false);
  });
});
