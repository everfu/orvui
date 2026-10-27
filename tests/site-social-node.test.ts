// @vitest-environment node
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { reactive } from "vue";
import { watchNotFoundHead } from "../apps/docs/.vitepress/theme/not-found-head";
import type { HeadConfig, PageData } from "../apps/docs/node_modules/vitepress";
import {
  applySocialMetadata,
  canonicalPath,
  notFoundRobots,
  siteDescriptions,
  socialImage,
} from "../apps/docs/.vitepress/social";
import catalog from "../tools/catalog/components.json";
import { sitePages } from "../apps/docs/.vitepress/theme/site-page-data";

const root = resolve(import.meta.dirname, "../apps/docs");
function page(
  relativePath: string,
  frontmatter: Record<string, unknown> = {},
): PageData {
  return {
    relativePath,
    filePath: relativePath,
    title: String(frontmatter.title ?? "Page"),
    description: "",
    headers: [],
    frontmatter,
  };
}
function sourcePage(path: string) {
  const source = readFileSync(resolve(root, path), "utf8");
  const frontmatter = Object.fromEntries(
    [...source.matchAll(/^([\w]+): (".*")$/gm)].map(([, key, value]) => [
      key,
      JSON.parse(value),
    ]),
  );
  return page(path, frontmatter);
}
function value(data: PageData, key: string) {
  const head: HeadConfig[] = data.frontmatter.head;
  return head.find(
    ([, attrs]) => attrs.property === key || attrs.name === key,
  )?.[1].content;
}

