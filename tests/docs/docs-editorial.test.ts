// @vitest-environment node
import { expect, it } from "vitest";
it("keeps guide anchor IDs unique when editorial content is refreshed", async () => {
  const { sitePages, themeCss } =
    await import("../../apps/docs/app/utils/docs/site-page-data");
  const { applyGuideEditorial } =
    await import("../../apps/docs/app/utils/docs/guide-editorial");
  const copy = structuredClone(sitePages);
  applyGuideEditorial(copy, themeCss);
  applyGuideEditorial(copy, themeCss);
  for (const page of copy)
    expect(new Set(page.sections.map((section) => section.id)).size).toBe(
      page.sections.length,
    );
});
