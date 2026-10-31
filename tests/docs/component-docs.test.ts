import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  buildComponentDocs,
  sfcExports,
} from "../../apps/docs/scripts/component-docs";
import type { ComponentDocs } from "../../apps/docs/app/utils/docs/component-docs-types";
import type { CatalogCategory } from "../../tools/registry/types";

const fixture = mkdtempSync(resolve(tmpdir(), "orvui-component-docs-"));
let docs: ComponentDocs;
const put = (path: string, text: string) => {
  const file = resolve(fixture, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
};
const base = "packages/vue/src/motion/example";
const categories: CatalogCategory[] = [
  {
    slug: "motion",
    name: "Motion",
    description: "",
    components: [
      {
        slug: "example",
        name: "Example",
        description: "",
        file: "upstream.tsx",
        examples: [
          {
            slug: "other",
            name: "Other",
            file: "other.tsx",
            previewFile: "other.preview.tsx",
            previewKey: "other",
          },
        ],
      },
    ],
  },
];
beforeAll(() => {
  put(
    "node_modules/fake-native/package.json",
    JSON.stringify({ name: "fake-native", types: "index.d.ts" }),
  );
  put(
    "node_modules/fake-native/index.d.ts",
    "export interface Native { nativeLabel?: string; onVnodeMounted?: () => void }",
  );
  put(
    `${base}/types.ts`,
    `import type {Native} from 'fake-native';\nexport interface Shared extends Native {\n/** Visible label. */\nlabel?: string;\ncount: number;\ndepth?: number;\n}`,
  );
  put(
    `${base}/helper.ts`,
    `import type {Shared} from './types';export function useShared(p:Shared) {const depth=p.depth??4;function unrelated(){const p={depth:5};return p.depth??99;}return depth;}`,
  );
  put(
    `${base}/index.ts`,
    `export {default as Example,default as ExampleRoot} from './Example.vue'; export {default as Other} from './Other.vue'; export {default as Broken} from './Broken.vue'; export {default as Generic} from './Generic.vue'; export type {Shared} from './types';`,
  );
  put(
    `${base}/Example.vue`,
    `<script setup lang="ts">
import type { Shared } from './types';
import {useShared} from './helper';
const props = withDefaults(defineProps<Shared & { disabled?: boolean; open?: boolean; variant?: 'one'|'two' }>(), {label:'Hello',open:undefined,variant:'one'});
useShared(props);
const emit = defineEmits<{ change: [value: number]; close: [] }>();
defineSlots<{default?: (scope: {count: number}) => string}>();
</script><template><slot :count="props.count" /></template>`,
  );
  put(
    `${base}/Other.vue`,
    `<script setup lang="ts">const p=defineProps<{value?: number}>();const emit=defineEmits(['change']);const value=p.value ?? 4;</script><template><slot name="label" /><slot :value="value" /></template>`,
  );
  put(
    `${base}/Broken.vue`,
    `<script setup lang="ts">defineProps<{missing?: MissingType[]}>();</script><template><div /></template>`,
  );
  put(
    `${base}/Generic.vue`,
    `<script setup lang="ts" generic="T">defineProps<{items: readonly T[]}>();</script><template><div /></template>`,
  );
  put(
    `${base}/demo.vue`,
    `<script setup lang="ts">import Wrapped from './examples/first.vue';</script><template><Wrapped /></template>`,
  );
  put(
    `${base}/examples/first.vue`,
    `<script setup lang="ts">import {ExampleRoot} from '../index';import {SharedButton} from '../../shared';</script><template><ExampleRoot :count="2"/><SharedButton /></template>`,
  );
  put(
    `${base}/examples/other.vue`,
    `<script setup lang="ts">import {Other} from '../index';</script><template><Other /></template>`,
  );
  docs = buildComponentDocs({ root: fixture, categories, revision: "fixture" });
});
afterAll(() => rmSync(fixture, { recursive: true, force: true }));

describe("Vue public API metadata", () => {
  it("resolves real SFC aliases and follows a default demo wrapper without selecting sibling variants", () => {
    expect([
      ...sfcExports(resolve(fixture, `${base}/index.ts`)).keys(),
    ]).toEqual(["Example", "ExampleRoot", "Other", "Broken", "Generic"]);
    const entry = docs.entries["motion/example"];
    expect(entry.default.primaryFile).toBe(`${base}/Example.vue`);
    expect(entry.default.sourceFiles).toEqual([`${base}/Example.vue`]);
    expect(entry.default.components[0].displayName).toBe("ExampleRoot");
    expect(entry.variants.other.primaryFile).toBe(`${base}/Other.vue`);
    expect(entry.variants.other.sourceFiles).toEqual([`${base}/Other.vue`]);
  });
  it("resolves imported intersections, optionality, literal unions and actual macro/Boolean defaults", () => {
    const props = docs.components[`${base}/Example.vue`].props;
    expect(props.find((prop) => prop.name === "count")).toMatchObject({
      type: "number",
      required: true,
    });
    expect(props.find((prop) => prop.name === "label")).toMatchObject({
      type: "string",
      required: false,
      defaultValue: "'Hello'",
      description: "Visible label.",
    });
    expect(props.find((prop) => prop.name === "disabled")).toMatchObject({
      type: "boolean",
      defaultValue: "false",
      defaultSource: "boolean-cast",
    });
    expect(props.find((prop) => prop.name === "open")).toMatchObject({
      type: "boolean",
      defaultValue: "undefined",
      defaultSource: "withDefaults",
    });
    expect(props.find((prop) => prop.name === "variant")).toMatchObject({
      type: '"one" | "two"',
      defaultValue: "'one'",
    });
    expect(props.find((prop) => prop.name === "depth")).toMatchObject({
      defaultValue: "4",
      defaultSource: "fallback",
    });
    expect(props.map((prop) => prop.name)).not.toContain("nativeLabel");
    expect(props.map((prop) => prop.name)).not.toContain("onVnodeMounted");
    expect(docs.components[`${base}/Other.vue`].props[0]).toMatchObject({
      defaultValue: "4",
      defaultSource: "fallback",
    });
  });
  it("keeps typed event tuples and slot scopes and reports undeclared payloads without inventing types", () => {
    const main = docs.components[`${base}/Example.vue`];
    expect(main.events).toEqual([
      {
        name: "change",
        signature: "[value: number]",
        declaration: "typed",
        description: "",
      },
      { name: "close", signature: "[]", declaration: "typed", description: "" },
    ]);
    expect(main.slots[0]).toMatchObject({
      name: "default",
      declaration: "typed",
      signature: "(scope: { count: number; }) => string",
      bindings: [{ name: "count", expression: "props.count" }],
    });
    const other = docs.components[`${base}/Other.vue`];
    expect(other.events[0]).toMatchObject({
      name: "change",
      signature: null,
      declaration: "runtime",
    });
    expect(other.slots.find((slot) => slot.name === "label")).toMatchObject({
      signature: "() => VNodeChild",
    });
    expect(other.slots.find((slot) => slot.name === "default")).toMatchObject({
      signature: null,
      bindings: [{ name: "value", expression: "value" }],
    });
    expect(other.diagnostics.map((diagnostic) => diagnostic.code)).toEqual([
      "runtime-event-payload",
      "untyped-slot-bindings",
    ]);
    expect(docs.components[`${base}/Broken.vue`].props[0].type).toBeNull();
    expect(
      docs.components[`${base}/Broken.vue`].diagnostics.map(
        (diagnostic) => diagnostic.code,
      ),
    ).toContain("unresolved-prop-type");
    expect(docs.components[`${base}/Generic.vue`].props[0].type).toBe(
      "readonly T[]",
    );
    expect(docs.components[`${base}/Generic.vue`].diagnostics).toEqual([]);
  });
  it("maps all 110 catalog entries and 72 examples to actual public files in the generated repository artifact", () => {
    const data = JSON.parse(
      readFileSync(resolve("apps/docs/app/data/component-docs.json"), "utf8"),
    ) as ComponentDocs;
    expect(data.summary.entries).toBe(110);
    expect(data.summary.variants).toBe(72);
    expect(
      data.diagnostics.filter(
        (item) =>
          item.code.startsWith("unresolved") ||
          item.code === "unmapped-composition",
      ),
    ).toEqual([]);
    expect(
      data.entries["motion/range-slider"].variants.inline.primaryFile,
    ).toBe("packages/vue/src/motion/range-slider/src/InlineSlider.vue");
    expect(data.entries["motion/range-slider"].variants.fluid.primaryFile).toBe(
      "packages/vue/src/motion/range-slider/src/FluidSlider.vue",
    );
    expect(
      data.entries["motion/image-viewer"].variants.morphing.sourceFiles,
    ).toContain(
      "packages/vue/src/motion/image-viewer/src/ImageViewerCaption.vue",
    );
    for (const entry of Object.values(data.entries))
      for (const composition of [
        entry.default,
        ...Object.values(entry.variants),
      ]) {
        expect(composition.primaryFile).not.toBeNull();
        expect(composition.sourceFiles).toContain(composition.primaryFile);
        expect(
          composition.components.map((component) => component.file),
        ).toEqual(composition.sourceFiles);
        for (const component of composition.components)
          for (const prop of component.props) expect(prop.type).not.toBeNull();
      }
  });
});
