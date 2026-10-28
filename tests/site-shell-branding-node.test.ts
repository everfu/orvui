// @vitest-environment node
import { createSSRApp } from "vue";
import { renderToString } from "@vue/server-renderer";
import { expect, it, vi } from "vitest";
const location = vi.hoisted(() => ({ path: "/" }));
import Layout from "../apps/docs/app/docs/SiteLayout.vue";

it.each([false, true])(
  "renders the orvui home without upstream promotion en=%s",
  async (en) => {
    location.path = en ? "/en/" : "/";
    const html = await renderToString(
      createSSRApp(Layout, {
        frontmatter: { layout: "home" },
        route: location,
        router: { go: async () => {} },
      }),
    );
    const visibleText = html.replace(/<[^>]*>/g, " ");
    expect(html).toContain(`href="${en ? "/en" : ""}/components/motion"`);
    expect(html).toContain("hero-count");
    expect(html).toContain("109");
    expect(html).toContain("shadcn-vue");
    expect(html.indexOf('class="home-install"')).toBeLessThan(
      html.indexOf('class="home-showcase"'),
    );
    expect(html).toContain('data-ready="false"');
    expect(html).toContain('data-scene="components"');
    expect(html).not.toContain('data-scene="dashboard"');
    for (const scene of [
      "components",
      "dashboard",
      "mail",
      "chat",
      "finances",
      "crm",
    ])
      expect(html).toContain(`data-tabs-value="${scene}"`);
    expect(html).toContain('href="/licenses/MIT.txt"');
    expect(html).toContain('href="/licenses/orvui-NOTICE.txt"');
    expect(html).toContain('href="/licenses/paper-design-PolyForm-Shield.txt"');
  },
);
