// @vitest-environment node
import { expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import catalog from "../../tools/catalog/components.json";
import { createDocsPages } from "../../apps/docs/app/utils/docs/route-manifest";
import {
  componentGroups,
  resolveDocsSection,
  guideGroups,
} from "../../apps/docs/app/utils/docs/document-sections";
import { templateDefinitions } from "../../apps/docs/app/utils/docs/template-definitions";
import { buildSiteSearchIndex } from "../../apps/docs/app/utils/docs/site-search-index";

it("assigns all 110 components exactly once without changing their install/storage categories", () => {
  expect(componentGroups.map((group) => group.entries.length)).toEqual([
    5, 16, 14, 15, 9, 7, 7, 5, 18, 14,
  ]);
  const entries = componentGroups.flatMap((group) => group.entries);
  expect(new Set(entries.map((entry) => entry.slug)).size).toBe(110);
  expect(
    entries.map((entry) => `${entry.category}/${entry.slug}`).sort(),
  ).toEqual(
    catalog.categories
      .flatMap((category) =>
        category.components.map((entry) => `${category.slug}/${entry.slug}`),
      )
      .sort(),
  );
});
it("gives each documentation route one section and retains all previous entry points", () => {
  const pages = createDocsPages();
  expect(pages.map((page) => page.path)).toEqual(
    expect.arrayContaining([
      "/docs/mcp-server",
      "/en/docs/mcp-server",
      "/docs/agent-skills",
      "/en/docs/agent-skills",
    ]),
  );
  for (const page of pages.filter(
    (page) => page.frontmatter.layout !== "home",
  )) {
    expect(resolveDocsSection(page.frontmatter)).toBe(
      page.frontmatter.docsSection,
    );
  }
  expect(
    guideGroups.flatMap((group) => group.pages).map((page) => page.path),
  ).not.toContain("/changelog");
  for (const locale of ["", "/en"])
    for (const template of templateDefinitions) {
      expect(
        pages.some(
          (page) =>
            page.path === `${locale}/templates/${template.slug}` &&
            page.frontmatter.docsSection === "templates",
        ),
      ).toBe(true);
    }
});
it.each([false, true])(
  "indexes every template and functional component group (en=%s)",
  (en) => {
    const index = buildSiteSearchIndex(catalog.categories, en);
    expect(index.find((record) => record.id === "motion-switch")?.group).toBe(
      en ? "Forms and selection" : "表单与选择",
    );
    for (const template of templateDefinitions)
      expect(
        index.find((record) => record.id === `template-${template.slug}`)?.href,
      ).toBe(`${en ? "/en" : ""}/templates/${template.slug}`);
  },
);
it("groups the five AI entry points and indexes both locales without losing legacy routes", () => {
  const ai = guideGroups.find((group) => group.id === "ai-guides")!;
  const slugs = [
    "llms-txt",
    "mcp-server",
    "agent-skills",
    "agents-md",
    "design-md",
  ];
  expect(ai.pages.map((page) => page.path)).toEqual(
    slugs.map((slug) => `/docs/${slug}`),
  );
  expect(
    ai.pages
      .filter((page) => page.status === "preview")
      .map((page) => page.path),
  ).toEqual(["/docs/agents-md", "/docs/design-md"]);
  const pages = createDocsPages();
  for (const en of [false, true]) {
    const prefix = en ? "/en" : "";
    const search = buildSiteSearchIndex(catalog.categories, en);
    for (const slug of [...slugs, "ai-agents", "openui"]) {
      const href = `${prefix}/docs/${slug}`;
      expect(pages.some((page) => page.path === href)).toBe(true);
      expect(search.some((record) => record.href === href)).toBe(true);
    }
  }
});
it("publishes only gallery metadata and no private source payloads", () => {
  const manifest = JSON.parse(
    readFileSync("apps/docs/public/templates/manifest.json", "utf8"),
  );
  expect(manifest).toHaveLength(5);
  for (const template of templateDefinitions) {
    const entry = manifest.find(
      (item: { slug: string }) => item.slug === template.slug,
    );
    expect(entry.previewUrl).toBe(template.previewUrl);
    expect(entry.pages.length).toBeGreaterThan(2);
    expect(entry).not.toHaveProperty("files");
    expect(entry).not.toHaveProperty("archive");
    expect(
      existsSync(`apps/docs/public/templates/${template.slug}/source.json`),
    ).toBe(false);
    expect(
      existsSync(`apps/docs/public/templates/${template.slug}/source.zip`),
    ).toBe(false);
  }
});
