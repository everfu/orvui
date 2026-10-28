import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import {
  buildComponentMarkdown,
  type ComponentMarkdownInput,
} from "../tools/registry/component-markdown";
import type {
  ApiComponent,
  ComponentDocs,
} from "../tools/registry/component-docs-types";
import type { CatalogCategory } from "../tools/registry/types";
import type { ComponentDetailBaseline } from "../apps/docs/app/docs/details/types";

const apiComponent: ApiComponent = {
  displayName: "Example",
  aliases: ["Example", "ExampleRoot"],
  file: "packages/vue/src/motion/example/Example.vue",
  props: [
    {
      name: "modelValue",
      type: "'first' | 'last'",
      required: false,
      defaultValue: "0",
      defaultSource: "withDefaults",
      description: "Value | label\non a new line",
      sourceFile: "Example.vue",
    },
  ],
  events: [
    {
      name: "update:modelValue",
      signature: "[value: string]",
      declaration: "typed",
      description: "Emitted once",
    },
  ],
  slots: [
    {
      name: "default",
      signature: "(scope: { value: string }) => VNodeChild",
      declaration: "typed",
      bindings: [{ name: "value", expression: "value" }],
      description: "Visible contents",
    },
  ],
  diagnostics: [],
};
const details: ComponentDetailBaseline = {
  category: "motion",
  slug: "example",
  name: "Example",
  description: "An adapted Vue component.",
  keywords: [],
  dates: { publishedAt: "2026-01-01", updatedAt: "2026-10-25" },
  about: {
    overview: "Complete overview",
    useWhen: ["First use case", "Second use case"],
    accessibility: "Keyboard and focus details",
    faq: [{ question: "Can it be controlled?", answer: "Use v-model." }],
  },
  guide: {
    seo: { title: "Example Guide", description: "Full guide" },
    introduction: "Guide introduction",
    composition: {
      description: "Compose these parts",
      tree: "Example\n└─ ExampleItem",
    },
    lifecycle: [
      { title: "Start", description: "Lifecycle start" },
      { title: "Work", description: "Lifecycle work" },
      { title: "Finish", description: "Lifecycle finish" },
    ],
    principles: [
      { title: "First principle", description: "Principle one" },
      { title: "Second principle", description: "Principle two" },
      { title: "Third principle", description: "Principle three" },
    ],
    implementation: {
      title: "Implementation",
      description: "Implementation guidance",
    },
    connections: [
      { slug: "button", name: "Button", description: "Connection rationale" },
    ],
    contract: { owns: "Presentation state", leaves: "Business backend" },
    guidance: { useWhen: "Choose this case", avoidWhen: "Avoid that case" },
  },
};
function fixture(): ComponentMarkdownInput {
  const composition = {
    demoFile: "demo.vue",
    primaryFile: apiComponent.file,
    sourceFiles: [apiComponent.file],
    components: [apiComponent],
  };
  return {
    category: { slug: "motion", name: "Motion" },
    component: {
      slug: "example",
      name: "Example",
      description: "Example component",
      file: "example.tsx",
      examples: [
        {
          slug: "other",
          name: "Other example",
          description: "Other description",
          file: "other.tsx",
          previewFile: "other.preview.tsx",
          previewKey: "other",
        },
      ],
    },
    api: {
      category: "motion",
      slug: "example",
      default: composition,
      variants: { other: composition },
      publicComponents: ["Example"],
    },
    usage: {
      default:
        "<script setup>\nimport { Example } from '@orvui/vue/motion/example'\n</script>",
      other: '<Example model-value="first" />',
    },
    details,
    pageUrl: "http://127.0.0.1:5173/components/motion/example",
    registryBaseUrl: "http://127.0.0.1:5173",
    dependencies: ["motion-v@^1.10.0", "vue@^3.5.0"],
    productVersion: "0.1.0",
  };
}
it("includes complete install, every example, actual API and all guide/about sections", () => {
  const markdown = buildComponentMarkdown(fixture());
  for (const text of [
    "## Install",
    "pnpm dlx shadcn-vue@2.8.2 add http://127.0.0.1:5173/r/example.json",
    "components/orvui/styles.css",
    "## Dependencies",
    "motion-v@^1.10.0",
    "## Usage",
    "### Other example",
    "Other description",
    "@orvui/vue/motion/example",
    "## API Reference",
    "#### Props",
    "#### Events",
    "#### Slots",
    "update:modelValue",
    "value: value",
    "## Component Guide",
    "Guide introduction",
    "Compose these parts",
    "ExampleItem",
    "Lifecycle start",
    "Lifecycle work",
    "Lifecycle finish",
    "Principle one",
    "Principle two",
    "Principle three",
    "Implementation guidance",
    "http://127.0.0.1:5173/components/motion/button",
    "Connection rationale",
    "Presentation state",
    "Business backend",
    "Choose this case",
    "Avoid that case",
    "Complete overview",
    "First use case",
    "Second use case",
    "Keyboard and focus details",
    "Can it be controlled?",
    "Use v-model.",
    'publishedAt: "2026-01-01"',
    "Copyright",
  ]) {
    if (text === "Copyright")
      expect(markdown).toContain("Copyright notices and third-party terms");
    else expect(markdown, text).toContain(text);
  }
  expect(markdown.match(/^### Example$/gm)).toHaveLength(2); // Usage and the deduplicated API.
  expect(markdown).toContain("`'first' \\| 'last'`");
  expect(markdown).toContain("`0`");
  expect(markdown).toContain("Value \\| label on a new line");
  expect(markdown).toMatch(/\n$/);
  expect(markdown).not.toContain("shadcn@latest");
});
it("fails explicitly instead of generating an incomplete registered example section", () => {
  const input = fixture();
  delete input.usage.other;
  expect(() => buildComponentMarkdown(input)).toThrow(
    "Missing Markdown usage for motion/example/other",
  );
});
it("uses variant installation targets and does not duplicate the /r collection segment", () => {
  const input = fixture();
  input.registryBaseUrl += "/r/";
  input.component.examples![0].installSlug = "example-other";
  const markdown = buildComponentMarkdown(input);
  expect(markdown).toContain(
    "shadcn-vue@2.8.2 add http://127.0.0.1:5173/r/example-other.json",
  );
  expect(markdown).not.toContain("/r/r/");
});
it("keeps embedded Markdown fences and template literal types well formed", () => {
  const input = fixture();
  input.usage.default = '<script setup>\nconst markdown = "```text"\n</script>';
  input.apiComponents = [
    {
      ...apiComponent,
      file: "Other.vue",
      displayName: "Other",
      props: [{ ...apiComponent.props[0], type: "`prefix-${string}`" }],
    },
  ];
  const markdown = buildComponentMarkdown(input);
  expect(markdown).toContain(
    '````vue\n<script setup>\nconst markdown = "```text"\n</script>\n````',
  );
  expect(markdown).toContain("`` `prefix-${string}` ``");
});
it("localizes section labels and retains the supplied final localized detail text", () => {
  const input = fixture();
  input.locale = "zh";
  input.description = "组件说明";
  input.details = {
    ...details,
    about: { ...details.about, overview: "已本地化的完整概览" },
  };
  const markdown = buildComponentMarkdown(input);
  expect(markdown).toContain("## 安装");
  expect(markdown).toContain("## API 参考");
  expect(markdown).toContain("#### 事件");
  expect(markdown).toContain("## 组件指南");
  expect(markdown).toContain("## 关于 Example");
  expect(markdown).toContain("已本地化的完整概览");
  expect(markdown).toContain('description: "组件说明"');
  expect(markdown).toContain("update:modelValue");
});
it("retains the independent shader license notice instead of implying a blanket MIT runtime license", () => {
  const input = fixture();
  input.component.slug = "shader-background";
  expect(buildComponentMarkdown(input)).toContain(
    "retains its separate license",
  );
  expect(buildComponentMarkdown(input)).toContain("LICENSE.paper-design");
});
it("accepts the frozen real metadata schema for all 109 entries and 72 registered examples", () => {
  const catalog = JSON.parse(
    readFileSync("tools/catalog/components.json", "utf8"),
  ) as { categories: CatalogCategory[] };
  const metadata = JSON.parse(
    readFileSync("tools/registry/component-docs.json", "utf8"),
  ) as ComponentDocs;
  let count = 0,
    examples = 0;
  for (const category of catalog.categories)
    for (const component of category.components) {
      const usage = Object.fromEntries(
        [
          "default",
          ...(component.examples ?? []).map((example) => example.slug),
        ].map((slug) => [
          slug,
          `<template><div>${component.name} ${slug}</div></template>`,
        ]),
      );
      const markdown = buildComponentMarkdown({
        category,
        component,
        api: metadata.entries[`${category.slug}/${component.slug}`],
        usage,
        pageUrl: `http://127.0.0.1:5173/components/${category.slug}/${component.slug}`,
        registryBaseUrl: "http://127.0.0.1:5173",
      });
      expect(markdown).toContain(`# ${component.name}`);
      for (const example of component.examples ?? []) {
        expect(markdown).toContain(`### ${example.name}`);
        examples++;
      }
      count++;
    }
  expect(count).toBe(109);
  expect(examples).toBe(72);
});
