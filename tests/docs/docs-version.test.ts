import { describe, expect, it } from "vitest";
import { channelFromPath, versionHref } from "../../tools/release-channels";
import { createDocsPages } from "../../apps/docs/app/utils/docs/route-manifest";
import { getSitePage } from "../../apps/docs/app/utils/docs/site-page-data";
import { sitePageMarkdown } from "../../apps/docs/app/utils/docs/site-page-markdown";

describe("documentation release channels", () => {
  it("switches both locales without losing the document, query or anchor", () => {
    const original =
      "/en/components/motion/button?mode=package&example=loading#usage";
    expect(versionHref(original, "beta")).toBe("/beta" + original);
    expect(versionHref("/beta" + original, "stable")).toBe(original);
    expect(versionHref("/beta" + original, "beta")).toBe("/beta" + original);
    expect(versionHref("/", "beta")).toBe("/beta/");
    expect(versionHref("/en/", "beta")).toBe("/beta/en/");
    expect(channelFromPath("/betamax/guide")).toBe("stable");
    for (const href of [
      "#usage",
      "/r/button.json",
      "/llms.txt",
      "//example.com/guide",
      "https://example.com/guide",
    ])
      expect(versionHref(href, "beta")).toBe(href);
  });
  it("provides a real direct-load Beta route for every stable document", () => {
    const pages = createDocsPages();
    const stable = pages.filter(
      (page) => channelFromPath(page.path) === "stable",
    );
    for (const page of stable) {
      const beta = pages.find((item) => item.path === "/beta" + page.path);
      expect(beta?.frontmatter).toEqual({
        ...page.frontmatter,
        channel: "beta",
      });
    }
    expect(new Set(pages.map((page) => page.path)).size).toBe(pages.length);
  });
  it("keeps stable installation unchanged and gives Beta local package and RC instructions", () => {
    const stable = JSON.stringify(getSitePage("installation"));
    for (const en of [false, true]) {
      const beta = sitePageMarkdown("installation", en, undefined, "beta");
      expect(beta).toContain("0.2.0-beta.1");
      expect(beta).toContain("vue@3.6.0-rc.14");
      expect(beta).toContain("pnpm beta:pack");
      expect(beta).toContain("pnpm add ./orvui-vue-0.2.0-beta.1.tgz");
      expect(beta).toContain("/beta/r/button.json");
      expect(beta).not.toMatch(/pnpm add @orvui\/vue(?:@|\n)/);
    }
    expect(JSON.stringify(getSitePage("installation"))).toBe(stable);
    expect(
      getSitePage("installation", "beta").sections.map((item) => item.id),
    ).toEqual(getSitePage("installation").sections.map((item) => item.id));
  });
});
