// @vitest-environment node
import { expect, it } from "vitest";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import HeroBeam from "../apps/docs/.vitepress/theme/HeroBeam.vue";
const render = () =>
  renderToString(
    createSSRApp({
      render: () => h(HeroBeam, {}, () => h("button", "Install component")),
    }),
  );
it("renders deterministic hero decoration in real Node without browser globals", async () => {
  expect(typeof window).toBe("undefined");
  expect(typeof HTMLElement).toBe("undefined");
  const first = await render();
  expect(first).toBe(await render());
  expect(first).toContain("Install component");
  expect(first).toContain("@property --beam-angle-");
  expect(first).toContain("data-beam-bloom");
});
it("isolates generated beam CSS between multiple instances in the same SSR tree", async () => {
  const html = await renderToString(
    createSSRApp({
      render: () =>
        h("div", [
          h(HeroBeam, {}, () => "First"),
          h(HeroBeam, {}, () => "Second"),
        ]),
    }),
  );
  const ids = [...html.matchAll(/<div[^>]+data-beam="([^"]+)"/g)].map(
    (match) => match[1],
  );
  expect(ids).toHaveLength(2);
  expect(new Set(ids).size).toBe(2);
  for (const id of ids) expect(html).toContain(`@property --beam-angle-${id}`);
});
