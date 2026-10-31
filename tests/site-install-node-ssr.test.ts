// @vitest-environment node
import { expect, it, vi } from "vitest";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import SiteInstallBlock from "../apps/docs/app/components/docs/SiteInstallBlock.vue";
import SiteInstallCommand from "../apps/docs/app/components/docs/SiteInstallCommand.vue";

it("renders local package installation without browser globals or registry requests", async () => {
  expect(typeof window).toBe("undefined");
  const fetch = vi.spyOn(globalThis, "fetch");
  try {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(SiteInstallBlock, { slug: "button", en: true, mode: "package" }),
      }),
    );
    expect(html).toContain("Before publication");
    expect(html).toContain("pnpm add ./orvui-vue-0.1.0.tgz");
    expect(html).toContain("@orvui/vue/style.css");
    expect(fetch).not.toHaveBeenCalled();
  } finally {
    fetch.mockRestore();
  }
});
it("renders all explicit registry URLs deterministically before mounting", async () => {
  const html = await renderToString(
    createSSRApp({
      render: () =>
        h(SiteInstallCommand, {
          slugs: ["button", "input", "button"],
          en: true,
        }),
    }),
  );
  expect(html).toContain(
    "https://orvui.efu.me/r/button.json https://orvui.efu.me/r/input.json",
  );
  expect(html).toContain("shadcn-vue@2.8.2");
});
