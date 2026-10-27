import {
  beforeAll,
  afterAll,
  afterEach,
  describe,
  it,
  expect,
  vi,
} from "vitest";
import { mount, flushPromises, type VueWrapper } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref } from "vue";
import { Table } from "..";
import {
  useTableColumns,
  absoluteColumnWidth,
} from "../src/useTableColumns";
const wrappers: VueWrapper[] = [];
const nativeAnimate = Element.prototype.animate;
beforeAll(() => {
  // Keep WAAPI available; happy-dom exposes cancellation as a rejected finished promise.
  if (nativeAnimate)
    vi.spyOn(Element.prototype, "animate").mockImplementation(function (
      this: Element,
      ...args: Parameters<Element["animate"]>
    ) {
      const animation = nativeAnimate.apply(this, args);
      void animation.finished.catch(() => undefined);
      return animation;
    });
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(800);
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(
    function (this: HTMLElement) {
      return this.classList.contains("overflow-auto") ? 200 : 48;
    },
  );
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(800);
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(
    function (this: HTMLElement) {
      return this.classList.contains("overflow-auto") ? 200 : 48;
    },
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});
afterAll(() => {
  Object.defineProperty(Element.prototype, "animate", {
    value: nativeAnimate,
    configurable: true,
  });
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
afterEach(async () => {
  document.getAnimations?.().forEach((animation) => {
    if (Number.isFinite(Number(animation.effect?.getTiming().iterations)))
      animation.finish();
  });
  await nextTick();
  wrappers.splice(0).forEach((w) => w.unmount());
  document.body.innerHTML = "";
});
async function settle() {
  await flushPromises();
  for (let i = 0; i < 5; i++) await nextTick();
}
function render(props: Record<string, any>) {
  const w = mount(Table, { props: props as any, attachTo: document.body });
  wrappers.push(w);
  return w;
}
const data = Array.from({ length: 10000 }, (_, i) => ({
  id: String(i),
  name: `Person ${i}`,
  score: 10000 - i,
}));
const columns = [
  { key: "name", header: "Name", editable: true },
  { key: "score", header: "Score", sortable: true },
];
describe("native virtual table and business events", () => {
  it("keeps ten thousand records virtual, scrolls to the last window, and retains native table semantics", async () => {
    const w = render({ data, columns, getRowId: (row: any) => row.id });
    await settle();
    expect(w.find("table").attributes("aria-rowcount")).toBe("10001");
    expect(w.findAll("tbody tr[data-index]").length).toBeGreaterThan(0);
    expect(w.findAll("tbody tr[data-index]").length).toBeLessThan(40);
    const scroll = w.find(".overflow-auto");
    (scroll.element as HTMLElement).scrollTop = 479800;
    await scroll.trigger("scroll");
    await settle();
    expect(
      Number(w.find("tbody tr[data-index]").attributes("data-index")),
    ).toBeGreaterThan(9900);
  });
  it("emits one cell edit per input and selection stays controlled across sorting", async () => {
    const change = vi.fn(),
      selection = vi.fn();
    const w = render({
      data: data.slice(0, 3),
      columns,
      selectable: true,
      selectedRowIds: [],
      getRowId: (row: any) => row.id,
      onCellEdit: change,
      onSelectionChange: selection,
    });
    await settle();
    await w.find('input[aria-label="name for row 1"]').setValue("Edited");
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledWith("0", "name", "Edited");
    await w.find('[aria-label="Select row 1"]').trigger("click");
    expect(selection).toHaveBeenCalledOnce();
    expect(selection).toHaveBeenCalledWith(["0"]);
    expect(w.find("tbody tr[data-index]").attributes("aria-selected")).toBe(
      "false",
    );
    await w.findAll("thead th")[2].find("button").trigger("click");
    await settle();
    expect(w.find("tbody tr[data-index] input").attributes("aria-label")).toBe(
      "name for row 1",
    );
    expect(
      (w.find("tbody tr[data-index] input").element as HTMLInputElement).value,
    ).toBe("Person 2");
  });
  it("arms end reached once per load cycle even when the new page has the same length", async () => {
    const end = vi.fn(),
      w = render({ data: data.slice(0, 1), columns, onEndReached: end });
    await settle();
    const scroll = w.find(".overflow-auto");
    await scroll.trigger("scroll");
    await scroll.trigger("scroll");
    expect(end).toHaveBeenCalledOnce();
    await w.setProps({ loading: true });
    await scroll.trigger("scroll");
    expect(end).toHaveBeenCalledOnce();
    await w.setProps({ loading: false });
    await scroll.trigger("scroll");
    expect(end).toHaveBeenCalledTimes(2);
  });
});
describe("column pointer geometry", () => {
  it("freezes sibling widths, clamps resizing, and inserts new columns at their requested neighbor", async () => {
    const cols = ref([
        { key: "a", header: "A" },
        { key: "b", header: "B" },
      ]),
      headers = ref<Record<string, HTMLElement | null>>({}),
      events = vi.fn();
    let api!: ReturnType<typeof useTableColumns>;
    const w = mount(
      defineComponent({
        setup() {
          api = useTableColumns(
            () => cols.value,
            headers,
            () => 64,
            events,
          );
          return () => h("div");
        },
      }),
    );
    wrappers.push(w);
    for (const [i, key] of ["a", "b"].entries()) {
      const element = document.createElement("th");
      vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
        left: i * 100,
        right: (i + 1) * 100,
        width: 100,
        top: 0,
        bottom: 48,
        height: 48,
        x: i * 100,
        y: 0,
        toJSON() {},
      });
      headers.value[key] = element;
    }
    const event = (x: number) =>
      ({
        button: 0,
        clientX: x,
        pointerId: 1,
        currentTarget: document.createElement("button"),
        preventDefault() {},
        stopPropagation() {},
      }) as unknown as PointerEvent;
    api.startResize("a", event(100));
    api.moveResize(event(-100));
    api.endResize();
    expect(api.widths.value).toEqual({ a: 64, b: 100 });
    expect(events).toHaveBeenCalledWith("columnResize", "a", 64);
    api.startReorder("a", event(0));
    api.moveReorder(event(250));
    api.endReorder();
    expect(api.ordered.value.map((c) => c.key)).toEqual(["b", "a"]);
    cols.value = [
      { key: "a", header: "A" },
      { key: "new", header: "New" },
      { key: "b", header: "B" },
    ];
    await nextTick();
    expect(api.ordered.value.map((c) => c.key)).toEqual(["b", "a", "new"]);
  });
  it("resolves only absolute px and rem widths to a deterministic minimum", () => {
    expect(absoluteColumnWidth("10rem", 20)).toBe(200);
    expect(absoluteColumnWidth("160px", 20)).toBe(160);
    for (const width of ["20%", "1fr", "auto", "calc(20% + 1px)", undefined])
      expect(absoluteColumnWidth(width, 20)).toBeNull();
  });
});
