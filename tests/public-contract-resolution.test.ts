import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import { expect, it } from "vitest";

// A missing dependency inside a declaration can become `any` when skipLibCheck
// is enabled. Resolve the frozen contract independently before trusting its
// consumer assignability assertions.
it("resolves every frozen contract reference without missing dependency types", () => {
  const root = resolve("tests/fixtures/public-contract");
  const declarations = (directory: string): string[] =>
    readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const file = resolve(directory, entry.name);
      return entry.isDirectory()
        ? declarations(file)
        : file.endsWith(".d.ts")
          ? [file]
          : [];
    });
  const options: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    strict: true,
    allowSyntheticDefaultImports: true,
  };
  const cache = ts.createModuleResolutionCache(process.cwd(), (file) => file, options);
  const unresolved: { file: string; specifier: string }[] = [];
  const external = new Set<string>();
  for (const file of declarations(root)) {
    const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
    const imports = new Set<string>();
    const visit = (node: ts.Node) => {
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) imports.add(node.moduleSpecifier.text);
      else if (
        ts.isImportTypeNode(node) &&
        ts.isLiteralTypeNode(node.argument) &&
        ts.isStringLiteral(node.argument.literal)
      ) imports.add(node.argument.literal.text);
      ts.forEachChild(node, visit);
    };
    visit(source);
    for (const specifier of imports) {
      if (!specifier.startsWith(".")) external.add(specifier);
      if (!ts.resolveModuleName(specifier, file, options, ts.sys, cache).resolvedModule)
        unresolved.push({ file, specifier });
    }
  }
  expect([...external].sort()).toEqual([
    "@paper-design/shaders", "lenis", "lucide-vue-next", "motion-v", "vue",
  ]);
  expect(unresolved).toEqual([]);
});
