import {
  afterEach,
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import {
  ExpandableActionBar,
  ExpandableTabs,
  FeedbackWidget,
  InfiniteMasonry,
} from "../../packages/vue/src/blocks";
const wrappers: VueWrapper[] = [];
const animateDescriptor = Object.getOwnPropertyDescriptor(
  Element.prototype,
  "animate",
);
beforeAll(() => {
  Reflect.deleteProperty(Element.prototype, "animate");
  window.matchMedia = vi.fn().mockReturnValue({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  });
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});
afterAll(() => {
  if (animateDescriptor)
    Object.defineProperty(Element.prototype, "animate", animateDescriptor);
});
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  document.body.innerHTML = "";
  vi.useRealTimers();
});
describe("source expanding surfaces", () => {
  it("renders the default feedback icon when the optional icon node is omitted", () => {
    const wrapper = mount(FeedbackWidget);
    wrappers.push(wrapper);
    expect(wrapper.find('button[aria-haspopup="dialog"] svg').exists()).toBe(
      true,
    );
  });
  it("treats an omitted masonry error node as absent and retains the empty state", () => {
    const wrapper = mount(InfiniteMasonry, {
      props: {
        items: [],
        hasMore: false,
        getItemKey: (_item: unknown, index: number) => index,
      },
      attachTo: document.body,
    });
    wrappers.push(wrapper);
    expect(wrapper.text()).toContain("No items yet");
    expect(wrapper.text()).not.toContain("Couldn't load more");
  });
  it("arms a second touch even when a controlled action bar declined the first expansion", async () => {
    const action = vi.fn(),
      wrapper = mount(ExpandableActionBar, {
        props: {
          expanded: false,
          items: [{ id: "save", label: "Save", icon: "S", onClick: action }],
        },
        attachTo: document.body,
      });
    wrappers.push(wrapper);
    const button = wrapper.get("button");
    await button.trigger("pointerdown", { pointerType: "touch" });
    await button.trigger("focus");
    await button.trigger("click");
    expect(action).not.toHaveBeenCalled();
    expect(wrapper.emitted("update:expanded")?.at(-1)).toEqual([true]);
    await button.trigger("pointerdown", { pointerType: "touch" });
    await button.trigger("click");
    expect(action).toHaveBeenCalledOnce();
    expect(wrapper.emitted("action")).toHaveLength(1);
  });
  it("closes expanded tabs with outside input while retaining a named active panel", async () => {
    const wrapper = mount(ExpandableTabs, {
      props: {
        items: [
          { id: "one", label: "One", icon: "1", content: "First panel" },
          { id: "two", label: "Two", icon: "2", content: "Second panel" },
        ],
      },
      attachTo: document.body,
    });
    wrappers.push(wrapper);
    await wrapper.findAll("[role=tab]")[1].trigger("click");
    await nextTick();
    expect(wrapper.get("[role=tabpanel]").text()).toBe("Second panel");
    expect(wrapper.get("[role=tabpanel]").attributes("aria-labelledby")).toBe(
      wrapper.findAll("[role=tab]")[1].attributes("id"),
    );
    document.body.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true }),
    );
    await nextTick();
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([null]);
  });
  it("preserves failed feedback for retry, keeps its original payload, and closes after source success timing", async () => {
    vi.useFakeTimers();
    const submit = vi
      .fn()
      .mockRejectedValueOnce(new Error("Offline"))
      .mockResolvedValueOnce(undefined);
    const wrapper = mount(FeedbackWidget, {
      props: { onSubmit: submit },
      attachTo: document.body,
    });
    wrappers.push(wrapper);
    await wrapper.get("button[aria-haspopup=dialog]").trigger("click");
    await wrapper.get("textarea").setValue("  Include the original spacing.  ");
    const send = wrapper
      .findAll("button")
      .find((button) => button.text().includes("Submit"))!;
    await send.trigger("click");
    await Promise.resolve();
    await nextTick();
    expect(wrapper.get("[role=alert]").text()).toContain(
      "Something went wrong",
    );
    expect(submit).toHaveBeenLastCalledWith({
      message: "  Include the original spacing.  ",
    });
    const retry = wrapper
      .findAll("button")
      .find((button) => button.text() === "Try again")!;
    await retry.trigger("click");
    await Promise.resolve();
    await nextTick();
    expect(wrapper.emitted("success")).toEqual([
      [{ message: "  Include the original spacing.  " }],
    ]);
    await vi.advanceTimersByTimeAsync(1600);
    expect(wrapper.find("button[aria-haspopup=dialog]").exists()).toBe(true);
  });
});
