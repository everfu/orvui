import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mount, flushPromises, type VueWrapper } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { useThemeToggle } from "../src/useThemeToggle";
let wrapper: VueWrapper | undefined;
function deferred() {
  let resolve!: () => void, reject!: (reason: unknown) => void;
  const promise = new Promise<void>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
  delete document.documentElement.dataset.orvuiVt;
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  });
});
it("keeps appearance and the VitePress preference working when the renamed storage key is blocked", () => {
  const setItem = Storage.prototype.setItem;
  const save = vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (this: Storage, key, value) {
    if (key === "orvui-theme") throw new DOMException("blocked", "SecurityError");
    setItem.call(this, key, value);
  });
  const changed = vi.fn();
  const legacyChanged = vi.fn();
  window.addEventListener("orvui-theme-change", changed);
  window.addEventListener("iui-theme-change", legacyChanged);
  wrapper = mount(defineComponent({
    setup() {
      const theme = useThemeToggle();
      theme.applyTheme("dark", false);
      return () => h("div");
    },
  }));
  expect(document.documentElement.classList.contains("dark")).toBe(true);
  expect(save.mock.calls).toEqual([
    ["orvui-theme", "dark"],
    ["vitepress-theme-appearance", "dark"],
  ]);
  expect(localStorage.getItem("vitepress-theme-appearance")).toBe("dark");
  expect(changed).toHaveBeenCalledOnce();
  expect(legacyChanged).not.toHaveBeenCalled();
  window.removeEventListener("orvui-theme-change", changed);
  window.removeEventListener("iui-theme-change", legacyChanged);
});
afterEach(() => {
  wrapper?.unmount();
  wrapper = undefined;
  Reflect.deleteProperty(document, "startViewTransition");
  delete document.documentElement.dataset.orvuiVt;
  document.documentElement.classList.remove("dark");
  vi.restoreAllMocks();
});
it("handles cancelled transitions and lets only the latest instance clear its animation marker", async () => {
  const first = deferred(),
    second = deferred(),
    queue = [first, second];
  Object.defineProperty(document, "startViewTransition", {
    configurable: true,
    value: vi.fn((update: () => void) => {
      update();
      return { finished: queue.shift()!.promise };
    }),
  });
  const Harness = defineComponent({
    setup() {
      const theme = useThemeToggle({ variant: "circle" });
      return () => h("button", { onClick: theme.toggle }, "Toggle");
    },
  });
  wrapper = mount(Harness);
  await wrapper.find("button").trigger("click");
  await wrapper.find("button").trigger("click");
  expect(document.documentElement.dataset.orvuiVt).toBe("circle");
  first.reject(
    new DOMException("Replaced by another transition", "AbortError"),
  );
  await flushPromises();
  expect(document.documentElement.dataset.orvuiVt).toBe("circle");
  second.reject(new DOMException("Skipped animation", "AbortError"));
  await flushPromises();
  expect(document.documentElement.dataset.orvuiVt).toBeUndefined();
  expect(document.documentElement.classList.contains("dark")).toBe(false);
});
it("clears a finished transition marker after a successful animation", async () => {
  const transition = deferred();
  Object.defineProperty(document, "startViewTransition", {
    configurable: true,
    value: (update: () => void) => {
      update();
      return { finished: transition.promise };
    },
  });
  wrapper = mount(
    defineComponent({
      setup() {
        const theme = useThemeToggle();
        return () => h("button", { onClick: theme.toggle }, "Toggle");
      },
    }),
  );
  await wrapper.find("button").trigger("click");
  expect(document.documentElement.dataset.orvuiVt).toBe("rect");
  transition.resolve();
  await flushPromises();
  expect(document.documentElement.dataset.orvuiVt).toBeUndefined();
  expect(document.documentElement.classList.contains("dark")).toBe(true);
});

it("emits the intended next theme before a deferred native transition callback", async () => {
  const transition = deferred();
  let update!: () => void;
  Object.defineProperty(document, "startViewTransition", {
    configurable: true,
    value: (callback: () => void) => {
      update = callback;
      return { finished: transition.promise };
    },
  });
  const { default: ThemeToggle } =
    await import("../src/ThemeToggle.vue");
  wrapper = mount(ThemeToggle);
  await wrapper.find("button").trigger("click");
  expect(document.documentElement.classList.contains("dark")).toBe(false);
  expect(wrapper.emitted("update:modelValue")).toEqual([["dark"]]);
  expect(wrapper.emitted("change")).toEqual([["dark"]]);
  update();
  transition.resolve();
  await flushPromises();
  expect(document.documentElement.classList.contains("dark")).toBe(true);
});

