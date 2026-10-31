import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  it,
  vi,
} from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { createSSRApp, h, nextTick } from "vue";
import { renderToString } from "@vue/server-renderer";
import SiteLanguageSwitch from "../../apps/docs/app/components/docs/SiteLanguageSwitch.vue";

const wrappers: VueWrapper[] = [];
const nativeAnimate = Object.getOwnPropertyDescriptor(
  Element.prototype,
  "animate",
);
const chineseHref =
  "/components/motion/button?mode=package&example=loading#usage";
const englishHref =
  "/en/components/motion/button?mode=package&example=loading#usage";

beforeAll(() => {
  Reflect.deleteProperty(Element.prototype, "animate");
});
beforeEach(() => {
  vi.useFakeTimers();
  window.matchMedia = vi.fn().mockReturnValue({
    matches: true,
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
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
afterAll(() => {
  if (nativeAnimate)
    Object.defineProperty(Element.prototype, "animate", nativeAnimate);
});

function render(props: Record<string, unknown> = {}) {
  const wrapper = mount(SiteLanguageSwitch, {
    props: {
      en: false,
      currentHref: chineseHref,
      alternateHref: englishHref,
      ...props,
    },
    attachTo: document.body,
  });
  wrappers.push(wrapper);
  return wrapper;
}
async function settle() {
  await nextTick();
  await Promise.resolve();
  await nextTick();
  await vi.advanceTimersByTimeAsync(20);
  await nextTick();
}
function trigger(wrapper: VueWrapper) {
  return wrapper.get('button[aria-haspopup="dialog"]');
}
function options() {
  return Array.from(
    document.querySelectorAll<HTMLAnchorElement>("a.language-option"),
  );
}
async function pressKey(element: Element, key: string, shiftKey = false) {
  const event = new KeyboardEvent("keydown", {
    key,
    shiftKey,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
  await settle();
  return event;
}
async function openAt(wrapper: VueWrapper, key = "ArrowDown") {
  (trigger(wrapper).element as HTMLButtonElement).focus();
  await pressKey(trigger(wrapper).element, key);
}
async function openBeforeFocusFrame(wrapper: VueWrapper) {
  const button = trigger(wrapper).element as HTMLButtonElement;
  button.focus();
  button.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
      cancelable: true,
    }),
  );
  await nextTick();
  await Promise.resolve();
  await nextTick();
  await nextTick();
  expect(trigger(wrapper).attributes("aria-expanded")).toBe("true");
  expect(document.activeElement).toBe(button);
}

it("opens a language popup without navigating and retains native query/hash links", async () => {
  const wrapper = render();
  const button = trigger(wrapper);
  const location = window.location.href;
  expect(button.attributes("type")).toBe("button");
  expect(button.attributes("href")).toBeUndefined();
  expect(button.attributes("aria-label")).toBe("选择语言，当前：简体中文");
  expect(button.attributes("aria-expanded")).toBe("false");
  await button.trigger("click");
  await settle();
  expect(window.location.href).toBe(location);
  expect(button.attributes("aria-expanded")).toBe("true");
  const navigation = document.querySelector('nav[aria-label="语言"]')!;
  expect(navigation).not.toBeNull();
  const languages = options();
  expect(languages.map((link) => link.textContent?.trim())).toEqual([
    "English",
    "简体中文",
  ]);
  expect(languages.map((link) => link.getAttribute("href"))).toEqual([
    englishHref,
    chineseHref,
  ]);
  expect(languages.map((link) => link.hreflang)).toEqual(["en", "zh-CN"]);
  expect(languages.map((link) => link.getAttribute("aria-current"))).toEqual([
    null,
    "page",
  ]);
  expect(wrapper.find(".lucide-languages-icon").exists()).toBe(true);
  expect(navigation.querySelector(".language-heading")?.textContent).toBe(
    "选择语言",
  );
  for (const link of languages) expect(link.tagName).toBe("A");
  expect(navigation.querySelectorAll(".language-check svg")).toHaveLength(1);
});

it("uses the English current route and marks only English as current", async () => {
  const wrapper = render({
    en: true,
    currentHref: englishHref,
    alternateHref: chineseHref,
  });
  expect(trigger(wrapper).attributes("aria-label")).toBe(
    "Choose language, current: English",
  );
  await openAt(wrapper);
  expect(document.querySelector('nav[aria-label="Language"]')).not.toBeNull();
  expect(options().map((link) => link.getAttribute("href"))).toEqual([
    englishHref,
    chineseHref,
  ]);
  expect(options().map((link) => link.getAttribute("aria-current"))).toEqual([
    "page",
    null,
  ]);
});

it.each([
  [
    "current route",
    { currentHref: "/components/motion/tabs?mode=registry#api" },
  ],
  ["alternate route", { alternateHref: "/en/components/motion/tabs#usage" }],
  ["current locale", { en: true }],
] as const)(
  "dismisses the popup when the %s props change",
  async (_name, props) => {
    const wrapper = render();
    await openAt(wrapper);
    expect(trigger(wrapper).attributes("aria-expanded")).toBe("true");
    await wrapper.setProps(props);
    await settle();
    expect(trigger(wrapper).attributes("aria-expanded")).toBe("false");
  },
);

it("updates labels, current language and links when the route changes in place", async () => {
  const wrapper = render();
  await openAt(wrapper);
  await wrapper.setProps({
    en: true,
    currentHref: "/en/components/motion/tabs?example=icons#api",
    alternateHref: "/components/motion/tabs?example=icons#api",
  });
  await settle();
  await openAt(wrapper);
  expect(trigger(wrapper).attributes("aria-label")).toBe(
    "Choose language, current: English",
  );
  expect(options().map((link) => link.getAttribute("href"))).toEqual([
    "/en/components/motion/tabs?example=icons#api",
    "/components/motion/tabs?example=icons#api",
  ]);
  expect(options().map((link) => link.getAttribute("aria-current"))).toEqual([
    "page",
    null,
  ]);
});

it("focuses either edge, wraps arrow navigation and returns to the trigger on Escape", async () => {
  const wrapper = render();
  await openAt(wrapper);
  expect(document.activeElement).toBe(options()[0]);
  for (const [key, index] of [
    ["ArrowUp", 1],
    ["ArrowDown", 0],
    ["End", 1],
    ["Home", 0],
  ] as const) {
    await pressKey(document.activeElement!, key);
    expect(document.activeElement).toBe(options()[index]);
  }
  await pressKey(document.activeElement!, "Escape");
  expect(trigger(wrapper).attributes("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(trigger(wrapper).element);
  await openAt(wrapper, "ArrowUp");
  expect(document.activeElement).toBe(options()[1]);
});

it("activates a native link with Space, preserves normal click behavior and closes", async () => {
  const wrapper = render();
  await openAt(wrapper, "ArrowDown");
  const english = options()[0];
  const click = vi.fn((event: MouseEvent) => {
    expect(event.defaultPrevented).toBe(false);
    event.preventDefault();
  });
  english.addEventListener("click", click, { once: true });
  const event = await pressKey(english, " ");
  expect(event.defaultPrevented).toBe(true);
  expect(click).toHaveBeenCalledOnce();
  expect(english.getAttribute("href")).toBe(englishHref);
  expect(trigger(wrapper).attributes("aria-expanded")).toBe("false");
});

it.each([false, true])(
  "returns focus to the trigger on Tab while preserving native traversal (shift: %s)",
  async (shiftKey) => {
    const wrapper = render();
    await openAt(wrapper);
    const event = await pressKey(document.activeElement!, "Tab", shiftKey);
    expect(event.defaultPrevented).toBe(false);
    expect(trigger(wrapper).attributes("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger(wrapper).element);
  },
);

it("dismisses on an outside pointer press while preserving an external control's focus", async () => {
  const wrapper = render();
  await openAt(wrapper);
  const outside = document.createElement("button");
  outside.textContent = "Outside control";
  document.body.append(outside);
  outside.focus();
  outside.dispatchEvent(
    new PointerEvent("pointerdown", { bubbles: true, cancelable: true }),
  );
  await settle();
  expect(trigger(wrapper).attributes("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(outside);
});

it("cancels delayed language focus when Tab closes the popup before its first frame", async () => {
  const wrapper = render();
  await openBeforeFocusFrame(wrapper);
  const optionFocus = options().map((option) => vi.spyOn(option, "focus"));
  const cancelFrame = vi.spyOn(globalThis, "cancelAnimationFrame");
  const event = await pressKey(trigger(wrapper).element, "Tab");
  expect(event.defaultPrevented).toBe(false);
  expect(trigger(wrapper).attributes("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(trigger(wrapper).element);
  expect(cancelFrame).toHaveBeenCalled();
  for (const focus of optionFocus) expect(focus).not.toHaveBeenCalled();
});

it("cancels pending focus on unmount and leaves the next control focused", async () => {
  const wrapper = render();
  await openBeforeFocusFrame(wrapper);
  const optionFocus = options().map((option) => vi.spyOn(option, "focus"));
  const cancelFrame = vi.spyOn(globalThis, "cancelAnimationFrame");
  wrapper.unmount();
  wrappers.splice(wrappers.indexOf(wrapper), 1);
  const outside = document.createElement("button");
  outside.textContent = "Next control";
  document.body.append(outside);
  outside.focus();
  await settle();
  expect(cancelFrame).toHaveBeenCalled();
  for (const focus of optionFocus) expect(focus).not.toHaveBeenCalled();
  expect(document.activeElement).toBe(outside);
});

it("does not steal focus moved outside while the opening frame is pending", async () => {
  const wrapper = render();
  await openBeforeFocusFrame(wrapper);
  const optionFocus = options().map((option) => vi.spyOn(option, "focus"));
  const outside = document.createElement("button");
  outside.textContent = "Another control";
  document.body.append(outside);
  outside.focus();
  await settle();
  expect(trigger(wrapper).attributes("aria-expanded")).toBe("true");
  expect(document.activeElement).toBe(outside);
  for (const focus of optionFocus) expect(focus).not.toHaveBeenCalled();
});

it("waits for delayed portal visibility before focusing the requested language", async () => {
  const wrapper = render();
  await openBeforeFocusFrame(wrapper);
  const first = options()[0];
  const surface = first.parentElement!.parentElement!;
  const focus = vi.spyOn(first, "focus");
  surface.style.visibility = "hidden";
  await vi.advanceTimersByTimeAsync(40);
  await nextTick();
  expect(focus).not.toHaveBeenCalled();
  expect(document.activeElement).toBe(trigger(wrapper).element);
  surface.style.visibility = "visible";
  await settle();
  expect(focus).toHaveBeenCalledOnce();
  expect(document.activeElement).toBe(first);
});

it("server-renders the localized closed trigger without a language popup", async () => {
  for (const [en, label] of [
    [false, "选择语言，当前：简体中文"],
    [true, "Choose language, current: English"],
  ] as const) {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(SiteLanguageSwitch, {
            en,
            currentHref: en ? englishHref : chineseHref,
            alternateHref: en ? chineseHref : englishHref,
          }),
      }),
    );
    expect(html).toContain(`aria-label="${label}"`);
    expect(html).toContain('aria-expanded="false"');
    expect(html).not.toContain("language-option");
    expect(html).not.toContain('role="dialog"');
  }
});

it("focuses the current language when touch activation leaves the previous control focused", async () => {
  const wrapper = render();
  const previous = document.createElement("button");
  document.body.append(previous);
  previous.focus();
  // Synthetic click mirrors touch browsers that do not focus the tapped button.
  await trigger(wrapper).trigger("click");
  await settle();
  expect(document.activeElement).toBe(
    options().find((link) => link.hasAttribute("aria-current")),
  );
});
