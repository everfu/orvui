import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref } from "vue";
import SitePreferences from "../apps/docs/.vitepress/theme/SitePreferences.vue";
import {
  THEME_LIST,
  THEMES,
  themeExportCss,
  themesStylesheet,
} from "../apps/docs/.vitepress/theme/themes";

enableAutoUnmount(afterEach);
const animate = Object.getOwnPropertyDescriptor(Element.prototype, "animate");
beforeAll(() => {
  Reflect.deleteProperty(Element.prototype, "animate");
});
beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  });
});
afterAll(() => {
  if (animate) Object.defineProperty(Element.prototype, "animate", animate);
});
afterEach(() => {
  document.body.innerHTML = "";
  document.body.removeAttribute("style");
  delete document.documentElement.dataset.theme;
  vi.useRealTimers();
  vi.restoreAllMocks();
});

async function settle() {
  await nextTick();
  await nextTick();
}
function controlledPreferences(initialOpen = false) {
  return mount(
    defineComponent({
      setup() {
        const open = ref(initialOpen);
        return () =>
          h(SitePreferences, {
            open: open.value,
            lang: "en",
            "onUpdate:open": (value: boolean) => (open.value = value),
          });
      },
    }),
    { attachTo: document.body },
  );
}
function paletteButton(index: number) {
  return document.querySelector<HTMLButtonElement>(
    `[role="dialog"] button[data-theme-id="${THEME_LIST[index].id}"]`,
  )!;
}
async function openPreferences() {
  const wrapper = controlledPreferences();
  const trigger = wrapper.get('button[aria-label="Customize theme"]');
  (trigger.element as HTMLButtonElement).focus();
  await trigger.trigger("click");
  await settle();
  return { wrapper, trigger };
}
async function pressKey(element: Element, key: string) {
  element.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
  );
  await settle();
}

