import { createDocsPages } from "../../apps/docs/app/utils/docs/route-manifest";
const docRoutes = new Set(createDocsPages().map((page) => page.path));
// @vitest-environment node
import { renderToString } from "@vue/server-renderer";
import { existsSync, readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { createSSRApp, h } from "vue";
import SiteFooter from "../../apps/docs/app/components/docs/SiteFooter.vue";
const render = (en: boolean) =>
  renderToString(createSSRApp({ render: () => h(SiteFooter, { en }) }));
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
    // Each rendered local href must actually exist as a Nuxt route or asset.
    for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
      if (!href!.startsWith("/")) continue;
      const route = href!.split(/[?#]/)[0]!;
      expect(
        docRoutes.has(route) || existsSync(`apps/docs/public${href}`),
        href,
      ).toBe(true);
    }
    expect(
      readFileSync("apps/docs/public/licenses/orvui-NOTICE.txt", "utf8"),
    ).toBe(readFileSync("NOTICE", "utf8"));
  },
);
