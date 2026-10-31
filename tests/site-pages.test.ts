import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  copyFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import SitePage from "../apps/docs/app/components/docs/SitePage.vue";
import SiteMotionDemo from "../apps/docs/app/components/docs/SiteMotionDemo.vue";
import {
  getSitePage,
  sitePages,
  siteOrigin,
  openUiSnippets,
} from "../apps/docs/app/utils/docs/site-page-data";
import {
  changelogEntries,
  excludedChangelogItems,
} from "../apps/docs/app/utils/docs/site-changelog-data";
import { sitePageMarkdown } from "../apps/docs/app/utils/docs/site-page-markdown";
import { buildSitePages } from "../tools/registry/site-pages";
import metadata from "../tools/registry/component-docs.json";
import type { ComponentDocs } from "../tools/registry/component-docs-types";

const mounted: VueWrapper[] = [];
const media = new Map<string, Set<(event: { matches: boolean }) => void>>();
beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    addEventListener: (
      _event: string,
      listener: (event: { matches: boolean }) => void,
    ) => {
      if (!media.has(query)) media.set(query, new Set());
      media.get(query)!.add(listener);
    },
    removeEventListener: (
      _event: string,
      listener: (event: { matches: boolean }) => void,
    ) => media.get(query)?.delete(listener),
  }));
});
afterEach(() => {
  for (const wrapper of mounted.splice(0)) wrapper.unmount();
});
function render(component: any, options: any) {
  const wrapper = mount(component, options);
  mounted.push(wrapper);
  return wrapper;
}

