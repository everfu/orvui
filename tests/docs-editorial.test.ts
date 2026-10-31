// @vitest-environment node
import { expect, it } from "vitest";
import { getSitePage } from "../apps/docs/app/utils/docs/site-page-data";
import { sitePageMarkdown } from "../apps/docs/app/utils/docs/site-page-markdown";
it.each([false, true])(
  "exports the same quickstart steps, notes and file examples en=%s",
  (en) => {
    const page = getSitePage("introduction");
    const markdown = sitePageMarkdown(page.slug, en);
    for (const section of page.sections)
      for (const block of section.blocks) {
        if (block.kind === "steps")
          for (const step of block.items)
            expect(markdown).toContain(step.title[en ? "en" : "zh"]);
        if (block.kind === "callout")
          expect(markdown).toContain(block.text[en ? "en" : "zh"]);
        if (block.kind === "code" && block.filename === "src/App.vue")
          expect(markdown).toContain(block.code);
      }
    expect(markdown).toContain(en ? "Nuxt SSR" : "Nuxt SSR");
  },
);
it("keeps guide anchor IDs unique when editorial content is refreshed", async () => {
  const { sitePages, themeCss } =
    await import("../apps/docs/app/utils/docs/site-page-data");
  const { applyGuideEditorial } =
    await import("../apps/docs/app/utils/docs/guide-editorial");
  const copy = structuredClone(sitePages);
  applyGuideEditorial(copy, themeCss);
  applyGuideEditorial(copy, themeCss);
  for (const page of copy)
    expect(new Set(page.sections.map((section) => section.id)).size).toBe(
      page.sections.length,
    );
});
