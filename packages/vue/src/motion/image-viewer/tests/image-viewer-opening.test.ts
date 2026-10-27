import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { ImageViewer, ImageViewerContent, ImageViewerThumbnail } from "..";
import frameSource from "../src/ImageViewerFrame.vue?raw";

const images = [
  { id: "first", src: "first.jpg", alt: "First photo", width: 800, height: 600 },
  { id: "second", src: "second.jpg", alt: "Second photo", width: 600, height: 800 },
];
const wrappers: VueWrapper[] = [];
const nativeAnimate = Object.getOwnPropertyDescriptor(Element.prototype, "animate");
let reduced = false;

beforeEach(() => {
  vi.useFakeTimers();
  reduced = false;
  Reflect.deleteProperty(Element.prototype, "animate");
  vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
    matches: reduced && query.includes("reduced-motion"),
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => true,
  }));
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
  });
});

afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount());
  document.body.innerHTML = "";
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  if (nativeAnimate) Object.defineProperty(Element.prototype, "animate", nativeAnimate);
  else Reflect.deleteProperty(Element.prototype, "animate");
});

function render() {
  const wrapper = mount(ImageViewer, { props: { images }, attachTo: document.body });
  wrappers.push(wrapper);
  return wrapper;
}
async function settle() {
  for (let index = 0; index < 6; index++) await nextTick();
}
function dialog() {
  return document.querySelector<HTMLElement>('[data-image-viewer-portal] [role="dialog"]');
}
function frame() {
  return dialog()!.querySelector("img")!.closest<HTMLElement>("[data-lightbox-content]")!;
}
async function open(wrapper: VueWrapper) {
  const trigger = wrapper.get('button[aria-label="Open First photo"]');
  (trigger.element as HTMLElement).focus();
  await trigger.trigger("click");
  await settle();
  return trigger.element;
}
async function close() {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  await settle();
}
function pendingAnimation() {
  const cancel = vi.fn();
  return { cancel, finished: new Promise<Animation>(() => {}) } as unknown as Animation;
}

