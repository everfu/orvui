import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { parse as parseSfc } from "vue/compiler-sfc";
import {
  createRegistryUsageIndex,
  transformRegistryUsage,
  type UsageRegistryItem,
} from "../../../tools/registry/registry-usage";
import type {
  CatalogCategory,
  ProductCatalog,
} from "../../../tools/registry/types";
import type {
  PublicUsageDiagnostic,
  PublicUsageImport,
  PublicUsageManifest,
  PublicUsageSnippet,
} from "../app/utils/docs/public-usage-types";
export type * from "../app/utils/docs/public-usage-types";

const normalize = (file: string) => file.replaceAll("\\", "/");
function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? walk(resolve(directory, entry.name))
      : [resolve(directory, entry.name)],
  );
}
function resolveLocal(file: string, specifier: string) {
  const base = resolve(dirname(file), specifier);
  return [
    base,
    base + ".ts",
    base + ".tsx",
    base + ".vue",
    resolve(base, "index.ts"),
    base.replace(/\.js$/, ".ts"),
  ].find((candidate) => existsSync(candidate) && !readdirSafe(candidate));
}
function readdirSafe(file: string) {
  try {
    readdirSync(file);
    return true;
  } catch {
    return false;
  }
}
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const emptySource = ts.createSourceFile(
  "usage.ts",
  "",
  ts.ScriptTarget.Latest,
  false,
  ts.ScriptKind.TS,
);

