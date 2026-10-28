// @vitest-environment node
import routePaths from "./fixtures/docs-route-paths.json";
import { describe, expect, it } from "vitest";
import { createDocsPages } from "../tools/docs/routes";
import {
  applySocialMetadata,
  canonicalPath,
} from "../apps/docs/app/page-metadata";

const pages = createDocsPages();

describe("shared documentation route metadata", () => {
  it("covers every current bilingual page without including public downloads", () => {
    expect(pages).toHaveLength(242);
    expect(pages.map((page) => page.path).sort()).toEqual(routePaths);
    expect(new Set(pages.map((page) => page.path)).size).toBe(pages.length);
    expect(
      pages.filter((page) => page.frontmatter.layout === "component"),
    ).toHaveLength(218);
    expect(
      pages.filter((page) => page.frontmatter.layout === "category"),
    ).toHaveLength(8);
    for (const page of pages) {
      expect(page.path).toBe(canonicalPath(page.relativePath));
      expect(page.relativePath).not.toContain("public/");
      const alternate = page.path.startsWith("/en/")
        ? page.path.slice(3)
        : "/en" + page.path;
      expect(pages.some((candidate) => candidate.path === alternate)).toBe(
        true,
      );
    }
  });

  it("creates independent localized social metadata for repeated SSR requests", () => {
    const original = JSON.stringify(pages);
    for (const path of [
      "/",
      "/en/",
      "/components/motion/button",
      "/en/components/motion/button",
      "/",
    ]) {
      const page = pages.find((candidate) => candidate.path === path)!;
      const request = { ...page, frontmatter: { ...page.frontmatter } };
      applySocialMetadata(request);
      const head = request.frontmatter as {
        head: [string, Record<string, string>][];
      };
      expect(
        head.head.find(([, attrs]) => attrs.property === "og:locale")?.[1]
          .content,
      ).toBe(path.startsWith("/en/") ? "en_US" : "zh_CN");
      expect(
        head.head.find(([, attrs]) => attrs.rel === "canonical")?.[1].href,
      ).toBe("https://orvui.efu.me" + path);
      expect(request.description.length).toBeGreaterThan(20);
    }
    expect(JSON.stringify(pages)).toBe(original);
  });
});