describe("image viewer opening and closing lifecycle", () => {
  it("retains the closing image without retaining modal interaction, then removes it", async () => {
    const aside = document.createElement("aside");
    document.body.append(aside);
    const wrapper = render();
    const trigger = await open(wrapper);
    expect(aside.inert).toBe(true);
    await close();
    expect(dialog()).not.toBeNull();
    expect(dialog()!.getAttribute("aria-hidden")).toBe("true");
    expect(dialog()!.style.pointerEvents).toBe("none");
    expect(dialog()!.closest<HTMLElement>("[data-image-viewer-portal]")!.inert).toBe(true);
    expect(aside.inert).toBe(false);
    expect(document.activeElement).toBe(trigger);
    await vi.advanceTimersByTimeAsync(200);
    expect(dialog()).not.toBeNull();
    await vi.advanceTimersByTimeAsync(400);
    expect(dialog()).toBeNull();
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("keeps a rapidly reopened, navigated and zoomed session alive past the old closing deadline", async () => {
    const wrapper = render();
    await open(wrapper);
    await close();
    await vi.advanceTimersByTimeAsync(80);
    await open(wrapper);
    dialog()!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await settle();
    dialog()!.querySelector<HTMLButtonElement>('[aria-label="Zoom in"]')!.click();
    await settle();
    await vi.advanceTimersByTimeAsync(600);
    expect(document.querySelectorAll('[data-image-viewer-portal] [role="dialog"]')).toHaveLength(1);
    expect(dialog()!.getAttribute("aria-hidden")).toBeNull();
    expect(dialog()!.querySelector("img")!.alt).toBe("Second photo");
    expect(dialog()!.querySelector('[aria-label="Zoom out"]')).not.toBeNull();
    expect(dialog()!.contains(document.activeElement)).toBe(true);
    await close();
    await vi.advanceTimersByTimeAsync(600);
    expect(dialog()).toBeNull();
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it.each(["missing", "unsupported"])("closes without trapping content when WAAPI is %s", async support => {
    const wrapper = render();
    await open(wrapper);
    const imageFrame = frame();
    if (support === "unsupported") Object.defineProperty(imageFrame, "animate", {
      value: () => { throw new DOMException("Animation unavailable", "NotSupportedError"); },
    });
    await close();
    expect(imageFrame.style.opacity).toBe("0");
    await vi.advanceTimersByTimeAsync(600);
    expect(dialog()).toBeNull();
    expect(wrapper.get('button[aria-label="Open First photo"]').attributes("aria-expanded")).toBe("false");
  });

  it("uses a fade when its source thumbnail is removed during the open session", async () => {
    const wrapper = render();
    const trigger = await open(wrapper);
    const animate = vi.fn(() => pendingAnimation());
    Object.defineProperty(frame(), "animate", { value: animate });
    trigger.remove();
    await close();
    expect(animate).toHaveBeenCalledOnce();
    const [keyframes] = animate.mock.calls[0] as unknown as [Keyframe[]];
    expect(keyframes.at(-1)?.opacity).toBe(0);
    expect(keyframes.every(keyframe => keyframe.transform === undefined)).toBe(true);
    await vi.advanceTimersByTimeAsync(600);
    expect(dialog()).toBeNull();
  });

  it("returns to the thumbnail image's layout while that image still carries its opening projection", async () => {
    const wrapper = render();
    const trigger = await open(wrapper);
    const imageFrame = frame();
    const thumbnailImage = trigger.querySelector("img")!;
    const rectangle = (x: number, y: number, width: number, height: number) => new DOMRect(x, y, width, height);
    vi.spyOn(imageFrame, "getBoundingClientRect").mockReturnValue(rectangle(100, 100, 800, 600));
    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue(rectangle(10, 20, 400, 360));
    const imageRect = rectangle(30, 40, 200, 150);
    const projection = "translate3d(40px,-120px,0px) scale(3.35,3.35)";
    thumbnailImage.style.transform = projection;
    vi.spyOn(thumbnailImage, "getBoundingClientRect").mockImplementation(() =>
      thumbnailImage.style.transform === "none" ? imageRect : rectangle(70, -80, 670, 502.5),
    );
    let endpoint: DOMRect | undefined;
    Object.defineProperty(imageFrame, "animate", { value: (frames: Keyframe[]) => {
      const transform = String(frames.at(-1)?.transform);
      const values = transform.match(/-?[\d.]+/g)!.map(Number);
      endpoint = rectangle(100 + values[0], 100 + values[1], 800 * values[2], 600 * values[3]);
      return pendingAnimation();
    } });
    await close();
    expect(endpoint?.toJSON()).toEqual(imageRect.toJSON());
    expect(thumbnailImage.style.transform).toBe(projection);
  });

  it("returns to the actual clicked copy when the same image has multiple thumbnails", async () => {
    const wrapper = mount(defineComponent({
      setup: () => () => h(ImageViewer, { images }, { default: () => [
        h(ImageViewerThumbnail, { imageId: "first", "aria-label": "Open first copy" }),
        h(ImageViewerThumbnail, { imageId: "first", "aria-label": "Open second copy" }),
        h(ImageViewerContent),
      ] }),
    }), { attachTo: document.body });
    wrappers.push(wrapper);
    const clicked = wrapper.get('button[aria-label="Open second copy"]');
    (clicked.element as HTMLElement).focus();
    await clicked.trigger("click");
    await settle();
    const imageFrame = frame();
    const firstImage = wrapper.get('button[aria-label="Open first copy"]').element.querySelector("img")!;
    const secondImage = clicked.element.querySelector("img")!;
    vi.spyOn(imageFrame, "getBoundingClientRect").mockReturnValue(new DOMRect(100, 100, 800, 600));
    vi.spyOn(firstImage, "getBoundingClientRect").mockReturnValue(new DOMRect(10, 20, 100, 75));
    const clickedRect = new DOMRect(300, 200, 200, 150);
    vi.spyOn(secondImage, "getBoundingClientRect").mockReturnValue(clickedRect);
    let endpoint: DOMRect | undefined;
    Object.defineProperty(imageFrame, "animate", { value: (frames: Keyframe[]) => {
      imageFrame.style.transformOrigin = "50% 50%";
      const last = frames.at(-1)!;
      const values = String(last.transform).match(/-?[\d.]+/g)!.map(Number);
      const origin = String(last.transformOrigin ?? imageFrame.style.transformOrigin).split(" ");
      const coordinate = (value: string, size: number) => value.endsWith("%") ? parseFloat(value) * size / 100 : parseFloat(value);
      const originX = coordinate(origin[0], 800);
      const originY = coordinate(origin[1], 600);
      endpoint = new DOMRect(
        100 + values[0] + originX * (1 - values[2]),
        100 + values[1] + originY * (1 - values[3]),
        800 * values[2],
        600 * values[3],
      );
      expect(frames.every(keyframe => keyframe.transformOrigin === "0px 0px")).toBe(true);
      return pendingAnimation();
    } });
    await close();
    expect(endpoint?.toJSON()).toEqual(clickedRect.toJSON());
    expect(document.activeElement).toBe(clicked.element);
  });

  it("makes the initially focused zoom control visible when a custom header has no buttons", async () => {
    const style = document.createElement("style");
    style.textContent = frameSource.match(/<style scoped>([\s\S]*?)<\/style>/)![1];
    document.body.append(style);
    const wrapper = mount(defineComponent({
      setup: () => () => h(ImageViewer, { images }, { default: () => [
        h(ImageViewerThumbnail, { imageId: "first" }),
        h(ImageViewerContent, {}, { header: () => h("span", "Custom gallery heading") }),
      ] }),
    }), { attachTo: document.body });
    wrappers.push(wrapper);
    await open(wrapper);
    const zoom = dialog()!.querySelector<HTMLButtonElement>('[aria-label="Zoom in"]')!;
    zoom.style.opacity = "0";
    expect(document.activeElement).toBe(zoom);
    expect(getComputedStyle(zoom).opacity).toBe("1");
  });

  it("cancels a reduced-motion fade and its delayed release when unmounted", async () => {
    reduced = true;
    const wrapper = render();
    const trigger = await open(wrapper);
    const animation = pendingAnimation();
    const animate = vi.fn(() => animation);
    Object.defineProperty(frame(), "animate", { value: animate });
    await close();
    const [keyframes, options] = animate.mock.calls[0] as unknown as [Keyframe[], KeyframeAnimationOptions];
    expect(keyframes.every(keyframe => keyframe.transform === undefined)).toBe(true);
    expect(Number(options.duration)).toBeLessThanOrEqual(100);
    expect(document.activeElement).toBe(trigger);
    await vi.advanceTimersByTimeAsync(50);
    wrapper.unmount();
    wrappers.splice(wrappers.indexOf(wrapper), 1);
    expect(animation.cancel).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(1000);
    expect(document.querySelector("[data-image-viewer-portal]")).toBeNull();
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});
