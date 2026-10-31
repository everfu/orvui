// @vitest-environment node
import { h, createSSRApp } from "vue";
import { renderToString } from "@vue/server-renderer";
import { expect, it, vi } from "vitest";
const location = vi.hoisted(() => ({ path: "/" }));
import SiteLayout from "../apps/docs/app/components/docs/SiteLayout.vue";
import DocsPageContent from "../apps/docs/app/components/docs/DocsPageContent.vue";

// Exercise the same shell/page composition used by Nuxt, including its slot.
const Layout = (props: InstanceType<typeof SiteLayout>["$props"]) =>
  h(SiteLayout, props, { default: () => h(DocsPageContent) });

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
    expect(html).toContain("110");
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
