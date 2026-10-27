import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { h, nextTick } from "vue";
import {
  Timeline,
  type TimelineEvent,
} from "..";

const animations = vi.hoisted(
  () =>
    [] as {
      from: number;
      to: number;
      options: {
        velocity?: number;
        onUpdate?: (value: number) => void;
        onComplete?: () => void;
      };
      stop: ReturnType<typeof vi.fn>;
    }[],
);
vi.mock("motion-v", async (original) => ({
  ...(await original<Record<string, unknown>>()),
  animate: (
    from: number,
    to: number,
    options: (typeof animations)[number]["options"],
  ) => {
    const stop = vi.fn();
    animations.push({ from, to, options, stop });
    return { stop };
  },
}));

const wrappers: VueWrapper[] = [];
const observers: {
  callback: ResizeObserverCallback;
  disconnect: ReturnType<typeof vi.fn>;
}[] = [];
const mediaListeners = new Set<() => void>();
let width = 800;
let reduced = false;
let now = 0;

const events: TimelineEvent[] = Array.from({ length: 7 }, (_, index) => ({
  id: `event-${index}`,
  date: `202${index < 3 ? "5" : "6"}-01-${String(index + 1).padStart(2, "0")}`,
  title: `Milestone ${index + 1}`,
}));

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(performance, "now").mockImplementation(() => now);
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(
    () => width,
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      disconnect = vi.fn();
      constructor(callback: ResizeObserverCallback) {
        observers.push({ callback, disconnect: this.disconnect });
      }
      observe() {}
    },
  );
  window.matchMedia = vi.fn().mockImplementation(() => ({
    get matches() {
      return reduced;
    },
    addEventListener(_name: string, listener: () => void) {
      mediaListeners.add(listener);
    },
    removeEventListener(_name: string, listener: () => void) {
      mediaListeners.delete(listener);
    },
  }));
});

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount();
  animations.length = 0;
  observers.length = 0;
  mediaListeners.clear();
  width = 800;
  reduced = false;
  now = 0;
  document.body.innerHTML = "";
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function render(
  props: Record<string, unknown> = {},
  slots: {
    media?: (props: {
      event: TimelineEvent;
      active: boolean;
    }) => ReturnType<typeof h>;
    meta?: (props: { event: TimelineEvent }) => ReturnType<typeof h>;
  } = {},
) {
  const wrapper = mount(Timeline, {
    props: { events, ...props },
    slots,
    attachTo: document.body,
  });
  wrappers.push(wrapper);
  return wrapper;
}

function pointer(
  wrapper: VueWrapper,
  type: string,
  clientX: number,
  pointerId = 1,
) {
  now += 20;
  wrapper.element.dispatchEvent(
    new PointerEvent(type, {
      pointerId,
      isPrimary: true,
      clientX,
      button: 0,
      bubbles: true,
      cancelable: true,
    }),
  );
}

function capture(wrapper: VueWrapper) {
  const host = wrapper.element as HTMLElement;
  let captured = false;
  const set = vi.fn(() => {
    captured = true;
  });
  const release = vi.fn(() => {
    captured = false;
  });
  Object.assign(host, {
    setPointerCapture: set,
    hasPointerCapture: () => captured,
    releasePointerCapture: release,
  });
  return { set, release };
}

function firstCardStyle(wrapper: VueWrapper) {
  return (wrapper.find('[data-slot="timeline-event"]').element as HTMLElement)
    .style;
}

