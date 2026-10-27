// @vitest-environment node
import { expect, it } from "vitest";
import { createSSRApp } from "vue";
import { renderToString } from "@vue/server-renderer";
import CodePanel from "../apps/docs/.vitepress/theme/CodePanel.vue";

it("renders readable, escaped source without browser APIs before highlighting mounts", async () => {
  expect(typeof window).toBe("undefined");
  expect(typeof HTMLElement).toBe("undefined");
  const html = await renderToString(
    createSSRApp(CodePanel, {
      code: "<template>\n  <button>Hello</button>\n</template>",
      filename: "components/Button.vue",
    }),
  );
  expect(html).toContain("components/");
  expect(html).toContain("Button.vue");
  expect(html).toContain("is-collapsed");
  expect(html).toContain("&lt;button&gt;Hello&lt;/button&gt;");
  expect(html).not.toContain("<button>Hello</button>");
  expect(html).toContain('aria-label="Copy code"');
});