it("applies initial and external model values to the document theme", async () => {
  const { default: ThemeToggle } =
    await import("../src/ThemeToggle.vue");
  wrapper = mount(ThemeToggle, { props: { modelValue: "dark" } });
  await flushPromises();
  expect(document.documentElement.classList.contains("dark")).toBe(true);
  expect(wrapper.find("button").attributes("aria-label")).toBe(
    "Switch to light mode",
  );
  await wrapper.setProps({ modelValue: "light" });
  expect(document.documentElement.classList.contains("dark")).toBe(false);
  expect(wrapper.find("button").attributes("aria-label")).toBe(
    "Switch to dark mode",
  );
  expect(wrapper.emitted("update:modelValue")).toBeUndefined();
});

it("leaves the document unchanged when a controlled parent rejects the requested theme", async () => {
  const nativeTransition = vi.fn((callback: () => void) => {
    callback();
    return { finished: Promise.resolve() };
  });
  Object.defineProperty(document, "startViewTransition", {
    configurable: true,
    value: nativeTransition,
  });
  const { default: ThemeToggle } =
    await import("../src/ThemeToggle.vue");
  wrapper = mount(ThemeToggle, { props: { modelValue: "light" } });
  await wrapper.find("button").trigger("click");
  await flushPromises();
  expect(wrapper.emitted("update:modelValue")).toEqual([["dark"]]);
  expect(wrapper.emitted("change")).toEqual([["dark"]]);
  expect(document.documentElement.classList.contains("dark")).toBe(false);
  expect(wrapper.find("button").attributes("aria-label")).toBe(
    "Switch to dark mode",
  );
  expect(nativeTransition).not.toHaveBeenCalled();
});

it("runs the native transition after a controlled parent accepts its v-model update", async () => {
  const transition = deferred();
  let update!: () => void;
  const nativeTransition = vi.fn((callback: () => void) => {
    update = callback;
    return { finished: transition.promise };
  });
  Object.defineProperty(document, "startViewTransition", {
    configurable: true,
    value: nativeTransition,
  });
  const { default: ThemeToggle } =
    await import("../src/ThemeToggle.vue");
  let accepted: "light" | "dark" = "light";
  const change = vi.fn();
  const { ref } = await import("vue");
  const model = ref<"light" | "dark">("light");
  wrapper = mount(
    defineComponent({
      setup() {
        return () =>
          h(ThemeToggle, {
            modelValue: model.value,
            "onUpdate:modelValue": (value: "light" | "dark") => {
              accepted = value;
              model.value = value;
            },
            onChange: change,
          });
      },
    }),
  );
  await wrapper.find("button").trigger("click");
  expect(accepted).toBe("dark");
  expect(change).toHaveBeenCalledExactlyOnceWith("dark");
  expect(nativeTransition).toHaveBeenCalledTimes(1);
  expect(document.documentElement.classList.contains("dark")).toBe(false);
  update();
  transition.resolve();
  await flushPromises();
  expect(document.documentElement.classList.contains("dark")).toBe(true);
  expect(wrapper.find("button").attributes("aria-label")).toBe(
    "Switch to light mode",
  );
  expect(change).toHaveBeenCalledTimes(1);
});

it("ignores a delayed native callback after a newer controlled theme supersedes it", async () => {
  const transition = deferred();
  let update!: () => void;
  Object.defineProperty(document, "startViewTransition", {
    configurable: true,
    value: (callback: () => void) => {
      update = callback;
      return { finished: transition.promise };
    },
  });
  const { default: ThemeToggle } =
    await import("../src/ThemeToggle.vue");
  wrapper = mount(ThemeToggle, { props: { modelValue: "light" } });
  await wrapper.setProps({ modelValue: "dark" });
  expect(document.documentElement.dataset.orvuiVt).toBe("rect");
  await wrapper.setProps({ modelValue: "light" });
  update();
  transition.resolve();
  await flushPromises();
  expect(document.documentElement.classList.contains("dark")).toBe(false);
  expect(document.documentElement.dataset.orvuiVt).toBeUndefined();
  expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  expect(wrapper.emitted("change")).toBeUndefined();
});
