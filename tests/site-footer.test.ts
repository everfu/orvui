// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { compileStyle, parse } from "vue/compiler-sfc";
import { expect, it } from "vitest";
import SiteFooter from "../apps/docs/.vitepress/theme/SiteFooter.vue";
import catalog from "../tools/catalog/components.json";
import type { CatalogCategory } from "../tools/registry/types";
const categories = catalog.categories as CatalogCategory[];
const render = (en: boolean) =>
  renderToString(createSSRApp({ render: () => h(SiteFooter, { en }) }));
it.each([true, false])(
  "renders source category order, exactly seven real component destinations and View all en=%s",
  async (en) => {
    expect(typeof window).toBe("undefined");
    const html = await render(en);
    expect(
      [...html.matchAll(/data-footer-category="([^"]+)"/g)].map(
        (match) => match[1],
      ),
    ).toEqual(["motion", "blocks", "agents", "charts"]);
    for (const slug of ["motion", "blocks", "agents", "charts"]) {
      const category = categories.find((category) => category.slug === slug)!;
      const base = `${en ? "/en" : ""}/${slug === "charts" ? "charts" : `components/${slug}`}`;
      for (const item of category.components.slice(0, 7))
        expect(html).toContain(`href="${base}/${item.slug}"`);
      expect(html).not.toContain(
        `href="${base}/${category.components[7]!.slug}"`,
      );
      expect(html).toContain(
        `${en ? "View all" : "查看全部"} (${category.components.length})`,
      );
    }
  },
);
it.each([true, false])(
  "preserves scoped resource URLs and real licenses without upstream promotion en=%s",
  async (en) => {
    const html = await render(en);
    for (const path of [
      "/changelog",
      "/docs/ai-agents",
      "/docs/theme",
      "/docs/motion-patterns",
    ])
      expect(html).toContain(`href="${en ? "/en" : ""}${path}"`);
    for (const path of [
      "/llms.txt",
      "/licenses/MIT.txt",
      "/licenses/orvui-NOTICE.txt",
      "/licenses/paper-design-PolyForm-Shield.txt",
    ])
      expect(html).toContain(`href="${path}"`);
    // Each rendered local href must actually exist as a VitePress route or asset.
    for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
      if (!href!.startsWith("/")) continue;
      const route = href!.endsWith("/") ? `${href}index` : href;
      expect(
        existsSync(`apps/docs${route}.md`) ||
          existsSync(`apps/docs/public${href}`),
        href,
      ).toBe(true);
    }
    expect(
      readFileSync("apps/docs/public/licenses/orvui-NOTICE.txt", "utf8"),
    ).toBe(readFileSync("NOTICE", "utf8"));
  },
);
it("compiles isolated scoped responsive rules without reserved artwork space", () => {
  const source = readFileSync(
    "apps/docs/.vitepress/theme/SiteFooter.vue",
    "utf8",
  );
  const descriptor = parse(source).descriptor;
  const result = compileStyle({
    filename: "SiteFooter.vue",
    source: descriptor.styles[0]!.content,
    id: "data-v-footer",
    scoped: true,
  });
  expect(result.errors).toEqual([]);
  const declarations = new Map<string, Record<string, string>>();
  result.rawResult!.root.walkRules((rule) => {
    const parent = rule.parent;
    const media = parent && "params" in parent ? String(parent.params) : "base";
    const fields = Object.fromEntries(
      rule.nodes
        .filter((node) => node.type === "decl")
        .map((node) => [node.prop, node.value]),
    );
    declarations.set(`${media}:${rule.selector}`, fields);
  });
  const style = (media: string, selector: string) =>
    declarations.get(`${media}:${selector}[data-v-footer]`)!;
  expect(style("base", ".orvui-site-footer-grid")["grid-template-columns"]).toBe(
    "minmax(0, 1fr)",
  );
  expect(style("base", ".orvui-site-footer-grid").padding).toBe(
    "64px 16px",
  );
  expect(style("base", ".orvui-site-footer-grid")["row-gap"]).toBe("48px");
  expect(
    style("(min-width: 640px)", ".orvui-site-footer-grid")[
      "grid-template-columns"
    ],
  ).toBe("repeat(2, minmax(0, 1fr))");
  expect(
    style("(min-width: 768px)", ".orvui-site-footer-grid")[
      "grid-template-columns"
    ],
  ).toBe("repeat(3, minmax(0, 1fr))");
  expect(
    style("(min-width: 1024px)", ".orvui-site-footer-grid")[
      "grid-template-columns"
    ],
  ).toBe("1.4fr repeat(5, minmax(0, 1fr))");
  expect(result.code).not.toContain(".landing-footer");
});
