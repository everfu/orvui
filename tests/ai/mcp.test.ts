// @vitest-environment node
import { beforeAll, afterAll, expect, it } from "vitest";
import { Client, InMemoryTransport } from "@modelcontextprotocol/client";
import {
  readFileSync,
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { resolve, dirname, posix } from "node:path";
import { tmpdir } from "node:os";
import { strFromU8, unzipSync, zipSync } from "fflate";
import { parse } from "vue/compiler-sfc";
import { createAiData, createSkillFiles } from "../../tools/ai/build";
import { createServer } from "../../packages/mcp/src/server";
import type { AiData } from "../../packages/mcp/src/data";
import catalog from "../../tools/catalog/components.json";
import metadata from "../../apps/docs/app/data/component-docs.json";
import { publicUsage } from "../../apps/docs/app/utils/docs/public-usage";
import { THEMES } from "../../packages/vue/src/theme/palettes";
import type { ProductCatalog } from "../../tools/registry/types";

let data: AiData;
let client: Client;
let server: ReturnType<typeof createServer>;
const read = (path: string) => readFileSync(resolve(path), "utf8");
async function call(name: string, args: Record<string, unknown> = {}) {
  const response = await client.callTool({ name, arguments: args });
  const content = response.content as { type: string; text?: string }[];
  return {
    error: response.isError,
    ...JSON.parse(content.find((item) => item.type === "text")!.text!),
  };
}
beforeAll(async () => {
  data = createAiData();
  server = createServer(data);
  client = new Client({ name: "orvui-test", version: "1.0.0" });
  const [local, remote] = InMemoryTransport.createLinkedPair();
  await server.connect(remote);
  await client.connect(local);
});
afterAll(async () => {
  await client?.close();
  await server?.close();
});

it("negotiates MCP and discovers seven read-only tools and catalog-driven components", async () => {
  expect(client.getServerVersion()).toMatchObject({
    name: "orvui",
    version: catalog.product.version,
  });
  const { tools } = await client.listTools();
  expect(tools.map((tool) => tool.name).sort()).toEqual([
    "get_component_docs",
    "get_component_skill",
    "get_component_source_code",
    "get_component_source_styles",
    "get_docs",
    "get_theme_variables",
    "list_components",
  ]);
  expect(
    tools.every(
      (tool) =>
        tool.annotations?.readOnlyHint &&
        tool.annotations?.openWorldHint === false,
    ),
  ).toBe(true);
  const entries = (catalog as ProductCatalog).categories.flatMap(
    (category) => category.components,
  );
  const result = await call("list_components");
  expect(result.productVersion).toBe(catalog.product.version);
  expect(result.data.map((entry: { slug: string }) => entry.slug)).toEqual(
    entries.map((entry) => entry.slug),
  );
  expect(
    result.data.flatMap((entry: { variants: unknown[] }) => entry.variants),
  ).toHaveLength(
    entries.flatMap((entry) => ("examples" in entry ? entry.examples : []))
      .length,
  );
  expect(
    (
      await call("list_components", {
        category: "charts",
        query: "donut",
        locale: "en",
      })
    ).data.map((entry: { slug: string }) => entry.slug),
  ).toEqual(["donut-chart"]);
});

it("returns actual APIs, variants and package/registry usage without inferring undeclared types", async () => {
  for (const slug of [
    "button",
    "popover",
    "table",
    "prompt-input",
    "donut-chart",
  ]) {
    const entry = data.components[slug],
      key = `${entry.category}/${slug}`;
    const result = await call("get_component_docs", { slug, locale: "en" });
    expect(result.data.api).toEqual(
      metadata.entries[key as keyof typeof metadata.entries].default,
    );
    expect(result.data.usage.code).toBe(publicUsage.entries[key].default.code);
    expect(result.data.usage.registryCode).toBe(
      publicUsage.entries[key].default.registryCode,
    );
    expect(result.data.markdown).toBe(entry.docs.en);
    expect(
      (
        await call("get_docs", {
          path: new URL(entry.source).pathname,
          locale: "en",
        })
      ).data.markdown,
    ).toBe(result.data.markdown);
    const variant = entry.variants[0];
    if (variant) {
      const result = await call("get_component_docs", {
        slug,
        variant: variant.slug,
      });
      expect(result.data.api).toEqual(entry.api.variants[variant.slug]);
      expect(result.data.usage).toEqual(entry.usage[variant.slug]);
    }
    expect(
      (await call("get_component_skill", { slug })).data.markdown,
    ).toContain(entry.docs.zh);
  }
});

it("preserves registry closures, original notices and standalone/SFC styles", async () => {
  for (const slug of [
    "button",
    "popover",
    "shader-background",
    "prompt-input",
  ].filter((slug) => data.components[slug])) {
    const registry = JSON.parse(read(`apps/docs/public/r/${slug}.json`));
    const result = await call("get_component_source_code", { slug });
    expect(result.data).toEqual({
      files: registry.files,
      dependencies: registry.dependencies,
    });
    expect(
      result.data.files.some((file: { path: string }) =>
        /NOTICE/.test(file.path),
      ),
    ).toBe(true);
    const styles = (await call("get_component_source_styles", { slug })).data;
    for (const file of styles.files) {
      const source = data.files[file.path];
      if (file.path.endsWith(".vue")) {
        const expected = parse(source.content).descriptor.styles.map(
          (style) => style.content,
        );
        for (const block of expected) expect(file.content).toContain(block);
      } else expect(file.content).toBe(source.content);
    }
    expect(
      styles.files.some((file: { path: string }) => /\.css/.test(file.path)),
    ).toBe(true);
  }
  expect(Object.keys(data.files)).not.toEqual(
    expect.arrayContaining([
      expect.stringMatching(/\/tests\/|templates\/|\/Users\//),
    ]),
  );
});

it("returns every canonical palette unchanged in both appearances", async () => {
  for (const [palette, theme] of Object.entries(THEMES))
    for (const mode of ["light", "dark"] as const)
      expect(
        (await call("get_theme_variables", { palette, mode })).data.variables,
      ).toEqual(theme[mode]);
});

it("rejects unknown components, variants, palettes and paths without allowing filesystem reads", async () => {
  for (const [name, args] of [
    ["get_component_docs", { slug: "missing" }],
    ["get_component_docs", { slug: "button", variant: "missing" }],
    ["get_theme_variables", { palette: "constructor" }],
    ["get_docs", { path: "/docs/../../package.json" }],
    ["get_docs", { path: "file:///etc/passwd" }],
    ["get_docs", { path: "constructor" }],
  ] as const) {
    const response = await call(name, args);
    expect(response.error).toBe(true);
    expect(response.data.error).toMatch(/Unknown/);
    expect(response.productVersion).toBe(catalog.product.version);
  }
  expect(
    (
      await client.callTool({
        name: "get_component_docs",
        arguments: { slug: "../button" },
      })
    ).isError,
  ).toBe(true);
});

it("packages one offline skill with resolvable bilingual references and original notices", () => {
  const skill = read("skills/orvui/SKILL.md");
  const files = createSkillFiles(data, skill, {
    LICENSE: read("LICENSE"),
    NOTICE: read("NOTICE"),
  });
  const archive = unzipSync(zipSync(files));
  expect(strFromU8(archive["orvui/SKILL.md"])).toBe(skill);
  expect(strFromU8(archive["orvui/NOTICE"])).toBe(read("NOTICE"));
  for (const path of ["orvui/SKILL.md", "orvui/references/index.md"]) {
    const markdown = strFromU8(archive[path]);
    for (const [, link] of markdown.matchAll(/\]\(([^)]+)\)/g))
      if (!/^(?:https?:|#)/.test(link))
        expect(archive[posix.join(posix.dirname(path), link)]).toBeDefined();
  }
  for (const entry of Object.values(data.components))
    for (const locale of ["zh", "en"] as const)
      expect(
        strFromU8(archive[`orvui/references/${locale}/${entry.slug}.md`]),
      ).toContain(entry.docs[locale]);
  expect(
    Object.keys(archive).filter((path) => path.endsWith("/SKILL.md")),
  ).toHaveLength(1);
});

it("fails generation before delivery when product versions diverge", () => {
  const root = mkdtempSync(resolve(tmpdir(), "orvui-ai-invalid-"));
  try {
    for (const path of [
      "tools/catalog/components.json",
      "apps/docs/app/data/component-docs.json",
      "apps/docs/app/data/public-usage.json",
      "packages/vue/package.json",
      "packages/mcp/package.json",
    ]) {
      mkdirSync(dirname(resolve(root, path)), { recursive: true });
      writeFileSync(
        resolve(root, path),
        path === "packages/mcp/package.json"
          ? '{"version":"999.0.0"}'
          : read(path),
      );
    }
    expect(() => createAiData(root)).toThrow("matching");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
