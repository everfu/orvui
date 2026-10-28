// @vitest-environment node
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { expect, it } from "vitest";
import { SankeyChart } from "..";

it("provides real painted SVG geometry before visibility animations take ownership", async () => {
  const html = await renderToString(
    createSSRApp({
      render: () =>
        h(SankeyChart, {
          nodes: [
            { id: "a", label: "A" },
            { id: "b", label: "B" },
          ],
          links: [{ source: "a", target: "b", value: 12 }],
        }),
    }),
  );
  const painted = [...html.matchAll(/<path\b[^>]*>/g)]
    .map((match) => match[0])
    .filter((tag) => tag.includes('stroke="url('));
  expect(painted).toHaveLength(1);
  expect(painted[0]).toMatch(/\bd="M /);
  expect(painted[0]).toMatch(/\bstroke-width="[\d.]+"/);
  expect(painted[0]).not.toContain("undefined");
});
