import {
  readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync,
} from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import catalogData from "../catalog/components.json";
import {
  documentationOrigin, packageName, packageVersion, registryBaseUrl, registryItemUrl,
} from "../distribution";
import type { ProductCatalog } from "./types";
import { sourceClosure } from "./source-closure";

type RegistryFile = ReturnType<typeof sourceClosure>["files"][number];
type RegistryItem = {
  $schema: string;
  name: string;
  type: string;
  title?: string;
  description?: string;
  files: RegistryFile[];
  dependencies: string[];
  meta: Record<string, string>;
};
type Coverage = {
  category: string;
  slug: string;
  implemented: boolean;
  demo: boolean;
  variants: { slug: string; implemented: boolean }[];
  visualVerified: boolean;
};
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const fileTypes = new Set(["registry:component", "registry:lib", "registry:file"]);
const itemTypes = new Set(["registry:component", "registry:block", "registry:style"]);
const itemSchema = "https://shadcn-vue.com/schema/registry-item.json";

function safePath(value: unknown, prefix: string): value is string {
  return typeof value === "string" && value.startsWith(prefix)
    && value.length > prefix.length && !/[\\\0?#]/.test(value)
    && value.split("/").every((part) => part !== "." && part !== ".." && part !== "");
}

/** Validate the schema subset we emit, including stronger portable-source invariants. */
export function validateRegistryItem(value: unknown): asserts value is RegistryItem {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Registry item must be an object");
  const item = value as RegistryItem;
  if (item.$schema !== itemSchema || typeof item.name !== "string" || !slugPattern.test(item.name)
    || !itemTypes.has(item.type)) throw new Error("Invalid registry item schema, name or type");
  for (const field of ["title", "description"] as const)
    if (item[field] !== undefined && typeof item[field] !== "string")
      throw new Error(`Invalid registry ${field}: ${item.name}`);
  if (!Array.isArray(item.files) || item.files.length === 0)
    throw new Error(`Registry item has no source files: ${item.name}`);
  if (!Array.isArray(item.dependencies)
    || item.dependencies.some((dependency) => typeof dependency !== "string"
      || !/^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+@[^\s]+$/.test(dependency))
    || new Set(item.dependencies).size !== item.dependencies.length)
    throw new Error(`Invalid registry dependencies: ${item.name}`);
  if (!item.meta || typeof item.meta !== "object" || Array.isArray(item.meta))
    throw new Error(`Invalid registry metadata: ${item.name}`);
  const paths = new Set<string>(), targets = new Set<string>();
  for (const file of item.files) {
    if (!file || !safePath(file.path, "registry/orvui/")
      || !safePath(file.target, "~/src/components/orvui/")
      || !fileTypes.has(file.type) || typeof file.content !== "string")
      throw new Error(`Invalid registry file structure or path: ${item.name}`);
    if (paths.has(file.path) || targets.has(file.target))
      throw new Error(`Duplicate registry file path or target: ${item.name} (${file.target})`);
    paths.add(file.path); targets.add(file.target);
  }
}

/** Assemble once in memory so the published package and docs receive identical bytes. */
export function createRegistry(options: { directory?: string; catalog?: ProductCatalog; strict?: boolean } = {}) {
  const directory = resolve(options.directory ?? "."),
    catalog = options.catalog ?? catalogData as ProductCatalog,
    root = resolve(directory, "packages/vue/src"),
    manifest = JSON.parse(readFileSync(resolve(directory, "packages/vue/package.json"), "utf8")),
    closureOptions = {
      root,
      dependencies: { ...manifest.dependencies, ...manifest.devDependencies },
      peerDependencies: manifest.peerDependencies,
    },
    noticeFiles: RegistryFile[] = ["LICENSE", "NOTICE"].map((notice) => ({
      path: `registry/orvui/${notice}.txt`,
      target: `~/src/components/orvui/${notice}.txt`,
      type: "registry:file",
      content: readFileSync(resolve(directory, notice), "utf8"),
    })),
    documents = new Map<string, string>(),
    items: { name: string; type: string; title?: string; description?: string }[] = [],
    coverage: Coverage[] = [],
    targets = new Map<string, RegistryFile>();
  if (options.strict && (catalog.product.name !== "orvui" || catalog.product.version !== packageVersion
    || manifest.name !== packageName || manifest.version !== packageVersion))
    throw new Error("Registry catalog and package identity must match the distribution manifest");
  function addItem(item: RegistryItem) {
    validateRegistryItem(item);
    const filename = `${item.name}.json`;
    if (documents.has(filename)) throw new Error(`Duplicate registry item: ${item.name}`);
    for (const file of item.files) {
      const existing = targets.get(file.target);
      if (existing && (existing.content !== file.content || existing.type !== file.type || existing.path !== file.path))
        throw new Error(`Conflicting registry target: ${file.target}`);
      targets.set(file.target, file);
    }
    documents.set(filename, JSON.stringify(item, null, 2) + "\n");
    items.push({ name: item.name, type: item.type, title: item.title, description: item.description });
  }
  for (const category of catalog.categories) for (const item of category.components) {
    const path = resolve(root, category.slug, item.slug, "index.ts"),
      variants = (item.examples ?? []).map((example) => ({
        slug: example.slug,
        implemented: existsSync(resolve(root, category.slug, item.slug, "examples", `${example.slug}.vue`)),
      }));
    if (!slugPattern.test(category.slug) || !slugPattern.test(item.slug)
      || variants.some((variant) => !slugPattern.test(variant.slug)))
      throw new Error(`Invalid registry catalog slug: ${category.slug}/${item.slug}`);
    const state: Coverage = {
      category: category.slug, slug: item.slug, implemented: existsSync(path),
      demo: existsSync(resolve(root, category.slug, item.slug, "demo.vue")), variants, visualVerified: false,
    };
    coverage.push(state);
    if (!state.implemented) continue;
    const bundle = sourceClosure([path, resolve(root, "styles.css")], closureOptions);
    const registryItem: RegistryItem = {
      $schema: itemSchema, name: item.slug,
      type: category.slug === "blocks" ? "registry:block" : "registry:component",
      title: item.name, description: item.description, ...bundle,
      files: [...bundle.files, ...noticeFiles],
      meta: {
        product: "orvui", version: packageVersion, package: packageName,
        category: category.slug, registry: registryItemUrl(item.slug),
      },
    };
    addItem(registryItem);
    const componentAliases = new Set<string>();
    for (const example of item.examples ?? []) {
      const alias = example.installSlug;
      if (!alias || alias === item.slug || componentAliases.has(alias)) continue;
      componentAliases.add(alias);
      addItem({ ...registryItem, name: alias, title: example.name,
        meta: { ...registryItem.meta, registry: registryItemUrl(alias) } });
    }
  }
  const themeBundle = sourceClosure([resolve(root, "styles.css")], closureOptions);
  addItem({
    $schema: itemSchema, name: "orvui-theme", type: "registry:style", title: "orvui theme",
    ...themeBundle, files: [...themeBundle.files, ...noticeFiles],
    meta: { product: "orvui", version: packageVersion, package: packageName, registry: registryItemUrl("orvui-theme") },
  });
  if (options.strict && coverage.some((entry) => !entry.implemented || !entry.demo
    || entry.variants.some((variant) => !variant.implemented)))
    throw new Error("Strict registry coverage requires every component, demo and registered variant");
  documents.set("registry.json", JSON.stringify({
    $schema: "https://shadcn-vue.com/schema/registry.json", name: "orvui", homepage: documentationOrigin, items,
  }, null, 2) + "\n");
  return { documents, coverage, catalog };
}

/** Remove obsolete generated JSON, retaining nested raw source and other resources. */
export function writeRegistryOutputs(documents: ReadonlyMap<string, string>, outputs: string[]) {
  for (const output of outputs) {
    mkdirSync(output, { recursive: true });
    for (const entry of readdirSync(output, { withFileTypes: true }))
      if (entry.isFile() && entry.name.endsWith(".json") && !documents.has(entry.name))
        rmSync(resolve(output, entry.name));
    for (const [name, content] of documents) writeFileSync(resolve(output, name), content);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = createRegistry({ strict: process.argv.includes("--strict") });
    writeRegistryOutputs(result.documents, [resolve("apps/docs/public/r"), resolve("packages/vue/registry")]);
    const reports = resolve("artifacts/reports");
    mkdirSync(reports, { recursive: true });
    writeFileSync(resolve(reports, "coverage.json"), JSON.stringify({
      product: result.catalog.product, schemaVersion: result.catalog.schemaVersion,
      total: result.coverage.length, components: result.coverage,
    }, null, 2) + "\n");
    const variants = result.coverage.flatMap((entry) => entry.variants);
    console.log(`Registry built: ${result.coverage.filter((entry) => entry.implemented).length}/${result.coverage.length} components, ${result.documents.size - 1} installable items; variants ${variants.filter((entry) => entry.implemented).length}/${variants.length}. Both outputs share ${registryBaseUrl}. Visual verification is tracked separately.`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
