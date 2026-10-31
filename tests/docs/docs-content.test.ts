// @vitest-environment node
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import apiMetadata from "../../apps/docs/app/data/component-docs.json";
import catalog from "../../tools/catalog/components.json";
import type { ComponentDocs } from "../../apps/docs/app/utils/docs/component-docs-types";
import {
  componentBindings,
  componentGroupGuidance,
} from "../../apps/docs/app/utils/docs/component-handbook";
import { componentGroups } from "../../apps/docs/app/utils/docs/document-sections";
import { templateEditorial } from "../../apps/docs/app/utils/docs/template-editorial";
import { templateDefinitions } from "../../apps/docs/app/utils/docs/template-definitions";
import { documentOutline } from "../../apps/docs/app/utils/docs/document-outline";

const api = apiMetadata as unknown as ComponentDocs;
it("documents only model bindings declared by a component's public API, including variants", () => {
  let count = 0;
  for (const entry of Object.values(api.entries)) {
    const components = [
      entry.default,
      ...Object.values(entry.variants),
    ].flatMap((composition) => composition.components);
    const bindings = componentBindings(entry);
    expect(
      new Set(bindings.map((binding) => binding.component + ":" + binding.prop))
        .size,
    ).toBe(bindings.length);
    for (const binding of bindings) {
      count++;
      expect(
        components.some(
          (component) =>
            component.displayName === binding.component &&
            component.props.some((prop) => prop.name === binding.prop) &&
            component.events.some((event) => event.name === binding.event),
        ),
      ).toBe(true);
      expect(binding.event).toBe(`update:${binding.prop}`);
    }
  }
  expect(count).toBeGreaterThan(50);
  expect(componentBindings(api.entries["motion/switch"])[0].directive).toBe(
    "v-model",
  );
  expect(componentBindings(api.entries["motion/button"])).toEqual([]);
  expect(
    componentBindings(api.entries["motion/bottom-sheet"]).some(
      (binding) => binding.directive === "v-model:open",
    ),
  ).toBe(true);
});
it("provides bilingual selection guidance for every functional group", () => {
  for (const group of componentGroups) {
    expect(componentGroupGuidance[group.id].zh.length).toBeGreaterThan(25);
    expect(componentGroupGuidance[group.id].en.length).toBeGreaterThan(60);
  }
});
it("documents public demo workflows without exposing private source", () => {
  for (const template of templateDefinitions) {
    const editorial = templateEditorial[template.slug];
    expect(editorial.walkthrough).toHaveLength(3);
    for (const en of [false, true]) {
      const markdown = readFileSync(
        `apps/docs/public/${en ? "en/" : ""}templates/${template.slug}.md`,
        "utf8",
      );
      expect(markdown).toContain(template.previewUrl);
      for (const page of template.pages)
        expect(markdown).toContain(en ? page.en : page.zh);
      expect(markdown).not.toMatch(
        /source\.zip|source\.json|<script setup|renderToString/,
      );
    }
  }
});
it.each([false, true])(
  "exports each new reading-outline target exactly once in Markdown (en=%s)",
  (en) => {
    for (const layout of ["components", "templates", "template"]) {
      const paths =
        layout === "template"
          ? templateDefinitions.map((template) => `templates/${template.slug}`)
          : [layout];
      const outline = documentOutline({ layout, en, isNew: () => false });
      for (const path of paths) {
        const markdown = readFileSync(
          `apps/docs/public/${en ? "en/" : ""}${path}.md`,
          "utf8",
        );
        if (layout !== "template")
          expect(
            [...markdown.matchAll(/<a id="([^"]+)"><\/a>/g)].map(
              (match) => match[1],
            ),
          ).toEqual(outline.map((item) => item.id));
        for (const item of outline)
          expect(
            markdown.split(`<a id="${item.id}"></a>`).length - 1,
            path + "#" + item.id,
          ).toBe(1);
      }
    }
    for (const category of catalog.categories)
      for (const entry of category.components) {
        const prefix =
          category.slug === "charts" ? "charts" : `components/${category.slug}`;
        const markdown = readFileSync(
          `apps/docs/public/${en ? "en/" : ""}${prefix}/${entry.slug}.md`,
          "utf8",
        );
        expect(markdown).toContain('<a id="state-and-events"></a>');
      }
  },
);

it.each([false, true])(
  "indexes template workflows and application pages (en=%s)",
  async (en) => {
    const { buildSiteSearchIndex } =
      await import("../../apps/docs/app/utils/docs/site-search-index");
    const index = buildSiteSearchIndex(catalog.categories, en);
    for (const template of templateDefinitions) {
      const record = index.find(
        (item) => item.id === `template-${template.slug}`,
      )!;
      expect(record.keywords).toContain(
        templateEditorial[template.slug].purpose[en ? "en" : "zh"],
      );
      expect(record.keywords).toContain(template.pages[0][en ? "en" : "zh"]);
    }
  },
);
