// @vitest-environment node
import { expect, it } from "vitest";
import { createSSRApp } from "vue";
import { renderToString } from "@vue/server-renderer";
import CopyPage from "../apps/docs/app/docs/CopyPage.vue";

it("renders the split page-copy control on the server without accessing browser resources", async () => {
  expect(typeof window).toBe("undefined");
  expect(typeof HTMLElement).toBe("undefined");
  const html = await renderToString(
    createSSRApp(CopyPage, {
      pageUrl: "http://127.0.0.1:5173/components/motion/button",
      markdownPath: "/components/motion/button.md",
      componentName: "Button",
    }),
  );
  expect(html).toContain("Copy Page");
  expect(html).toContain('aria-label="More page actions"');
  expect(html).toContain('aria-expanded="false"');
  expect(html).not.toContain('role="menuitem"');
});
