// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { createSSRApp } from "vue";
import { renderToString } from "@vue/server-renderer";
import NewBadge from "../apps/docs/app/components/docs/NewBadge.vue";
import CategoryPage from "../apps/docs/app/components/docs/CategoryPage.vue";

describe("New badges during real Node SSR", () => {
  it("keeps badges hidden and category ordering deterministic across request clocks without allocating timers", async () => {
    expect(typeof window).toBe("undefined");
    expect(typeof HTMLElement).toBe("undefined");
    const clock = vi.spyOn(Date, "now");
    const timeout = vi.spyOn(globalThis, "setTimeout");
    const category = {
      slug: "motion",
      name: "Motion",
      description: "",
      components: [
        {
          slug: "fresh",
          name: "Fresh",
          file: "",
          description: "Example",
          badge: "new",
          launchedAt: "2026-10-20",
        },
      ],
    };
    try {
      clock.mockReturnValue(Date.parse("2026-10-20T12:00:00Z"));
      const firstBadge = await renderToString(
        createSSRApp(NewBadge, { launchedAt: "2026-10-20" }),
      );
      const firstCategory = await renderToString(
        createSSRApp(CategoryPage, { category, en: true }),
      );
      clock.mockReturnValue(Date.parse("2030-01-01T00:00:00Z"));
      expect(
        await renderToString(
          createSSRApp(NewBadge, { launchedAt: "2026-10-20" }),
        ),
      ).toBe(firstBadge);
      expect(
        await renderToString(
          createSSRApp(CategoryPage, { category, en: true }),
        ),
      ).toBe(firstCategory);
      expect(firstBadge).not.toContain("New");
      expect(firstCategory).toContain('id="new"');
      expect(firstCategory).not.toContain('class="new-badge"');
      expect(timeout).not.toHaveBeenCalled();
    } finally {
      timeout.mockRestore();
      clock.mockRestore();
    }
  });
});
