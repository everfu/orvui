import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { computed, defineComponent, h, nextTick, ref } from "vue";
import SiteSearch from "../apps/docs/.vitepress/theme/SiteSearch.vue";
import NewBadge from "../apps/docs/.vitepress/theme/NewBadge.vue";
import { useNewBadgeClock } from "../apps/docs/.vitepress/theme/new-badge";

const wrappers: VueWrapper[] = [];
beforeEach(() => {
  vi.useFakeTimers();
  let elapsed = 0;
  // Each lifecycle refresh sees a later millisecond, as it does in a real browser.
  vi.spyOn(Date, "now").mockImplementation(
    () => Date.parse("2026-10-25T12:00:00Z") + elapsed++,
  );
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: true,
      addEventListener() {},
      removeEventListener() {},
    })),
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  document.body.innerHTML = "";
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
async function settle() {
  await nextTick();
  await Promise.resolve();
  await nextTick();
}
function key(target: EventTarget, value: string, ctrlKey = false) {
  target.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: value,
      ctrlKey,
      bubbles: true,
      cancelable: true,
    }),
  );
}

it("opens, searches, selects and dismisses the controlled palette without recursive live-clock updates", async () => {
  const errors: unknown[] = [],
    navigate = vi.fn();
  const Host = defineComponent({
    setup() {
      const open = ref(false);
      return () =>
        h("main", [
          h(
            "button",
            { onClick: () => (open.value = true) },
            "Search components",
          ),
          h("output", open.value ? "open" : "closed"),
          h(SiteSearch, {
            open: open.value,
            en: true,
            "onUpdate:open": (value: boolean) => (open.value = value),
            onNavigate: navigate,
          }),
        ]);
    },
  });
  const wrapper = mount(Host, {
    attachTo: document.body,
    global: { config: { errorHandler: (error) => errors.push(error) } },
  });
  wrappers.push(wrapper);
  (wrapper.find("button").element as HTMLButtonElement).focus();
  await wrapper.find("button").trigger("click");
  await settle();
  const input = document.querySelector<HTMLInputElement>('[role="combobox"]')!;
  expect(input).not.toBeNull();
  input.value = "ruler";
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await settle();
  expect(document.querySelector('[role="option"]')?.textContent).toBe(
    "Ruler Slider",
  );
  key(input, "Enter");
  await settle();
  expect(navigate).toHaveBeenCalledExactlyOnceWith(
    "/en/components/motion/range-slider#ruler",
  );
  expect(wrapper.find("output").text()).toBe("closed");
  key(window, "k", true);
  await settle();
  expect(wrapper.find("output").text()).toBe("open");
  key(document.querySelector('[role="combobox"]')!, "Escape");
  await settle();
  expect(wrapper.find("output").text()).toBe("closed");
  expect(document.activeElement).toBe(wrapper.find("button").element);
  expect(errors.map(String)).toEqual([]);
});

it("keeps a clock-dependent parent with function-rendered New badges stable during child mount and unmount", async () => {
  const errors: unknown[] = [],
    renders = vi.fn();
  const Host = defineComponent({
    setup() {
      const entry = { badge: "new", launchedAt: "2026-10-20" };
      const { isNew } = useNewBadgeClock(() => [entry]);
      const visible = ref(true);
      const rows = computed(() => [
        {
          badge: isNew(entry)
            ? () => h(NewBadge, { launchedAt: entry.launchedAt })
            : undefined,
        },
      ]);
      return () => {
        renders();
        return h("div", [
          h(
            "button",
            { onClick: () => (visible.value = !visible.value) },
            "Toggle row",
          ),
          visible.value && rows.value[0].badge ? h(rows.value[0].badge) : null,
        ]);
      };
    },
  });
  const wrapper = mount(Host, {
    global: { config: { errorHandler: (error) => errors.push(error) } },
  });
  wrappers.push(wrapper);
  await settle();
  expect(wrapper.find(".new-badge").text()).toBe("New");
  await wrapper.find("button").trigger("click");
  await settle();
  expect(wrapper.find(".new-badge").exists()).toBe(false);
  await wrapper.find("button").trigger("click");
  await settle();
  expect(wrapper.find(".new-badge").text()).toBe("New");
  expect(errors.map(String)).toEqual([]);
  expect(renders.mock.calls.length).toBeLessThan(10);
});
