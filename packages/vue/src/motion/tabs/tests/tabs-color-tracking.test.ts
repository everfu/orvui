import { mount } from "@vue/test-utils";
import { computed, defineComponent, h, nextTick, ref, shallowRef } from "vue";
import { expect, it, vi } from "vitest";
import type { TabsState } from "../src/context";
import { useTabsList } from "../src/list-state";

const pending = vi.hoisted(() => new Set<() => void>());
vi.mock("motion-v", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion-v")>();
  return {
    ...actual,
    frame: {
      ...actual.frame,
      postRender: (callback: () => void) => pending.add(callback),
    },
    cancelFrame: (callback: () => void) => pending.delete(callback),
  };
});

it("keeps label contrast aligned when shared-layout motion starts after initially still frames", async () => {
  let indicatorLeft = 100;
  const box = (left: number) => ({
    left,
    right: left + 100,
    top: 0,
    bottom: 32,
    width: 100,
    height: 32,
    x: left,
    y: 0,
    toJSON() {},
  });
  const bind = (left: () => number) => (node: unknown) => {
    if (node) (node as HTMLElement).getBoundingClientRect = () => box(left());
  };
  const wrapper = mount(
    defineComponent({
      setup() {
        const root = ref<HTMLElement | null>(null),
          viewport = ref<HTMLElement | null>(null),
          list = ref<HTMLElement | null>(null);
        const state = {
          value: ref("b"),
          variant: computed(() => "pill"),
          icons: computed(() => "always"),
          placed: ref(false),
          panels: shallowRef(new Set()),
        } as unknown as TabsState;
        useTabsList(state, ref(false), root, viewport, list);
        return () =>
          h(
            "div",
            { ref: root },
            h(
              "div",
              { ref: viewport },
              h("div", { ref: list }, [
                h("span", {
                  "data-tabs-indicator": "",
                  ref: bind(() => indicatorLeft),
                }),
                ...["a", "b"].map((value, index) =>
                  h(
                    "button",
                    {
                      role: "tab",
                      "aria-selected": value === "b" ? "true" : "false",
                      "data-tabs-value": value,
                      ref: bind(() => index * 100),
                    },
                    h(
                      "span",
                      { "data-tabs-label": "", ref: bind(() => index * 100) },
                      value,
                    ),
                  ),
                ),
              ]),
            ),
          );
      },
    }),
  );
  await nextTick();
  const tick = () => [...pending].forEach((callback) => callback());
  for (let frame = 0; frame < 5; frame++) tick();
  indicatorLeft = 0;
  tick();
  expect(
    (wrapper.findAll("[data-tabs-label]")[1].element as HTMLElement).style
      .clipPath,
  ).toBe("inset(0 100% 0 0)");
  indicatorLeft = 50;
  tick();
  expect(
    (wrapper.findAll("[data-tabs-label]")[1].element as HTMLElement).style
      .clipPath,
  ).toBe("inset(0 50px 0 0px)");
  indicatorLeft = 100;
  for (let frame = 0; frame < 12; frame++) tick();
  expect(
    (wrapper.findAll("[data-tabs-label]")[1].element as HTMLElement).style
      .clipPath,
  ).toBe("inset(0 0px 0 0px)");
  expect(pending.size).toBe(0);
  wrapper.unmount();
  pending.clear();
});
