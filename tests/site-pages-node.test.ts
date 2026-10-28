// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { createSSRApp } from "vue";
import { renderToString } from "@vue/server-renderer";
import SitePage from "../apps/docs/app/docs/SitePage.vue";
import { sitePages } from "../apps/docs/app/docs/site-page-data";
describe("support pages without browser globals", () => {
  for (const page of sitePages)
    for (const en of [false, true])
      it(`${page.slug} ${en ? "English" : "Chinese"}`, async () => {
        expect(typeof window).toBe("undefined");
        expect(typeof HTMLElement).toBe("undefined");
        const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
        try {
          const first = await renderToString(
            createSSRApp(SitePage, { page: page.slug, en }),
          );
          const second = await renderToString(
            createSSRApp(SitePage, { page: page.slug, en }),
          );
          expect(first).toBe(second);
          expect(first).toContain("<h1");
          expect(first).not.toContain("[object Object]");
          expect(warning.mock.calls.flat().join(" ")).not.toMatch(
            /Unhandled|injection/i,
          );
        } finally {
          warning.mockRestore();
        }
      });
});