describe("public support pages", () => {
  it.each([
    ["introduction", 6],
    ["installation", 6],
    ["theme", 7],
    ["ai-agents", 7],
    ["openui", 8],
    ["motion-patterns", 5],
    ["changelog", 1],
  ] as const)("retains the complete %s section structure", (page, count) => {
    const wrapper = render(SitePage, {
      props: { page, en: true },
      global: { stubs: { CodePanel: true, CopyPage: true } },
    });
    expect(wrapper.findAll("h2")).toHaveLength(count);
    expect(wrapper.get("h1").text()).toBe(getSitePage(page).title.en);
    expect(wrapper.text()).not.toContain("[object Object]");
    if (page === "changelog")
      expect(wrapper.findAll("ol > li")).toHaveLength(1);
  });
  it("records actual orvui work with bilingual notes instead of imported release history", () => {
    expect(changelogEntries).toHaveLength(1);
    expect(changelogEntries.flatMap((week) => week.items)).toHaveLength(3);
    expect(excludedChangelogItems).toHaveLength(0);
    for (const week of changelogEntries)
      for (const item of week.items) {
        expect(item.text.zh).toMatch(/[\u3400-\u9fff]/);
        expect(item.text.en.length).toBeGreaterThan(10);
        expect(item.href ?? "").not.toMatch(
          /^\/(?:react-native|docs\/native-setup|playground|sponsors|pro)(?:\/|$)/,
        );
      }
    const wrapper = render(SitePage, {
      props: { page: "changelog" },
      global: { stubs: { CodePanel: true, CopyPage: true } },
    });
    expect(wrapper.get("header").text()).toContain("未发布到 npm");
    expect(wrapper.get("time").attributes("datetime")).toBe("2026-10-26");
  });
  it("switches the guide language and retains location-safe local links and code examples", async () => {
    const wrapper = render(SitePage, {
      props: { page: "ai-agents", en: false, siteUrl: "http://localhost:6111" },
      global: { stubs: { CodePanel: true, CopyPage: true } },
    });
    expect(wrapper.get("h1").text()).toBe("面向 AI 助手");
    await wrapper.setProps({ en: true });
    expect(wrapper.get("h1").text()).toBe("For AI agents");
    expect(wrapper.find('a[href="/en/docs/openui"]').exists()).toBe(true);
    const markdown = sitePageMarkdown(
      "ai-agents",
      true,
      "http://localhost:6111",
    );
    expect(markdown).toContain("http://localhost:6111/r/registry.json");
    expect(markdown).not.toContain("{{origin}}");
    expect(markdown).toContain("file.target");
    expect(markdown).toContain("'shadcn-vue@2.8.2', 'add'");
    expect(markdown).not.toContain("writeFile(");
    expect(markdown).not.toContain("or write every file");
    expect(siteOrigin("http://localhost:6111/path")).toBe(
      "http://localhost:6111",
    );
    expect(() => siteOrigin("javascript:alert(1)")).toThrow();
  });
  it("keeps the source's local layout, content swap and replay interactions", async () => {
    const layout = render(SiteMotionDemo, {
      props: { demo: "layout", en: true },
    });
    expect(layout.get("button").attributes("aria-expanded")).toBe("false");
    await layout.get("button").trigger("click");
    expect(layout.get("button").attributes("aria-expanded")).toBe("true");
    expect(layout.text()).toContain("Open panel");
    const swap = render(SiteMotionDemo, { props: { demo: "swap", en: true } });
    await swap.get('[role="tab"][aria-selected="false"]').trigger("click");
    expect(swap.get('[role="tab"][aria-selected="true"]').text()).toBe("Code");
    expect(
      swap
        .get('[role="tab"][aria-selected="true"]')
        .attributes("aria-controls"),
    ).toBe(swap.get('[role="tabpanel"]').attributes("id"));
    const reveal = render(SiteMotionDemo, {
      props: { demo: "reveal", en: true },
    });
    const before = reveal.get(".w-48").element;
    await reveal.get("button").trigger("click");
    expect(reveal.get(".w-48").element).not.toBe(before);
    for (const listener of media.get("(prefers-reduced-motion: reduce)") ?? [])
      listener({ matches: true });
    await nextTick();
    expect(reveal.text()).toContain("New surface");
  });
  it("documents only the verified Vue OpenUI bindings without adding an executable model service", () => {
    expect(openUiSnippets.install).toContain("@openuidev/vue-lang@^0.4");
    expect(openUiSnippets.install).toContain("@openuidev/lang-core@^0.4");
    expect(openUiSnippets.render).toContain(':on-action="handleAction"');
    expect(openUiSnippets.render).not.toContain("@action");
    expect(openUiSnippets.prompt).toContain("streamModel");
    expect(Object.values(openUiSnippets).join("\n")).not.toContain(
      "@openuidev/react-lang",
    );
  });
  it("generates every linked static resource with full bilingual text and actual primary Vue source", () => {
    const root = mkdtempSync(resolve(tmpdir(), "orvui-site-pages-"));
    const putCopy = (source: string, target: string) => {
      const file = resolve(root, target);
      mkdirSync(dirname(file), { recursive: true });
      copyFileSync(source, file);
    };
    try {
      putCopy(
        resolve("apps/docs/public/r/registry.json"),
        "apps/docs/public/r/registry.json",
      );
      const docs = metadata as unknown as ComponentDocs;
      for (const entry of Object.values(docs.entries))
        if (entry.default.primaryFile)
          putCopy(
            resolve(entry.default.primaryFile),
            entry.default.primaryFile,
          );
      const result = buildSitePages({ root, origin: "http://localhost:6111" });
      expect(result).toMatchObject({
        pages: 7,
        locales: 2,
        artifacts: 128,
        rawSources: 109,
        changelogWeeks: 1,
        changelogItems: 3,
        excludedChangelogItems: 0,
      });
      for (const page of sitePages)
        for (const locale of ["", "en/"])
          expect(
            existsSync(
              resolve(
                root,
                "apps/docs/public",
                `${locale}${page.path.slice(1)}.md`,
              ),
            ),
          ).toBe(true);
      const read = (path: string) =>
        readFileSync(resolve(root, "apps/docs/public", path), "utf8");
      expect(read("llms.txt")).toContain(
        "http://localhost:6111/docs/motion-patterns.md",
      );
      expect(read("orvui-agent/SKILL.md")).toContain(
        "http://localhost:6111/r/registry.json",
      );
      expect(read("theme.css")).toContain("--background: oklch(99% 0 0)");
      expect(read("changelog/rss.xml").match(/<item>/g)).toHaveLength(1);
      expect(read("docs/motion-patterns.md")).toContain("```vue");
      expect(read("en/docs/openui.md")).toContain("Register components");
      expect(read("r/bump-chart/raw.txt")).toBe(
        readFileSync(
          resolve("packages/vue/src/charts/bump-chart/src/BumpChart.vue"),
          "utf8",
        ),
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