describe("source website preferences", () => {
  it("exposes every full light/dark palette and copyable root selectors", () => {
    expect(THEME_LIST).toHaveLength(11);
    expect(THEMES.default.name).toBe("orvui");
    for (const theme of THEME_LIST) {
      expect(Object.keys(THEMES[theme.id].light)).toEqual(
        Object.keys(THEMES.default.light),
      );
      expect(Object.keys(THEMES[theme.id].dark)).toEqual(
        Object.keys(THEMES.default.dark),
      );
      expect(themeExportCss(theme.id)).toContain(":root {");
      expect(themeExportCss(theme.id)).toContain(".dark {");
    }
    expect(themesStylesheet()).toContain('.dark[data-theme="blood-orange"]');
    expect(themesStylesheet()).not.toContain('[data-theme="default"]');
  });
  it("changes the complete theme without persistence and resets on remount", async () => {
    const storage = vi.spyOn(Storage.prototype, "setItem");
    const wrapper = mount(SitePreferences, {
      props: { open: true, lang: "en" },
      attachTo: document.body,
    });
    await nextTick();
    const violet = document.querySelector<HTMLButtonElement>(
      'button[aria-label="Violet"]',
    )!;
    expect(violet).not.toBeNull();
    violet.click();
    await nextTick();
    expect(document.documentElement.dataset.theme).toBe("violet");
    expect(violet.getAttribute("aria-pressed")).toBe("true");
    expect(
      document.querySelector("[data-orvui-theme-presets]")?.textContent,
    ).toContain("--accent-foreground:");
    expect(storage).not.toHaveBeenCalled();
    wrapper.unmount();
    expect(document.documentElement.dataset.theme).toBeUndefined();
    mount(SitePreferences, { props: { open: false, lang: "en" } });
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });
  it("copies the selected full CSS with concise feedback and no redundant hints", async () => {
    vi.useFakeTimers();
    const copy = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(navigator.clipboard, "writeText").mockImplementation(copy);
    mount(SitePreferences, {
      props: { open: true, lang: "en" },
      attachTo: document.body,
    });
    await nextTick();
    document
      .querySelector<HTMLButtonElement>('button[aria-label="Green"]')!
      .click();
    const buttons = [
      ...document.querySelectorAll<HTMLButtonElement>('[role="dialog"] button'),
    ];
    buttons
      .find((button) => button.textContent?.trim() === "Copy CSS")!
      .click();
    await nextTick();
    await nextTick();
    expect(copy).toHaveBeenCalledWith(themeExportCss("green"));
    const dialog = document.querySelector('[role="dialog"]')!;
    expect(dialog.textContent).toContain("Copied");
    expect(dialog.querySelector("small, details, [title]")).toBeNull();
    expect(dialog.textContent).not.toMatch(
      /Colors reset|Icons|Lucide|Hugeicons|Phosphor|Soon/,
    );
    expect(buttons).toHaveLength(THEME_LIST.length + 1);
    await vi.advanceTimersByTimeAsync(2000);
    expect(dialog.querySelector(".theme-copy")?.textContent?.trim()).toBe(
      "Copy CSS",
    );
  });
  it("localizes every palette label while preserving theme ids, swatches and exported CSS", async () => {
    const labels: Record<string, [string, string]> = {
      default: ["默认", "Default"],
      violet: ["紫罗兰", "Violet"],
      blue: ["蓝色", "Blue"],
      green: ["绿色", "Green"],
      amber: ["琥珀", "Amber"],
      "blood-orange": ["血橙", "Blood Orange"],
      rose: ["玫瑰", "Rose"],
      red: ["红色", "Red"],
      teal: ["青色", "Teal"],
      indigo: ["靛蓝", "Indigo"],
      lime: ["青柠", "Lime"],
    };
    const wrapper = mount(SitePreferences, {
      props: { open: true, lang: "en" },
      attachTo: document.body,
    });
    await settle();
    const swatches = THEME_LIST.map((_, index) =>
      paletteButton(index)
        .querySelector<HTMLElement>(".theme-orb")!
        .getAttribute("style"),
    );
    const exportedCss = THEME_LIST.map((theme) => themeExportCss(theme.id));
    const stylesheet = document.querySelector(
      "[data-orvui-theme-presets]",
    )!.textContent;
    const selectedIndex = THEME_LIST.findIndex(
      (theme) => theme.id === "blood-orange",
    );
    paletteButton(selectedIndex).click();
    await settle();
    for (const [lang, labelIndex, copyLabel] of [
      ["zh-CN", 0, "复制 CSS"],
      ["en", 1, "Copy CSS"],
    ] as const) {
      await wrapper.setProps({ lang });
      await settle();
      for (const [index, theme] of THEME_LIST.entries()) {
        const button = paletteButton(index);
        expect(button.dataset.themeId).toBe(theme.id);
        expect(button.getAttribute("aria-label")).toBe(
          labels[theme.id][labelIndex],
        );
        expect(button.querySelector(".theme-name")?.textContent).toBe(
          labels[theme.id][labelIndex],
        );
        expect(button.hasAttribute("title")).toBe(false);
        expect(button.querySelector(".theme-orb")?.getAttribute("style")).toBe(
          swatches[index],
        );
        expect(themeExportCss(theme.id)).toBe(exportedCss[index]);
      }
      expect(document.querySelector(".theme-copy")?.textContent?.trim()).toBe(
        copyLabel,
      );
      expect(document.documentElement.dataset.theme).toBe("blood-orange");
      expect(paletteButton(selectedIndex).getAttribute("aria-pressed")).toBe(
        "true",
      );
      expect(
        document.querySelector("[data-orvui-theme-presets]")?.textContent,
      ).toBe(stylesheet);
    }
  });
  it("ignores a delayed copy completion after the selected palette changes", async () => {
    let finishCopy!: () => void;
    const copy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockReturnValue(new Promise<void>((resolve) => (finishCopy = resolve)));
    await openPreferences();
    document
      .querySelector<HTMLButtonElement>('button[aria-label="Green"]')!
      .click();
    await settle();
    const copyButton = [
      ...document.querySelectorAll<HTMLButtonElement>('[role="dialog"] button'),
    ].find((button) => button.textContent?.trim() === "Copy CSS")!;
    copyButton.click();
    expect(copy).toHaveBeenCalledWith(themeExportCss("green"));
    document
      .querySelector<HTMLButtonElement>('button[aria-label="Violet"]')!
      .click();
    await settle();
    finishCopy();
    await settle();
    expect(document.documentElement.dataset.theme).toBe("violet");
    expect(copyButton.textContent?.trim()).toBe("Copy CSS");
    expect(copyButton.textContent).not.toContain("Copied");
  });
  it("opens a nonmodal popup without locking scroll and restores trigger focus on Escape", async () => {
    document.body.style.overflow = "auto";
    const { trigger } = await openPreferences();
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')!;
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute("aria-modal")).not.toBe("true");
    expect(trigger.attributes("aria-haspopup")).toBe("dialog");
    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(trigger.attributes("aria-controls")).toBe(dialog.id);
    expect(dialog.id).not.toBe("");
    expect(document.body.style.overflow).toBe("auto");
    expect(document.activeElement).toBe(paletteButton(0));
    await pressKey(document.activeElement!, "Escape");
    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(dialog.inert).toBe(true);
    expect(dialog.getAttribute("aria-hidden")).toBe("true");
    expect(dialog.style.pointerEvents).toBe("none");
    expect(document.activeElement).toBe(trigger.element);
    expect(document.body.style.overflow).toBe("auto");
  });
  it("keeps the selected palette when the trigger closes and reopens the popup", async () => {
    const { trigger } = await openPreferences();
    const violetIndex = THEME_LIST.findIndex((theme) => theme.id === "violet");
    paletteButton(violetIndex).click();
    await settle();
    expect(document.documentElement.dataset.theme).toBe("violet");
    await trigger.trigger("click");
    await settle();
    expect(trigger.attributes("aria-expanded")).toBe("false");
    await trigger.trigger("click");
    await settle();
    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(paletteButton(violetIndex).getAttribute("aria-pressed")).toBe(
      "true",
    );
    expect(document.activeElement).toBe(paletteButton(violetIndex));
    expect(document.documentElement.dataset.theme).toBe("violet");
  });
  it("dismisses on an outside pointer press without restoring the trigger focus", async () => {
    const { trigger } = await openPreferences();
    const focus = vi.spyOn(trigger.element as HTMLButtonElement, "focus");
    const outside = document.createElement("button");
    outside.textContent = "Outside control";
    document.body.append(outside);
    outside.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true, cancelable: true }),
    );
    await settle();
    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(focus).not.toHaveBeenCalled();
  });
  it("dismisses when focus leaves and preserves the new external focus", async () => {
    const { trigger } = await openPreferences();
    const outside = document.createElement("button");
    outside.textContent = "Outside control";
    document.body.append(outside);
    outside.focus();
    await settle();
    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(outside);
  });
  it("moves focus through the four-column palette grid without changing the selected theme", async () => {
    await openPreferences();
    expect(document.activeElement).toBe(paletteButton(0));
    for (const [key, index] of [
      ["ArrowRight", 1],
      ["ArrowDown", 5],
      ["ArrowLeft", 4],
      ["ArrowUp", 0],
      ["End", THEME_LIST.length - 1],
      ["Home", 0],
    ] as const) {
      await pressKey(document.activeElement!, key);
      expect(document.activeElement).toBe(paletteButton(index));
      expect(paletteButton(0).getAttribute("aria-pressed")).toBe("true");
      expect(document.documentElement.dataset.theme).toBeUndefined();
    }
    await pressKey(document.activeElement!, "ArrowRight");
    paletteButton(1).click();
    await settle();
    expect(paletteButton(1).getAttribute("aria-pressed")).toBe("true");
    expect(document.documentElement.dataset.theme).toBe(THEME_LIST[1].id);
  });
});
