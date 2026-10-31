import { beforeAll, afterEach, describe, it, expect, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { h, nextTick, defineComponent } from "vue";
import {
  FileTree,
  FileTreeFolder,
  FileTreeFile,
} from "../../packages/vue/src/motion/file-tree";
import { Loader } from "../../packages/vue/src/motion/loader";
const wrappers: VueWrapper[] = [];
const render = (component: any, options: any = {}) => {
  const w = mount(component, { attachTo: document.body, ...options });
  wrappers.push(w);
  return w;
};
beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});
afterEach(() => {
  for (const w of wrappers.splice(0)) w.unmount();
  vi.useRealTimers();
  document.body.innerHTML = "";
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});
const Tree = defineComponent({
  setup: () => () =>
    h(
      FileTree,
      { defaultExpandedIds: ["src", "components"] },
      {
        default: () => [
          h(
            FileTreeFolder,
            { value: "src", name: "src" },
            {
              default: () => [
                h(
                  FileTreeFolder,
                  { value: "components", name: "components" },
                  {
                    default: () => [
                      h(FileTreeFile, { value: "button", name: "Button.vue" }),
                      h(FileTreeFile, { value: "card", name: "Card.vue" }),
                    ],
                  },
                ),
                h(FileTreeFile, { value: "app", name: "App.vue" }),
              ],
            },
          ),
          h(FileTreeFile, { value: "package", name: "package.json" }),
          h(FileTreeFile, {
            value: "locked",
            name: "Locked.vue",
            disabled: true,
          }),
        ],
      },
    ),
});
describe("hierarchical file explorer keyboard navigation", () => {
  it("navigates into open branches and back to the parent", async () => {
    const w = render(Tree);
    const rows = () => w.findAll("[role=treeitem]");
    await rows()[0].trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement?.textContent).toContain("components");
    await rows()[1].trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement?.textContent).toContain("Button.vue");
    await rows()[2].trigger("keydown", { key: "ArrowLeft" });
    expect(document.activeElement?.textContent).toContain("components");
    await rows()[1].trigger("keydown", { key: "ArrowLeft" });
    expect(rows().some((r) => r.text() === "Button.vue")).toBe(false);
    expect(rows()[1].attributes("aria-expanded")).toBe("false");
  });
  it("uses a single roving tab stop, correct hierarchy, and typeahead", async () => {
    const w = render(Tree);
    expect(w.findAll('[role=treeitem][tabindex="0"]')).toHaveLength(1);
    const first = w.findAll("[role=treeitem]")[0];
    await first.trigger("keydown", { key: "b" });
    await nextTick();
    expect(document.activeElement?.textContent).toContain("Button.vue");
    expect(w.findAll('[role=treeitem][tabindex="0"]')).toHaveLength(1);
    const button = w
      .findAll("[role=treeitem]")
      .find((r) => r.text() === "Button.vue")!;
    expect(button.attributes("aria-level")).toBe("3");
    expect(button.attributes("aria-posinset")).toBe("1");
    expect(button.attributes("aria-setsize")).toBe("2");
    await button.trigger("keydown", { key: "End" });
    expect(document.activeElement?.textContent).toContain("Locked.vue");
    await w
      .findAll("[role=treeitem]")
      .at(-1)!
      .trigger("keydown", { key: "Enter" });
    expect(w.findComponent(FileTree).emitted("change")).toBeUndefined();
  });
  it("selects a folder and toggles its branch on Enter", async () => {
    const w = render(Tree);
    await w.findAll("[role=treeitem]")[0].trigger("keydown", { key: "Enter" });
    expect(
      w.findComponent(FileTree).emitted("update:modelValue")?.at(-1),
    ).toEqual(["src"]);
    expect(w.findAll("[role=treeitem]")).toHaveLength(3);
    expect(w.findAll("[role=treeitem]")[0].attributes("aria-expanded")).toBe(
      "false",
    );
  });
});
describe("source loader variants", () => {
  it("keeps the Bayer dither, double helix, and Newton cradle structurally distinct", () => {
    const dither = render(Loader, { props: { variant: "dither" } });
    expect(dither.findAll(".grid > span")).toHaveLength(16);
    const helix = render(Loader, { props: { variant: "helix" } });
    expect(helix.findAll(".absolute.rounded-full")).toHaveLength(14);
    const newton = render(Loader, { props: { variant: "newton" } });
    expect(newton.findAll(".rounded-full")).toHaveLength(5);
    expect(newton.html()).not.toContain("rotate(");
  });
  it("advances terminal glyphs at the speed-derived cadence and cleans up its timer", async () => {
    vi.useFakeTimers();
    const w = render(Loader, { props: { variant: "ascii-line", speed: 2 } });
    expect(w.text()).toContain("|");
    await vi.advanceTimersByTimeAsync(500);
    expect(w.text()).toContain("/");
    w.unmount();
    wrappers.pop();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("shows the source scramble target rather than a single random symbol and freezes it for reduced motion", async () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const w = render(Loader, { props: { variant: "scramble" } });
    await nextTick();
    expect(w.text()).toContain("LOADING");
    expect(w.findAll("[role=status]")).toHaveLength(1);
  });
});
