import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { strToU8, zipSync } from "fflate";
import type {
  AiData,
  ComponentRecord,
  SourceFile,
  Usage,
} from "../../packages/mcp/src/data";
import type { ProductCatalog } from "../registry/types";
import type { ComponentDocs } from "../../apps/docs/app/utils/docs/component-docs-types";
import type { PublicUsageManifest } from "../../apps/docs/app/utils/docs/public-usage-types";
import { getLocalizedDetails } from "../../apps/docs/app/utils/docs/details";
import { componentGroup } from "../../apps/docs/app/utils/docs/document-sections";
import { componentGroupGuidance } from "../../apps/docs/app/utils/docs/component-handbook";
import { sitePages } from "../../apps/docs/app/utils/docs/site-page-data";
import { THEMES } from "../../packages/vue/src/theme/palettes";
import { documentationOrigin } from "../distribution";
import { validateRegistryItem } from "../registry/build";

const read = (root: string, path: string) =>
  readFileSync(resolve(root, path), "utf8");
const json = <T>(root: string, path: string): T => JSON.parse(read(root, path));

/** Pure assembly from the same generated resources used by the documentation and registry. */
export function createAiData(root = process.cwd()): AiData {
  const catalog = json<ProductCatalog>(root, "tools/catalog/components.json");
  const api = json<ComponentDocs>(
    root,
    "apps/docs/app/data/component-docs.json",
  );
  const usage = json<PublicUsageManifest>(
    root,
    "apps/docs/app/data/public-usage.json",
  );
  const library = json<{ version: string }>(root, "packages/vue/package.json");
  const mcp = json<{ version: string }>(root, "packages/mcp/package.json");
  if (
    [
      api.productVersion,
      usage.productVersion,
      library.version,
      mcp.version,
    ].some((version) => version !== catalog.product.version)
  )
    throw new Error(
      "AI resources require matching catalog, API, usage, Vue and MCP product versions.",
    );
  // API diagnostics also record intentionally unknown runtime payloads. Preserve
  // those in the API instead of inventing signatures or rejecting valid components.
  if (
    usage.diagnostics.length ||
    api.diagnostics.some(
      (entry) =>
        entry.code.startsWith("unresolved") ||
        ["unmapped-composition", "sfc-parse"].includes(entry.code),
    )
  )
    throw new Error(
      "Resolve public usage diagnostics before building AI resources.",
    );
  const data: AiData = {
    schemaVersion: 1,
    product: catalog.product,
    source: documentationOrigin,
    components: {},
    files: {},
    guides: {},
    themes: THEMES,
    themeCss: read(root, "apps/docs/public/theme.css"),
  };
  const registryNames = new Set(
    json<{ items: { name: string }[] }>(
      root,
      "apps/docs/public/r/registry.json",
    ).items.map((item) => item.name),
  );
  for (const category of catalog.categories)
    for (const entry of category.components) {
      const key = `${category.slug}/${entry.slug}`,
        apiEntry = api.entries[key],
        usageEntry = usage.entries[key];
      if (!apiEntry || !usageEntry || data.components[entry.slug])
        throw new Error(`Missing or duplicate component: ${key}`);
      const registryText = read(root, `apps/docs/public/r/${entry.slug}.json`);
      if (
        registryText !== read(root, `packages/vue/registry/${entry.slug}.json`)
      )
        throw new Error(`Package and documentation registry differ: ${key}`);
      const registry = JSON.parse(registryText) as {
        meta: { version: string };
        files: SourceFile[];
        dependencies: string[];
      };
      validateRegistryItem(registry);
      if (registry.meta.version !== catalog.product.version)
        throw new Error(`Registry version mismatch: ${key}`);
      for (const file of registry.files) {
        if (
          /(?:^|\/)tests\//.test(file.path) ||
          file.path.includes("templates/") ||
          /(?:\/Users\/|[A-Z]:\\)/.test(file.path)
        )
          throw new Error(`Non-public source in AI data: ${file.path}`);
        const previous = data.files[file.path];
        if (previous && JSON.stringify(previous) !== JSON.stringify(file))
          throw new Error(`Conflicting source: ${file.path}`);
        data.files[file.path] = file;
      }
      const route = `/${category.slug === "charts" ? "charts" : `components/${category.slug}`}/${entry.slug}`;
      const record: ComponentRecord = {
        slug: entry.slug,
        category: category.slug,
        name: entry.name,
        keywords: entry.keywords ?? [],
        description: { zh: "", en: "" },
        source: documentationOrigin + route,
        variants: (entry.examples ?? []).map((example) => ({
          slug: example.slug,
          name: example.name,
          installSlug: example.installSlug ?? entry.slug,
        })),
        files: registry.files.map((file) => file.path),
        dependencies: registry.dependencies,
        api: apiEntry,
        usage: {},
        docs: { zh: "", en: "" },
        skills: { zh: "", en: "" },
      };
      const variantNames = (entry.examples ?? [])
        .map((example) => example.slug)
        .sort();
      for (const values of [apiEntry.variants, usageEntry.variants])
        if (
          JSON.stringify(Object.keys(values).sort()) !==
          JSON.stringify(variantNames)
        )
          throw new Error(`Variant coverage mismatch: ${key}`);
      for (const [variant, snippet] of Object.entries({
        default: usageEntry.default,
        ...usageEntry.variants,
      })) {
        if (
          !snippet.code ||
          !snippet.registryCode ||
          snippet.registryInstallSlugs.some((slug) => !registryNames.has(slug))
        )
          throw new Error(
            `Missing usage or registry dependency: ${key}/${variant}`,
          );
        for (const slug of snippet.registryInstallSlugs) {
          const item = json<{ meta: { version: string } }>(
            root,
            `apps/docs/public/r/${slug}.json`,
          );
          if (item.meta.version !== catalog.product.version)
            throw new Error(`Registry dependency version mismatch: ${slug}`);
        }
        record.usage[variant] = {
          code: snippet.code,
          registryCode: snippet.registryCode,
          installSlugs: snippet.registryInstallSlugs,
          dependencies: snippet.dependencies,
          extraDependencies: snippet.registryExtraDependencies,
        } satisfies Usage;
      }
      for (const locale of ["zh", "en"] as const) {
        const path = `${locale === "en" ? "/en" : ""}${route}`;
        const markdown = read(root, `apps/docs/public${path}.md`);
        if (
          !markdown.includes(
            `productVersion: ${JSON.stringify(catalog.product.version)}`,
          )
        )
          throw new Error(`Markdown version mismatch: ${path}`);
        record.docs[locale] = markdown;
        const details = getLocalizedDetails(
          category.slug,
          entry.slug,
          locale === "en",
        );
        if (!details?.about)
          throw new Error(`Missing component guidance: ${key}/${locale}`);
        record.description[locale] = details.description;
        const group = componentGroup(entry.slug);
        const guidance = group
          ? componentGroupGuidance[
              group.id as keyof typeof componentGroupGuidance
            ]?.[locale]
          : undefined;
        // The full reference is the canonical handbook, with only decision-making guidance added.
        record.skills[locale] =
          [
            `# ${entry.name} · orvui ${catalog.product.version}`,
            `\n${locale === "zh" ? "## 选择与组合" : "## Selection and composition"}\n`,
            guidance ?? details.description,
            details.guide?.guidance.useWhen ?? "",
            details.guide?.guidance.avoidWhen ?? "",
            `\n${locale === "zh" ? "## SSR、动效与应用边界" : "## SSR, motion and application boundaries"}\n`,
            locale === "zh"
              ? "在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。"
              : "Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.",
            `\n${locale === "zh" ? "## 完整组件参考" : "## Complete component reference"}\n`,
            markdown,
          ]
            .filter(Boolean)
            .join("\n") + "\n";
        data.guides[path] = { source: documentationOrigin + path, markdown };
      }
      data.components[entry.slug] = record;
    }
  const expected = catalog.categories.reduce(
    (sum, category) => sum + category.components.length,
    0,
  );
  if (
    Object.keys(api.entries).length !== expected ||
    Object.keys(usage.entries).length !== expected
  )
    throw new Error("AI component coverage differs from catalog.");
  for (const page of sitePages)
    for (const locale of ["zh", "en"]) {
      const path = `${locale === "en" ? "/en" : ""}${page.path}`;
      data.guides[path] = {
        source: documentationOrigin + path,
        markdown: read(root, `apps/docs/public${path}.md`),
      };
    }
  return data;
}

