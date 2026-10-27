import { resolve } from "node:path";
import ts from "typescript";
import catalog from "./components.json";
import type { ProductCatalog } from "../registry/types";

export interface PublicApiExport {
  name: string;
  kind: "runtime" | "type";
}
export interface PublicApiModule {
  specifier: string;
  file: string;
  exports: PublicApiExport[];
}
export interface PublicApiBaseline {
  schemaVersion: 1;
  product: string;
  version: string;
  root: PublicApiModule;
  components: (PublicApiModule & { category: string; slug: string })[];
}

/** Inspect exports from public barrels only; implementation-private names stay private. */
export function collectPublicApi(
  root = process.cwd(),
  options: {
    catalog?: ProductCatalog;
    packageName?: string;
    sourceRoot?: string;
  } = {},
): PublicApiBaseline {
  const productCatalog = options.catalog ?? catalog;
  const packageName = options.packageName ?? "@orvui/vue";
  const sourceRoot = options.sourceRoot ?? "packages/vue/src";
  const entries = [
    { specifier: packageName, file: `${sourceRoot}/index.ts` },
    ...productCatalog.categories.flatMap((category) =>
      category.components.map((component) => ({
        category: category.slug,
        slug: component.slug,
        specifier: `${packageName}/${category.slug}/${component.slug}`,
        file: component.file,
      })),
    ),
  ];
  const program = ts.createProgram(
      entries.map((entry) => resolve(root, entry.file)),
      {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        skipLibCheck: true,
        allowSyntheticDefaultImports: true,
      },
    ),
    checker = program.getTypeChecker();
  const inspect = (entry: (typeof entries)[number]): PublicApiModule => {
    const source = program.getSourceFile(resolve(root, entry.file));
    const symbol = source && checker.getSymbolAtLocation(source);
    if (!symbol) throw new Error(`Missing public barrel: ${entry.file}`);
    const exports = checker
      .getExportsOfModule(symbol)
      .map((symbol): PublicApiExport => {
        const typeOnly = symbol.declarations?.some(
          (declaration) =>
            ts.isExportSpecifier(declaration) &&
            (declaration.isTypeOnly ||
              (ts.isExportDeclaration(declaration.parent.parent) &&
                declaration.parent.parent.isTypeOnly)),
        );
        const target =
          symbol.flags & ts.SymbolFlags.Alias
            ? checker.getAliasedSymbol(symbol)
            : symbol;
        return {
          name: symbol.name,
          kind:
            typeOnly || !(target.flags & ts.SymbolFlags.Value)
              ? "type"
              : "runtime",
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
    return { ...entry, exports };
  };
  return {
    schemaVersion: 1,
    product: productCatalog.product.name,
    version: productCatalog.product.version,
    root: inspect(entries[0]),
    components: entries
      .slice(1)
      .map((entry) => inspect(entry)) as PublicApiBaseline["components"],
  };
}

export function comparePublicApi(
  expected: PublicApiBaseline,
  actual: PublicApiBaseline,
) {
  const current = new Map(
    [actual.root, ...actual.components].map((entry) => [
      entry.specifier,
      entry,
    ]),
  );
  return [expected.root, ...expected.components].map((entry) => {
    const exports = new Map(
      current
        .get(entry.specifier)
        ?.exports.map((item) => [item.name, item.kind]) ?? [],
    );
    return {
      specifier: entry.specifier,
      expected: entry.exports.length,
      missing: entry.exports
        .filter((item) => !exports.has(item.name))
        .map((item) => item.name),
      changedKind: entry.exports
        .filter(
          (item) =>
            exports.has(item.name) && exports.get(item.name) !== item.kind,
        )
        .map((item) => item.name),
    };
  });
}
