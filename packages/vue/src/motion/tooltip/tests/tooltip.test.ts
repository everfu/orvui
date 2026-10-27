import {
  afterEach,
  beforeAll,
  afterAll,
  describe,
  it,
  expect,
  vi,
} from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "..";
// Use Motion's JavaScript scheduler; happy-dom does not model canceled WAAPI promises.
const nativeAnimate = Element.prototype.animate;
beforeAll(() =>
  Object.defineProperty(Element.prototype, "animate", {
    value: undefined,
    configurable: true,
  }),
);
afterAll(() =>
  Object.defineProperty(Element.prototype, "animate", {
    value: nativeAnimate,
    configurable: true,
  }),
);
const mounted: ReturnType<typeof mount>[] = [];
afterEach(() => {
  for (const wrapper of mounted) wrapper.unmount();
  mounted.length = 0;
  document.body.innerHTML = "";
  vi.useRealTimers();
});
function render(content = "Save changes", props = {}) {
  const wrapper = mount(Tooltip, {
    props: { content, ...props },
    slots: { default: () => h("button", { id: "trigger" }, "Save") },
    attachTo: document.body,
  });
  mounted.push(wrapper);
  return wrapper;
}
describe("tooltip interaction contract", () => {
  it("preserves the trigger element without a layout wrapper", () => {
    const wrapper = render();
    expect(wrapper.find("button").attributes("id")).toBe("trigger");
    expect(
      wrapper
        .find("button")
        .element.parentElement?.classList.contains("inline-flex"),
    ).toBe(false);
  });
  it("opens on keyboard focus and closes on Escape", async () => {
    const wrapper = render();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
    wrapper.find("button").element.focus();
    await nextTick();
    await nextTick();
    expect(wrapper.emitted("update:open")?.[0]).toEqual([true]);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await nextTick();
    expect(wrapper.emitted("update:open")?.at(-1)).toEqual([false]);
  });
  it("honors hover delay and cancels when the pointer leaves before opening", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 1000);
    const wrapper = render("Tip", { delay: 500 });
    await wrapper
      .find("button")
      .trigger("pointerenter", { pointerType: "mouse" });
    await vi.advanceTimersByTimeAsync(300);
    expect(wrapper.emitted("update:open")).toBeUndefined();
    await wrapper
      .find("button")
      .trigger("pointerleave", { pointerType: "mouse" });
    await vi.advanceTimersByTimeAsync(500);
    expect(wrapper.emitted("update:open")).toBeUndefined();
  });
  it("does not open a disabled tooltip", async () => {
    const wrapper = render("Tip", { disabled: true });
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
    wrapper.find("button").element.focus();
    await nextTick();
    expect(wrapper.emitted("update:open")).toBeUndefined();
  });
  it("shows one tooltip at a time", async () => {
    const a = render("First"),
      b = render("Second");
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
    a.find("button").element.focus();
    await nextTick();
    b.find("button").element.focus();
    await nextTick();
    expect(a.emitted("update:open")?.at(-1)).toEqual([false]);
    expect(b.emitted("update:open")?.at(-1)).toEqual([true]);
  });
  it("keeps an accessible name mounted when an asLabel tooltip is closed", async () => {
    const wrapper = render("Account settings", { asLabel: true });
    await nextTick();
    const id = wrapper.find("button").attributes("aria-labelledby");
    expect(id).toBeTruthy();
    expect(document.getElementById(id!)?.textContent).toBe("Account settings");
    expect(document.getElementById(id!)?.hidden).toBe(true);
  });
  it("supports composed provider, trigger and content", async () => {
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(TooltipProvider, { delay: 0 }, () =>
            h(Tooltip, {}, () => [
              h(TooltipTrigger, {}, () => "+"),
              h(TooltipContent, { arrow: true }, () => "Add item"),
            ]),
          ),
      }),
      { attachTo: document.body },
    );
    mounted.push(wrapper);
    await wrapper
      .find("button")
      .trigger("pointerenter", { pointerType: "mouse" });
    await nextTick();
    await nextTick();
    await flushPromises();
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain(
      "Add item",
    );
  });
});
