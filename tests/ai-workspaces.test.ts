import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  beforeEach,
  afterEach,
} from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { createSSRApp, defineComponent, nextTick, type Component } from "vue";
import { renderToString } from "@vue/server-renderer";
import {
  AISidebar,
  moveResource,
  type SidebarResource,
} from "../packages/vue/src/agents/ai-sidebar";
import { ChatApp } from "../packages/vue/src/agents/chat-app";
import SidebarDemo from "../packages/vue/src/agents/ai-sidebar/demo.vue";
import ChatDemo from "../packages/vue/src/agents/chat-app/demo.vue";
import SidebarUsage from "../packages/vue/src/agents/ai-sidebar/examples/basic.vue";
import ChatUsage from "../packages/vue/src/agents/chat-app/examples/workspace.vue";
const nativeAnimate = Element.prototype.animate;
let restoreAnimation = () => {};
beforeEach(() => {
  if (nativeAnimate) {
    const spy = vi
      .spyOn(Element.prototype, "animate")
      .mockImplementation(function (
        this: Element,
        ...args: Parameters<Element["animate"]>
      ) {
        const animation = nativeAnimate.apply(this, args);
        void animation.finished.catch(() => undefined);
        return animation;
      });
    restoreAnimation = () => spy.mockRestore();
  }
});
const wrappers: VueWrapper[] = [],
  observers: {
    callback: ResizeObserverCallback;
    targets: Element[];
    disconnected: boolean;
  }[] = [];
beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      entry: {
        callback: ResizeObserverCallback;
        targets: Element[];
        disconnected: boolean;
      };
      constructor(callback: ResizeObserverCallback) {
        this.entry = { callback, targets: [], disconnected: false };
        observers.push(this.entry);
      }
      observe(target: Element) {
        this.entry.targets.push(target);
      }
      unobserve() {}
      disconnect() {
        this.entry.disconnected = true;
      }
    },
  );
});
afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount());
  observers.length = 0;
  document.body.innerHTML = "";
  vi.useRealTimers();
  restoreAnimation();
});
function render(component: any, props: any = {}) {
  const w = mount(component, { props, attachTo: document.body });
  wrappers.push(w);
  return w;
}
async function settle() {
  for (let n = 0; n < 5; n++) await nextTick();
}
async function frame() {
  await settle();
  await new Promise((resolve) => setTimeout(resolve, 25));
  await settle();
}
const resources: SidebarResource[] = [
  {
    id: "folder",
    label: "Project",
    kind: "project",
    children: [
      { id: "file", label: "First file", kind: "file" },
      { id: "bookmark", label: "Reference", kind: "bookmark" },
    ],
  },
  { id: "other", label: "Other file", kind: "file" },
  { id: "disabled", label: "Unavailable", kind: "folder", disabled: true },
];
function row(w: VueWrapper, id: string) {
  return w.find(`[data-resource-id="${id}"]`);
}
describe("source resource tree", () => {
  it("toggles containers without changing selection and selects only leaves", async () => {
    const w = render(AISidebar, { defaultItems: resources });
    expect(row(w, "folder").attributes("aria-selected")).toBeUndefined();
    expect(row(w, "folder").attributes("tabindex")).toBe("0");
    await row(w, "folder").trigger("click");
    expect(row(w, "file").exists()).toBe(true);
    expect(w.emitted("activeChange")).toBeUndefined();
    await row(w, "file").trigger("click");
    expect(w.emitted("activeChange")?.at(-1)).toEqual(["file"]);
    expect(row(w, "file").attributes("aria-selected")).toBe("true");
  });
  it("returns the roving tab stop to a visible row after an ancestor collapses", async () => {
    const w = render(AISidebar, {
      defaultItems: resources,
      defaultExpandedIds: ["folder"],
      defaultActiveId: "file",
    });
    expect(row(w, "file").attributes("tabindex")).toBe("0");
    await row(w, "folder").trigger("click");
    expect(row(w, "folder").attributes("tabindex")).toBe("0");
    await row(w, "folder").trigger("keydown", { key: "ArrowDown" });
    await frame();
    expect(document.activeElement?.getAttribute("data-resource-id")).toBe(
      "other",
    );
    await row(w, "other").trigger("keydown", { key: "End" });
    await frame();
    expect(document.activeElement?.getAttribute("data-resource-id")).toBe(
      "disabled",
    );
  });
  it("opens the source morph menu by ContextMenu and retains move commands across parent boundaries", async () => {
    const w = render(AISidebar, {
      defaultItems: resources,
      defaultExpandedIds: ["folder"],
    });
    await row(w, "bookmark").trigger("keydown", { key: "ContextMenu" });
    await frame();
    const menu = Array.from(
      document.querySelectorAll<HTMLElement>("[data-sidebar-resource-menu]"),
    ).find((el) => el.dataset.sidebarResourceMenu === "bookmark")!;
    expect(menu.textContent).toContain("Move up");
    expect(menu.textContent).toContain("Move out");
    expect(document.activeElement?.textContent).toBe("Rename");
  });
  it("starts rename on double-click, commits trimmed text once, and cancels without a blur commit", async () => {
    const rename = vi.fn(),
      w = render(AISidebar, {
        defaultItems: resources,
        defaultExpandedIds: ["folder"],
        onRename: rename,
      });
    await row(w, "file").trigger("dblclick");
    await frame();
    const input = w.find('[aria-label="Rename First file"]');
    expect(document.activeElement).toBe(input.element);
    await input.setValue("  Renamed file  ");
    await input.trigger("keydown", { key: "Enter" });
    await settle();
    expect(rename).toHaveBeenCalledTimes(1);
    expect(rename).toHaveBeenCalledWith(
      resources[0].children![0],
      "Renamed file",
    );
    await row(w, "file").trigger("keydown", { key: "F2" });
    await settle();
    await w.find("input").setValue("Discard me");
    await w.find("input").trigger("keydown", { key: "Escape" });
    await settle();
    expect(rename).toHaveBeenCalledTimes(1);
    expect(row(w, "file").text()).toContain("Renamed file");
  });
  it("keeps the rename draft focused after starting from its menu", async () => {
    const w = render(AISidebar, {
      defaultItems: resources,
      defaultExpandedIds: ["folder"],
    });
    await row(w, "file").trigger("keydown", { key: "ContextMenu" });
    await frame();
    const menu = Array.from(
      document.querySelectorAll<HTMLElement>("[data-sidebar-resource-menu]"),
    ).find((el) => el.dataset.sidebarResourceMenu === "file")!;
    menu.querySelector<HTMLButtonElement>("button")!.click();
    await frame();
    expect(document.activeElement).toBe(
      w.find('[aria-label="Rename First file"]').element,
    );
    expect(w.emitted("activeChange")?.at(-1)).toEqual(["file"]);
    expect(w.emitted("activeChange")).toHaveLength(1);
  });
  it("selects the acted-on leaf when the full controlled sidebar preview starts rename from its portal", async () => {
    const w = render(SidebarDemo);
    await row(w, "billing").trigger("keydown", { key: "ContextMenu" });
    await frame();
    document
      .querySelector<HTMLButtonElement>(
        '[data-sidebar-resource-menu="billing"] button',
      )!
      .click();
    await frame();
    expect(row(w, "billing").attributes("aria-selected")).toBe("true");
    expect(w.text()).toContain("Billing states");
    await w
      .find('[aria-label="Rename Billing states"]')
      .setValue("Billing notes");
    await w
      .find('[aria-label="Rename Billing states"]')
      .trigger("keydown", { key: "Enter" });
    await frame();
    expect(row(w, "billing").attributes("aria-selected")).toBe("true");
  });
  it("optimistically updates controlled items and rolls back with a live announcement on rejection", async () => {
    let reject!: (error: Error) => void;
    const onMove = vi.fn(() => new Promise<void>((_, fail) => (reject = fail))),
      w = render(AISidebar, {
        items: resources,
        defaultExpandedIds: ["folder"],
        onMove,
      });
    await row(w, "file").trigger("keydown", {
      key: "ArrowLeft",
      altKey: true,
      shiftKey: true,
    });
    expect(w.emitted("itemsChange")).toHaveLength(1);
    expect(row(w, "file").attributes("aria-level")).toBe("1");
    reject(new Error("Rejected"));
    await settle();
    expect(row(w, "file").attributes("aria-level")).toBe("2");
    expect(w.find('[aria-live="polite"]').text()).toBe(
      "Move failed. First file was restored.",
    );
    expect(w.emitted("moveError")).toHaveLength(1);
  });
  it("keeps menu actions discoverable on a touch-capable device with a fine pointer", async () => {
    const descriptor = Object.getOwnPropertyDescriptor(
      navigator,
      "maxTouchPoints",
    );
    Object.defineProperty(navigator, "maxTouchPoints", {
      configurable: true,
      value: 5,
    });
    try {
      const w = render(AISidebar, { defaultItems: resources });
      await settle();
      expect(w.find('[aria-label="Actions for Project"]').classes()).toContain(
        "opacity-100",
      );
    } finally {
      if (descriptor)
        Object.defineProperty(navigator, "maxTouchPoints", descriptor);
      else Reflect.deleteProperty(navigator, "maxTouchPoints");
    }
  });
  it("retains default icons and menu actions when optional render callbacks return null", async () => {
    const w = render(AISidebar, {
      defaultItems: resources,
      renderIcon: () => null,
      renderMenu: () => null,
    });
    expect(row(w, "folder").find("svg").exists()).toBe(true);
    await row(w, "other").trigger("keydown", { key: "ContextMenu" });
    await frame();
    expect(
      document.querySelector('[data-sidebar-resource-menu="other"]')
        ?.textContent,
    ).toContain("Rename");
  });
  it("rejects descendant/self drops and disabled destinations using the preserved pure model", () => {
    expect(
      moveResource(resources, {
        itemId: "folder",
        targetId: "file",
        position: "after",
      }),
    ).toBeNull();
    expect(
      moveResource(resources, {
        itemId: "file",
        targetId: "disabled",
        position: "inside",
      }),
    ).toBeNull();
    expect(
      moveResource(resources, {
        itemId: "disabled",
        targetId: null,
        position: "after",
      }),
    ).toBeNull();
  });
});
function shellObserver(w: VueWrapper) {
  return observers.find((o) => o.targets.includes(w.element))!;
}
function resize(observer: ReturnType<typeof shellObserver>, width: number) {
  observer.callback(
    [{ contentRect: { width } } as ResizeObserverEntry],
    {} as ResizeObserver,
  );
}
describe("source chat shell fit", () => {
  it("preserves default-closed on the first wide measurement, folds narrow and reopens only at a crossing", async () => {
    const w = render(ChatApp, {
      defaultOpen: false,
      sidebarWidth: "calc(15rem + 1px)",
    });
    await settle();
    expect(
      (w.element as HTMLElement).style.getPropertyValue("--sidebar-width"),
    ).toBe("calc(15rem + 1px)");
    const observer = shellObserver(w);
    expect(observer).toBeDefined();
    resize(observer, 700);
    await settle();
    expect(w.emitted("update:open")).toBeUndefined();
    resize(observer, 500);
    await settle();
    expect(w.emitted("update:open")).toBeUndefined();
    resize(observer, 700);
    await settle();
    expect(w.emitted("update:open")?.at(-1)).toEqual([true]);
    resize(observer, 710);
    await settle();
    expect(w.emitted("update:open")).toHaveLength(1);
  });
  it("does not measure or override a controlled open state", async () => {
    const w = render(ChatApp, { open: true });
    await settle();
    expect(observers.some((o) => o.targets.includes(w.element))).toBe(false);
    expect(w.attributes("data-state")).toBe("expanded");
  });
});
describe("complete workspace previews", () => {
  for (const [name, Demo] of Object.entries({
    SidebarDemo,
    ChatDemo,
    SidebarUsage,
    ChatUsage,
  }))
    it(name + " renders and hydrates its original composition", async () => {
      const html = await renderToString(createSSRApp(Demo)),
        host = document.createElement("div");
      host.innerHTML = html;
      document.body.append(host);
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {}),
        error = vi.spyOn(console, "error").mockImplementation(() => {}),
        app = createSSRApp(Demo);
      app.mount(host);
      await settle();
      expect(
        [...warn.mock.calls, ...error.mock.calls].flat().join(" "),
      ).not.toMatch(/hydration|mismatch/i);
      expect(host.textContent).toContain(
        name === "SidebarDemo"
          ? "Review resource sidebar interaction details"
          : name === "SidebarUsage"
            ? "Website redesign"
            : "Checkout release",
      );
      app.unmount();
      warn.mockRestore();
      error.mockRestore();
    });
});

