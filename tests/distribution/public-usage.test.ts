import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import ts from "typescript";
import { afterAll, beforeAll, expect, it } from "vitest";
import { parse } from "vue/compiler-sfc";
import { createPublicUsageTransformer } from "../../apps/docs/scripts/public-usage";
import {
  publicUsage,
  usageFor,
} from "../../apps/docs/app/utils/docs/public-usage";
import type { CatalogCategory } from "../../tools/registry/types";
const fixture = mkdtempSync(resolve(tmpdir(), "orvui-public-usage-unit-"));
const base = "packages/vue/src",
  entry = `${base}/motion/range-slider`;
const categories: CatalogCategory[] = [
  {
    slug: "motion",
    name: "Motion",
    description: "",
    components: [
      {
        slug: "range-slider",
        name: "Slider",
        description: "",
        file: "source.tsx",
      },
    ],
  },
];
const put = (path: string, text: string) => {
  const file = resolve(fixture, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
};
let transformer: ReturnType<typeof createPublicUsageTransformer>;
beforeAll(() => {
  put(
    `${base}/index.ts`,
    "export * from './motion/range-slider';export {cn as mergeClasses} from './lib/utils';export {EASE_OUT} from './lib/ease'",
  );
  put(
    `${entry}/index.ts`,
    "export {default as InlineSlider} from './private-renderer.vue';export type {Selection as SliderSelection} from './types';export {internalName as PublicRuntime} from './helpers'",
  );
  put(
    `${entry}/private-renderer.vue`,
    '<script setup lang="ts">defineProps<{value?:number}>()</script><template><input /></template>',
  );
  put(`${entry}/types.ts`, "export interface Selection { value: number }");
  put(
    `${entry}/helpers.ts`,
    "export {originalName as internalName} from './renamed';",
  );
  put(`${entry}/renamed.ts`, "export const originalName = 42;");
  put(
    `${base}/lib/utils.ts`,
    "export function cn(...values:string[]){return values.join(' ')};export const privateUtility=42;",
  );
  put(`${base}/lib/ease.ts`, "export const EASE_OUT=[.23,1,.32,1];");
  put(`${base}/styles.css`, ":root { color: red }");
  put(
    "packages/vue/package.json",
    JSON.stringify({
      dependencies: {
        "motion-v": "^1.10.0",
        "lucide-vue-next": "^0.468.0",
        "@example/icons": "^2.0.0",
      },
    }),
  );
  transformer = createPublicUsageTransformer({
    root: fixture,
    categories,
    registryItems: [
      {
        name: "range-slider",
        dependencies: ["motion-v@^1.10.0"],
        files: [
          "motion/range-slider/index.ts",
          "motion/range-slider/private-renderer.vue",
          "motion/range-slider/types.ts",
          "motion/range-slider/helpers.ts",
          "motion/range-slider/renamed.ts",
          "lib/utils.ts",
          "lib/ease.ts",
          "styles.css",
        ].map((file) => ({
          path: "registry/orvui/" + file,
          target: "~/src/components/orvui/" + file,
        })),
      },
    ],
  });
});
afterAll(() => rmSync(fixture, { recursive: true, force: true }));
it("resolves default and named aliases by their real export graph, regardless of the SFC filename", () => {
  put(
    `${entry}/examples/aliased.vue`,
    `<script setup lang="ts">
import LocalSlider from '../private-renderer.vue';
import {default as SecondSlider} from '../private-renderer.vue';
import {internalName as localRuntime} from '../helpers';
import type {Selection as Choice} from '../types';
type Component = typeof import('../private-renderer.vue').default;
const choice:Choice={value:localRuntime};
</script><template><LocalSlider/><SecondSlider/></template>`,
  );
  const result = transformer.transform(`${entry}/examples/aliased.vue`);
  expect(result.code).toContain("InlineSlider as LocalSlider");
  expect(result.code).toContain("InlineSlider as SecondSlider");
  expect(result.code).toContain("PublicRuntime as localRuntime");
  expect(result.code).toContain("import type { SliderSelection as Choice }");
  expect(result.code).toContain(
    'typeof import("@orvui/vue/motion/range-slider").InlineSlider',
  );
  expect(result.code).not.toContain("private-renderer");
  expect(
    result.imports.every(
      (item) => item.target === "@orvui/vue/motion/range-slider",
    ),
  ).toBe(true);
  expect(result.registryCode).toContain(
    'import LocalSlider from "@/components/orvui/motion/range-slider/private-renderer.vue"',
  );
  expect(result.registryCode).toContain(
    'import type {Selection as Choice} from "@/components/orvui/motion/range-slider/types"',
  );
  expect(result.registryInstallSlugs).toEqual(["range-slider"]);
});
it("resolves aggregate root imports back to actual copied component and utility exports", () => {
  put(
    `${entry}/examples/root.vue`,
    '<script setup lang="ts">import {InlineSlider as Local,mergeClasses as classes} from "../../../index"</script><template><Local :class="classes(\'one\')"/></template>',
  );
  const result = transformer.transform(`${entry}/examples/root.vue`);
  expect(result.code).toContain('from "@orvui/vue"');
  expect(result.registryCode).toContain("InlineSlider as Local");
  expect(result.registryCode).toContain("cn as classes");
  expect(result.registryCode).toContain('from "@/components/orvui/lib/utils"');
  expect(result.registryCode).not.toContain("@orvui/vue");
});
it("routes utility aliases through the real root export and preserves external imports", () => {
  put(
    `${entry}/examples/utilities.vue`,
    `<script setup lang="ts">
import {cn as classes} from '../../../lib/utils';
import {EASE_OUT} from '../../../lib/ease';
import {ref} from 'vue';
import {Check} from 'lucide-vue-next';
import '.././../../styles.css';
const load=()=>import('motion-v');
</script><template><div :class="classes('a')"><Check/></div></template>`,
  );
  const result = transformer.transform(`${entry}/examples/utilities.vue`);
  expect(result.code).toContain("mergeClasses as classes");
  expect(result.code).toContain('from "@orvui/vue"');
  expect(result.code).toContain('import "@orvui/vue/style.css"');
  expect(result.code).toContain("from 'lucide-vue-next'");
  expect(result.code).toContain("import('motion-v')");
  expect(result.dependencies).toEqual(["lucide-vue-next", "motion-v", "vue"]);
  expect(result.registryExtraDependencies).toEqual([
    "lucide-vue-next@^0.468.0",
  ]);
});
it("normalizes scoped dependency versions without treating their leading @ as a version separator", () => {
  put(
    `${entry}/examples/scoped.vue`,
    '<script setup lang="ts">import {Check} from "@example/icons"</script><template><Check/></template>',
  );
  expect(
    transformer.transform(`${entry}/examples/scoped.vue`)
      .registryExtraDependencies,
  ).toEqual(["@example/icons@^2.0.0"]);
});
it("preserves type-only markers within mixed imports and public namespaces", () => {
  put(
    `${entry}/examples/mixed.vue`,
    `<script setup lang="ts">
import {InlineSlider as Slider, type SliderSelection as Choice} from '../index';
import * as Sliders from '../index';
</script><template><Slider/><Sliders.InlineSlider/></template>`,
  );
  const result = transformer.transform(`${entry}/examples/mixed.vue`);
  expect(result.code).toContain(
    "InlineSlider as Slider, type SliderSelection as Choice",
  );
  expect(result.code).toContain(
    'import * as Sliders from "@orvui/vue/motion/range-slider"',
  );
});
it("expands a transparent wrapper, preserving all actual example logic and styling", () => {
  put(
    `${entry}/examples/real.vue`,
    '<script setup lang="ts">import {InlineSlider} from "../index"</script><template><InlineSlider/></template><style scoped>.demo{color:red}</style>',
  );
  put(
    `${entry}/demo.vue`,
    '<script setup lang="ts">import AnyName from "./examples/real.vue"</script><template><AnyName /></template>',
  );
  const result = transformer.transform(`${entry}/demo.vue`);
  expect(result.file).toBe(`${entry}/demo.vue`);
  expect(result.resolvedFile).toBe(`${entry}/examples/real.vue`);
  expect(result.code).toContain(".demo{color:red}");
  expect(result.code).toContain('from "@orvui/vue/motion/range-slider"');
  expect(result.code).not.toContain("AnyName");
});
it("reports a private symbol rather than emitting a guessed private package subpath", () => {
  put(
    `${entry}/examples/private.vue`,
    '<script setup lang="ts">import {privateUtility} from "../../../lib/utils"</script><template><span/></template>',
  );
  expect(() => transformer.transform(`${entry}/examples/private.vue`)).toThrow(
    "Imported symbol has no real public export: ../../../lib/utils#privateUtility",
  );
});
it("rejects pre-existing private package paths and application aliases instead of passing them through", () => {
  put(
    `${entry}/examples/private-package.vue`,
    '<script setup lang="ts">import Slider from "@orvui/vue/motion/range-slider/private-renderer.vue"</script><template><Slider/></template>',
  );
  expect(() =>
    transformer.transform(`${entry}/examples/private-package.vue`),
  ).toThrow("Package import is not a public root/component/style entry");
  put(
    `${entry}/examples/application-alias.vue`,
    '<script setup lang="ts">import Slider from "@/components/Slider.vue"</script><template><Slider/></template>',
  );
  expect(() =>
    transformer.transform(`${entry}/examples/application-alias.vue`),
  ).toThrow("Application alias is not portable");
});
it("maps all real defaults, registered variants and standalone examples to safe public imports", () => {
  expect(publicUsage.summary).toMatchObject({
    entries: 110,
    variants: 72,
    files: 188,
    wrappersExpanded: 0,
    publicModules: 111,
  });
  expect(publicUsage.diagnostics).toEqual([]);
  const publicModules = new Set([
    "@orvui/vue",
    ...Object.keys(publicUsage.entries).map((entry) => "@orvui/vue/" + entry),
    "@orvui/vue/style.css",
    "@orvui/vue/tokens.css",
  ]);
  for (const snippet of Object.values(publicUsage.files)) {
    for (const code of [snippet.code, snippet.registryCode])
      expect(code, snippet.file).not.toMatch(
        /\bReact(?:Node|Element)?\b|\bNext\.js\b|\.(?:tsx|jsx)\b|\blucide-react\b|\bframer-motion\b/,
      );
    const { descriptor } = parse(snippet.code);
    for (const block of [descriptor.script, descriptor.scriptSetup])
      if (block) {
        const ast = ts.createSourceFile(
          "demo.ts",
          block.content,
          ts.ScriptTarget.Latest,
          true,
        );
        for (const statement of ast.statements)
          if (
            ts.isImportDeclaration(statement) &&
            ts.isStringLiteral(statement.moduleSpecifier)
          ) {
            const specifier = statement.moduleSpecifier.text;
            expect(specifier, snippet.file).not.toMatch(/^\./);
            if (specifier.startsWith("@orvui/vue"))
              expect(
                publicModules.has(specifier),
                snippet.file + " -> " + specifier,
              ).toBe(true);
          }
      }
    const original = parse(
      readFileSync(snippet.resolvedFile, "utf8"),
    ).descriptor;
    expect(descriptor.template?.content, snippet.file).toBe(
      original.template?.content,
    );
    expect(
      descriptor.styles.map((style) => style.content),
      snippet.file,
    ).toEqual(original.styles.map((style) => style.content));
  }
  expect(usageFor("motion", "range-slider", "inline")?.code).toContain(
    'from "@orvui/vue/motion/range-slider"',
  );
  expect(usageFor("motion", "table")?.resolvedFile).toBe(
    "packages/vue/src/motion/table/demo.vue",
  );
  expect(usageFor("motion", "unknown")).toBeUndefined();
});
it("pairs every registry Usage import with real installed targets and includes demonstration-only dependencies", () => {
  const cache = new Map<string, Set<string>>();
  function targets(slug: string) {
    if (!cache.has(slug))
      cache.set(
        slug,
        new Set(
          (
            JSON.parse(
              readFileSync(`apps/docs/public/r/${slug}.json`, "utf8"),
            ) as { files: { target: string }[] }
          ).files.map((file) => file.target.replace(/^~\//, "")),
        ),
      );
    return cache.get(slug)!;
  }
  for (const snippet of Object.values(publicUsage.files)) {
    const installed = new Set(
      snippet.registryInstallSlugs.flatMap((slug) => [...targets(slug)]),
    );
    expect(snippet.registryInstallSlugs.length, snippet.file).toBeGreaterThan(
      0,
    );
    for (const target of snippet.registryTargets) {
      expect(target.startsWith("src/components/orvui/"), snippet.file).toBe(
        true,
      );
      expect(installed.has(target), snippet.file + " -> " + target).toBe(true);
    }
    const dependencyName = (specifier: string) => {
      const versionAt = specifier.lastIndexOf("@");
      return versionAt > 0 ? specifier.slice(0, versionAt) : specifier;
    };
    const installedDependencies = new Set([
      "vue",
      ...snippet.registryInstallSlugs.flatMap((slug) =>
        (
          JSON.parse(readFileSync(`apps/docs/public/r/${slug}.json`, "utf8"))
            .dependencies ?? []
        ).map(dependencyName),
      ),
      ...snippet.registryExtraDependencies.map(dependencyName),
    ]);
    for (const dependency of snippet.dependencies)
      expect(
        installedDependencies.has(dependency),
        snippet.file + " -> " + dependency,
      ).toBe(true);
    const { descriptor } = parse(snippet.registryCode);
    for (const block of [descriptor.script, descriptor.scriptSetup])
      if (block) {
        const ast = ts.createSourceFile(
          "demo.ts",
          block.content,
          ts.ScriptTarget.Latest,
          true,
        );
        for (const node of ast.statements)
          if (
            ts.isImportDeclaration(node) &&
            ts.isStringLiteral(node.moduleSpecifier)
          ) {
            const name = node.moduleSpecifier.text;
            expect(name, snippet.file).not.toMatch(/^\.|^@orvui\/vue/);
            if (name.startsWith("@/"))
              expect(name, snippet.file).toMatch(/^@\/components\/orvui\//);
          }
      }
  }
  expect(usageFor("motion", "alert")?.registryInstallSlugs).toEqual([
    "alert",
    "button",
    "tabs",
  ]);
  expect(usageFor("motion", "dock")?.registryExtraDependencies).toEqual([
    "lucide-vue-next@^0.468.0",
  ]);
  expect(
    usageFor("motion", "range-slider", "inline", "registry")?.code,
  ).toContain('from "@/components/orvui/motion/range-slider"');
  expect(
    usageFor("motion", "range-slider", "inline", "package")?.code,
  ).toContain('from "@orvui/vue/motion/range-slider"');
});
