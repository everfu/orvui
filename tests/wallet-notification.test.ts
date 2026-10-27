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
import { NotificationStack } from "../packages/vue/src/blocks/notification-stack";
import { WalletCard } from "../packages/vue/src/blocks/wallet-card";
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
const items = [
  { id: "a", title: "Build passed", description: "Ready to ship" },
  { id: "b", title: "Review requested" },
];
function notifications(onViewAll?: () => void) {
  const wrapper = mount(NotificationStack, {
    props: { items, onViewAll },
    attachTo: document.body,
  });
  wrappers.push(wrapper);
  return wrapper;
}
describe("notification gestures and source wallet state", () => {
  it("uses touch-start state when focus opens the stack during the first tap", async () => {
    const viewAll = vi.fn(),
      wrapper = notifications(viewAll),
      button = wrapper.get("button");
    await button.trigger("pointerdown", {
      pointerType: "touch",
      pointerId: 1,
      buttons: 1,
    });
    await button.trigger("focus");
    await button.trigger("click");
    expect(button.attributes("aria-expanded")).toBe("true");
    expect(viewAll).not.toHaveBeenCalled();
    await button.trigger("pointerdown", {
      pointerType: "touch",
      pointerId: 2,
      buttons: 1,
    });
    await button.trigger("click");
    expect(viewAll).toHaveBeenCalledOnce();
  });
  it("consumes the outside touch used to dismiss, then permits the next outside activation", async () => {
    const wrapper = notifications(),
      button = wrapper.get("button"),
      outside = document.createElement("button"),
      activated = vi.fn();
    outside.addEventListener("click", activated);
    document.body.append(outside);
    await button.trigger("pointerdown", {
      pointerType: "touch",
      pointerId: 1,
      buttons: 1,
    });
    await button.trigger("click");
    await nextTick();
    outside.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        pointerType: "touch",
        pointerId: 2,
      }),
    );
    outside.click();
    await nextTick();
    expect(button.attributes("aria-expanded")).toBe("false");
    expect(activated).not.toHaveBeenCalled();
    outside.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        pointerType: "touch",
        pointerId: 3,
      }),
    );
    outside.click();
    expect(activated).toHaveBeenCalledOnce();
  });
  it("pairs a mouse hover leave even while pressed and never treats a touch leave as hover", async () => {
    const wrapper = notifications(),
      button = wrapper.get("button");
    await button.trigger("pointerenter", {
      pointerType: "mouse",
      pointerId: 1,
      buttons: 0,
    });
    expect(button.attributes("aria-expanded")).toBe("true");
    await button.trigger("pointerleave", {
      pointerType: "mouse",
      pointerId: 1,
      buttons: 1,
    });
    expect(button.attributes("aria-expanded")).toBe("false");
    await button.trigger("pointerenter", {
      pointerType: "touch",
      pointerId: 2,
      buttons: 1,
    });
    await button.trigger("pointerdown", {
      pointerType: "touch",
      pointerId: 2,
      buttons: 1,
    });
    await button.trigger("click");
    await button.trigger("pointerleave", {
      pointerType: "touch",
      pointerId: 2,
      buttons: 0,
    });
    expect(button.attributes("aria-expanded")).toBe("true");
  });
  it("retains the last wallet delta beyond five seconds and swaps account/search through their source controls", async () => {
    vi.useFakeTimers();
    const wrapper = mount(WalletCard, {
      props: {
        accounts: [
          { id: "a", name: "Personal", address: "0x111111111111" },
          { id: "b", name: "Savings", address: "0x222222222222" },
        ],
        balance: 100,
        searchRecent: ["Ethereum", "Base"],
      },
      attachTo: document.body,
    });
    wrappers.push(wrapper);
    await wrapper.setProps({ balance: 125 });
    await vi.advanceTimersByTimeAsync(6000);
    expect(wrapper.text()).toContain("+$25.00");
    await wrapper.get("button[aria-haspopup=listbox]").trigger("click");
    await vi.advanceTimersByTimeAsync(300);
    await wrapper.findAll("[role=option]")[1].trigger("click");
    expect(wrapper.emitted("accountChange")?.at(-1)).toEqual(["b"]);
    await wrapper.get("button[aria-label=Search]").trigger("click");
    const input = wrapper.get("input");
    await input.setValue("  Base  ");
    await input.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("searchSubmit")?.at(-1)).toEqual(["Base"]);
  });
});
