import { mount, type VueWrapper } from "@vue/test-utils";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import SiteMotionDemo from "../../apps/docs/app/components/docs/SiteMotionDemo.vue";
import SitePage from "../../apps/docs/app/components/docs/SitePage.vue";
import {
  siteOrigin,
  sitePages,
} from "../../apps/docs/app/utils/docs/site-page-data";
import { sitePageMarkdown } from "../../apps/docs/app/utils/docs/site-page-markdown";
import type { ComponentDocs } from "../../apps/docs/app/utils/docs/component-docs-types";
import metadata from "../../apps/docs/app/data/component-docs.json";
import { buildSitePages } from "../../apps/docs/scripts/resources";
import { changelogEntries } from "../../apps/docs/app/utils/docs/site-changelog-data";
import { consumerDocument } from "../../tools/ai/consumer-documents";

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
  it("keeps the view-switch surface mounted through rapid changes and language updates", async () => {
    const swap = render(SiteMotionDemo, { props: { demo: "swap", en: false } });
    const panel = swap.get('[role="tabpanel"]').element;
    const layers = swap
      .findAll('[role="tabpanel"] [aria-hidden="true"]')
      .map((layer) => layer.element);
    const tabs = swap.findAll('[role="tab"]');
    for (const index of [1, 0, 1]) {
      await tabs[index].trigger("click");
      expect(swap.findAll('[role="tabpanel"]')).toHaveLength(1);
      expect(swap.get('[role="tabpanel"]').element).toBe(panel);
      expect(
        swap
          .findAll('[role="tabpanel"] [aria-hidden="true"]')
          .map((layer) => layer.element),
      ).toEqual(layers);
      expect(swap.get('[role="tabpanel"]').classes()).toContain(
        "bg-background",
      );
      expect(
        swap.get('[role="tabpanel"]').attributes("style") ?? "",
      ).not.toMatch(/opacity|transform/);
      expect(swap.get('[role="tabpanel"] .sr-only').text()).toBe(
        index ? "可复制的源码" : "实时组件视图",
      );
      expect(swap.get('[role="tabpanel"]').attributes("aria-labelledby")).toBe(
        tabs[index].attributes("id"),
      );
    }
    await swap.setProps({ en: true });
    expect(swap.get('[role="tabpanel"]').element).toBe(panel);
    expect(swap.get('[role="tabpanel"] .sr-only').text()).toBe(
      "Copy-ready source",
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
      putCopy(resolve("skills/orvui/SKILL.md"), "skills/orvui/SKILL.md");
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
      for (const filename of ["source.json", "source.zip"])
        putCopy(
          resolve("LICENSE"),
          `apps/docs/public/templates/dashboard/${filename}`,
        );
      const result = buildSitePages({ root, origin: "http://localhost:6111" });
      expect(result).toMatchObject({
        pages: sitePages.length,
        locales: 2,
        rawSources: 110,
        changelogWeeks: changelogEntries.length,
        changelogItems: changelogEntries.reduce(
          (total, entry) => total + entry.items.length,
          0,
        ),
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
      expect(JSON.parse(read("templates/manifest.json"))).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            slug: "dashboard",
            previewUrl: "https://orvui-template-dashboard.netlify.app",
          }),
        ]),
      );
      for (const filename of ["source.json", "source.zip"])
        expect(
          existsSync(
            resolve(root, "apps/docs/public/templates/dashboard", filename),
          ),
        ).toBe(false);
      expect(read("llms.txt")).toContain(
        "http://localhost:6111/docs/motion-patterns.md",
      );
      expect(read("orvui-agent/SKILL.md")).toContain(
        "https://orvui.efu.me/r/registry.json",
      );
      expect(read("orvui-agent/SKILL.md")).toBe(
        readFileSync(resolve("skills/orvui/SKILL.md"), "utf8"),
      );
      for (const filename of ["AGENTS.md", "DESIGN.md"] as const)
        for (const en of [false, true]) {
          const path = `orvui-agent/${en ? "en/" : ""}${filename}`;
          expect(read(path)).toBe(
            consumerDocument(filename, en, "http://localhost:6111"),
          );
          const page = sitePages.find(
            (page) =>
              page.slug ===
              (filename === "AGENTS.md" ? "agents-md" : "design-md"),
          )!;
          const download = page.sections[0].blocks.find(
            (block) => block.kind === "code",
          )!;
          if (download.kind === "code")
            expect(en ? download.codeEn : download.code).toContain(`/${path}`);
          const preview = page.sections.find(
            (section) => section.id === "preview",
          )!.blocks[0];
          if (preview.kind === "code")
            expect(en ? preview.codeEn : preview.code).toBe(
              consumerDocument(filename, en),
            );
        }
      expect(read("theme.css")).toContain("--background: oklch(99% 0 0)");
      const rss = read("changelog/rss.xml");
      expect(rss.match(/<item>/g)).toHaveLength(changelogEntries.length);
      expect(rss).toContain("orvui 0.1.1");
      expect(rss).toContain("2026-10-26");
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
