// @vitest-environment node
import { expect, it } from "vitest";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import SitePreferences from "../../apps/docs/app/components/docs/SitePreferences.vue";
import { themesStylesheet } from "../../apps/docs/app/utils/docs/themes";

it("server-renders the exact complete preset CSS without browser globals or escaped CSS selectors", async () => {
  const html = await renderToString(
    createSSRApp({ render: () => h(SitePreferences, { open: false }) }),
  );
  expect(html).toContain(themesStylesheet());
  expect(html).not.toContain("&quot;");
  expect(html).not.toContain('role="dialog"');
});
