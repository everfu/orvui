import { beforeEach, afterEach, it, expect, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { defineComponent, h, nextTick, shallowRef } from "vue";
import {
  SortableList,
  SortableListGroup,
  SortableListItem,
  SortableListHandle,
  SortableListItemContent,
  SortableListUndo,
  useSortableList,
} from "../packages/vue/src/motion/sortable-stack";
import { PullToRefresh } from "../packages/vue/src/motion/pull-to-refresh";
import { Dock, DockItem } from "../packages/vue/src/motion/dock";
import { SPRING_LAYOUT } from "../packages/vue/src/lib/ease";
const wrappers: VueWrapper[] = [],
  nativeAnimate = Element.prototype.animate;
let reduced = false;
beforeEach(() => {
  window.matchMedia = vi
    .fn()
    .mockImplementation(() => ({
      matches: reduced,
      addEventListener() {},
      removeEventListener() {},
    }));
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
afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount());
  document.body.innerHTML = "";
  reduced = false;
  vi.useRealTimers();
  vi.restoreAllMocks();
});
function render(component: any, props: any = {}, slots: any = {}) {
  const w = mount(component, { props, slots, attachTo: document.body });
  wrappers.push(w);
  return w;
}
const tasks = [
  { id: "one", label: "First task" },
  { id: "two", label: "Second task" },
  { id: "three", label: "Third task" },
];
function touch(w: VueWrapper, type: string, x: number, y: number, count = 1) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, "touches", {
    value: Array.from({ length: count }, () => ({ clientX: x, clientY: y })),
  });
  w.element.dispatchEvent(event);
  return event;
}
it("restores focus to the moved handle when undo restores the previous order", async () => {
  const w = render(SortableList, {
    defaultItems: tasks,
    getItemLabel: (item: (typeof tasks)[number]) => item.label,
  });
  await w.find("[data-sortable-id=one]").trigger("keydown", { key: "End" });
  const undo = w.findComponent(SortableListUndo);
  (undo.element as HTMLButtonElement).focus();
  await undo.trigger("click");
  await nextTick();
  expect(document.activeElement).toBe(w.find("[data-sortable-id=one]").element);
  expect(w.find("[role=status]").text()).toBe("Previous order restored.");
});
it("keeps the existing undo snapshot when a subsequent drag ends without reordering", async () => {
  const w = render(SortableList, {
    defaultItems: tasks,
    getItemLabel: (item: (typeof tasks)[number]) => item.label,
  });
  await w.find("[data-sortable-id=one]").trigger("keydown", { key: "End" });
  const item = w.findComponent({ name: "ReorderItem" });
  item.vm.$emit("dragStart");
  await nextTick();
  item.vm.$emit("dragEnd");
  await nextTick();
  expect(
    w.findComponent(SortableListUndo).attributes("disabled"),
  ).toBeUndefined();
  await w.findComponent(SortableListUndo).trigger("click");
  expect(
    (w.emitted("itemsChange")!.at(-1)![0] as typeof tasks).map((i) => i.id),
  ).toEqual(["one", "two", "three"]);
});
it("captures a drag as one undo transaction and announces the source label", async () => {
  const w = render(SortableList, {
    defaultItems: tasks,
    getItemLabel: (item: (typeof tasks)[number]) => item.label,
  });
  const item = w.findAllComponents({ name: "ReorderItem" })[0];
  item.vm.$emit("dragStart");
  w.findComponent({ name: "ReorderGroup" }).vm.$emit("update:values", [
    "two",
    "one",
    "three",
  ]);
  await nextTick();
  w.findComponent({ name: "ReorderGroup" }).vm.$emit("update:values", [
    "two",
    "three",
    "one",
  ]);
  await nextTick();
  item.vm.$emit("dragEnd");
  await nextTick();
  expect(w.find("[role=status]").text()).toBe(
    "First task moved to position 3 of 3.",
  );
  await w.findComponent(SortableListUndo).trigger("click");
  expect(
    (w.emitted("itemsChange")!.at(-1)![0] as typeof tasks).map((i) => i.id),
  ).toEqual(["one", "two", "three"]);
});
it("invalidates an old undo if a consumer removes and later re-adds a row", async () => {
  const w = render(SortableList, { defaultItems: tasks });
  await w.find("[data-sortable-id=one]").trigger("keydown", { key: "End" });
  await w.setProps({ modelValue: [tasks[1], tasks[0]] });
  await w.setProps({ modelValue: [tasks[1], tasks[2], tasks[0]] });
  expect(
    w.findComponent(SortableListUndo).attributes("disabled"),
  ).toBeDefined();
});
it("does not revive a drag snapshot if a row was removed before the drag ended", async () => {
  const w = render(SortableList, { defaultItems: tasks });
  const item = w.findAllComponents({ name: "ReorderItem" })[0];
  item.vm.$emit("dragStart");
  await w.setProps({ modelValue: [tasks[1], tasks[0]] });
  item.vm.$emit("dragEnd");
  await nextTick();
  await w.setProps({ modelValue: [tasks[1], tasks[2], tasks[0]] });
  expect(
    w.findComponent(SortableListUndo).attributes("disabled"),
  ).toBeDefined();
});
it("honors a custom undo click cancellation before restoring the order", async () => {
  const w = render(
    SortableList,
    { defaultItems: tasks },
    {
      default: ({ items }: { items: typeof tasks }) => [
        h(SortableListGroup, {}, () =>
          items.map((item) =>
            h(SortableListItem, { id: item.id, key: item.id }, () => [
              h(SortableListHandle),
              h(SortableListItemContent, {}, () => item.label),
            ]),
          ),
        ),
        h(SortableListUndo, {
          onClick: (event: MouseEvent) => event.preventDefault(),
        }),
      ],
    },
  );
  await w.find("[data-sortable-id=one]").trigger("keydown", { key: "End" });
  await w.findComponent(SortableListUndo).trigger("click");
  expect(w.emitted("itemsChange")).toHaveLength(1);
  expect(
    w.findComponent(SortableListUndo).attributes("disabled"),
  ).toBeUndefined();
});
it("keeps useSortableList disabled state reactive", async () => {
  const Status = defineComponent({
    setup() {
      const list = useSortableList();
      return () =>
        h("span", { "data-disabled-state": "" }, String(list.disabled.value));
    },
  });
  const w = render(
    SortableList,
    { defaultItems: tasks },
    { default: () => h(Status) },
  );
  expect(w.find("[data-disabled-state]").text()).toBe("false");
  await w.setProps({ disabled: true });
  expect(w.find("[data-disabled-state]").text()).toBe("true");
});
it("uses the resisted native-touch threshold and ignores the duplicate touch pointer path", async () => {
  vi.useFakeTimers();
  const refresh = vi.fn(() => new Promise<void>(() => {})),
    w = render(PullToRefresh, { onRefresh: refresh });
  await w.trigger("pointerdown", {
    pointerType: "touch",
    pointerId: 1,
    button: 0,
    clientX: 0,
    clientY: 0,
  });
  await w.trigger("pointermove", {
    pointerType: "touch",
    pointerId: 1,
    clientX: 0,
    clientY: 200,
  });
  await w.trigger("pointerup", { pointerType: "touch", pointerId: 1 });
  expect(refresh).not.toHaveBeenCalled();
  touch(w, "touchstart", 0, 0);
  const under = touch(w, "touchmove", 0, 113);
  await nextTick();
  expect(under.defaultPrevented).toBe(true);
  expect(w.attributes("data-state")).toBe("pulling");
  touch(w, "touchend", 0, 113, 0);
  expect(refresh).not.toHaveBeenCalled();
  touch(w, "touchstart", 0, 0);
  touch(w, "touchmove", 0, 114);
  await nextTick();
  expect(w.attributes("data-state")).toBe("ready");
  touch(w, "touchend", 0, 114, 0);
  await nextTick();
  expect(refresh).toHaveBeenCalledTimes(1);
  expect(w.attributes("aria-busy")).toBe("true");
});
it("leaves native touch scroll alone away from the top or during a horizontal gesture", async () => {
  const refresh = vi.fn(),
    w = render(PullToRefresh, { onRefresh: refresh });
  (w.element as HTMLElement).scrollTop = 10;
  touch(w, "touchstart", 0, 0);
  expect(touch(w, "touchmove", 0, 140).defaultPrevented).toBe(false);
  touch(w, "touchend", 0, 140, 0);
  (w.element as HTMLElement).scrollTop = 0;
  touch(w, "touchstart", 0, 0);
  expect(touch(w, "touchmove", 160, 100).defaultPrevented).toBe(false);
  touch(w, "touchend", 160, 100, 0);
  expect(refresh).not.toHaveBeenCalled();
});
it("updates pull progress when threshold changes and renders rich source labels", async () => {
  vi.useFakeTimers();
  const w = render(
    PullToRefresh,
    { pullingLabel: h("strong", { "data-rich-label": "" }, "Pull gently") },
    {
      default: ({ progress }: { progress: number }) =>
        h("span", { "data-progress": "" }, progress.toFixed(4)),
    },
  );
  expect(w.find("[data-rich-label]").text()).toBe("Pull gently");
  await w.trigger("pointerdown", {
    pointerType: "pen",
    pointerId: 1,
    button: 0,
    clientX: 0,
    clientY: 0,
  });
  await w.trigger("pointermove", {
    pointerType: "pen",
    pointerId: 1,
    clientX: 0,
    clientY: 80,
  });
  await vi.advanceTimersByTimeAsync(32);
  const distance = 132 * (1 - Math.exp(-80 / 132));
  expect(Number(w.find("[data-progress]").text())).toBeCloseTo(
    distance / 76,
    3,
  );
  await w.setProps({ threshold: 100 });
  await vi.advanceTimersByTimeAsync(32);
  expect(Number(w.find("[data-progress]").text())).toBeCloseTo(
    distance / 100,
    3,
  );
});
it("keeps a successful refresh held until its external refreshing state releases", async () => {
  vi.useFakeTimers();
  let resolve!: () => void;
  const refresh = vi.fn(
      () =>
        new Promise<void>((done) => {
          resolve = done;
        }),
    ),
    w = render(PullToRefresh, { onRefresh: refresh });
  touch(w, "touchstart", 0, 0);
  touch(w, "touchmove", 0, 160);
  touch(w, "touchend", 0, 160, 0);
  await nextTick();
  await w.setProps({ refreshing: true });
  resolve();
  await Promise.resolve();
  await nextTick();
  expect(w.attributes("data-state")).toBe("refreshing");
  expect(w.attributes("aria-busy")).toBe("true");
  await w.setProps({ refreshing: false });
  expect(w.attributes("data-state")).toBe("idle");
  expect(w.attributes("aria-busy")).toBe("false");
});
it("updates the dock button/link branch when its handler changes and retains the source pill spring", async () => {
  const handler = shallowRef<(() => void) | undefined>(),
    click = vi.fn();
  const w = render(
    defineComponent({
      setup() {
        return () =>
          h(Dock, {}, () =>
            h(DockItem, { active: true, onClick: handler.value }, () =>
              h("a", { href: "#item" }, "Item"),
            ),
          );
      },
    }),
  );
  expect(w.findComponent(DockItem).element.tagName).toBe("DIV");
  handler.value = click;
  await nextTick();
  expect(w.findComponent(DockItem).element.tagName).toBe("BUTTON");
  await w.findComponent(DockItem).trigger("click");
  expect(click).toHaveBeenCalledTimes(1);
  expect(w.findComponent({ name: "motion.span" }).props("transition")).toEqual(
    SPRING_LAYOUT,
  );
  handler.value = undefined;
  await nextTick();
  expect(w.findComponent(DockItem).element.tagName).toBe("DIV");
});