describe("local checkout workflow", () => {
  it("runs the local permission states into the complete release composition", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const w = render(ChatDemo),
      allow = w
        .findAll("button")
        .find((button) => button.text() === "Allow once")!;
    await allow.trigger("click");
    expect(w.text()).toContain("Approving");
    await vi.advanceTimersByTimeAsync(1700);
    await settle();
    expect(w.text()).toContain("Checkout checks passed");
    expect(w.text()).toContain("The checkout patch is ready for review.");
    expect(w.text()).toContain("How should the patch be released?");
    expect(w.text()).toContain("checkout/submit.ts");
  });
  it("stops the local streamed follow-up without leaving pending work", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const w = render(ChatDemo);
    await w.find("textarea").setValue("Please continue.");
    await w.find("form").trigger("submit");
    expect(w.text()).toContain("Please continue.");
    expect(w.text()).toContain("Reviewing your direction");
    await vi.advanceTimersByTimeAsync(430);
    await settle();
    expect(w.find('[aria-label^="Stop generat"]').exists()).toBe(true);
    await w.find('[aria-label^="Stop generat"]').trigger("click");
    await settle();
    expect(w.find('[aria-label="Send prompt"]').exists()).toBe(true);
    expect(w.find('[aria-label^="Stop generat"]').exists()).toBe(false);
    const count = w.findAll('[data-slot="message"]').length;
    await vi.advanceTimersByTimeAsync(1000);
    await settle();
    expect(w.findAll('[data-slot="message"]')).toHaveLength(count);
  });
  it("keeps an expanded preview open while dismissing a nested prompt menu first", async () => {
    const aside = document.createElement("aside");
    document.body.append(aside);
    const w = render(ChatDemo);
    await w.find('[aria-label="Expand preview"]').trigger("click");
    await settle();
    expect(
      document
        .querySelector('[aria-label="Chat app preview"]')
        ?.getAttribute("aria-modal"),
    ).toBe("true");
    expect(aside.inert).toBe(true);
    document
      .querySelector<HTMLButtonElement>(
        '[aria-label="Chat app preview"] [aria-label="Add to prompt"]',
      )!
      .click();
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
      document
        .querySelector('[aria-label="Chat app preview"]')
        ?.getAttribute("aria-modal"),
    ).toBe("true");
    expect(
      document
        .querySelector(
          '[aria-label="Chat app preview"] [aria-label="Add to prompt"]',
        )
        ?.getAttribute("aria-expanded"),
    ).toBe("false");
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    );
    await settle();
    expect(
      document
        .querySelector('[aria-label="Chat app preview"]')
        ?.getAttribute("aria-modal"),
    ).toBeNull();
    expect(aside.inert).toBe(false);
    expect(document.body.style.overflow).toBe("");
    await frame();
    expect(document.activeElement?.getAttribute("aria-label")).toBe(
      "Expand preview",
    );
  });
  it("returns focus after the preview moves without waiting for animation frames", async () => {
    const w = render(ChatDemo);
    await w.find('[aria-label="Expand preview"]').trigger("click");
    await settle();
    const frames = vi
      .spyOn(globalThis, "requestAnimationFrame")
      .mockReturnValue(0);
    try {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Escape",
          bubbles: true,
          cancelable: true,
        }),
      );
      await settle();
      expect(document.activeElement).toBe(
        w.find('[aria-label="Expand preview"]').element,
      );
    } finally {
      frames.mockRestore();
    }
  });
});