describe("Timeline reference interaction contract", () => {
  it("uses a nonzero hidden-stage fallback and responds to measured width", async () => {
    width = 0;
    const wrapper = render();
    await nextTick();
    expect(firstCardStyle(wrapper).width).toBe("288px");
    const line = wrapper.find("line");
    expect(line.attributes("x1")).toBe("400");
    width = 375;
    observers[0].callback(
      [{ contentRect: { width } } as ResizeObserverEntry],
      {} as ResizeObserver,
    );
    await nextTick();
    expect(parseFloat(firstCardStyle(wrapper).width)).toBeCloseTo(217.5);
    expect(line.attributes("x1")).toBe("187.5");
  });

  it("keeps one named tab stop, UTC dates and scoped media/meta slots", async () => {
    const wrapper = render(
      { defaultValue: "missing", ariaLabel: "Release history" },
      {
        media: ({ event, active }: { event: TimelineEvent; active: boolean }) =>
          h("span", { "data-media": event.id }, `${event.title}:${active}`),
        meta: ({ event }: { event: TimelineEvent }) =>
          h("span", { "data-meta": event.id }, event.id),
      },
    );
    await nextTick();
    expect(wrapper.attributes("aria-label")).toBe("Release history");
    expect(wrapper.findAll('button[tabindex="0"]')).toHaveLength(1);
    const button = wrapper.find('button[aria-current="step"]');
    expect(
      button
        .attributes("aria-labelledby")!
        .split(" ")
        .map((id) => document.getElementById(id)?.textContent),
    ).toEqual(["Jan 1 ’25", "Milestone 1"]);
    expect(wrapper.find('[data-media="event-0"]').text()).toBe(
      "Milestone 1:true",
    );
    expect(wrapper.find('[data-meta="event-0"]').text()).toBe("event-0");
    expect(wrapper.emitted("change")).toBeUndefined();
  });

  it("supports keyboard boundaries, focus and reduced-motion selection without a spring", async () => {
    reduced = true;
    const wrapper = render({ defaultValue: "event-2" });
    await nextTick();
    const buttons = wrapper.findAll("button");
    await buttons[2].trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement).toBe(buttons[3].element);
    expect(buttons[3].attributes("aria-current")).toBe("step");
    await buttons[3].trigger("keydown", { key: "End" });
    expect(document.activeElement).toBe(buttons[6].element);
    await buttons[6].trigger("keydown", { key: "ArrowRight" });
    await buttons[6].trigger("keydown", { key: "Home" });
    expect(document.activeElement).toBe(buttons[0].element);
    expect(wrapper.emitted("update:modelValue")).toEqual([
      ["event-3"],
      ["event-6"],
      ["event-0"],
    ]);
    expect(wrapper.emitted("change")).toEqual(
      wrapper.emitted("update:modelValue"),
    );
    expect(animations).toHaveLength(0);
  });

  it("retains parent-controlled selection until the requested model is echoed", async () => {
    reduced = true;
    const wrapper = render({ modelValue: "event-0" });
    await nextTick();
    await wrapper.findAll("button")[2].trigger("click");
    expect(wrapper.emitted("update:modelValue")).toEqual([["event-2"]]);
    expect(wrapper.findAll("button")[0].attributes("aria-current")).toBe(
      "step",
    );
    await wrapper.setProps({ modelValue: "event-2" });
    expect(wrapper.findAll("button")[2].attributes("aria-current")).toBe(
      "step",
    );
    expect(wrapper.emitted("update:modelValue")).toEqual([["event-2"]]);
  });

  it("waits for the drag threshold before capturing a pointer or changing events", async () => {
    const wrapper = render({ defaultValue: "event-2" });
    const captured = capture(wrapper);
    pointer(wrapper, "pointerdown", 400);
    pointer(wrapper, "pointermove", 397);
    await nextTick();
    expect(captured.set).not.toHaveBeenCalled();
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    pointer(wrapper, "pointermove", 396);
    expect(captured.set).toHaveBeenCalledWith(1);
    pointer(wrapper, "pointerup", 396);
    expect(captured.release).toHaveBeenCalledWith(1);
    expect(animations).toHaveLength(1);
  });

  it("clears an uncaptured press released outside the stage before the next gesture", async () => {
    const wrapper = render({ defaultValue: "event-2" });
    const captured = capture(wrapper);
    pointer(wrapper, "pointerdown", 500);
    now += 20;
    document.dispatchEvent(
      new PointerEvent("pointerup", {
        pointerId: 1,
        isPrimary: true,
        clientX: 500,
        button: 0,
        bubbles: true,
      }),
    );
    pointer(wrapper, "pointermove", 345);
    await nextTick();
    expect(captured.set).not.toHaveBeenCalled();
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();

    pointer(wrapper, "pointerdown", 300);
    pointer(wrapper, "pointermove", 145);
    await nextTick();
    expect(captured.set).toHaveBeenCalledWith(1);
    expect(wrapper.emitted("update:modelValue")).toEqual([["event-3"]]);
    pointer(wrapper, "pointercancel", 145);
  });

  it("ignores a secondary touch without interrupting the primary pointer session", async () => {
    const wrapper = render({ defaultValue: "event-2" });
    const captured = capture(wrapper);
    pointer(wrapper, "pointerdown", 500);
    wrapper.element.dispatchEvent(
      new PointerEvent("pointerdown", {
        pointerId: 2,
        isPrimary: false,
        clientX: 100,
        button: 0,
        bubbles: true,
      }),
    );
    pointer(wrapper, "pointermove", 345);
    await nextTick();
    expect(captured.set).toHaveBeenCalledWith(1);
    expect(wrapper.emitted("update:modelValue")).toEqual([["event-3"]]);
    pointer(wrapper, "pointercancel", 345);
  });

  it("emits once per nearest event during a controlled drag without waiting for parent echo", async () => {
    const wrapper = render({ modelValue: "event-0" });
    capture(wrapper);
    pointer(wrapper, "pointerdown", 500);
    for (const x of [345, 335, 325]) {
      pointer(wrapper, "pointermove", x);
      await nextTick();
    }
    expect(wrapper.emitted("update:modelValue")).toEqual([["event-1"]]);
    pointer(wrapper, "pointercancel", 325);
  });

  it("cancels touch loss at the nearest event without projecting a flick", async () => {
    const wrapper = render({ defaultValue: "event-2" });
    const captured = capture(wrapper);
    pointer(wrapper, "pointerdown", 500);
    pointer(wrapper, "pointermove", 345);
    await nextTick();
    pointer(wrapper, "pointercancel", 345);
    expect(captured.release).toHaveBeenCalledWith(1);
    expect(animations.at(-1)?.to).toBe(3);
    expect(animations.at(-1)?.options.velocity).toBe(0);
  });

  it("settles lost pointer capture and ignores later moves from that pointer", async () => {
    const wrapper = render({ defaultValue: "event-2" });
    capture(wrapper);
    pointer(wrapper, "pointerdown", 500);
    pointer(wrapper, "pointermove", 345);
    await nextTick();
    pointer(wrapper, "lostpointercapture", 345);
    expect(animations.at(-1)?.to).toBe(3);
    expect(animations.at(-1)?.options.velocity).toBe(0);
    const before = firstCardStyle(wrapper).transform;
    pointer(wrapper, "pointermove", 100);
    await nextTick();
    expect(firstCardStyle(wrapper).transform).toBe(before);
  });

  it("releases a drag on window blur and settles without flick velocity", async () => {
    const wrapper = render({ defaultValue: "event-2" });
    const captured = capture(wrapper);
    pointer(wrapper, "pointerdown", 500);
    pointer(wrapper, "pointermove", 345);
    await nextTick();
    window.dispatchEvent(new Event("blur"));
    expect(captured.release).toHaveBeenCalledWith(1);
    expect(animations.at(-1)?.to).toBe(3);
    expect(animations.at(-1)?.options.velocity).toBe(0);
    const before = firstCardStyle(wrapper).transform;
    pointer(wrapper, "pointermove", 100);
    await nextTick();
    expect(firstCardStyle(wrapper).transform).toBe(before);
  });

  it("suppresses the synthetic card click after a drag", async () => {
    reduced = true;
    const wrapper = render({ defaultValue: "event-2" });
    capture(wrapper);
    await nextTick();
    pointer(wrapper, "pointerdown", 500);
    pointer(wrapper, "pointermove", 345);
    await nextTick();
    pointer(wrapper, "pointerup", 345);
    await nextTick();
    const changes = wrapper.emitted("update:modelValue")?.length;
    await wrapper.findAll("button")[2].trigger("click", { detail: 1 });
    expect(wrapper.emitted("update:modelValue")).toHaveLength(changes!);
    expect(wrapper.findAll("button")[6].attributes("aria-current")).toBe(
      "step",
    );
  });

  it("leaves vertical wheel to the page and prevents horizontal wheel navigation", async () => {
    const wrapper = render();
    const vertical = new WheelEvent("wheel", {
      deltaY: 200,
      deltaX: 2,
      cancelable: true,
    });
    wrapper.element.dispatchEvent(vertical);
    await nextTick();
    expect(vertical.defaultPrevented).toBe(false);
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    const horizontal = new WheelEvent("wheel", {
      deltaX: 200,
      cancelable: true,
    });
    wrapper.element.dispatchEvent(horizontal);
    await nextTick();
    expect(horizontal.defaultPrevented).toBe(true);
    expect(wrapper.emitted("update:modelValue")).toEqual([["event-1"]]);
    await vi.advanceTimersByTimeAsync(140);
    expect(animations.at(-1)?.to).toBe(1);
  });

  it("discards a wheel settle when a new pointer gesture starts", async () => {
    const wrapper = render({ defaultValue: "event-2" });
    capture(wrapper);
    wrapper.element.dispatchEvent(
      new WheelEvent("wheel", { deltaX: 100, cancelable: true }),
    );
    await nextTick();
    pointer(wrapper, "pointerdown", 400);
    await vi.advanceTimersByTimeAsync(200);
    expect(animations).toHaveLength(0);
    pointer(wrapper, "pointercancel", 400);
  });

  it("follows a new controlled value while an earlier selection spring is running", async () => {
    const wrapper = render({ modelValue: "event-0" });
    await wrapper.findAll("button")[3].trigger("click");
    const previous = animations[0];
    previous.options.onUpdate?.(1.2);
    await nextTick();
    await wrapper.setProps({ modelValue: "event-5" });
    expect(previous.stop).toHaveBeenCalled();
    expect(animations.at(-1)?.to).toBe(5);
    const before = firstCardStyle(wrapper).transform;
    previous.options.onUpdate?.(2);
    await nextTick();
    expect(firstCardStyle(wrapper).transform).toBe(before);
  });

  it("carries current spring velocity into an interrupted card selection", async () => {
    const wrapper = render();
    const buttons = wrapper.findAll("button");
    await buttons[2].trigger("click");
    const earlier = animations[0];
    now = 20;
    earlier.options.onUpdate?.(0.4);
    now = 40;
    earlier.options.onUpdate?.(0.8);
    await nextTick();
    await buttons[4].trigger("click");
    expect(earlier.stop).toHaveBeenCalled();
    expect(animations.at(-1)).toMatchObject({ from: 0.8, to: 4 });
    expect(animations.at(-1)?.options.velocity).toBeCloseTo(20);
  });

  it("projects a fresh flick but clears release velocity after the pointer is held", async () => {
    const quick = render({ defaultValue: "event-2" });
    capture(quick);
    pointer(quick, "pointerdown", 500);
    pointer(quick, "pointermove", 345);
    await nextTick();
    pointer(quick, "pointerup", 345);
    expect(animations.at(-1)?.to).toBe(6);
    expect(animations.at(-1)?.options.velocity).toBeGreaterThan(0);

    const held = render({ defaultValue: "event-2" });
    capture(held);
    pointer(held, "pointerdown", 500);
    pointer(held, "pointermove", 345);
    now += 200;
    pointer(held, "pointerup", 345);
    expect(animations.at(-1)?.to).toBe(3);
    expect(animations.at(-1)?.options.velocity).toBe(0);
  });

  it("stops an active spring when reduced motion becomes enabled", async () => {
    const wrapper = render();
    await wrapper.findAll("button")[3].trigger("click");
    const earlier = animations[0];
    earlier.options.onUpdate?.(1.2);
    reduced = true;
    for (const listener of mediaListeners) listener();
    await nextTick();
    expect(earlier.stop).toHaveBeenCalled();
    expect(animations).toHaveLength(1);
    const selected = wrapper.findAll('[data-slot="timeline-event"]')[3]
      .element as HTMLElement;
    expect(selected.style.transform).toBe("translateX(0px) scale(1)");
  });

  it("recenters a retained event when its index changes during a spring", async () => {
    const wrapper = render({ modelValue: "event-0" });
    await wrapper.findAll("button")[3].trigger("click");
    await wrapper.setProps({ modelValue: "event-3" });
    const reordered = [
      events[0],
      events[3],
      ...events.filter((event) => !["event-0", "event-3"].includes(event.id)),
    ];
    await wrapper.setProps({ events: reordered });
    expect(animations.at(-1)?.to).toBe(1);
    expect(wrapper.findAll("button")[1].attributes("aria-current")).toBe(
      "step",
    );
  });

  it("handles removing the selected event and emptying the list during a spring", async () => {
    const wrapper = render({ defaultValue: "event-4" });
    await wrapper.findAll("button")[5].trigger("click");
    const selection = animations.at(-1)!;
    selection.options.onUpdate?.(4.4);
    await wrapper.setProps({
      events: events.filter((event) => event.id !== "event-5"),
    });
    expect(selection.stop).toHaveBeenCalled();
    expect(wrapper.findAll("button")[0].attributes("aria-current")).toBe(
      "step",
    );
    const removal = animations.at(-1)!;
    expect(removal.to).toBe(0);
    removal.options.onUpdate?.(0.4);

    await wrapper.setProps({ events: [] });
    expect(removal.stop).toHaveBeenCalled();
    expect(wrapper.findAll('[data-slot="timeline-event"]')).toHaveLength(0);
    expect(wrapper.findAll("button")).toHaveLength(0);
    expect(wrapper.emitted("update:modelValue")).toEqual([["event-5"]]);
    const empty = animations.at(-1)!;

    await wrapper.setProps({ events: [events[6], events[2]] });
    expect(empty.stop).toHaveBeenCalled();
    animations.at(-1)!.options.onComplete?.();
    await nextTick();
    const before = firstCardStyle(wrapper).transform;
    expect(before).toBe("translateX(0px) scale(1)");
    expect(wrapper.findAll('button[tabindex="0"]')).toHaveLength(1);
    selection.options.onUpdate?.(5);
    removal.options.onComplete?.();
    empty.options.onUpdate?.(1);
    await nextTick();
    expect(firstCardStyle(wrapper).transform).toBe(before);
  });

  it("releases its observer, pointer, wheel timer and pending animation on unmount", async () => {
    const wrapper = render({ defaultValue: "event-2" });
    const captured = capture(wrapper);
    await wrapper.findAll("button")[3].trigger("click");
    const oldAnimation = animations[0];
    wrapper.element.dispatchEvent(
      new WheelEvent("wheel", { deltaX: 50, cancelable: true }),
    );
    pointer(wrapper, "pointerdown", 400);
    pointer(wrapper, "pointermove", 390);
    wrapper.unmount();
    expect(captured.release).toHaveBeenCalledWith(1);
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
    expect(mediaListeners.size).toBe(0);
    expect(oldAnimation.stop).toHaveBeenCalled();
    const animationCount = animations.length;
    await vi.advanceTimersByTimeAsync(200);
    expect(animations).toHaveLength(animationCount);
  });
});
