import { afterEach, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref } from "vue";
import { useThemePanel } from "../apps/docs/app/docs/use-theme-panel";
let wrapper: VueWrapper | undefined;
afterEach(() => {
  wrapper?.unmount();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
it("positions a teleported surface attached after the opening tick and clamps it inside the viewport", async () => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  const open = ref(false),
    ready = ref(false);
  let anchored!: ReturnType<typeof useThemePanel>;
  wrapper = mount(
    defineComponent({
      setup() {
        anchored = useThemePanel(
          () => open.value,
          () => {
            open.value = false;
          },
        );
        return () =>
          h("div", [
            h("button", { ref: anchored.trigger }, "Open"),
            ready.value
              ? h("div", {
                  ref: (value: unknown) => {
                    if (value instanceof HTMLElement)
                      Object.defineProperty(value, "offsetWidth", {
                        value: 248,
                      });
                    anchored.panel.value = value as HTMLElement | null;
                  },
                })
              : null,
          ]);
      },
    }),
    { attachTo: document.body },
  );
  vi.spyOn(anchored.trigger.value!, "getBoundingClientRect").mockReturnValue({
    left: 4,
    right: 36,
    top: 12,
    bottom: 44,
    width: 32,
    height: 32,
  } as DOMRect);
  open.value = true;
  await nextTick();
  expect(anchored.positioned.value).toBe(false);
  ready.value = true;
  await nextTick();
  await nextTick();
  expect(anchored.positioned.value).toBe(true);
  expect(anchored.position.value.left).toBe("12px");
  expect(anchored.position.value.top).toBe("52px");
});

it("waits for the portal to become visible before focusing the selected swatch", async () => {
  vi.useFakeTimers();
  const open = ref(false),
    visible = ref(false);
  let anchored!: ReturnType<typeof useThemePanel>;
  wrapper = mount(
    defineComponent({
      setup() {
        anchored = useThemePanel(
          () => open.value,
          () => {
            open.value = false;
          },
        );
        return () =>
          h("div", [
            h("button", { ref: anchored.trigger }, "Open"),
            open.value
              ? h(
                  "div",
                  {
                    ref: anchored.panel,
                    style: { visibility: visible.value ? "visible" : "hidden" },
                  },
                  [
                    h(
                      "button",
                      { "data-theme-option": "", "aria-pressed": "true" },
                      "Selected",
                    ),
                  ],
                )
              : null,
          ]);
      },
    }),
    { attachTo: document.body },
  );
  anchored.trigger.value!.focus();
  open.value = true;
  await nextTick();
  await nextTick();
  await vi.advanceTimersByTimeAsync(20);
  expect(document.activeElement).toBe(anchored.trigger.value);
  visible.value = true;
  await nextTick();
  await vi.advanceTimersByTimeAsync(20);
  expect(document.activeElement?.textContent).toBe("Selected");
  wrapper.unmount();
  wrapper = undefined;
  vi.useRealTimers();
});