export interface PublicUsageOptions {
  root?: string;
  sourceRoot?: string;
  packageName?: string;
  namespace?: string;
  categories?: CatalogCategory[];
  revision?: string;
  registryItems?: UsageRegistryItem[];
}
export function createPublicUsageTransformer(options: PublicUsageOptions = {}) {
  const root = resolve(options.root ?? process.cwd()),
    sourceRoot = resolve(root, options.sourceRoot ?? "packages/vue/src"),
    packageName = options.packageName ?? "@orvui/vue";
  const catalog =
    options.categories ??
    (
      JSON.parse(
        readFileSync(resolve(root, "tools/catalog/components.json"), "utf8"),
      ) as { categories: CatalogCategory[] }
    ).categories;
  const publicModules = [
    { file: resolve(sourceRoot, "index.ts"), specifier: packageName },
    ...catalog.flatMap((category) =>
      category.components.map((component) => ({
        file: resolve(sourceRoot, category.slug, component.slug, "index.ts"),
        specifier: `${packageName}/${category.slug}/${component.slug}`,
      })),
    ),
  ];
  const compilationOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.Preserve,
    skipLibCheck: true,
    allowSyntheticDefaultImports: true,
    allowNonTsExtensions: true,
  };
  const host = ts.createCompilerHost(compilationOptions),
    ordinaryRead = host.readFile;
  host.readFile = (file) => {
    const text = ordinaryRead(file);
    if (!file.endsWith(".vue") || text === undefined) return text;
    const { descriptor } = parseSfc(text, { filename: file });
    const scripts = [
      descriptor.script?.content ?? "",
      descriptor.scriptSetup?.content ?? "",
    ].join("\n");
    const ast = ts.createSourceFile(
      file,
      scripts,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );
    const hasDefault = ast.statements.some(
      (statement) =>
        ts.isExportAssignment(statement) ||
        ((ts.isFunctionDeclaration(statement) ||
          ts.isClassDeclaration(statement)) &&
          statement.modifiers?.some(
            (modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword,
          )),
    );
    return (
      scripts +
      (hasDefault
        ? ""
        : "\ndeclare const __orvui_component: any; export default __orvui_component;\n")
    );
  };
  host.resolveModuleNames = (names, containingFile) =>
    names.map((name) => {
      const local = name.startsWith(".")
        ? resolveLocal(containingFile, name)
        : undefined;
      return local?.endsWith(".vue")
        ? { resolvedFileName: local, extension: ts.Extension.Ts }
        : ts.resolveModuleName(name, containingFile, compilationOptions, host)
            .resolvedModule;
    });
  const program = ts.createProgram(
    walk(sourceRoot).filter(
      (file) =>
        /\.(?:ts|tsx|vue)$/.test(file) &&
        !/(?:\/demo\.vue|\/examples\/|\/tests\/)/.test(normalize(file)),
    ),
    compilationOptions,
    host,
  );
  const checker = program.getTypeChecker();
  type Candidate = {
    file: string;
    specifier: string;
    name: string;
    symbol: ts.Symbol;
  };
  const candidates = new Map<ts.Symbol, Candidate[]>(),
    moduleExports = new Map<string, Map<string, ts.Symbol>>();
  function original(symbol: ts.Symbol) {
    const visited = new Set<ts.Symbol>();
    while (symbol.flags & ts.SymbolFlags.Alias) {
      if (visited.has(symbol)) break;
      visited.add(symbol);
      const next = checker.getAliasedSymbol(symbol);
      if (next === symbol) break;
      symbol = next;
    }
    return symbol;
  }
  function exportsOf(file: string) {
    const found = moduleExports.get(file);
    if (found) return found;
    const source = program.getSourceFile(file),
      symbol = source && checker.getSymbolAtLocation(source);
    const exports = new Map(
      symbol
        ? checker
            .getExportsOfModule(symbol)
            .map((symbol) => [symbol.getName(), original(symbol)])
        : [],
    );
    moduleExports.set(file, exports);
    return exports;
  }
  for (const entry of publicModules)
    for (const [name, symbol] of exportsOf(entry.file)) {
      if (!symbol.declarations?.length) continue;
      const list = candidates.get(symbol) ?? [];
      list.push({ ...entry, name, symbol });
      candidates.set(symbol, list);
    }
  const registry = createRegistryUsageIndex(
    root,
    catalog,
    options.registryItems,
    { sourceRoot: options.sourceRoot, namespace: options.namespace },
  );
  function registrySymbol(target: string, name: string, hint: string) {
    const symbol = exportsOf(target).get(name);
    if (!symbol) return;
    const exported = (candidates.get(symbol) ?? [])
      .filter((candidate) => registry.files.has(candidate.file))
      .sort(
        (a, b) =>
          Number(b.name === name || b.name === hint) -
            Number(a.name === name || a.name === hint) ||
          a.specifier.localeCompare(b.specifier),
      )[0];
    if (exported) return { file: exported.file, name: exported.name };
    for (const declaration of symbol.declarations ?? []) {
      const file = declaration.getSourceFile().fileName;
      if (!registry.files.has(file)) continue;
      for (const [exported, original] of exportsOf(file))
        if (original === symbol) return { file, name: exported };
    }
  }
  function findPublic(
    target: string,
    name: string,
    hint: string,
    consumer: string,
  ): Candidate | undefined {
    const symbol = exportsOf(target).get(name);
    if (!symbol) return;
    const list = candidates.get(symbol) ?? [];
    const rank = (candidate: Candidate) => {
      const owner = dirname(candidate.file),
        ownsTarget = target === owner || target.startsWith(owner + "/");
      return (
        (candidate.file === target ? 1000 : 0) +
        (candidate.specifier !== packageName && ownsTarget ? 100 : 0) +
        (candidate.specifier !== packageName && consumer.startsWith(owner + "/")
          ? 50
          : 0) +
        (candidate.name === name ? 10 : candidate.name === hint ? 5 : 0)
      );
    };
    return [...list].sort(
      (a, b) =>
        rank(b) - rank(a) ||
        a.specifier.localeCompare(b.specifier) ||
        a.name.localeCompare(b.name),
    )[0];
  }
  function unwrap(file: string, seen = new Set<string>()): string {
    if (seen.has(file))
      throw new Error(
        `Circular usage wrapper: ${normalize(relative(root, file))}`,
      );
    seen.add(file);
    const source = readFileSync(file, "utf8"),
      { descriptor } = parseSfc(source, { filename: file });
    if (
      !descriptor.scriptSetup ||
      descriptor.script ||
      descriptor.styles.length ||
      !descriptor.template?.ast
    )
      return file;
    const ast = ts.createSourceFile(
      file + ".ts",
      descriptor.scriptSetup.content,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );
    if (ast.statements.length !== 1) return file;
    const statement = ast.statements[0];
    if (
      !ts.isImportDeclaration(statement) ||
      !statement.importClause?.name ||
      statement.importClause.namedBindings ||
      !ts.isStringLiteral(statement.moduleSpecifier) ||
      !statement.moduleSpecifier.text.startsWith(".")
    )
      return file;
    const children = descriptor.template.ast.children.filter(
      (node) => node.type !== 3 && !(node.type === 2 && !node.content.trim()),
    );
    if (
      children.length !== 1 ||
      children[0].type !== 1 ||
      children[0].props.length ||
      children[0].children.length
    )
      return file;
    const name = statement.importClause.name.text,
      tag = children[0].tag;
    if (
      tag !== name &&
      tag !== name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
    )
      return file;
    const target = resolveLocal(file, statement.moduleSpecifier.text);
    return target?.endsWith(".vue") ? unwrap(target, seen) : file;
  }
  function transform(file: string): PublicUsageSnippet {
    const requested = resolve(root, file),
      resolved = unwrap(requested),
      content = readFileSync(resolved, "utf8"),
      { descriptor, errors } = parseSfc(content, { filename: resolved });
    if (errors.length)
      throw new Error(`Invalid usage SFC ${file}: ${errors.join("; ")}`);
    const edits: { start: number; end: number; text: string }[] = [],
      imports: PublicUsageImport[] = [],
      diagnostics: PublicUsageDiagnostic[] = [],
      dependencies = new Set<string>();
    const report = (message: string, specifier?: string, name?: string) =>
      diagnostics.push({
        file: normalize(relative(root, requested)),
        message,
        specifier,
        name,
      });
    const recordPackage = (specifier: string) => {
      if (specifier.startsWith(packageName)) return;
      dependencies.add(
        specifier.startsWith("@")
          ? specifier.split("/").slice(0, 2).join("/")
          : specifier.split("/")[0],
      );
    };
    const checkPackagePath = (specifier: string) => {
      if (specifier.startsWith("@/")) {
        report(
          "Application alias is not portable to an independent consumer",
          specifier,
        );
        return false;
      }
      if (
        specifier.startsWith(packageName + "/") &&
        !publicModules.some((entry) => entry.specifier === specifier) &&
        ![packageName + "/style.css", packageName + "/tokens.css"].includes(
          specifier,
        )
      ) {
        report(
          "Package import is not a public root/component/style entry",
          specifier,
        );
        return false;
      }
      return true;
    };
    for (const block of [descriptor.script, descriptor.scriptSetup]) {
      if (!block) continue;
      const ast = ts.createSourceFile(
        resolved + ".ts",
        block.content,
        ts.ScriptTarget.Latest,
        true,
        block.lang === "tsx" ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
      );
      const replace = (node: ts.Node, text: string) =>
        edits.push({
          start: block.loc.start.offset + node.getStart(ast),
          end: block.loc.start.offset + node.getEnd(),
          text,
        });
      for (const node of ast.statements) {
        if (
          !ts.isImportDeclaration(node) ||
          !ts.isStringLiteral(node.moduleSpecifier)
        )
          continue;
        const specifier = node.moduleSpecifier.text;
        if (!specifier.startsWith(".")) {
          checkPackagePath(specifier);
          recordPackage(specifier);
          continue;
        }
        const target = resolveLocal(resolved, specifier);
        if (!target) {
          report("Relative import cannot be resolved", specifier);
          continue;
        }
        const clause = node.importClause;
        if (!clause) {
          const explicit =
            target === resolve(sourceRoot, "styles.css")
              ? packageName + "/style.css"
              : target === resolve(sourceRoot, "tokens.css")
                ? packageName + "/tokens.css"
                : publicModules.find((entry) => entry.file === target)
                    ?.specifier;
          if (!explicit) {
            report("Side-effect import has no public module", specifier);
            continue;
          }
          replace(node, `import ${JSON.stringify(explicit)};`);
          imports.push({ source: specifier, target: explicit, names: [] });
          continue;
        }
        if (
          clause.namedBindings &&
          ts.isNamespaceImport(clause.namedBindings)
        ) {
          const exact = publicModules.find((entry) => entry.file === target);
          if (!exact || clause.name) {
            report(
              "Private namespace import cannot be represented by a public namespace",
              specifier,
            );
            continue;
          }
          replace(node.moduleSpecifier, JSON.stringify(exact.specifier));
          imports.push({
            source: specifier,
            target: exact.specifier,
            names: [
              {
                imported: "*",
                local: clause.namedBindings.name.text,
                typeOnly: clause.isTypeOnly,
              },
            ],
          });
          continue;
        }
        const bindings = [
          ...(clause.name
            ? [
                {
                  imported: "default",
                  local: clause.name.text,
                  typeOnly: clause.isTypeOnly,
                },
              ]
            : []),
          ...(clause.namedBindings && ts.isNamedImports(clause.namedBindings)
            ? clause.namedBindings.elements.map((binding) => ({
                imported: (binding.propertyName ?? binding.name).text,
                local: binding.name.text,
                typeOnly: clause.isTypeOnly || binding.isTypeOnly,
              }))
            : []),
        ];
        const grouped = new Map<
          string,
          { imported: string; local: string; typeOnly: boolean }[]
        >();
        for (const binding of bindings) {
          const candidate = findPublic(
            target,
            binding.imported,
            binding.local,
            resolved,
          );
          if (!candidate) {
            report(
              "Imported symbol has no real public export",
              specifier,
              binding.imported,
            );
            continue;
          }
          const group = grouped.get(candidate.specifier) ?? [];
          group.push({ ...binding, imported: candidate.name });
          grouped.set(candidate.specifier, group);
        }
        const rewritten: string[] = [];
        for (const [target, names] of grouped) {
          const allTypes = names.every((name) => name.typeOnly);
          const declaration = ts.factory.createImportDeclaration(
            undefined,
            ts.factory.createImportClause(
              allTypes,
              undefined,
              ts.factory.createNamedImports(
                names.map((binding) =>
                  ts.factory.createImportSpecifier(
                    !allTypes && binding.typeOnly,
                    binding.imported === binding.local
                      ? undefined
                      : ts.factory.createIdentifier(binding.imported),
                    ts.factory.createIdentifier(binding.local),
                  ),
                ),
              ),
            ),
            ts.factory.createStringLiteral(target),
          );
          rewritten.push(
            printer.printNode(
              ts.EmitHint.Unspecified,
              declaration,
              emptySource,
            ),
          );
          imports.push({ source: specifier, target, names });
        }
        if (
          bindings.length ===
          [...grouped.values()].reduce(
            (count, group) => count + group.length,
            0,
          )
        )
          replace(node, rewritten.join("\n"));
      }
      const scan = (node: ts.Node) => {
        if (
          ts.isCallExpression(node) &&
          node.expression.kind === ts.SyntaxKind.ImportKeyword &&
          node.arguments[0] &&
          ts.isStringLiteral(node.arguments[0])
        ) {
          const specifier = node.arguments[0].text;
          if (specifier.startsWith(".")) {
            const target = resolveLocal(resolved, specifier),
              exact = publicModules.find((entry) => entry.file === target);
            if (exact)
              replace(node.arguments[0], JSON.stringify(exact.specifier));
            else
              report(
                "Dynamic import has no equivalent public module",
                specifier,
              );
          } else {
            checkPackagePath(specifier);
            recordPackage(specifier);
          }
        }
        if (
          ts.isImportTypeNode(node) &&
          ts.isLiteralTypeNode(node.argument) &&
          ts.isStringLiteral(node.argument.literal)
        ) {
          const specifier = node.argument.literal.text;
          if (specifier.startsWith(".")) {
            const target = resolveLocal(resolved, specifier),
              name =
                node.qualifier && ts.isIdentifier(node.qualifier)
                  ? node.qualifier.text
                  : undefined,
              candidate =
                target && name
                  ? findPublic(target, name, name, resolved)
                  : undefined;
            if (candidate) {
              const updated = ts.factory.updateImportTypeNode(
                node,
                ts.factory.createLiteralTypeNode(
                  ts.factory.createStringLiteral(candidate.specifier),
                ),
                node.attributes,
                ts.factory.createIdentifier(candidate.name),
                node.typeArguments,
                node.isTypeOf,
              );
              replace(
                node,
                printer.printNode(
                  ts.EmitHint.Unspecified,
                  updated,
                  emptySource,
                ),
              );
              return;
            }
            report(
              "Import type has no equivalent public symbol",
              specifier,
              name,
            );
          } else {
            checkPackagePath(specifier);
            recordPackage(specifier);
          }
        }
        if (
          ts.isExportDeclaration(node) &&
          node.moduleSpecifier &&
          ts.isStringLiteral(node.moduleSpecifier) &&
          node.moduleSpecifier.text.startsWith(".")
        )
          report(
            "Relative re-export in usage must be explicitly resolved",
            node.moduleSpecifier.text,
          );
        ts.forEachChild(node, scan);
      };
      ts.forEachChild(ast, scan);
    }
    if (diagnostics.length) {
      const error = new Error(
        diagnostics
          .map(
            (item) =>
              `${item.file}: ${item.message}: ${item.specifier ?? ""}${item.name ? "#" + item.name : ""}`,
          )
          .join("\n"),
      );
      Object.assign(error, { diagnostics });
      throw error;
    }
    let code = content;
    for (const edit of edits.sort((a, b) => b.start - a.start))
      code = code.slice(0, edit.start) + edit.text + code.slice(edit.end);
    return {
      file: normalize(relative(root, requested)),
      resolvedFile: normalize(relative(root, resolved)),
      code,
      ...transformRegistryUsage({
        root,
        file: requested,
        resolvedFile: resolved,
        source: content,
        dependencies: [...dependencies],
        index: registry,
        publicModules,
        resolveLocal,
        resolveSymbol: registrySymbol,
      }),
      imports,
      dependencies: [...dependencies].sort(),
    };
  }
  return {
    transform,
    publicModules,
    publicExports: [...candidates.values()].reduce(
      (count, list) => count + list.length,
      0,
    ),
  };
}

