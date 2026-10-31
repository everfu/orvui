import {
  afterEach,
  beforeAll,
  afterAll,
  describe,
  it,
  expect,
  vi,
} from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { defineComponent, nextTick } from "vue";
import {
  AnimatedToastStack,
  useAnimatedToastStack,
} from "../../packages/vue/src/motion/animated-toast-stack";
import {
  AnimatedSidebarProvider,
  AnimatedSidebar,
  AnimatedSidebarTrigger,
  AnimatedSidebarClose,
  AnimatedSidebarMenuButton,
  AnimatedSidebarMenuSub,
  AnimatedSidebarMenuSubButton,
} from "../../packages/vue/src/motion/animated-sidebar";
const wrappers: VueWrapper[] = [];
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
afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount());
  document.body.innerHTML = "";
  vi.useRealTimers();
});
function render(component: any, props: any = {}) {
  const w = mount(component, { props, attachTo: document.body });
  wrappers.push(w);
  return w;
}
async function settle() {
  for (let i = 0; i < 5; i++) await nextTick();
}
function toasts(options: Parameters<typeof useAnimatedToastStack>[0] = {}) {
  let api!: ReturnType<typeof useAnimatedToastStack>;
  render(
    defineComponent({
      setup() {
        api = useAnimatedToastStack(options);
        return () => null;
      },
    }),
  );
  return api;
}
describe("source toast ordering and lifetime", () => {
  it("appends in source order, limits oldest entries, and exposes the original hook names", () => {
    const api = toasts({ limit: 2, defaultDuration: 0 });
    api.showToast({ id: "a", title: "A" });
    api.showToast({ id: "b", title: "B" });
    api.showToast({ id: "c", title: "C" });
    expect(api.toasts.value.map((t) => t.id)).toEqual(["b", "c"]);
    api.setToasts((current) => current.slice(0, 1));
    expect(api.toasts.value[0].id).toBe("b");
    api.clearToasts();
    expect(api.toasts.value).toEqual([]);
  });
  it("does not restart a lifetime for content updates, and restarts an explicitly supplied duration", async () => {
    vi.useFakeTimers();
    const api = toasts({ defaultDuration: 1000 });
    const first = api.showToast({ title: "A" });
    await vi.advanceTimersByTimeAsync(600);
    api.updateToast(first, { title: "Edited", status: "success" });
    await vi.advanceTimersByTimeAsync(400);
    expect(api.toasts.value).toHaveLength(0);
    const second = api.showToast({ title: "B" });
    await vi.advanceTimersByTimeAsync(600);
    api.updateToast(second, { duration: 1200 });
    await vi.advanceTimersByTimeAsync(1199);
    expect(api.toasts.value).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(api.toasts.value).toHaveLength(0);
  });
  it("keeps duration zero until dismissed and clears scheduled work on unmount", async () => {
    vi.useFakeTimers();
    const api = toasts({
      initialToasts: [{ id: "persist", title: "Persistent", duration: 0 }],
    });
    await vi.advanceTimersByTimeAsync(10000);
    expect(api.toasts.value).toHaveLength(1);
    api.dismissToast("persist");
    api.showToast({ title: "Temporary" });
    wrappers.splice(0).forEach((w) => w.unmount());
    expect(vi.getTimerCount()).toBe(0);
  });
  it("renders only the newest entries with natural variable heights and optional dismissal", () => {
    const values = Array.from({ length: 6 }, (_, i) => ({
      id: String(i),
      title: `Toast ${i}`,
    }));
    const w = render(AnimatedToastStack, { toasts: values });
    expect(w.findAll("li")).toHaveLength(4);
    expect(w.findAll("li")[0].text()).toBe("Toast 2");
    expect(
      w
        .findAll("li")
        .every((li) => !li.attributes("style")?.includes("height")),
    ).toBe(true);
    expect(w.find('[aria-label="Dismiss toast"]').exists()).toBe(false);
  });
});
const parts = {
  AnimatedSidebarProvider,
  AnimatedSidebar,
  AnimatedSidebarTrigger,
  AnimatedSidebarClose,
  AnimatedSidebarMenuButton,
  AnimatedSidebarMenuSub,
  AnimatedSidebarMenuSubButton,
};
function sidebar(template: string, mobile = false) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: mobile && query.includes("767"),
    addEventListener() {},
    removeEventListener() {},
  }));
  return render(defineComponent({ components: parts, template }));
}
describe("responsive sidebar state and nested navigation", () => {
  it("a controlled desktop sidebar emits updates without taking ownership", async () => {
    const w = sidebar(
      '<AnimatedSidebarProvider :open="false"><AnimatedSidebar><AnimatedSidebarClose/></AnimatedSidebar><AnimatedSidebarTrigger/></AnimatedSidebarProvider>',
    );
    await w.find('[data-slot="sidebar-trigger"]').trigger("click");
    expect(
      w.findComponent(AnimatedSidebarProvider).emitted("update:open"),
    ).toEqual([[true]]);
    expect(w.find('[data-slot="sidebar"]').attributes("data-state")).toBe(
      "collapsed",
    );
  });
  it("unfolds an icon rail when opening a submenu and honors a desktop close button", async () => {
    const w = sidebar(
      '<AnimatedSidebarProvider :default-open="false"><AnimatedSidebar><AnimatedSidebarMenuButton :aria-expanded="false">People</AnimatedSidebarMenuButton><AnimatedSidebarClose/></AnimatedSidebar></AnimatedSidebarProvider>',
    );
    await w.find('[aria-expanded="false"]').trigger("click");
    expect(w.find('[data-slot="sidebar"]').attributes("data-state")).toBe(
      "expanded",
    );
    await w.find('[aria-label="Close sidebar"]').trigger("click");
    expect(w.find('[data-slot="sidebar"]').attributes("data-state")).toBe(
      "collapsed",
    );
  });
  it("toggles mobile state using the shortcut and preserves the menu while a group opens", async () => {
    const w = sidebar(
      '<AnimatedSidebarProvider><AnimatedSidebar><AnimatedSidebarMenuButton :aria-expanded="false">People</AnimatedSidebarMenuButton><AnimatedSidebarMenuSubButton>All people</AnimatedSidebarMenuSubButton></AnimatedSidebar><AnimatedSidebarTrigger/></AnimatedSidebarProvider>',
      true,
    );
    await settle();
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "B", metaKey: true }),
    );
    await settle();
    const panel = document.querySelector<HTMLElement>('[data-mobile="true"]')!;
    expect(panel.getAttribute("data-state")).toBe("expanded");
    expect(document.body.style.position).toBe("fixed");
    (panel.querySelector("[aria-expanded]") as HTMLButtonElement).click();
    await settle();
    expect(panel.getAttribute("data-state")).toBe("expanded");
    (panel.querySelectorAll("button")[1] as HTMLButtonElement).click();
    await settle();
    expect(panel.getAttribute("data-state")).toBe("collapsed");
    expect(document.body.style.position).not.toBe("fixed");
    expect(
      w.findComponent(AnimatedSidebarProvider).emitted("update:open"),
    ).toBeUndefined();
  });
});
