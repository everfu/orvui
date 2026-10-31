// @vitest-environment node
import { expect, it } from "vitest";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import catalog from "../../tools/catalog/components.json";
import { TableOfContents } from "../../packages/vue/src/motion/table-of-contents";
import {
  componentOutline,
  documentOutline,
} from "../../apps/docs/app/utils/docs/document-outline";
import {
  sitePages,
  sitePageToc,
} from "../../apps/docs/app/utils/docs/site-page-data";

it.each([false, true])(
  "provides unique, localized outlines for every component (en=%s)",
  (en) => {
    for (const category of catalog.categories)
      for (const entry of category.components) {
        const items = componentOutline(category, entry, en);
        expect(new Set(items.map((item) => item.id)).size, entry.slug).toBe(
          items.length,
        );
        expect(items.map((item) => item.id)).toEqual(
          expect.arrayContaining([
            "install",
            "examples",
            "api-reference",
            "accessibility",
            "faq",
            "licenses",
          ]),
        );
        expect(items.every((item) => item.label.length > 0)).toBe(true);
      }
  },
);
it("uses the same guide IDs and category group definitions as the rendered pages", () => {
  for (const page of sitePages.filter((page) => page.slug !== "changelog")) {
    const items = documentOutline({
      page: page.slug,
      en: false,
      isNew: () => false,
    });
    expect(items.slice(1).map((item) => item.id)).toEqual(
      sitePageToc(page.slug).map((item) => item.id),
    );
  }
  const items = documentOutline({
    category: catalog.categories[0],
    en: false,
    isNew: () => false,
  });
  expect(items.map((item) => item.id)).toEqual(["all"]);
});
it("renders native anchors and scoped instance IDs during SSR", async () => {
  const html = await renderToString(
    createSSRApp({
      render: () =>
        h("div", [
          h(TableOfContents, {
            items: [{ id: "one", label: "Overview" }],
            target: "#article",
          }),
          h(TableOfContents, {
            items: [{ id: "two", label: "Install" }],
            target: "#article",
          }),
        ]),
    }),
  );
  expect(html).toContain('href="#one"');
  expect(html).toContain('href="#two"');
  expect(html.match(/aria-current="location"/g)).toHaveLength(2);
  expect(html).not.toContain("[object Object]");
});
