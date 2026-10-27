import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, relative, resolve } from "node:path";
import ts from "typescript";
import { parse as parseSfc } from "vue/compiler-sfc";
import type { CatalogCategory } from "./types";
import type { PublicUsageImport } from "./public-usage-types";

export interface UsageRegistryItem {
  name: string;
  files: { target?: string; path: string; content?: string }[];
  dependencies?: string[];
}
export interface RegistryUsageImport extends PublicUsageImport {
  sourceFile: string;
  targetFile: string;
}
const normalize = (value: string) => value.replaceAll("\\", "/");
export function createRegistryUsageIndex(
  root: string,
  categories: CatalogCategory[],
  provided?: UsageRegistryItem[],
  options: { sourceRoot?: string; namespace?: string } = {},
) {
  const sourceRoot = resolve(root, options.sourceRoot ?? "packages/vue/src");
  const packageFile = resolve(sourceRoot, "../package.json");
  const library = existsSync(packageFile)
    ? (JSON.parse(readFileSync(packageFile, "utf8")) as {
        dependencies?: Record<string, string>;
        peerDependencies?: Record<string, string>;
      })
    : {};
  const names = [
    ...new Set(
      categories.flatMap((category) =>
        category.components.flatMap((component) => [
          component.slug,
          ...(component.examples ?? []).flatMap((example) =>
            example.installSlug ? [example.installSlug] : [],
          ),
        ]),
      ),
    ),
  ];
  const items = new Map(
    (
      provided ??
      names.map(
        (name) =>
          JSON.parse(
            readFileSync(
              resolve(root, "apps/docs/public/r", name + ".json"),
              "utf8",
            ),
          ) as UsageRegistryItem,
      )
    ).map((item) => [item.name, item]),
  );
  const files = new Map<string, { target: string; specifier: string }>(),
    coverage = new Map<string, Set<string>>();
  for (const item of items.values()) {
    const available = new Set<string>();
    for (const file of item.files) {
      if (!file.target) continue;
      const target = normalize(file.target).replace(/^~\//, ""),
        marker = `components/${options.namespace ?? "orvui"}/`,
        at = target.indexOf(marker);
      if (at < 0) continue;
      const source = resolve(sourceRoot, target.slice(at + marker.length));
      if (!existsSync(source)) continue;
      if (!target.startsWith("src/"))
        throw new Error(
          `Registry target is outside the configured @=src alias: ${target}`,
        );
      const specifier =
        "@/" +
        target
          .slice(4)
          .replace(/\/index\.ts$/, "")
          .replace(/\.(?:ts|tsx)$/, "");
      const previous = files.get(source);
      if (previous && previous.target !== target)
        throw new Error(
          `Conflicting registry targets for ${source}: ${previous.target} / ${target}`,
        );
      files.set(source, { target, specifier });
      available.add(source);
    }
    coverage.set(item.name, available);
  }
  function owner(file: string) {
    const [category, slug] = normalize(relative(sourceRoot, file)).split("/");
    return categories
      .find((item) => item.slug === category)
      ?.components.find((item) => item.slug === slug);
  }
  function installation(file: string, required: string[]) {
    const entry = owner(file);
    if (!entry) throw new Error(`Usage has no catalog owner: ${file}`);
    const variant = normalize(file).includes("/examples/")
      ? entry.examples?.find(
          (example) => example.slug === basename(file, ".vue"),
        )
      : undefined;
    const primary = variant?.installSlug ?? entry.slug;
    if (!coverage.has(primary))
      throw new Error(`Usage registry entry is missing: ${primary}`);
    const selected = [primary],
      covered = new Set(coverage.get(primary));
    for (const file of required) {
      if (covered.has(file)) continue;
      const preferred = owner(file)?.slug;
      const candidates = [...coverage]
        .filter(([, set]) => set.has(file))
        .sort(
          ([a, setA], [b, setB]) =>
            Number(b === preferred) - Number(a === preferred) ||
            setA.size - setB.size ||
            a.localeCompare(b),
        );
      const next = candidates[0];
      if (!next)
        throw new Error(
          `No installable registry entry contains ${normalize(relative(root, file))}`,
        );
      if (!selected.includes(next[0])) selected.push(next[0]);
      next[1].forEach((file) => covered.add(file));
    }
    return selected;
  }
  function extraDependencies(selected: string[], dependencies: string[]) {
    const nameOf = (specifier: string) => {
      const versionAt = specifier.lastIndexOf("@");
      return versionAt > 0 ? specifier.slice(0, versionAt) : specifier;
    };
    const installed = new Set([
      "vue",
      ...selected.flatMap((slug) =>
        (items.get(slug)?.dependencies ?? []).map(nameOf),
      ),
    ]);
    return [...new Set(dependencies)]
      .filter((name) => !installed.has(name))
      .sort()
      .map((name) => {
        const version =
          library.dependencies?.[name] ?? library.peerDependencies?.[name];
        if (!version && existsSync(packageFile))
          throw new Error(`Undeclared registry demo dependency: ${name}`);
        return version ? `${name}@${version}` : name;
      });
  }
  return { sourceRoot, files, items, installation, extraDependencies };
}

export function transformRegistryUsage(input: {
  root: string;
  file: string;
  resolvedFile: string;
  source: string;
  dependencies: string[];
  index: ReturnType<typeof createRegistryUsageIndex>;
  publicModules: { file: string; specifier: string }[];
  resolveLocal: (file: string, specifier: string) => string | undefined;
  resolveSymbol: (
    file: string,
    imported: string,
    local: string,
  ) => { file: string; name: string } | undefined;
}) {
  const { descriptor } = parseSfc(input.source, {
      filename: input.resolvedFile,
    }),
    edits: { start: number; end: number; text: string }[] = [],
    imports: RegistryUsageImport[] = [],
    required = new Set<string>();
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const targetOf = (source: string) => {
    const target = input.index.files.get(source);
    if (!target)
      throw new Error(
        `Imported file is absent from registry files.target: ${normalize(relative(input.root, source))}`,
      );
    required.add(source);
    return target;
  };
  function sourceOf(specifier: string) {
    return specifier.startsWith(".")
      ? input.resolveLocal(input.resolvedFile, specifier)
      : (input.publicModules.find((module) => module.specifier === specifier)
          ?.file ??
          (specifier === "@orvui/vue/style.css"
            ? resolve(input.index.sourceRoot, "styles.css")
            : undefined));
  }
  for (const block of [descriptor.script, descriptor.scriptSetup]) {
    if (!block) continue;
    const ast = ts.createSourceFile(
      input.resolvedFile + ".ts",
      block.content,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
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
      if (!specifier.startsWith(".") && !specifier.startsWith("@orvui/vue"))
        continue;
      const source = sourceOf(specifier);
      if (!source)
        throw new Error(
          `Cannot resolve registry import ${specifier} in ${input.file}`,
        );
      if (input.index.files.has(source)) {
        const target = targetOf(source);
        replace(node.moduleSpecifier, JSON.stringify(target.specifier));
        const clause = node.importClause;
        const names = [
          ...(clause?.name
            ? [
                {
                  imported: "default",
                  local: clause.name.text,
                  typeOnly: clause.isTypeOnly,
                },
              ]
            : []),
          ...(clause?.namedBindings && ts.isNamedImports(clause.namedBindings)
            ? clause.namedBindings.elements.map((name) => ({
                imported: (name.propertyName ?? name.name).text,
                local: name.name.text,
                typeOnly: clause.isTypeOnly || name.isTypeOnly,
              }))
            : []),
          ...(clause?.namedBindings &&
          ts.isNamespaceImport(clause.namedBindings)
            ? [
                {
                  imported: "*",
                  local: clause.namedBindings.name.text,
                  typeOnly: clause.isTypeOnly,
                },
              ]
            : []),
        ];
        imports.push({
          source: specifier,
          target: target.specifier,
          sourceFile: normalize(relative(input.root, source)),
          targetFile: target.target,
          names,
        });
        continue;
      }
      const clause = node.importClause;
      if (
        !clause ||
        (clause.namedBindings && ts.isNamespaceImport(clause.namedBindings))
      )
        throw new Error(
          `Registry cannot copy aggregate namespace/side-effect module: ${specifier}`,
        );
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
          ? clause.namedBindings.elements.map((name) => ({
              imported: (name.propertyName ?? name.name).text,
              local: name.name.text,
              typeOnly: clause.isTypeOnly || name.isTypeOnly,
            }))
          : []),
      ];
      const rewritten: string[] = [];
      for (const binding of bindings) {
        const symbol = input.resolveSymbol(
          source,
          binding.imported,
          binding.local,
        );
        if (!symbol)
          throw new Error(
            `Registry has no copied export for ${specifier}#${binding.imported}`,
          );
        const target = targetOf(symbol.file);
        const statement = ts.factory.createImportDeclaration(
          undefined,
          ts.factory.createImportClause(
            binding.typeOnly,
            symbol.name === "default"
              ? ts.factory.createIdentifier(binding.local)
              : undefined,
            symbol.name === "default"
              ? undefined
              : ts.factory.createNamedImports([
                  ts.factory.createImportSpecifier(
                    false,
                    symbol.name === binding.local
                      ? undefined
                      : ts.factory.createIdentifier(symbol.name),
                    ts.factory.createIdentifier(binding.local),
                  ),
                ]),
          ),
          ts.factory.createStringLiteral(target.specifier),
        );
        rewritten.push(
          printer.printNode(ts.EmitHint.Unspecified, statement, ast),
        );
        imports.push({
          source: specifier,
          target: target.specifier,
          sourceFile: normalize(relative(input.root, symbol.file)),
          targetFile: target.target,
          names: [{ ...binding, imported: symbol.name }],
        });
      }
      replace(node, rewritten.join("\n"));
    }
    const scan = (node: ts.Node) => {
      if (
        ts.isImportTypeNode(node) &&
        ts.isLiteralTypeNode(node.argument) &&
        ts.isStringLiteral(node.argument.literal)
      ) {
        const specifier = node.argument.literal.text;
        if (specifier.startsWith(".") || specifier.startsWith("@orvui/vue")) {
          const source = sourceOf(specifier);
          if (!source)
            throw new Error(`Cannot resolve registry import type ${specifier}`);
          if (input.index.files.has(source))
            replace(
              node.argument.literal,
              JSON.stringify(targetOf(source).specifier),
            );
          else {
            const name =
                node.qualifier && ts.isIdentifier(node.qualifier)
                  ? node.qualifier.text
                  : undefined,
              symbol = name
                ? input.resolveSymbol(source, name, name)
                : undefined;
            if (!symbol)
              throw new Error(
                `Registry has no copied import type ${specifier}#${name}`,
              );
            const updated = ts.factory.updateImportTypeNode(
              node,
              ts.factory.createLiteralTypeNode(
                ts.factory.createStringLiteral(targetOf(symbol.file).specifier),
              ),
              node.attributes,
              ts.factory.createIdentifier(symbol.name),
              node.typeArguments,
              node.isTypeOf,
            );
            replace(
              node,
              printer.printNode(ts.EmitHint.Unspecified, updated, ast),
            );
          }
          return;
        }
      }
      if (
        ts.isCallExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ImportKeyword &&
        node.arguments[0] &&
        ts.isStringLiteral(node.arguments[0])
      ) {
        const specifier = node.arguments[0].text;
        if (specifier.startsWith(".") || specifier.startsWith("@orvui/vue")) {
          const source = sourceOf(specifier);
          if (!source)
            throw new Error(
              `Cannot resolve registry dynamic import ${specifier}`,
            );
          replace(
            node.arguments[0],
            JSON.stringify(targetOf(source).specifier),
          );
        }
      }
      ts.forEachChild(node, scan);
    };
    ts.forEachChild(ast, scan);
  }
  let code = input.source;
  for (const edit of edits.sort((a, b) => b.start - a.start))
    code = code.slice(0, edit.start) + edit.text + code.slice(edit.end);
  const registryInstallSlugs = input.index.installation(input.file, [
    ...required,
  ]);
  return {
    registryCode: code,
    registryInstallSlugs,
    registryExtraDependencies: input.index.extraDependencies(
      registryInstallSlugs,
      input.dependencies,
    ),
    registryImports: imports,
    registryTargets: [...required]
      .map((source) => input.index.files.get(source)!.target)
      .sort(),
  };
}
