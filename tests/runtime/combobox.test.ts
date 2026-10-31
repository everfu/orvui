import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { h, nextTick } from "vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxList,
  ComboboxGroup,
  ComboboxItem,
  ComboboxLabel,
} from "../../packages/vue/src/motion/combobox";
import {
  MultiSelect,
  MultiSelectInput,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectContent,
  MultiSelectList,
  MultiSelectItem,
} from "../../packages/vue/src/motion/multi-select";
const wrappers: VueWrapper[] = [];
const nativeAnimate = Element.prototype.animate;
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
async function combo(extra: any = {}) {
  const wrapper = mount(Combobox, {
    props: { defaultValue: "two", ...extra },
    attachTo: document.body,
    slots: {
      default: () => [
        h(ComboboxTrigger, {}, () => h(ComboboxInput)),
        h(ComboboxContent, {}, () =>
          h(ComboboxList, {}, () => [
            h(ComboboxGroup, {}, () => [
              h(ComboboxLabel, {}, () => "Options"),
              h(
                ComboboxItem,
                { value: "one", textValue: "Alpha" },
                () => "Alpha",
              ),
              h(
                ComboboxItem,
                { value: "disabled", disabled: true },
                () => "Disabled",
              ),
              h(
                ComboboxItem,
                { value: "two", textValue: "Bravo" },
                () => "Bravo",
              ),
              h(
                ComboboxItem,
                { value: "three", textValue: "Charlie" },
                () => "Charlie",
              ),
            ]),
          ]),
        ),
      ],
    },
  });
  wrappers.push(wrapper);
  await nextTick();
  await nextTick();
  return wrapper;
}
const active = () =>
  document.querySelector<HTMLElement>("[data-active]")?.textContent?.trim();
describe("Combobox active cursor", () => {
  it("opens on selection, skips disabled items, wraps and selects with Enter while retaining input focus", async () => {
    const wrapper = await combo(),
      input = wrapper.find("input");
    expect(input.element.value).toBe("Bravo");
    await input.trigger("keydown", { key: "ArrowDown" });
    expect(active()).toBe("Bravo");
    await input.trigger("keydown", { key: "ArrowDown" });
    await input.trigger("keydown", { key: "ArrowDown" });
    expect(active()).toBe("Alpha");
    await input.trigger("keydown", { key: "ArrowDown" });
    expect(active()).toBe("Bravo");
    await input.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["two"]);
    expect(input.attributes("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(input.element);
  });
  it("resolves active option synchronously after search and clears stale cursors when results reappear", async () => {
    const wrapper = await combo(),
      input = wrapper.find("input");
    await input.trigger("focus");
    await input.trigger("keydown", { key: "End" });
    expect(active()).toBe("Charlie");
    await input.setValue("al");
    expect(active()).toBe("Alpha");
    await input.setValue("");
    expect(active()).toBe("Bravo");
    expect(input.attributes("aria-activedescendant")).toBe(
      document.querySelector("[data-active]")?.id,
    );
    await input.setValue("no match");
    expect(input.attributes("aria-activedescendant")).toBeUndefined();
    expect(document.querySelector("fieldset")?.hidden).toBe(true);
  });
  it("restores the search field when a controlled query request is rejected", async () => {
    const wrapper = await combo({ query: "br", defaultOpen: true }),
      input = wrapper.find("input");
    expect(input.element.value).toBe("br");
    await input.setValue("al");
    await nextTick();
    expect(wrapper.emitted("update:query")?.at(-1)).toEqual(["al"]);
    expect(input.element.value).toBe("br");
  });
  it("does not change a controlled selection until the parent accepts it", async () => {
    const wrapper = await combo({ modelValue: "one" }),
      input = wrapper.find("input");
    await input.trigger("focus");
    await input.trigger("keydown", { key: "End" });
    await input.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["three"]);
    expect(input.element.value).toBe("Alpha");
    await wrapper.setProps({ modelValue: "three" });
    expect(input.element.value).toBe("Charlie");
  });
});
describe("MultiSelect keyboard and removal", () => {
  it("keeps the search focused and open after Enter and Backspace removes the final selected chip", async () => {
    const wrapper = mount(MultiSelect, {
      props: { defaultValue: ["one"] },
      attachTo: document.body,
      slots: {
        default: () => [
          h(MultiSelectTrigger, {}, () => [
            h(MultiSelectValue),
            h(MultiSelectInput),
          ]),
          h(MultiSelectContent, {}, () =>
            h(MultiSelectList, {}, () => [
              h(
                MultiSelectItem,
                { value: "one", textValue: "Alpha" },
                () => "Alpha",
              ),
              h(
                MultiSelectItem,
                { value: "two", textValue: "Bravo" },
                () => "Bravo",
              ),
              h(
                MultiSelectItem,
                { value: "three", textValue: "Charlie" },
                () => "Charlie",
              ),
            ]),
          ),
        ],
      },
    });
    wrappers.push(wrapper);
    await nextTick();
    await nextTick();
    const input = wrapper.find("input");
    await input.trigger("focus");
    await input.trigger("keydown", { key: "ArrowDown" });
    await input.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([
      ["one", "two"],
    ]);
    expect(input.attributes("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(input.element);
    await input.trigger("keydown", { key: "Backspace" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([["one"]]);
    await wrapper.find("[data-multi-select-remove]").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([[]]);
    expect(document.activeElement).toBe(input.element);
  });
});