export function buildPublicUsage(
  options: PublicUsageOptions = {},
): PublicUsageManifest {
  const root = resolve(options.root ?? process.cwd()),
    catalog = JSON.parse(
      readFileSync(resolve(root, "tools/catalog/components.json"), "utf8"),
    ) as ProductCatalog,
    categories = options.categories ?? catalog.categories,
    transformer = createPublicUsageTransformer({ ...options, categories }),
    files: PublicUsageManifest["files"] = {},
    entries: PublicUsageManifest["entries"] = {},
    diagnostics: PublicUsageDiagnostic[] = [];
  const demoFiles = walk(
    resolve(root, options.sourceRoot ?? "packages/vue/src"),
  ).filter((file) =>
    /(?:\/demo\.vue|\/examples\/[^/]+\.vue)$/.test(normalize(file)),
  );
  for (const file of [...new Set(demoFiles)].sort()) {
    try {
      const snippet = transformer.transform(file);
      files[snippet.file] = snippet;
    } catch (error) {
      diagnostics.push(
        ...((error as { diagnostics?: PublicUsageDiagnostic[] })
          .diagnostics ?? [
          { file: normalize(relative(root, file)), message: String(error) },
        ]),
      );
    }
  }
  if (diagnostics.length) {
    const error = new Error(
      `Public Usage generation failed (${diagnostics.length}):\n${diagnostics.map((item) => `${item.file}: ${item.message}: ${item.specifier ?? ""}${item.name ? "#" + item.name : ""}`).join("\n")}`,
    );
    Object.assign(error, { diagnostics });
    throw error;
  }
  let variants = 0;
  for (const category of categories)
    for (const component of category.components) {
      const prefix = `${options.sourceRoot ?? "packages/vue/src"}/${category.slug}/${component.slug}`;
      const item = {
        default: files[prefix + "/demo.vue"],
        variants: {} as Record<string, PublicUsageSnippet>,
      };
      if (!item.default)
        throw new Error(`Missing default Usage: ${prefix}/demo.vue`);
      for (const example of component.examples ?? []) {
        const file = `${prefix}/examples/${example.slug}.vue`;
        if (!files[file]) throw new Error(`Missing example Usage: ${file}`);
        item.variants[example.slug] = files[file];
        variants++;
      }
      entries[`${category.slug}/${component.slug}`] = item;
    }
  return {
    schemaVersion: 1,
    productVersion: options.revision ?? catalog.product.version,
    entries,
    files,
    diagnostics: [],
    summary: {
      entries: Object.keys(entries).length,
      variants,
      files: Object.keys(files).length,
      wrappersExpanded: Object.values(files).filter(
        (file) => file.file !== file.resolvedFile,
      ).length,
      publicModules: transformer.publicModules.length,
      publicExports: transformer.publicExports,
    },
  };
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const result = buildPublicUsage();
  writeFileSync(
    resolve("apps/docs/app/data/public-usage.json"),
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result.summary));
}
