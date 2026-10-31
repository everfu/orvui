// @vitest-environment node
import { renderToString } from "@vue/server-renderer";
import { expect, it } from "vitest";
import { createSSRApp, h } from "vue";
import ComponentDetails from "../../apps/docs/app/components/docs/ComponentDetails.vue";
import { componentDetails } from "../../apps/docs/app/utils/docs/details";
it.each(
  componentDetails.map((record) => ({
    category: record.category,
    slug: record.slug,
  })),
)(
  "renders $category/$slug complete notes while About remains closed on the server",
  async (record) => {
    const html = await renderToString(
      createSSRApp({
        render: () => h(ComponentDetails, { ...record, en: true }),
      }),
    );
    expect(html).toContain('id="about"');
    expect(html).toContain('data-state="closed"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("When to use it");
    expect(html).toContain("Accessibility");
    expect(html).toContain("<time datetime=");
    expect((html.match(/class="related-card"/g) ?? []).length).toBe(3);
    const guide = componentDetails.find(
      (item) => item.category === record.category && item.slug === record.slug,
    )!.guide;
    if (guide) {
      expect(html).toContain('id="composition"');
      expect(html).toContain('id="behavior"');
      expect(html).toContain(guide.composition.tree.split("\n")[0]);
    }
    if (record.category === "blocks")
      expect(html).toContain("/licenses/orvui-NOTICE.txt");
  },
);