describe("social metadata", () => {
  it.each([
    ["index.md", "/"],
    ["en/index.md", "/en/"],
    ["guide.md", "/guide"],
    ["en/guide.md", "/en/guide"],
    [
      "/components/motion/button.html?theme=dark#usage",
      "/components/motion/button",
    ],
    ["en/charts/line-chart.md?utm_source=share#api", "/en/charts/line-chart"],
    ["/en/", "/en/"],
  ])("normalizes %s without query or hash", (input, expected) => {
    expect(canonicalPath(input)).toBe(expected);
  });

  it.each([false, true])("reuses localized page copy en=%s", (en) => {
    const prefix = en ? "en/" : "";
    const home = sourcePage(prefix + "index.md");
    applySocialMetadata(home);
    expect(home.description).toBe(siteDescriptions[en ? "en" : "zh"]);
    const guide = sourcePage(prefix + "guide.md");
    applySocialMetadata(guide);
    expect(guide.description).toBe(
      sitePages.find((item) => item.slug === "introduction")!.description[
        en ? "en" : "zh"
      ],
    );
    const button = sourcePage(prefix + "components/motion/button.md");
    applySocialMetadata(button);
    expect(button.description).toMatch(en ? /button|press/i : /按压反馈/);
    expect(value(button, "og:locale")).toBe(en ? "en_US" : "zh_CN");
    expect(value(button, "og:locale:alternate")).toBe(en ? "zh_CN" : "en_US");
    expect(value(button, "og:image:alt")).toContain(
      en ? "dark background" : "深色背景",
    );
  });

  it("covers every bilingual home, guide, category, and component page", () => {
    const paths = [
      "index.md",
      ...sitePages.map((item) => item.path.slice(1) + ".md"),
    ];
    for (const category of catalog.categories) {
      const base =
        category.slug === "charts" ? "charts" : `components/${category.slug}`;
      paths.push(
        `${base}.md`,
        ...category.components.map((entry) => `${base}/${entry.slug}.md`),
      );
    }
    for (const prefix of ["", "en/"])
      for (const path of paths) {
        const data = sourcePage(prefix + path);
        applySocialMetadata(data);
        const head: HeadConfig[] = data.frontmatter.head;
        const identities = head.map(
          ([tag, attrs]) =>
            `${tag}:${attrs.property ?? attrs.name ?? attrs.rel}`,
        );
        expect(new Set(identities).size, data.relativePath).toBe(
          identities.length,
        );
        expect(value(data, "og:title")).toBe(`${data.title} | orvui`);
        expect(value(data, "twitter:title")).toBe(value(data, "og:title"));
        expect(
          data.description.trim().length,
          data.relativePath,
        ).toBeGreaterThan(0);
        expect(value(data, "og:description")).toBe(data.description);
        expect(value(data, "twitter:description")).toBe(data.description);
        expect(value(data, "og:url")).toBe(
          `https://orvui.efu.me${canonicalPath(data.relativePath)}`,
        );
        expect(
          head.find(
            ([tag, attrs]) => tag === "link" && attrs.rel === "canonical",
          )?.[1].href,
        ).toBe(value(data, "og:url"));
        expect(value(data, "og:image")).toBe(
          "https://orvui.efu.me/social/orvui-v2.png",
        );
        expect(value(data, "twitter:image")).toBe(value(data, "og:image"));
        expect(value(data, "twitter:card")).toBe("summary_large_image");
        expect(value(data, "robots")).toBe("index, follow");
        const first = structuredClone(data.frontmatter.head);
        applySocialMetadata(data);
        expect(data.frontmatter.head).toEqual(first);
      }
  });

  it("keeps authored descriptions, unrelated heads and indexing restrictions", () => {
    const data = page("custom.md", {
      head: [
        ["meta", { property: "og:title", content: "Stale" }],
        ["meta", { name: "twitter:card", content: "summary" }],
        ["link", { rel: "canonical", href: "https://example.com/stale" }],
        ["meta", { name: "robots", content: "noindex" }],
        ["meta", { name: "author", content: "orvui" }],
      ],
    });
    data.description = 'A custom description with "quotes" & symbols.';
    applySocialMetadata(data);
    expect(value(data, "og:description")).toBe(data.description);
    expect(value(data, "author")).toBe("orvui");
    expect(value(data, "robots")).toBe("noindex");
    expect(value(data, "og:title")).toBe("Page | orvui");
  });

  it("uses readable plain text for descriptions containing rendered links", () => {
    const data = page("openui.md");
    data.description =
      '<a href="https://www.openui.com">OpenUI</a> &amp; Vue: "components".';
    applySocialMetadata(data);
    expect(data.description).toBe('OpenUI & Vue: "components".');
    expect(value(data, "og:description")).toBe(data.description);
    const openui = sourcePage("docs/openui.md");
    applySocialMetadata(openui);
    expect(openui.description).toMatch(/^OpenUI 是/);
    expect(openui.description).not.toContain("<a");
  });

  it.each([
    [false, "Page"],
    [true, "Page | orvui"],
    ["Docs", "Page | Docs"],
    ["orvui", "Page"],
    [":title · orvui", "Page · orvui"],
  ])("matches VitePress titleTemplate=%s", (template, expected) => {
    const data = page("custom.md");
    data.titleTemplate = template;
    applySocialMetadata(data);
    expect(value(data, "og:title")).toBe(expected);
  });

  it.each(["404.md", "en/404.md", "missing.md"])(
    "excludes not-found cards for %s",
    (path) => {
      const data = page(path, {
        head: [["meta", { property: "og:image", content: "stale.png" }]],
      });
      if (path === "missing.md") data.isNotFound = true;
      applySocialMetadata(data);
      expect(data.frontmatter.head).toEqual([notFoundRobots]);
    },
  );

  it("manages virtual 404 heads through route changes and releases its watcher", () => {
    const route = reactive({
      data: { ...page("404.md"), isNotFound: true } as PageData,
    });
    const stop = watchNotFoundHead(() => route.data);
    expect(route.data.frontmatter.head).toEqual([notFoundRobots]);
    route.data = sourcePage("index.md");
    applySocialMetadata(route.data);
    expect(value(route.data, "robots")).toBe("index, follow");
    route.data = { ...page("missing.md"), isNotFound: true };
    expect(route.data.frontmatter.head).toEqual([notFoundRobots]);
    stop();
    route.data = { ...page("another-missing.md"), isNotFound: true };
    expect(route.data.frontmatter.head).toBeUndefined();
  });

  it("ships a small, full-size PNG ready for static hosting", () => {
    const path = resolve(root, "public" + socialImage.path);
    const bytes = readFileSync(path);
    expect(bytes.subarray(0, 8)).toEqual(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    );
    expect(bytes.readUInt32BE(16)).toBe(1200);
    expect(bytes.readUInt32BE(20)).toBe(630);
    expect(statSync(path).size).toBeLessThan(300_000);
  });
});
