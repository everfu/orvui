import { mount, type VueWrapper } from "@vue/test-utils";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import SiteInstallBlock from "../../apps/docs/app/components/docs/SiteInstallBlock.vue";
import SiteInstallCommand from "../../apps/docs/app/components/docs/SiteInstallCommand.vue";
import packageManifest from "../../packages/vue/package.json";
import { ActionSwapCascadeText } from "../../packages/vue/src/motion/action-swap";
import { publicUsage } from "../../apps/docs/app/utils/docs/public-usage";

const CodePanel = defineComponent({
  props: { code: String, filename: String, label: String },
  setup: (props) => () =>
    h("pre", { "data-filename": props.filename }, props.code),
});
const global = { stubs: { CodePanel } };
const wrappers: VueWrapper[] = [];
const animateDescriptor = Object.getOwnPropertyDescriptor(
  Element.prototype,
  "animate",
);
let fetcher: ReturnType<typeof vi.fn>, copy: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.useFakeTimers();
  Object.defineProperty(Element.prototype, "animate", {
    value: undefined,
    configurable: true,
  });
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
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
  Element.prototype.scrollIntoView = vi.fn();
  copy = vi.fn().mockResolvedValue(undefined);
  vi.spyOn(navigator, "clipboard", "get").mockReturnValue({
    writeText: copy,
  } as unknown as Clipboard);
  fetcher = vi.fn();
  vi.stubGlobal("fetch", fetcher);
});
afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
  document.body.innerHTML = "";
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  if (animateDescriptor)
    Object.defineProperty(Element.prototype, "animate", animateDescriptor);
});
async function settle() {
  for (let i = 0; i < 8; i++) {
    await Promise.resolve();
    await nextTick();
  }
}
it("copies every deduplicated registry URL in one package-manager command without cycling explicit targets", async () => {
  const wrapper = mount(SiteInstallCommand, {
    props: { slug: "unused", slugs: ["button", "input", "button"], en: true },
    attachTo: document.body,
  });
  wrappers.push(wrapper);
  await wrapper.find('[role="tab"][data-tabs-value="pnpm"]').trigger("click");
  await wrapper.find(".command-copy").trigger("click");
  await settle();
  const command = `pnpm dlx shadcn-vue@2.8.2 add ${window.location.origin}/r/button.json ${window.location.origin}/r/input.json`;
  expect(copy).toHaveBeenLastCalledWith(command);
  expect(wrapper.find(".command-overflow").text()).toContain("/r/button.json");
  expect(wrapper.find(".command-overflow").text()).toContain("/r/input.json");
  expect(wrapper.findComponent(ActionSwapCascadeText).exists()).toBe(false);
  await vi.advanceTimersByTimeAsync(3600);
  await wrapper.find(".command-copy").trigger("click");
  expect(copy).toHaveBeenLastCalledWith(command);
  await wrapper.setProps({ slugs: [], slug: "checkbox" });
  expect(wrapper.findComponent(ActionSwapCascadeText).exists()).toBe(true);
  await wrapper.find(".command-copy").trigger("click");
  expect(copy).toHaveBeenLastCalledWith(
    `pnpm dlx shadcn-vue@2.8.2 add ${window.location.origin}/r/checkbox.json`,
  );
});
it("encodes untrusted registry names as URL segments instead of embedding shell metacharacters", async () => {
  const wrapper = mount(SiteInstallCommand, {
    props: { slugs: ["button;$(whoami)'", "input & echo"], en: true },
  });
  wrappers.push(wrapper);
  await wrapper.find(".command-copy").trigger("click");
  const command = copy.mock.calls[0]![0] as string;
  expect(command).toContain("/r/button%3B%24%28whoami%29%27.json");
  expect(command).toContain("/r/input%20%26%20echo.json");
  expect(command).not.toMatch(/[;$()'&]/);
});
it("installs Dock's real demo-only Lucide dependency alongside the registry CLI without loading source files", async () => {
  const registry = JSON.parse(
    readFileSync("apps/docs/public/r/dock.json", "utf8"),
  ) as {
    dependencies: string[];
    files: { path: string; target?: string; content: string }[];
  };
  const lucide = `lucide-vue-next@${packageManifest.dependencies["lucide-vue-next"]}`;
  expect(publicUsage.entries["motion/dock"]!.default.code).toContain(
    'from "lucide-vue-next"',
  );
  expect(
    registry.dependencies.some((dependency) =>
      dependency.startsWith("lucide-vue-next"),
    ),
  ).toBe(false);
  const wrapper = mount(SiteInstallBlock, {
    props: { slug: "dock", en: true, extraDependencies: [lucide, lucide] },
    global,
  });
  wrappers.push(wrapper);
  await settle();
  const cli = wrapper.text();
  expect(cli).toContain("This example also needs:");
  expect(cli).toContain(`pnpm add ${lucide}`);
  expect(cli).not.toContain(`${lucide} ${lucide}`);
  expect(wrapper.find('[role="tab"][data-tabs-value="manual"]').exists()).toBe(
    false,
  );
  expect(wrapper.findComponent({ name: "RegistryFiles" }).exists()).toBe(false);
  expect(fetcher).not.toHaveBeenCalled();
});
it("lists package demo imports separately from the unpublished tarball without fetching registry files", async () => {
  const lucide = `lucide-vue-next@${packageManifest.dependencies["lucide-vue-next"]}`;
  const wrapper = mount(SiteInstallBlock, {
    props: {
      slug: "dock",
      mode: "package",
      en: false,
      demoDependencies: [lucide, lucide],
      extraDependencies: ["unused-registry-only"],
    },
    global,
  });
  wrappers.push(wrapper);
  expect(wrapper.text()).toContain("发布前");
  expect(wrapper.text()).toContain("此示例还需要：");
  expect(wrapper.findAll("pre").map((block) => block.text())).toEqual([
    "pnpm add @orvui/vue",
    `pnpm add ${lucide}`,
    "import '@orvui/vue/style.css';",
  ]);
  expect(wrapper.text()).not.toContain("unused-registry-only");
  expect(fetcher).not.toHaveBeenCalled();
});
it("provides unpublished local-package installation and its one-time stylesheet without fetching registry files", async () => {
  const wrapper = mount(SiteInstallBlock, {
    props: { slug: "button", mode: "package", en: true },
    global,
  });
  wrappers.push(wrapper);
  expect(wrapper.text()).toContain("Before publication");
  expect(wrapper.findAll("pre").map((code) => code.text())).toEqual([
    "pnpm add @orvui/vue",
    "import '@orvui/vue/style.css';",
  ]);
  expect(wrapper.find('[role="tablist"]').exists()).toBe(false);
  expect(fetcher).not.toHaveBeenCalled();
  await wrapper.setProps({
    mode: "registry",
    installSlugs: ["button", "input"],
  });
  await settle();
  expect(wrapper.findComponent(SiteInstallCommand).props("slugs")).toEqual([
    "button",
    "input",
  ]);
  expect(wrapper.findComponent({ name: "RegistryFiles" }).exists()).toBe(false);
  expect(fetcher).not.toHaveBeenCalled();
});
it("uses the registry CLI and stylesheet guidance by default without manual installation or source requests", async () => {
  const wrapper = mount(SiteInstallBlock, {
    props: { slug: "button", en: true },
    global,
  });
  wrappers.push(wrapper);
  await settle();
  expect(wrapper.findComponent(SiteInstallCommand).props("slug")).toBe(
    "button",
  );
  expect(wrapper.find('[role="tab"][data-tabs-value="manual"]').exists()).toBe(
    false,
  );
  expect(wrapper.findComponent({ name: "RegistryFiles" }).exists()).toBe(false);
  expect(wrapper.text()).toContain(
    "On first use, import the installed src/components/orvui/styles.css in your stylesheet entry.",
  );
  expect(fetcher).not.toHaveBeenCalled();
});
