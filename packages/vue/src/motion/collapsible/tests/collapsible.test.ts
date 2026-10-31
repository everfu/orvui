import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { h, nextTick } from "vue";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../index";

let wrapper: VueWrapper | undefined;
let resize: ResizeObserverCallback;
const disconnect = vi.fn();

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    })),
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: ResizeObserverCallback) {
        resize = callback;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
});

afterEach(() => {
  wrapper?.unmount();
  wrapper = undefined;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  disconnect.mockClear();
});

it("preserves slot layout, measured height and focus through collapse, resize and reopen", async () => {
  let contentHeight = 120;
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(
    function (this: HTMLElement) {
      return this.classList.contains("custom-content") ? contentHeight : 0;
    },
  );
  wrapper = mount(Collapsible, {
    props: { defaultOpen: true },
    attachTo: document.body,
    slots: {
      default: () => [
        h(CollapsibleTrigger, {}, () => "Details"),
        h(
          CollapsibleContent,
          { contentClassName: "custom-content flex gap-2" },
          () => [h("button", "First action"), h("button", "Second action")],
        ),
      ],
    },
  });
  await nextTick();
  const content = wrapper.get<HTMLElement>('[role="region"]');
  const inner = wrapper.get(".custom-content").element;
  const trigger = wrapper.get('[data-slot="collapsible-trigger"]');
  expect(content.element.style.height).toBe("120px");
  expect(wrapper.findAll(".custom-content > button")).toHaveLength(2);
  (
    wrapper.get(".custom-content > button").element as HTMLButtonElement
  ).focus();
  await trigger.trigger("click");
  expect(document.activeElement).toBe(trigger.element);
  expect(content.attributes("inert")).toBeDefined();
  expect(content.attributes("aria-hidden")).toBe("true");
  expect(content.element.style.height).toBe("1px");

  contentHeight = 176;
  resize([], {} as ResizeObserver);
  await nextTick();
  await trigger.trigger("click");
  expect(content.element.style.height).toBe("176px");
  expect(content.attributes("inert")).toBeUndefined();
  expect(wrapper.get(".custom-content").element).toBe(inner);
  wrapper.unmount();
  wrapper = undefined;
  expect(disconnect).toHaveBeenCalledOnce();
});
