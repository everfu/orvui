import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import { CommandPalette } from "../packages/vue/src/blocks/command-palette";
import { searchCommands } from "../packages/vue/src/blocks/command-palette/src/search";
import {
  MorphingSearch,
  MorphingSearchChips,
} from "../packages/vue/src/blocks/morphing-search";
import { ProjectFolder } from "../packages/vue/src/blocks/project-folder";
import catalog from "../tools/catalog/components.json";
import type { CatalogCategory, CatalogEntry } from "../tools/registry/types";
const wrappers: VueWrapper[] = [];
beforeAll(() => {
  Object.defineProperty(Element.prototype, "animate", {
    value: undefined,
    configurable: true,
  });
  Element.prototype.scrollIntoView = vi.fn();
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  });
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  document.body.innerHTML = "";
});
function key(element: Element, key: string) {
  element.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
}
describe("source search and folder contracts", () => {
  it("filters chip suggestions by the default matcher when no filter prop is supplied", async () => {
    const wrapper = mount(MorphingSearchChips, {
      props: {
        defaultQuery: "app",
        suggestions: ["Apple", "Banana"],
        defaultOpen: true,
      },
      attachTo: document.body,
    });
    wrappers.push(wrapper);
    await nextTick();
    expect(wrapper.text()).toContain("Apple");
    expect(wrapper.text()).not.toContain("Banana");
    await wrapper.setProps({ filter: false });
    expect(wrapper.text()).toContain("Banana");
  });
  it("normalizes accents and camel case, matches every word, and ranks a direct name before keyword matches", () => {
    const items = [
      { id: "keyword", label: "Other", keywords: ["file settings"] },
      { id: "name", label: "FileSettings" },
      { id: "accent", label: "Café notes" },
    ];
    expect(
      searchCommands(items, "file settings").map((item) => item.id),
    ).toEqual(["name", "keyword"]);
    expect(searchCommands(items, "cafe").map((item) => item.id)).toEqual([
      "accent",
    ]);
    expect(searchCommands(items, "file absent")).toEqual([]);
  });
  it("ranks an exact registry alias ahead of a broad component while preserving exact-label priority", () => {
    const component = (catalog.categories as CatalogCategory[])
      .flatMap((category) => category.components)
      .find((component) => component.slug === "range-slider") as CatalogEntry;
    const ruler = component.examples!.find(
      (example) => example.slug === "ruler",
    )!;
    const items = [
      {
        id: component.slug,
        label: component.name,
        keywords: [
          component.slug,
          component.description,
          ...component.keywords!,
        ],
      },
      {
        id: ruler.installSlug!,
        label: ruler.name,
        keywords: [
          component.name,
          component.slug,
          ruler.slug,
          ruler.installSlug!,
        ],
      },
    ];
    // The catalog's root carries broad variant keywords, whereas the variant's
    // dedicated install alias must identify its exact result.
    expect(searchCommands(items, "range-slider-ruler")[0]?.id).toBe(
      "range-slider-ruler",
    );
    const exactLabel = { id: "label", label: "range-slider-ruler" };
    expect(
      searchCommands([...items, exactLabel], "range-slider-ruler")[0]?.id,
    ).toBe("label");
  });
  it("uses grouped render order for keyboard selection and clamps the cursor at the final row", async () => {
    const select = vi.fn();
    const wrapper = mount(CommandPalette, {
      props: {
        defaultOpen: true,
        items: [
          { id: "a", label: "First", group: "One" },
          { id: "b", label: "Last", group: "Two", onSelect: select },
          { id: "c", label: "Middle", group: "One" },
        ],
      },
      attachTo: document.body,
    });
    wrappers.push(wrapper);
    await nextTick();
    expect(
      [...document.querySelectorAll("[role=option]")].map(
        (row) => row.textContent,
      ),
    ).toEqual(["First", "Middle", "Last"]);
    const field = document.querySelector("input")!;
    key(field, "ArrowDown");
    key(field, "ArrowDown");
    key(field, "ArrowDown");
    await nextTick();
    expect(
      document.querySelector("[role=option][aria-selected=true]")?.textContent,
    ).toBe("Last");
    key(field, "Enter");
    expect(select).toHaveBeenCalledOnce();
    expect(wrapper.emitted("select")?.[0]?.[0]).toMatchObject({ id: "b" });
  });
  it("opens MorphingSearch with the plain source shortcut and ignores shortcuts typed in an editable field", async () => {
    const wrapper = mount(MorphingSearch, {
      props: { items: [{ id: "a", title: "Files" }] },
      attachTo: document.body,
    });
    wrappers.push(wrapper);
    const other = document.createElement("input");
    document.body.append(other);
    key(other, "f");
    await nextTick();
    expect(document.querySelector("[role=dialog]")).toBeNull();
    key(document.body, "f");
    await nextTick();
    await nextTick();
    expect(
      document.querySelector("[role=dialog][aria-label=Search]"),
    ).toBeTruthy();
    expect(
      document.querySelector("[role=dialog]")?.classList.contains("fixed"),
    ).toBe(true);
    expect(
      document.querySelector("[role=dialog]")?.getAttribute("style"),
    ).toContain("width:");
    key(document.querySelector("[role=dialog] input")!, "Escape");
    await nextTick();
    expect(wrapper.emitted("update:open")?.at(-1)).toEqual([false]);
  });
  it("keeps an empty folder closed and uses source singular and plural count labels", async () => {
    const wrapper = mount(ProjectFolder, {
      props: { title: "Files", previews: [] },
    });
    wrappers.push(wrapper);
    expect(wrapper.text()).toContain("0 files");
    expect(wrapper.text()).toContain("Updated recently");
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("update:expanded")).toBeUndefined();
    await wrapper.setProps({ count: 1 });
    expect(wrapper.text()).toContain("1 file");
    expect(wrapper.text()).not.toContain("1 files");
  });
});
