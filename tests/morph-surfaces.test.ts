import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import {
  createSSRApp,
  defineComponent,
  nextTick,
  ref,
  type Component,
} from "vue";
import { renderToString } from "@vue/server-renderer";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  MorphSelect,
  MorphSelectTrigger,
  MorphSelectValue,
  MorphSelectContent,
  MorphSelectItem,
} from "../packages/vue/src/motion/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  MorphPopover,
  MorphPopoverTrigger,
  MorphPopoverContent,
} from "../packages/vue/src/motion/popover";
import {
  buildGeo,
  rectAtProgress,
  clipForProgress,
  triggerCutout,
} from "../packages/vue/src/motion/popover/src/geometry";
import { useOverlay } from "../packages/vue/src/lib/composables";
const wrappers: VueWrapper[] = [];
beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount());
});
const OverlayFixture = defineComponent({
  props: { onDismiss: Function },
  setup(p) {
    const open = ref(true),
      panel = ref<HTMLElement | null>(null);
    useOverlay(open, panel, () => {
      open.value = false;
      p.onDismiss?.();
    });
    return { open, panel };
  },
  template:
    '<div ref="panel" tabindex="-1" data-test-modal :data-open="open"><slot/></div>',
});
const components = {
  OverlayFixture,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  MorphSelect,
  MorphSelectTrigger,
  MorphSelectValue,
  MorphSelectContent,
  MorphSelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  MorphPopover,
  MorphPopoverTrigger,
  MorphPopoverContent,
};
function fixture(template: string, extra: any = {}) {
  const wrapper = mount(defineComponent({ components, template, ...extra }), {
    attachTo: document.body,
  });
  wrappers.push(wrapper);
  return wrapper;
}
const selectTemplate =
  '<Select default-value="b"><SelectTrigger><SelectValue placeholder="Choose"/></SelectTrigger><SelectContent><SelectItem value="a">Alpha</SelectItem><SelectItem value="b">Beta</SelectItem><SelectItem value="c" disabled>Charlie</SelectItem><SelectItem value="d">Delta</SelectItem></SelectContent></Select>';
