import { mount, flushPromises } from "@vue/test-utils";
import { defineComponent, h, nextTick, reactive, ref, type Ref } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const themeMotion = vi.hoisted(() => vi.fn());
vi.mock("../packages/vue/src/motion/theme-toggle/src/useThemeToggle", () => ({
  useThemeToggle: () => ({ toggle: themeMotion }),
}));
import {
  createSiteShell,
  type SiteShell,
} from "../apps/docs/app/composables/site-shell-state";
import { createComponentDocument } from "../apps/docs/app/composables/component-document-state";
let wrapper: ReturnType<typeof mount> | undefined;
let shell: SiteShell;
let route: { path: string };
let metadata: Ref<Record<string, unknown>>;
function start(go: (href: string) => unknown = () => undefined, doc = false) {
  route = reactive({ path: "/components/motion/button" });
  metadata = ref({ category: "motion", slug: "button" });
  let documentState: ReturnType<typeof createComponentDocument> | undefined;
  wrapper = mount(
    defineComponent({
      setup() {
        shell = createSiteShell(metadata, route, { go });
        if (doc)
          documentState = createComponentDocument(
            () => shell.category.value!,
            () => shell.entry.value!,
            shell,
          );
        return () => h("div", "shell test host");
      },
    }),
  );
  return {
    get documentState() {
      return documentState!;
    },
  };
}
beforeEach(() => {
  localStorage.clear();
  themeMotion.mockReset();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
});
afterEach(() => {
  wrapper?.unmount();
  wrapper = undefined;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.documentElement.classList.remove("dark");
  history.replaceState({}, "", "/");
});
describe("documentation shell browser lifetime", () => {
  it("updates localized addresses and closes transient chrome on route changes", async () => {
    history.replaceState({}, "", "/components/motion/button?q=one#metallic");
    start();
    expect(shell.alternate.value).toBe(
      "/en/components/motion/button?q=one#metallic",
    );
    shell.mobileMenu.value =
      shell.searchOpen.value =
      shell.preferencesOpen.value =
        true;
    route.path = "/en/components/motion/switch";
    metadata.value = { category: "motion", slug: "switch" };
    await nextTick();
    expect(shell.en.value).toBe(true);
    expect(shell.entry.value?.slug).toBe("switch");
    expect([
      shell.mobileMenu.value,
      shell.searchOpen.value,
      shell.preferencesOpen.value,
    ]).toEqual([false, false, false]);
    expect(shell.routeTo("charts", "bar-chart")).toBe("/en/charts/bar-chart");
  });
  it("continues to apply appearance when browser storage rejects writes", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    start();
    shell.changeTheme("light");
    expect(shell.theme.value).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    shell.changeTheme("unrecognized");
    expect(shell.theme.value).toBe("light");
  });
  it("loads a legacy preference and preserves a newer valid appearance", () => {
    localStorage.setItem("iui-theme", "light");
    start();
    expect(shell.theme.value).toBe("light");
    expect(localStorage.getItem("orvui-theme")).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    wrapper!.unmount();
    localStorage.setItem("orvui-theme", "dark");
    start();
    expect(shell.theme.value).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
  it("defaults to dark when storage cannot be accessed", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    start();
    expect(shell.theme.value).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
  it("accepts a legacy event once and releases its listener at unmount", () => {
    start();
    window.dispatchEvent(new CustomEvent("iui-theme-change", { detail: "light" }));
    expect(shell.theme.value).toBe("light");
    expect(localStorage.getItem("orvui-theme")).toBe("light");
    wrapper!.unmount();
    wrapper = undefined;
    window.dispatchEvent(new CustomEvent("iui-theme-change", { detail: "dark" }));
    expect(shell.theme.value).toBe("light");
    expect(localStorage.getItem("orvui-theme")).toBe("light");
  });
  it("ignores typing shortcuts and removes global theme subscriptions at unmount", () => {
    start();
    const input = document.createElement("textarea");
    document.body.append(input);
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "D", shiftKey: true, bubbles: true }),
    );
    expect(themeMotion).not.toHaveBeenCalled();
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "D", shiftKey: true, bubbles: true }),
    );
    expect(themeMotion).toHaveBeenCalledOnce();
    window.dispatchEvent(
      new CustomEvent("orvui-theme-change", { detail: "light" }),
    );
    expect(shell.theme.value).toBe("light");
    wrapper!.unmount();
    wrapper = undefined;
    window.dispatchEvent(
      new CustomEvent("orvui-theme-change", { detail: "dark" }),
    );
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "D", shiftKey: true }),
    );
    expect(shell.theme.value).toBe("light");
    expect(themeMotion).toHaveBeenCalledOnce();
    input.remove();
  });
  it("does not restore an expanded preview after a route cancels its next-tick opening", async () => {
    const host = start(() => undefined, true);
    const opening = host.documentState.expand("metallic");
    route.path = "/components/motion/switch";
    metadata.value = { category: "motion", slug: "switch" };
    await opening;
    await nextTick();
    expect(host.documentState.expanded.value).toBe(null);
    expect(host.documentState.tabs.value).toEqual({});
    await host.documentState.expand("default");
    expect(host.documentState.expanded.value).toBe("default");
    host.documentState.closeExpanded();
    expect(host.documentState.expanded.value).toBe(null);
    await flushPromises();
  });
});
