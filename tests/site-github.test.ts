import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { createSSRApp, defineComponent, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import SiteGithubLink from "../apps/docs/app/docs/SiteGithubLink.vue";
import { useGithubStars } from "../apps/docs/app/docs/github";
let wrapper: VueWrapper | undefined;
const Host = defineComponent({
  setup() {
    const stars = useGithubStars();
    return () => h(SiteGithubLink, { stars: stars.value, en: false });
  },
});
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  wrapper?.unmount();
  wrapper = undefined;
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
it("server-renders a working repository link without requesting statistics", async () => {
  const request = vi.fn();
  vi.stubGlobal("fetch", request);
  const html = await renderToString(createSSRApp(Host));
  expect(request).not.toHaveBeenCalled();
  expect(html).toContain('href="https://github.com/everfu/orvui"');
  expect(html).toContain("GitHub");
});
it.each([
  [0, "0"],
  [999, "999"],
  [1234, "1.2k"],
  [31000, "31.0k"],
])(
  "shows a real count %s with a full accessible label",
  async (count, label) => {
    const request = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ stargazers_count: count }),
    });
    vi.stubGlobal("fetch", request);
    wrapper = mount(Host);
    await flushPromises();
    expect(wrapper.text()).toBe(label);
    expect(wrapper.get("a").attributes("aria-label")).toContain(
      `${count} 颗星`,
    );
    expect(request).toHaveBeenCalledOnce();
    expect(request.mock.calls[0][1].credentials).toBe("omit");
    expect(vi.getTimerCount()).toBe(0);
  },
);
it.each([
  { ok: false },
  { ok: true, json: async () => ({ stargazers_count: -1 }) },
  { ok: true, json: async () => ({ stargazers_count: "31.0k" }) },
  {
    ok: true,
    json: async () => {
      throw new Error("invalid JSON");
    },
  },
])(
  "keeps the link available when public statistics cannot be used",
  async (response) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));
    wrapper = mount(Host);
    await flushPromises();
    expect(wrapper.text()).toBe("GitHub");
    expect(wrapper.get("a").attributes("href")).toBe(
      "https://github.com/everfu/orvui",
    );
    expect(vi.getTimerCount()).toBe(0);
  },
);
it.each([false, true])(
  "aborts a pending request on timeout or unmount (unmount: %s)",
  async (unmount) => {
    let resolve!: (response: unknown) => void;
    const request = vi.fn(
      (_url: string, _options: RequestInit) =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    vi.stubGlobal("fetch", request);
    wrapper = mount(Host);
    const signal = request.mock.calls[0][1].signal as AbortSignal;
    if (unmount) wrapper.unmount();
    else await vi.advanceTimersByTimeAsync(3000);
    expect(signal.aborted).toBe(true);
    resolve({ ok: true, json: async () => ({ stargazers_count: 31000 }) });
    await flushPromises();
    if (!unmount) expect(wrapper.text()).toBe("GitHub");
    expect(vi.getTimerCount()).toBe(0);
  },
);
