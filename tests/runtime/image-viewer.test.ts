import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { defineComponent, nextTick } from "vue";
import {
  ImageViewer,
  ImageViewerContent,
  ImageViewerGallery,
  ImageViewerNext,
  ImageViewerThumbnail,
} from "../../packages/vue/src/motion/image-viewer";
import {
  clampImagePan,
  imagePanBounds,
  imageSwipe,
} from "../../packages/vue/src/motion/image-viewer/src/geometry";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../packages/vue/src/motion/popover";
const wrappers: VueWrapper[] = [];
beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount());
  document.body.innerHTML = "";
});
const images = [
  {
    id: "first",
    src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"/%3E',
    alt: "First photo",
    width: 800,
    height: 600,
  },
  {
    id: "second",
    src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="800"/%3E',
    alt: "Second photo",
    caption: "Second caption",
    width: 600,
    height: 800,
  },
];
function render(component: any = ImageViewer, props: any = { images }) {
  const w = mount(component, { props, attachTo: document.body });
  wrappers.push(w);
  return w;
}
async function settle() {
  for (let n = 0; n < 6; n++) await nextTick();
}
function panel() {
  return document.querySelector<HTMLElement>(
    '[data-image-viewer-portal] [role="dialog"]',
  )!;
}
async function open(w: VueWrapper) {
  const trigger = w.find('button[aria-label="Open First photo"]');
  (trigger.element as HTMLElement).focus();
  await trigger.trigger("click");
  await settle();
  return trigger;
}
describe("image viewer source contracts", () => {
  it("keeps intrinsic thumbnails and retains images under custom overlay children", () => {
    const w = render(
      defineComponent({
        components: { ImageViewer, ImageViewerGallery, ImageViewerThumbnail },
        setup: () => ({ images }),
        template:
          '<ImageViewer :images="images"><ImageViewerGallery class="grid-cols-3"><ImageViewerThumbnail image-id="first"><span>Open overlay</span></ImageViewerThumbnail></ImageViewerGallery></ImageViewer>',
      }),
      {},
    );
    expect(w.find("img").attributes("width")).toBe("800");
    expect(w.find("img").classes()).toContain("h-auto");
    expect(w.find("button").classes()).not.toContain("aspect-[4/5]");
    expect(w.find("button span").text()).toBe("Open overlay");
    expect(w.find("section").classes()).toContain("grid-cols-3");
    expect(w.find("section").classes()).not.toContain("grid-cols-2");
  });
  it("locks background siblings, focuses the close control, and restores the actual trigger on Escape", async () => {
    const aside = document.createElement("aside");
    document.body.append(aside);
    const w = render(),
      trigger = await open(w);
    expect(aside.inert).toBe(true);
    expect(panel().getAttribute("aria-modal")).toBe("true");
    expect(document.activeElement?.getAttribute("aria-label")).toBe(
      "Close viewer",
    );
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await settle();
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([null]);
    expect(aside.inert).toBe(false);
    expect(document.activeElement).toBe(trigger.element);
  });
  it("navigates through controls, restores focus from a newly-disabled button and uses alt as caption fallback", async () => {
    const w = render();
    await open(w);
    expect(
      panel().querySelector("[data-lightbox-content] + div"),
    ).not.toBeNull();
    expect(panel().textContent).toContain("First photo");
    const next = panel().querySelector<HTMLButtonElement>(
      '[aria-label="Next image"]',
    )!;
    next.focus();
    next.click();
    await settle();
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["second"]);
    expect(panel().textContent).toContain("Second caption");
    expect(document.activeElement?.getAttribute("aria-label")).toBe(
      "Close viewer",
    );
    expect(
      panel()
        .querySelector('[aria-label="Next image"]')
        ?.hasAttribute("disabled"),
    ).toBe(true);
  });
  it("does not override a controlled selection and reports the semantic event", async () => {
    const w = render(ImageViewer, { images, modelValue: null });
    await w.find("button").trigger("click");
    await settle();
    expect(w.emitted("valueChange")?.at(-1)).toEqual(["first"]);
    expect(
      document.querySelector('[data-image-viewer-portal] [role="dialog"]'),
    ).toBeNull();
    await w.setProps({ modelValue: "second" });
    await settle();
    expect(panel().textContent).toContain("Second caption");
  });
  it("drops removed uncontrolled identities rather than reopening them when re-added", async () => {
    const w = render();
    await open(w);
    await w.setProps({ images: [images[1]] });
    await settle();
    await w.setProps({ images });
    await settle();
    expect(w.find("button").attributes("aria-expanded")).toBe("false");
  });
  it("swipes only after a dominant horizontal gesture and resets zoom after paging", async () => {
    const w = render();
    await open(w);
    const img = panel().querySelector("img")!;
    img.dispatchEvent(
      new PointerEvent("pointerdown", {
        pointerId: 1,
        isPrimary: true,
        clientX: 150,
        clientY: 50,
        bubbles: true,
      }),
    );
    img.dispatchEvent(
      new PointerEvent("pointerup", {
        pointerId: 1,
        isPrimary: true,
        clientX: 80,
        clientY: 52,
        bubbles: true,
      }),
    );
    await settle();
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["second"]);
    const zoom = panel().querySelector<HTMLButtonElement>(
      '[aria-label="Zoom in"]',
    )!;
    zoom.click();
    await settle();
    expect(
      panel()
        .querySelector('[aria-label="Zoom out"]')
        ?.getAttribute("aria-pressed"),
    ).toBe("true");
    panel()
      .querySelector<HTMLButtonElement>('[aria-label="Previous image"]')!
      .click();
    await settle();
    expect(
      panel()
        .querySelector('[aria-label="Zoom in"]')
        ?.getAttribute("aria-pressed"),
    ).toBe("false");
  });
  it("shows load failures and supports the exact bounded2x pan and50px swipe math", async () => {
    const w = render();
    await open(w);
    panel().querySelector("img")!.dispatchEvent(new Event("error"));
    await settle();
    expect(panel().querySelector('[role="status"]')?.textContent?.trim()).toBe(
      "Unable to load this image.",
    );
    expect(imagePanBounds(600, 400, 900, 700)).toEqual({ x: 150, y: 50 });
    expect(clampImagePan(200, 150)).toBe(150);
    expect(imageSwipe({ x: 100, y: 100 }, { x: 49, y: 100 })).toBe(1);
    expect(imageSwipe({ x: 100, y: 100 }, { x: 49, y: 140 })).toBeNull();
    expect(imageSwipe({ x: 100, y: 100 }, { x: 150, y: 100 })).toBeNull();
  });
  it("allows a nested floating portal to take focus and dismiss before the viewer", async () => {
    const w = render(
      defineComponent({
        components: {
          ImageViewer,
          ImageViewerThumbnail,
          ImageViewerContent,
          Popover,
          PopoverTrigger,
          PopoverContent,
        },
        setup: () => ({ images }),
        template:
          '<ImageViewer :images="images"><ImageViewerThumbnail image-id="first"/><ImageViewerContent><Popover><PopoverTrigger><button class="child-trigger">Edit caption</button></PopoverTrigger><PopoverContent><input aria-label="Caption editor"/></PopoverContent></Popover></ImageViewerContent></ImageViewer>',
      }),
      {},
    );
    await open(w);
    document.querySelector<HTMLButtonElement>(".child-trigger")!.click();
    await settle();
    expect(
      document.querySelector(".child-trigger")?.getAttribute("aria-expanded"),
    ).toBe("true");
    const input = document.querySelector<HTMLInputElement>(
      '[aria-label="Caption editor"]',
    )!;
    input.focus();
    expect(document.activeElement).toBe(input);
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    );
    await settle();
    expect(panel()).not.toBeNull();
    expect(
      document.querySelector(".child-trigger")?.getAttribute("aria-expanded"),
    ).toBe("false");
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    );
    await settle();
    expect(w.find("button").attributes("aria-expanded")).toBe("false");
  });
  it("honors a navigation click handler that prevents default", async () => {
    const w = render(
      defineComponent({
        components: {
          ImageViewer,
          ImageViewerThumbnail,
          ImageViewerContent,
          ImageViewerNext,
        },
        setup: () => ({ images }),
        template:
          '<ImageViewer :images="images"><ImageViewerThumbnail image-id="first"/><ImageViewerContent><ImageViewerNext @click.prevent class="custom-control"/></ImageViewerContent></ImageViewer>',
      }),
      {},
    );
    await open(w);
    panel().querySelector<HTMLButtonElement>(".custom-control")!.click();
    await settle();
    expect(w.find("button").attributes("aria-expanded")).toBe("true");
    expect(panel().querySelector("img")?.getAttribute("alt")).toBe(
      "First photo",
    );
  });
  it("honors a thumbnail click handler that prevents default", async () => {
    const w = render(
      defineComponent({
        components: { ImageViewer, ImageViewerThumbnail },
        setup: () => ({ images }),
        template:
          '<ImageViewer :images="images"><ImageViewerThumbnail image-id="first" @click.prevent/></ImageViewer>',
      }),
      {},
    );
    await w.find("button").trigger("click");
    expect(w.find("button").attributes("aria-expanded")).toBe("false");
  });
});

describe("image viewer rapid lifecycle", () => {
  it("releases sibling inertness after a controlled close and rapid reopen", async () => {
    const aside = document.createElement("aside");
    document.body.append(aside);
    const w = render(ImageViewer, { images, modelValue: null });
    await w.setProps({ modelValue: "first" });
    await w.setProps({ modelValue: null });
    await w.setProps({ modelValue: "second" });
    await settle();
    expect(aside.inert).toBe(true);
    await w.setProps({ modelValue: null });
    await settle();
    expect(aside.inert).toBe(false);
  });
  it("leaves exiting content inert immediately", async () => {
    const w = render();
    await open(w);
    panel()
      .querySelector<HTMLButtonElement>('[aria-label="Close viewer"]')!
      .click();
    await nextTick();
    const exiting = document.querySelector<HTMLElement>(
      '[data-image-viewer-portal] [role="dialog"]',
    );
    if (exiting) {
      expect(exiting.getAttribute("aria-hidden")).toBe("true");
      expect(exiting.closest("[inert]")).not.toBeNull();
    }
  });
});