describe("unfolding and shared-layout selects", () => {
  it("registers selected labels while closed and changes uncontrolled state", async () => {
    const w = fixture(selectTemplate);
    await nextTick();
    expect(w.find("[data-trigger]").text()).toBe("Beta");
    expect(w.find('[role="listbox"]').attributes("inert")).toBeDefined();
    await w.find("[data-trigger]").trigger("click");
    await nextTick();
    expect(w.find('[role="listbox"]').attributes("aria-hidden")).toBe("false");
    await w.find('[data-listbox-id="a"]').trigger("click");
    await nextTick();
    expect(w.find("[data-trigger]").text()).toBe("Alpha");
    expect(w.find('[role="listbox"]').attributes("aria-hidden")).toBe("true");
  });
  it("renders valid CSS lengths on all four corners of the closed trigger", async () => {
    const w = fixture(selectTemplate);
    await nextTick();
    const trigger = w.find("[data-trigger]").element as HTMLElement;
    expect(trigger.style.borderTopLeftRadius).toBe("12px");
    expect(trigger.style.borderTopRightRadius).toBe("12px");
    expect(trigger.style.borderBottomLeftRadius).toBe("12px");
    expect(trigger.style.borderBottomRightRadius).toBe("12px");
  });
  it("starts at the selected option, skips disabled options, and supports typeahead", async () => {
    const w = fixture(selectTemplate);
    await w.find("[data-trigger]").trigger("keydown", { key: "ArrowDown" });
    await nextTick();
    await nextTick();
    expect(document.activeElement).toBe(
      w.find('[data-listbox-id="b"]').element,
    );
    await w.find('[role="listbox"]').trigger("keydown", { key: "ArrowDown" });
    await nextTick();
    await nextTick();
    expect(document.activeElement).toBe(
      w.find('[data-listbox-id="d"]').element,
    );
    await w.find('[role="listbox"]').trigger("keydown", { key: "a" });
    await nextTick();
    await nextTick();
    expect(document.activeElement).toBe(
      w.find('[data-listbox-id="a"]').element,
    );
  });
  it("leaves controlled selection owned by the caller and reports semantic events", async () => {
    const change = vi.fn(),
      w = fixture(
        '<Select model-value="a" @update:model-value="change"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="a">Alpha</SelectItem><SelectItem value="b">Beta</SelectItem></SelectContent></Select>',
        { setup: () => ({ change }) },
      );
    await w.find("[data-trigger]").trigger("click");
    await w.find('[data-listbox-id="b"]').trigger("click");
    expect(change).toHaveBeenCalledWith("b");
    expect(w.find("[data-trigger]").text()).toBe("Alpha");
  });
  it("restores the morph trigger after choosing an option without losing its registered label", async () => {
    const w = fixture(
      '<MorphSelect default-value="a"><MorphSelectTrigger><MorphSelectValue placeholder="Choose"/></MorphSelectTrigger><MorphSelectContent><MorphSelectItem value="a">Alpha</MorphSelectItem><MorphSelectItem value="b">Beta</MorphSelectItem></MorphSelectContent></MorphSelect>',
    );
    await nextTick();
    let trigger = w.find('[aria-haspopup="listbox"]');
    expect(trigger.text()).toBe("Alpha");
    await trigger.trigger("click");
    await nextTick();
    await nextTick();
    const option = w.find('[data-listbox-id="b"]');
    (option.element as HTMLElement).focus();
    await option.trigger("click");
    await nextTick();
    await nextTick();
    trigger = w.find('[aria-haspopup="listbox"]');
    expect(trigger.text()).toBe("Beta");
    expect(document.activeElement).toBe(trigger.element);
  });
});
describe("popover surface geometry", () => {
  it("uses one shared coordinate box and the exact trigger and panel endpoints", () => {
    for (const side of ["top", "bottom"] as const)
      for (const align of ["start", "center", "end"] as const) {
        const geo = buildGeo(100, 40, 288, 160, side, align, 14, 16);
        for (const key of ["x", "y", "w", "h", "r"] as const) {
          expect(rectAtProgress(geo, 0)[key]).toBeCloseTo(geo.trigger[key]);
          expect(rectAtProgress(geo, 1)[key]).toBeCloseTo(geo.panel[key]);
        }
        expect(geo.trigger.x).toBeGreaterThanOrEqual(0);
        expect(geo.panel.x).toBeGreaterThanOrEqual(0);
        expect(clipForProgress(geo, 0.5, false)).toContain("inset(");
        expect(triggerCutout(geo)).toContain("path(evenodd,");
      }
  });
  it("retains the actual trigger element and supplies the SVG goo bridge", async () => {
    const w = fixture(
      '<Popover><PopoverTrigger><button class="custom-trigger">Open</button></PopoverTrigger><PopoverContent><input aria-label="Width"/></PopoverContent></Popover>',
    );
    expect(w.findAll("button")).toHaveLength(1);
    await w.find("button").trigger("click");
    expect(w.find("button").attributes("aria-expanded")).toBe("true");
    expect(
      document
        .querySelector("[data-popover-portal] feGaussianBlur")
        ?.getAttribute("stdDeviation"),
    ).toBe("8");
    const dialog = document.querySelector(
      '[data-popover-portal] [role="dialog"]',
    ) as HTMLElement;
    expect(dialog.getAttribute("aria-hidden")).toBe("false");
    dialog.querySelector("input")?.focus();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await nextTick();
    expect(w.find("button").attributes("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(w.find("button").element);
  });
  it("keeps a hover panel open while its opening clip receives the pointer across Teleport", async () => {
    const settle = async () => {
      for (let index = 0; index < 5; index++) await nextTick();
    };
    const w = fixture(
      '<Popover trigger="hover"><PopoverTrigger><button>Hover</button></PopoverTrigger><PopoverContent>Details</PopoverContent></Popover>',
    );
    await settle();
    const root = w.find(".relative.inline-flex.isolate");
    await root.trigger("pointerenter", {
      pointerType: "mouse",
      pointerId: 1,
      buttons: 0,
    });
    await settle();
    await root.trigger("pointerleave", {
      pointerType: "mouse",
      pointerId: 1,
      buttons: 0,
    });
    const clip = document.querySelector<HTMLElement>(
      "[data-popover-interactive-clip]",
    )!;
    clip.dispatchEvent(
      new PointerEvent("pointerenter", {
        pointerType: "mouse",
        pointerId: 1,
        buttons: 0,
      }),
    );
    await new Promise((resolve) => setTimeout(resolve, 150));
    await settle();
    expect(w.find("button").attributes("aria-expanded")).toBe("true");
    clip.dispatchEvent(
      new PointerEvent("pointerleave", {
        pointerType: "mouse",
        pointerId: 1,
        buttons: 0,
      }),
    );
    await new Promise((resolve) => setTimeout(resolve, 150));
    await settle();
    expect(w.find("button").attributes("aria-expanded")).toBe("false");
  });
  it("does not reinterpret a hover-trigger touch tap as a mouse hover departure", async () => {
    const w = fixture(
        '<Popover trigger="hover"><PopoverTrigger><button>Touch</button></PopoverTrigger><PopoverContent>Details</PopoverContent></Popover>',
      ),
      button = w.find("button");
    await button.trigger("pointerenter", {
      pointerId: 1,
      pointerType: "touch",
      buttons: 1,
    });
    await button.trigger("pointerdown", {
      pointerId: 1,
      pointerType: "touch",
      buttons: 1,
    });
    await button.trigger("click");
    expect(button.attributes("aria-expanded")).toBe("true");
    await button.trigger("pointerleave", {
      pointerId: 1,
      pointerType: "touch",
      buttons: 0,
    });
    expect(button.attributes("aria-expanded")).toBe("true");
  });
  it("keeps pointer opens focused on the trigger and keyboard opens focused inside a morph panel", async () => {
    const w = fixture(
        '<MorphPopover><MorphPopoverTrigger><button>Options</button></MorphPopoverTrigger><MorphPopoverContent><button class="action">Edit</button></MorphPopoverContent></MorphPopover>',
      ),
      trigger = w.find("button");
    (trigger.element as HTMLElement).focus();
    await trigger.trigger("click", { detail: 1 });
    await nextTick();
    await nextTick();
    expect(document.activeElement).toBe(trigger.element);
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await nextTick();
    await trigger.trigger("keydown", { key: "Enter" });
    await trigger.trigger("click", { detail: 0 });
    for (let i = 0; i < 6; i++) await nextTick();
    expect(document.activeElement?.textContent).toBe("Edit");
  });
});
const examples = {
  ...import.meta.glob("../packages/vue/src/motion/select/examples/*.vue", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../packages/vue/src/motion/popover/examples/*.vue", {
    eager: true,
    import: "default",
  }),
  ...import.meta.glob("../packages/vue/src/motion/number/examples/*.vue", {
    eager: true,
    import: "default",
  }),
} as Record<string, Component>;
describe("source compositions", () => {
  for (const [path, Demo] of Object.entries(examples))
    it(path + " is SSR safe and mounts", async () => {
      const html = await renderToString(createSSRApp(Demo));
      expect(html.length).toBeGreaterThan(50);
      const w = mount(Demo);
      wrappers.push(w);
      await nextTick();
      expect(w.html()).not.toContain("NaN");
    });
});

describe("nested floating layer priority", () => {
  for (const kind of ["select", "popover"] as const)
    it(kind + " consumes Escape before its parent modal", async () => {
      const dismiss = vi.fn(),
        content =
          kind === "select"
            ? selectTemplate
            : "<Popover><PopoverTrigger><button>Open child</button></PopoverTrigger><PopoverContent><button>Nested action</button></PopoverContent></Popover>",
        w = fixture(
          '<OverlayFixture :on-dismiss="dismiss">' +
            content +
            "</OverlayFixture>",
          { setup: () => ({ dismiss }) },
        );
      await nextTick();
      await w
        .find(kind === "select" ? "[data-trigger]" : "button")
        .trigger("click");
      for (let n = 0; n < 4; n++) await nextTick();
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Escape",
          bubbles: true,
          cancelable: true,
        }),
      );
      await nextTick();
      expect(dismiss).not.toHaveBeenCalled();
      expect(w.find("[data-test-modal]").attributes("data-open")).toBe("true");
      expect(
        w
          .find(kind === "select" ? "[data-trigger]" : "button")
          .attributes("aria-expanded"),
      ).toBe("false");
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Escape",
          bubbles: true,
          cancelable: true,
        }),
      );
      await nextTick();
      expect(dismiss).toHaveBeenCalledTimes(1);
    });
  it("keeps a parent popover open while clicking a higher child portal", async () => {
    const w = fixture(
      '<Popover default-open><PopoverTrigger><button class="parent-trigger">Parent</button></PopoverTrigger><PopoverContent><Popover default-open><PopoverTrigger><button>Child</button></PopoverTrigger><PopoverContent><button class="nested-action">Nested portal</button></PopoverContent></Popover></PopoverContent></Popover>',
    );
    for (let n = 0; n < 6; n++) await nextTick();
    const child = document.querySelector(".nested-action")!;
    expect(child).not.toBeNull();
    child.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await nextTick();
    expect(w.find(".parent-trigger").attributes("aria-expanded")).toBe("true");
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    );
    await nextTick();
    expect(w.find(".parent-trigger").attributes("aria-expanded")).toBe("true");
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    );
    await nextTick();
    expect(w.find(".parent-trigger").attributes("aria-expanded")).toBe("false");
  });
});
