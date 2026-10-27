import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref } from "vue";
import { useOverlay } from "../packages/vue/src/lib/composables";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "../packages/vue/src/motion/combobox";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "../packages/vue/src/motion/context-menu";
const wrappers: VueWrapper[] = [],
  nativeAnimate = Element.prototype.animate;
beforeEach(() => {
  if (nativeAnimate)
    vi.spyOn(Element.prototype, "animate").mockImplementation(function (
      this: Element,
      ...args: Parameters<Element["animate"]>
    ) {
      const animation = nativeAnimate.apply(this, args);
      void animation.finished.catch(() => undefined);
      return animation;
    });
});
afterEach(async () => {
  document.getAnimations?.().forEach((animation) => {
    if (Number.isFinite(Number(animation.effect?.getTiming().iterations)))
      animation.finish();
  });
  await nextTick();
  await Promise.resolve();
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});
const escape = (node: Element | Document) =>
  node.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    }),
  );
async function parent(child: () => ReturnType<typeof h>) {
  const closed = vi.fn(),
    wrapper = mount(
      defineComponent({
        setup() {
          const open = ref(true),
            panel = ref<HTMLElement | null>(null);
          useOverlay(open, panel, () => {
            closed();
            open.value = false;
          });
          return () =>
            h("section", { ref: panel, tabindex: -1 }, [
              h("button", "Parent control"),
              child(),
            ]);
        },
      }),
      { attachTo: document.body },
    );
  wrappers.push(wrapper);
  await nextTick();
  await nextTick();
  return { wrapper, closed };
}
describe("Floating dismissal priority inside dialogs", () => {
  it("closes an open Combobox before its parent for both local and global Escape", async () => {
    const { wrapper, closed } = await parent(() =>
      h(Combobox, { defaultOpen: true }, () => [
        h(ComboboxTrigger, {}, () => h(ComboboxInput)),
        h(ComboboxContent, {}, () =>
          h(ComboboxList, {}, () =>
            h(ComboboxItem, { value: "one" }, () => "One"),
          ),
        ),
      ]),
    );
    const input = wrapper.find("input");
    escape(input.element);
    await nextTick();
    expect(input.attributes("aria-expanded")).toBe("false");
    expect(closed).not.toHaveBeenCalled();
    await input.trigger("keydown", { key: "ArrowDown" });
    escape(document);
    await nextTick();
    expect(input.attributes("aria-expanded")).toBe("false");
    expect(closed).not.toHaveBeenCalled();
    escape(document);
    await nextTick();
    expect(closed).toHaveBeenCalledOnce();
  });
  it("closes a context menu globally when focus moves to its dialog, preserving the parent until a second Escape", async () => {
    const { wrapper, closed } = await parent(() =>
      h(ContextMenu, { defaultOpen: true }, () => [
        h(ContextMenuTrigger, {}, () => h("button", "Menu trigger")),
        h(ContextMenuContent, {}, () => h(ContextMenuItem, {}, () => "Action")),
      ]),
    );
    escape(document);
    await nextTick();
    expect(
      wrapper.findComponent(ContextMenu).emitted("update:open")?.at(-1),
    ).toEqual([false]);
    expect(closed).not.toHaveBeenCalled();
    escape(document);
    await nextTick();
    expect(closed).toHaveBeenCalledOnce();
  });
});