export function buildAiResources(options: { root?: string } = {}) {
  const root = resolve(options.root ?? process.cwd()),
    data = createAiData(root);
  const put = (path: string, content: string | Uint8Array) => {
    mkdirSync(dirname(resolve(root, path)), { recursive: true });
    writeFileSync(resolve(root, path), content);
  };
  put("packages/mcp/data/manifest.json", JSON.stringify(data) + "\n");
  for (const name of ["LICENSE", "NOTICE"])
    copyFileSync(resolve(root, name), resolve(root, "packages/mcp", name));
  const skill = read(root, "skills/orvui/SKILL.md");
  const files = createSkillFiles(data, skill, {
    LICENSE: read(root, "LICENSE"),
    NOTICE: read(root, "NOTICE"),
  });
  rmSync(resolve(root, "skills/orvui/references"), {
    force: true,
    recursive: true,
  });
  rmSync(resolve(root, "apps/docs/public/orvui-agent/references"), {
    force: true,
    recursive: true,
  });
  for (const [path, content] of Object.entries(files)) {
    const relative = path.slice("orvui/".length);
    if (relative !== "SKILL.md") put(`skills/orvui/${relative}`, content);
    put(`apps/docs/public/orvui-agent/${relative}`, content);
  }
  put(
    "apps/docs/public/orvui-agent/orvui-skill.zip",
    zipSync(files, { level: 6, mtime: new Date("2026-01-01T00:00:00Z") }),
  );
  return {
    components: Object.keys(data.components).length,
    variants: Object.values(data.components).reduce(
      (sum, entry) => sum + entry.variants.length,
      0,
    ),
    sourceFiles: Object.keys(data.files).length,
    productVersion: data.product.version,
  };
}

/** Also used to validate the exact archive without writing into the working tree. */
export function createSkillFiles(
  data: AiData,
  skill: string,
  notices: Record<"LICENSE" | "NOTICE", string>,
) {
  const files: Record<string, Uint8Array> = {
    "orvui/SKILL.md": strToU8(skill),
  };
  const index = [
    "# orvui component references",
    "",
    `Product version: ${data.product.version}`,
    "",
    "Load only the components needed for the task. 中文 / English:",
    "",
    ...Object.values(data.components).map(
      (entry) =>
        `- ${entry.name} (${entry.category}): [中文](zh/${entry.slug}.md) · [English](en/${entry.slug}.md) — ${entry.description.en}`,
    ),
    "",
  ].join("\n");
  files["orvui/references/index.md"] = strToU8(index);
  for (const entry of Object.values(data.components))
    for (const locale of ["zh", "en"] as const)
      files[`orvui/references/${locale}/${entry.slug}.md`] = strToU8(
        entry.skills[locale],
      );
  for (const name of ["LICENSE", "NOTICE"] as const)
    files[`orvui/${name}`] = strToU8(notices[name]);
  return files;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  console.log(JSON.stringify(buildAiResources()));
