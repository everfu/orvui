import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { h, nextTick, defineComponent } from "vue";
import { SharedLayoutBg } from "..";
describe("shared layout list", () => {
  it("renders each item and preserves the original handler", async () => {
    let calls = 0;
    const wrapper = mount(SharedLayoutBg, {
      props: { as: "ul" },
      slots: {
        default: () => [
          h("li", { key: "a", onMouseenter: () => calls++ }, [
            h("button", "First"),
          ]),
          h("li", { key: "b" }, [h("button", "Second")]),
        ],
      },
      attachTo: document.body,
    });
    await wrapper.findAll("li")[0].trigger("mouseenter");
    expect(calls).toBe(1);
    expect(wrapper.findAll("li")).toHaveLength(2);
    expect(
      wrapper.findAll("li")[0].find("[style]").attributes("style"),
    ).toContain("left: -20px");
    wrapper.unmount();
  });
  it("namespaces the layout indicator between independent lists", async () => {
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h("div", [
            h(SharedLayoutBg, {}, () => h("button", "First")),
            h(SharedLayoutBg, {}, () => h("button", "Second")),
          ]),
      }),
      { attachTo: document.body },
    );
    const lists = wrapper.findAllComponents(SharedLayoutBg);
    await lists[0].find("button").trigger("mouseenter");
    await lists[1].find("button").trigger("mouseenter");
    await nextTick();
    const a = lists[0]
      .findAllComponents({ name: "Motion.div" })
      .map((item) => item.props("layoutId"))
      .filter(Boolean);
    const b = lists[1]
      .findAllComponents({ name: "Motion.div" })
      .map((item) => item.props("layoutId"))
      .filter(Boolean);
    expect(a).toHaveLength(1);
    expect(b).toHaveLength(1);
    expect(a[0]).not.toBe(b[0]);
    wrapper.unmount();
  });
});
