// @vitest-environment node
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { expect, it } from "vitest";
import { Loader } from "..";

it("renders one valid SVG frame for animated loader attributes before hydration", async () => {
  for (const variant of ["metaballs", "morph", "spinner"] as const) {
    const html = await renderToString(
      createSSRApp({
        render: () => h(Loader, { variant }),
      }),
    );
    for (const [, name, value] of html.matchAll(
      /\b(cx|cy|r|opacity)="([^"]*)"/g,
    )) {
      expect(
        Number.isFinite(Number(value)),
        `${variant}: ${name}=${value}`,
      ).toBe(true);
    }
    expect(html).not.toMatch(/NaN|undefined|\[object Object\]/);
    if (variant === "metaballs") {
      expect(html).toContain('cx="30"');
      expect(html).toContain('cx="70"');
    }
    if (variant === "morph") {
      const paths = [...html.matchAll(/\bd="([^"]+)"/g)];
      expect(paths).toHaveLength(1);
      expect(paths[0][1].match(/\bM/g)).toHaveLength(1);
    }
  }
});
