import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import {
  defineComponent,
  h,
  ref,
  nextTick,
  Teleport,
  onMounted,
  onBeforeUnmount,
} from "vue";
import {
  useControllable,
  useScrollLock,
  useReducedMotion,
  useOverlay,
  useFloatingLayer,
} from "../../packages/vue/src/lib/composables";
describe("shared Vue behavior", () => {
  it("keeps a controlled value owned by its caller and emits updates", async () => {
    const wrapper = mount(
      defineComponent({
        props: { modelValue: { type: String, default: undefined } },
        emits: ["update:modelValue"],
        setup(props, { emit }) {
          const value = useControllable(props, "modelValue", emit, "initial");
          return () =>
            h("button", { onClick: () => (value.value = "next") }, value.value);
        },
      }),
      { props: { modelValue: "parent" } },
    );
    await wrapper.trigger("click");
    expect(wrapper.text()).toBe("parent");
    expect(wrapper.emitted("update:modelValue")).toEqual([["next"]]);
    await wrapper.setProps({ modelValue: "next" });
    expect(wrapper.text()).toBe("next");
    wrapper.unmount();
  });
  it("supports uncontrolled state", async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          const value = useControllable({}, "modelValue", () => {}, "initial");
          return () =>
            h("button", { onClick: () => (value.value = "next") }, value.value);
        },
      }),
    );
    await wrapper.trigger("click");
    expect(wrapper.text()).toBe("next");
    wrapper.unmount();
  });
  it("retains body scroll lock until the last overlay releases it", async () => {
    document.body.style.overflow = "scroll";
    const Overlay = defineComponent({
      setup() {
        useScrollLock(ref(true));
        return () => h("div");
      },
    });
    const a = mount(Overlay),
      b = mount(Overlay);
    expect(document.body.style.overflow).toBe("hidden");
    a.unmount();
    expect(document.body.style.overflow).toBe("hidden");
    b.unmount();
    expect(document.body.style.overflow).toBe("scroll");
    document.body.style.overflow = "";
  });
  it("only dismisses the top nested overlay", async () => {
    const closes = [vi.fn(), vi.fn()];
    const make = (index: number) =>
      defineComponent({
        setup() {
          const open = ref(true),
            panel = ref<HTMLElement | null>(null);
          useOverlay(open, panel, () => {
            closes[index]();
            open.value = false;
          });
          return () =>
            h("div", { ref: panel, tabindex: -1 }, [h("button", "Close")]);
        },
      });
    const a = mount(make(0), { attachTo: document.body }),
      b = mount(make(1), { attachTo: document.body });
    await nextTick();
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    expect(closes[1]).toHaveBeenCalledTimes(1);
    expect(closes[0]).not.toHaveBeenCalled();
    await nextTick();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(closes[0]).toHaveBeenCalledTimes(1);
    b.unmount();
    a.unmount();
  });
  it("restores scroll coordinates and existing inline styles after the final nested lock", () => {
    const scroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const y = vi.spyOn(window, "scrollY", "get").mockReturnValue(348);
    document.body.style.cssText =
      "position:relative;top:12px;width:90%;overflow:auto";
    const Overlay = defineComponent({
      setup() {
        useScrollLock(ref(true));
        return () => h("div");
      },
    });
    const a = mount(Overlay),
      b = mount(Overlay);
    expect(document.body.style.position).toBe("fixed");
    expect(document.body.style.top).toBe("-348px");
    b.unmount();
    expect(scroll).not.toHaveBeenCalled();
    a.unmount();
    expect(scroll).toHaveBeenCalledWith(0, 348);
    expect(document.body.style.position).toBe("relative");
    expect(document.body.style.top).toBe("12px");
    expect(document.body.style.width).toBe("90%");
    document.body.style.cssText = "";
    scroll.mockRestore();
    y.mockRestore();
  });
  it("orders initially open nested overlays by ownership and restores focus past an unmounted parent", async () => {
    const outside = document.createElement("button");
    document.body.append(outside);
    outside.focus();
    const closed = [vi.fn(), vi.fn()];
    const Inner = defineComponent({
      setup() {
        const open = ref(true),
          panel = ref<HTMLElement | null>(null);
        useOverlay(open, panel, () => {
          closed[1]();
          open.value = false;
        });
        return () => h("section", { ref: panel }, h("button", "Inner"));
      },
    });
    const Outer = defineComponent({
      setup() {
        const open = ref(true),
          panel = ref<HTMLElement | null>(null);
        useOverlay(open, panel, () => {
          closed[0]();
          open.value = false;
        });
        return () =>
          h("section", { ref: panel }, [h("button", "Outer"), h(Inner)]);
      },
    });
    const wrapper = mount(Outer, { attachTo: document.body });
    await nextTick();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await nextTick();
    expect(closed[1]).toHaveBeenCalledOnce();
    expect(closed[0]).not.toHaveBeenCalled();
    wrapper.unmount();
    expect(document.activeElement).toBe(outside);
    outside.remove();
  });
  it("keeps a portaled floating branch in the modal focus scope and dismisses only the inner layer", async () => {
    const closed = vi.fn(),
      rects = vi
        .spyOn(HTMLElement.prototype, "getClientRects")
        .mockReturnValue([{}] as unknown as DOMRectList);
    const Child = defineComponent({
      setup() {
        const open = ref(false),
          panel = ref<HTMLElement | null>(null),
          layer = useFloatingLayer(open, panel);
        const key = (event: KeyboardEvent) => {
          if (layer.claimEscape(event)) open.value = false;
        };
        onMounted(() => document.addEventListener("keydown", key));
        onBeforeUnmount(() => document.removeEventListener("keydown", key));
        return () =>
          h("div", [
            h(
              "button",
              { id: "branch-trigger", onClick: () => (open.value = true) },
              "Open branch",
            ),
            open.value
              ? h(
                  Teleport,
                  { to: "body" },
                  h("div", { ref: panel }, [
                    h("button", { id: "branch-first" }, "First"),
                    h("button", { id: "branch-last" }, "Last"),
                  ]),
                )
              : null,
          ]);
      },
    });
    const Outer = defineComponent({
      setup() {
        const open = ref(true),
          panel = ref<HTMLElement | null>(null);
        useOverlay(open, panel, () => {
          closed();
          open.value = false;
        });
        return () =>
          h("section", { ref: panel }, [
            h("button", { id: "outer-first" }, "Outer first"),
            h(Child),
            h("button", { id: "outer-last" }, "Outer last"),
          ]);
      },
    });
    const wrapper = mount(Outer, { attachTo: document.body });
    try {
      await wrapper.find("#branch-trigger").trigger("click");
      await nextTick();
      document.querySelector<HTMLElement>("#branch-last")!.focus();
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", cancelable: true }),
      );
      expect(document.activeElement?.id).toBe("outer-first");
      document.querySelector<HTMLElement>("#branch-first")!.focus();
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Tab",
          shiftKey: true,
          cancelable: true,
        }),
      );
      expect(document.activeElement?.id).toBe("outer-last");
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", cancelable: true }),
      );
      await nextTick();
      expect(document.querySelector("#branch-first")).toBeNull();
      expect(closed).not.toHaveBeenCalled();
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", cancelable: true }),
      );
      expect(closed).toHaveBeenCalledOnce();
    } finally {
      wrapper.unmount();
      rects.mockRestore();
    }
  });
});
