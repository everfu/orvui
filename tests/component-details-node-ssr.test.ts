// @vitest-environment node
import { expect, it } from "vitest";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import ComponentDetails from "../apps/docs/app/docs/ComponentDetails.vue";
import {
  componentDetails,
  getComponentAbout,
} from "../apps/docs/app/docs/details";
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
    expect(html).not.toContain("details-credit");
  },
);
it.each(
  componentDetails.map((record) => ({
    category: record.category,
    slug: record.slug,
  })),
)(
  "renders complete Chinese About for $category/$slug without relying on browser state",
  async (record) => {
    const html = await renderToString(
      createSSRApp({
        render: () => h(ComponentDetails, { ...record, en: false }),
      }),
    );
    const about = getComponentAbout(record.category, record.slug, false)!;
    const escape = (value: string) =>
      value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    expect(html).toContain('lang="zh-CN"');
    expect(html).toContain("适用场景");
    expect(html).toContain("无障碍");
    expect(html).toContain('data-state="closed"');
    for (const paragraph of [
      about.overview,
      about.accessibility,
      ...about.useWhen,
      ...about.faq.flatMap((item) => [item.question, item.answer]),
    ])
      expect(html).toContain(escape(paragraph));
  },
);
